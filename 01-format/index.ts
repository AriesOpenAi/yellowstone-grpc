import Client, { CommitmentLevel, SubscribeRequest } from "@triton-one/yellowstone-grpc";
import { commitmentLevelFromJSON } from "@triton-one/yellowstone-grpc/dist/grpc/geyser";

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

    // 3. transactions
    // const request: SubscribeRequest = {
    //     accounts: {},
    //     slots: {},
    //     transactions: {
    //         txn: {
    //             vote: false,
    //             failed: false,
    //             signature: undefined,
    //             accountInclude: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
    //             accountExclude: [],
    //             accountRequired: [],
    //         }
    //     },
    //     transactionsStatus: {},
    //     blocks: {},
    //     blocksMeta: {},
    //     entry: {},
    //     accountsDataSlice: [],
    //     commitment: CommitmentLevel.PROCESSED, // 指定级别为processed
    //     ping: undefined,
    // };

    // transactionsStatus
    // const request: SubscribeRequest = {
    //     accounts: {},
    //     slots: {},
    //     transactions: {},
    //     transactionsStatus: {
    //         txn: {
    //             vote: false,
    //             failed: false,
    //             signature: undefined,
    //             accountInclude: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
    //             accountExclude: [],
    //             accountRequired: [],
    //         }
    //     },
    //     blocks: {},
    //     blocksMeta: {},
    //     entry: {},
    //     accountsDataSlice: [],
    //     // commitment: CommitmentLevel.PROCESSED, // 指定级别为processed
    //     commitment: undefined,
    //     ping: undefined,
    // };

    // 4. accounts
    // const request: SubscribeRequest = {
    //     accounts: {
    //         txn: {
    //             account: ["8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj"],
    //             owner: ["CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"],
    //             filters: [],
    //             nonemptyTxnSignature: true,
    //         }
    //     },
    //     slots: {},
    //     transactions: {},
    //     transactionsStatus: {},
    //     blocks: {},
    //     blocksMeta: {},
    //     entry: {},
    //     accountsDataSlice: [],
    //     commitment: CommitmentLevel.PROCESSED,
    //     ping: undefined,
    // };

    // accountsDataSlice
    // const request: SubscribeRequest = {
    //     accounts: {
    //         txn: {
    //             account: ["8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj"],
    //             owner: ["CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"],
    //             filters: [],
    //             nonemptyTxnSignature: true,
    //         }
    //     },
    //     slots: {},
    //     transactions: {},
    //     transactionsStatus: {},
    //     blocks: {},
    //     blocksMeta: {},
    //     entry: {},
    //     accountsDataSlice: [ { offset: "253", length: "16" } ],
    //     commitment: CommitmentLevel.PROCESSED,
    //     ping: undefined,
    // };

    // 5. blocks
    const request: SubscribeRequest = {
        accounts: {},
        slots: {},
        transactions: {},
        transactionsStatus: {},
        blocks: {
            block: {
                accountInclude: [],
                includeTransactions: true,
                includeAccounts: false,
                includeEntries: false,
            }
        },
        blocksMeta: {},
        entry: {},
        accountsDataSlice: [],
        commitment: CommitmentLevel.CONFIRMED,
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
        console.log(data);
    });

    // 为保证连接稳定，需要定期向服务端发送ping请求以维持连接
    const pingRequest: SubscribeRequest = {
        accounts: {},
        slots: {}, // 指定只获取processed的slot
        transactions: {},
        transactionsStatus: {},
        blocks: {},
        blocksMeta: {},
        entry: {},
        accountsDataSlice: [],
        commitment: undefined, // 指定级别为processed
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