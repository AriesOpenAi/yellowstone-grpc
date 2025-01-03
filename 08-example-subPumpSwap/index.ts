import Client, { CommitmentLevel, SubscribeRequest } from "@triton-one/yellowstone-grpc";
import bs58 from "bs58";

const PUMP_FUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
const GRPC_URL = "https://test-grpc.chainbuff.com";

type PumpPriceInfo = {
    // 交易签名
    signature: string;
    // 交易类型
    type: 'buy' | 'sell' | 'launch';
    // bondingCurve
    bondingCurve: string;
    // launch进度(0-1)
    progress: number;
    // 价格
    price: number;
    // 交易sol金额(买入为正数，卖出为负数)
    swapSolAmount: number;
}

class PumpSwapSubscriber {

    private bondingCurveSet: Set<string>;
    private callback: (data: PumpPriceInfo) => void;

    constructor(bondingCurveArr: Array<string>, callback: (data: PumpPriceInfo) => void) {
        this.bondingCurveSet = new Set(bondingCurveArr);
        this.callback = callback;
    }

    async listen() {
        const client = new Client.default(
            GRPC_URL,
            undefined,
            {
                "grpc.max_receive_message_length": 128 * 1024 * 1024, // 128MB
            }
        );
        console.log("Subscribing to event stream...");

        // 创建订阅数据流
        const stream = await client.subscribe();

        const request: SubscribeRequest = {
            commitment: CommitmentLevel.PROCESSED,
            accountsDataSlice: [],
            ping: undefined,
            transactions: {
                client: {
                    vote: false,
                    failed: false,
                    accountInclude: Array.from(this.bondingCurveSet),
                    accountRequired: [],
                    accountExclude: [],
                },
            },
            accounts: {},
            slots: {},
            transactionsStatus: {},
            entry: {},
            blocks: {},
            blocksMeta: {},
        };

        // 发送订阅请求
        await new Promise<void>((resolve, reject) => {
            stream.write(request, (err) => {
                if (err === null || err === undefined) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        }).catch((reason) => {
            console.error(reason);
            throw reason;
        });

        // 获取订阅数据
        stream.on("data", async (data) => {
            if (data?.transaction) {
                this.checkPrice(data.transaction);
            }
        });

        // 为保证连接稳定，需要定期向服务端发送ping请求以维持连接
        const pingRequest: SubscribeRequest = {
            accounts: {},
            slots: {},
            transactions: {},
            transactionsStatus: {},
            blocks: {},
            blocksMeta: {},
            entry: {},
            accountsDataSlice: [],
            commitment: undefined,
            ping: { id: 1 },
        };
        // 每5秒发送一次ping请求
        setInterval(async () => {
            await new Promise<void>((resolve, reject) => {
                stream.write(pingRequest, (err) => {
                    if (err === null || err === undefined) {
                        resolve();
                    } else {
                        reject(err);
                    }
                });
            }).catch((reason) => {
                console.error(reason);
                throw reason;
            });
        }, 5000);
    }

    checkPrice(txn: any) {
        const transaction = txn?.transaction;
        if (!transaction) {
            return;
        }
        // 将accountKeys编码成base58
        const accountKeys = transaction?.transaction?.message?.accountKeys?.map(o=>bs58.encode(o));
        if (!accountKeys) {
            return;
        }
        transaction.transaction.message.accountKeys = accountKeys;
        const signature = bs58.encode(txn.transaction.signature);
        const pumpProgramIdx = accountKeys.indexOf(PUMP_FUN_PROGRAM_ID);
        // 获取该交易的bondingCurve
        const txBondingCurves = accountKeys.filter(item=>this.bondingCurveSet.has(item))

        // 判断是否为launch(Instruction中programId为pump且data的第一个字节等于183)
        const isLaunch = txn?.transaction?.transaction?.message?.instructions
            .some(item=>item.programIdIndex===pumpProgramIdx && item.data[0] === 183) ?? false;
        if (isLaunch) {
            this.callback({
                signature: signature,
                type: "launch",
                bondingCurve: txBondingCurves[0],
                progress: 1,
                // 由于该交易为launch，bondingCurve中的余额已被提取，因此拿pre的余额作价格
                price: this.getPumpSwapInfo(txn, txBondingCurves[0], "pre")?.price ?? 0,
                swapSolAmount: 0,
            })
            return;
        }
        // 分析价格等信息
        // 一笔交易可能包含多个token的买入或卖出，为避免遗漏遍历所有符合的bondingCurve
        for (let bondingCurveItem of txBondingCurves) {
            // 获取交易后的价格
            const pumpPriceInfo = this.getPumpSwapInfo(txn, bondingCurveItem, "post");
            // 增加健壮性，理论上不会进入这里
            if (!pumpPriceInfo) {
                console.log('balance not found:', signature);
                continue;
            }
            this.callback({
                signature: signature,
                type: pumpPriceInfo.swapSolAmount > 0 ? 'buy' : 'sell',
                bondingCurve: bondingCurveItem,
                progress: pumpPriceInfo.progress,
                price: pumpPriceInfo.price,
                swapSolAmount: pumpPriceInfo.swapSolAmount
            })
        }

    }


    getPumpSwapInfo(txn: any, bondingCurve: string, type: "pre" | "post") {
        // 获取bondingCurve的token余额
        const tokenBalance = txn?.transaction?.meta?.[type + 'TokenBalances']?.find(o=>o.owner===bondingCurve);
        if (!tokenBalance) {
            return null;
        }
        // 获取bondingCurve的sol余额
        const bondingCurveIdx = txn.transaction.transaction.message.accountKeys.indexOf(bondingCurve);
        let preSolBalance = txn.transaction.meta?.preBalances?.[bondingCurveIdx];
        let postSolBalance = txn.transaction.meta?.postBalances?.[bondingCurveIdx];
        const targetSolBalance = txn.transaction.meta?.[type + "Balances"]?.[bondingCurveIdx];
        if (postSolBalance===undefined || preSolBalance === undefined) {
            return null;
        }
        // 通过余额反推虚拟余额，virtualSolReserves(sol余额+30-租金)和virtualTokenReserves(token余额+73000000)
        const price = ((Number(targetSolBalance) / (10 ** 9)) + 30 - 0.00123192) / (tokenBalance.uiTokenAmount.uiAmount + 73000000);
        const swapSolAmount = (Number(postSolBalance) - Number(preSolBalance)) / (10 ** 9);
        const progress = Number(postSolBalance) / (10 ** 9) / 85;
        return {price, swapSolAmount, progress};
    }
}

async function main() {
    new PumpSwapSubscriber(
        // 订阅bondingCurve 支持订阅多个
        ['7USfti8SXfV9k6fxbmsRejqUnHUvKDo8qFprUPaoa5ep'],
        o=>console.log(o)
    ).listen();
}

main();