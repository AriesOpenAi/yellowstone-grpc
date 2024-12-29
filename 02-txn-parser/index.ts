import Client, { CommitmentLevel, SubscribeRequest } from "@triton-one/yellowstone-grpc";
import bs58 from "bs58";

async function main() {

    // 创建client
    // @ts-ignore
    const client = new Client.default(
        "https://test-grpc.chainbuff.com",
        undefined,
        {
            "grpc.max_receive_message_length": 128 * 1024 * 1024, // 128MB
        }
    );
    console.log("Subscribing to event stream...");

    // 创建订阅数据流
    const stream = await client.subscribe();

    // 创建订阅请求
    const request: SubscribeRequest = {
        accounts: {},
        slots: {},
        transactions: {
            txn: {
                vote: false,
                failed: false,
                signature: undefined,
                accountInclude: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
                accountExclude: [],
                accountRequired: [],
            }
        },
        transactionsStatus: {},
        blocks: {},
        blocksMeta: {},
        entry: {},
        accountsDataSlice: [],
        commitment: CommitmentLevel.PROCESSED, // 指定级别为processed
        ping: undefined,
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
        if (data.transaction) {

            // console.log(data.transaction.transaction.transaction);

            // 解析交易
            const txnSignature = bs58.encode(data.transaction.transaction.transaction.signatures[0]);
            console.log('交易签名：', txnSignature);
            // 交易涉及的账户
            const accountKeys = data.transaction.transaction.transaction.message.accountKeys.map(ak => bs58.encode(ak));
            console.log('交易涉及的账户：', accountKeys);
            // 交易指令
            const instructions = data.transaction.transaction.transaction.message.instructions;
            console.log('交易指令：', instructions);

            // 日志
            console.log('日志：', data.transaction.transaction.meta.logMessages);
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

main();