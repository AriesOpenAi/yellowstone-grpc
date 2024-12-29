# 创建订阅

本部分将介绍创建grpc订阅的通用流程。若要更改订阅的数据，只需要修改订阅请求即可。

## 创建订阅客户端和数据流

首先，需要先指定grpc的endpoint，来创建订阅的客户端。

```ts
const client = new Client(
// 如遇到TypeError: Client is not a constructor错误
// 请使用以下方式创建
// 见 https://github.com/rpcpool/yellowstone-grpc/issues/428
// @ts-ignore
// const client = new Client.default(
    "https://test-grpc.chainbuff.com",
    undefined,
    {
        "grpc.max_receive_message_length": 16 * 1024 * 1024, // 16MB
    }
);
console.log("Subscribing to event stream...");
```

## 创建订阅请求

订阅请求应严格按照`SubscribeRequest`接口的格式来创建，不需要的字段不可省略。以下是一个订阅slot更新的例子，获取数据的级别为`processed`。

```ts
// 创建订阅请求
const request: SubscribeRequest = {
    accounts: {},
    slots: { slot: { filterByCommitment: true } }, // 指定只获取processed的slot
    transactions: {},
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    entry: {},
    accountsDataSlice: [],
    commitment: CommitmentLevel.PROCESSED, // 指定级别为processed
    ping: undefined,
};
```

## 发送订阅请求并获取数据流

之后，便可将订阅请求发送给服务端，并获取数据流。

```ts
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
```

输出应如下：

```bash
{
  filters: [ 'slot' ],
  account: undefined,
  slot: {
    slot: '310371084',
    parent: '310371083',
    status: 0,
    deadError: undefined
  },
  transaction: undefined,
  transactionStatus: undefined,
  block: undefined,
  ping: undefined,
  pong: undefined,
  blockMeta: undefined,
  entry: undefined
}
```

## pingpong机制

推荐使用pingpong机制来维持连接，否则连接在一段时间后会被断开。5秒发送一次ping请求是经验上合适的间隔。

```ts
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
    
```

# 总结

以上就是创建grpc订阅的基本流程。之后，我们需要了解订阅的基本格式以订阅各种不同的数据。