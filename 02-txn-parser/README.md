# 交易数据解析

在获取到交易数据后，需要解析交易数据，以获取到交易中的具体信息。

在本节的示例代码中，我们通过transactions订阅pumpfun相关交易数据，request请求如下：

```ts
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
```

一个示例的订阅交易原始data数据如下：

```ts
{
  filters: [ 'txn' ],
  account: undefined,
  slot: undefined,
  transaction: {
    transaction: {
      signature: <Buffer a2 33 55 e5 8a f6 b9 f5 90 67 be d7 a4 d2 65 66 02 33 5b 9c 09 cf e2 06 2a 29 8b 7a 0c ce fa 58 85 25 4b 3a f2 cb 4f 8a 05 32 06 fe 5a 64 17 5b 24 f6 ... 14 more bytes>,
      isVote: false,
      transaction: [Object], // 交易数据
      meta: [Object], // 包含日志信息
      index: '909'
    },
    slot: '310558888'
  },
  transactionStatus: undefined,
  block: undefined,
  ping: undefined,
  pong: undefined,
  blockMeta: undefined,
  entry: undefined
}
```

我们主要关心的是`data.transaction.transaction.transaction`中的数据和`data.transaction.transaction.meta`中的数据，其中分别包含交易的具体信息和交易的日志信息，如下：

## 交易具体信息

一个示例交易的`data.transaction.transaction.transaction`中的数据如下：

```ts
{
  signatures: [
    <Buffer d0 73 0c 15 24 24 1f db 18 87 98 69 48 f9 6a c8 f3 7c b5 9d 59 8d 34 29 2f 02 ff 2c de f7 7f 24 ac 08 a6 df 6e 0d fd 15 47 66 c3 93 98 c7 22 53 c6 09 ... 14 more bytes>
  ],
  message: {
    header: {
      numRequiredSignatures: 1,
      numReadonlySignedAccounts: 0,
      numReadonlyUnsignedAccounts: 8
    },
    accountKeys: [
      <Buffer b8 1f cb f6 6f 7a 25 28 59 a2 bd bd b7 d2 23 35 34 d4 d5 c0 5d f1 89 38 02 94 01 52 7a 8d 29 89>,
      <Buffer ad 11 e6 a4 fc 29 44 a4 fa 82 51 be f8 15 42 6e 1b fb 28 c6 b6 64 66 77 60 7c 6a d9 f5 66 a6 46>,
      <Buffer b0 f2 d8 e9 fc d8 8f 96 17 f2 b8 a5 c2 16 b2 2a 64 15 5e 3f b4 bb ee 54 e4 99 94 dc 30 44 cb f5>,
      <Buffer b8 7e f7 2d bf 80 1f 29 7b dd 12 6c c0 ed cb 27 03 bd cb b5 78 12 5a 3e 2d a8 c8 1c 8a 24 7f f9>,
      <Buffer 17 34 0f 1d 5b 06 be 88 22 53 5a 4b 07 10 a7 aa 6a 8b d7 23 4f 39 b8 37 53 98 54 1e d2 85 bb e9>,
      <Buffer 78 52 1c b1 79 ce bb 85 89 b5 56 a2 d5 ec 94 d2 49 86 82 fd f9 bb 2a f5 ad 64 e4 91 cc 41 53 da>,
      <Buffer 03 06 46 6f e5 21 17 32 ff ec ad ba 72 c3 9b e7 bc 8c e5 bb c5 f7 12 6b 2c 43 9b 3a 40 00 00 00>,
      <Buffer 01 56 e0 f6 93 66 5a cf 44 db 15 68 bf 17 5b aa 51 89 cb 97 f5 d2 ff 3b 65 5d 2b b6 fd 6d 18 b0>,
      <Buffer 3a 86 5e 69 ee 0f 54 80 ca bc f6 63 57 e4 dc 2f 18 d5 8d 45 c1 ea 74 89 fb 37 23 d9 79 3c 72 a6>,
      <Buffer 1b 7d cc 0f c5 5b 65 4c 0b 1d 62 1b 54 03 9b 39 bf d5 a5 cc 00 b0 22 9a a7 4c d2 51 9d 04 d0 7f>,
      <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>,
      <Buffer 8c 97 25 8f 4e 24 89 f1 bb 3d 10 29 14 8e 0d 83 0b 5a 13 99 da ff 10 84 04 8e 7b d8 db e9 f8 59>,
      <Buffer 06 dd f6 e1 d7 65 a1 93 d9 cb e1 46 ce eb 79 ac 1c b4 85 ed 5f 5b 37 91 3a 8c f5 85 7e ff 00 a9>,
      <Buffer ac f1 36 eb 01 fc 1c 4e 88 3d 23 c8 b5 84 4a b5 9a 37 f6 6a dd 57 c5 e9 ac 3b 53 e0 59 d3 5c 64>
    ],
    recentBlockhash: <Buffer 01 a3 a1 d8 f5 f0 b4 df b7 95 b4 ea 9f 5a 7c fb 2d d8 9d c6 05 74 52 12 4a 6a fd c9 fd 65 06 16>,
    instructions: [ [Object], [Object], [Object], [Object] ],
    versioned: true,
    addressTableLookups: []
  }
}
```

我们主要需要解析的是：

- `signatures`：交易签名
- `accountKeys`：交易涉及的账户
- `instructions`：交易指令

交易签名和涉及的账户需要转换为base58编码，而交易指令需要按照具体情况进一步解析。

修改代码中的获取订阅数据部分如下，可打印出交易签名、涉及的账户和交易指令：

```ts
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
    }
});
```

输入示例如下：

```bash
交易签名： 3dXad5fvPQUedvdjHS1jJkZDHWUegpsSEESeR5Es4dWeJ9Ek4SLvzpBdaCZebymC4sukbsMh8w4NQ7Fm6rG5Ub3z
交易涉及的账户： [
  'ErU8SDGTJ6aKHXbN4QiBCAfAxBF5efHzDRn8Lcg9R4XR',
  '7jxN82Emp6UrMi7d79BdBLUcoa9jPiQc6HS4NDySsCjN',
  '8VvkZvwwm4jmpt5Esa1mcx9uH9SQTTSGEwEJ2gowDCTy',
  'CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM',
  'E8mK46Dk7P4xS1mVZTyih7KTUrWBAU3AwSHFF5RdY4mk',
  '11111111111111111111111111111111',
  '2b9kESRNxs2t26ZSAovtXqM9cponYcyGwBXMBYLJpump',
  '4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf',
  '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  'Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1',
  'ComputeBudget111111111111111111111111111111',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
]
交易指令： [
  {
    programIdIndex: 11,
    accounts: Uint8Array(0) [],
    data: <Buffer 02 a0 86 01 00>
  },
  {
    programIdIndex: 11,
    accounts: Uint8Array(0) [],
    data: <Buffer 03 c2 23 00 00 00 00 00 00>
  },
  {
    programIdIndex: 8,
    accounts: <Buffer 07 03 06 01 04 02 00 05 09 0c 0a 08>,
    data: <Buffer 33 e6 85 a4 01 7f 83 ad 83 d2 1b a5 74 02 00 00 1a 62 30 03 00 00 00 00>
  }
]
```

可以看到前两条交易指令交互的合约为`ComputeBudget111111111111111111111111111111`，是修改CU更改交易优先费的指令，第三条交易指令交互的合约为`6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`，需要参照pumpfun合约或IDL文件进一步精确解析。通过浏览器查看，这实际上是一笔在pumpfun上卖出代币的指令。

## 交易日志信息

在某些情况下，监听交易日志信息是一个不错的选择。在编写合约时为了确保合约的正确性和规范性，日志中往往包含合约的执行结果等重要信息。

同样，可以修改代码中的获取订阅数据部分，打印出交易日志信息：

```ts
// 获取订阅数据
stream.on("data", async (data) => {
    if (data.transaction) {

        // 日志
        console.log('日志：', data.transaction.transaction.meta.logMessages);
    }
});
```

一个示例交易的`data.transaction.transaction.meta.logMessages`中的数据如下：

```ts
日志： [
  'Program ComputeBudget111111111111111111111111111111 invoke [1]',
  'Program ComputeBudget111111111111111111111111111111 success',
  'Program ComputeBudget111111111111111111111111111111 invoke [1]',
  'Program ComputeBudget111111111111111111111111111111 success',
  'Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P invoke [1]',
  'Program log: Instruction: Buy',
  'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
  'Program log: Instruction: Transfer',
  'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 76564 compute units',
  'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
  'Program 11111111111111111111111111111111 invoke [2]',
  'Program 11111111111111111111111111111111 success',
  'Program 11111111111111111111111111111111 invoke [2]',
  'Program 11111111111111111111111111111111 success',
  'Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P invoke [2]',
  'Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P consumed 2003 of 64476 compute units',
  'Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P success',
  'Program data: vdt/007mYe4I2s9bQJeDK7Vsc0abb1HZtkn00oEApJL31hHDmDkdn4elBH4AAAAANMdMxxcLAAABQFvoWh4tpYvdaQpW4wxu9sWX0f+5ye2VIR53vUXOYLdYSHFnAAAAAJ7V3KMRAAAArWn3u2uCAQCeKbmnCgAAAK3R5G/agwAA',
  'Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P consumed 38952 of 99700 compute units',
  'Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P success',
  'Program 11111111111111111111111111111111 invoke [1]',
  'Program 11111111111111111111111111111111 success',
  'Program 4pP8eDKACuV7T2rbFPE8CHxGKDYAzSdRsdMsGvz2k4oc invoke [1]',
  'Program log: Received timestamp: 1735477356',
  'Program log: Current timestamp: 1735477336',
  'Program log: The provided timestamp is valid.',
  'Program 4pP8eDKACuV7T2rbFPE8CHxGKDYAzSdRsdMsGvz2k4oc consumed 1661 of 60598 compute units',
  'Program 4pP8eDKACuV7T2rbFPE8CHxGKDYAzSdRsdMsGvz2k4oc success',
  'Program 11111111111111111111111111111111 invoke [1]',
  'Program 11111111111111111111111111111111 success',
  'Program HQ2UUt18uJqKaQFJhgV9zaTdQxUZjNrsKFgoEDquBkcx invoke [1]',
  'Program log: Powered by bloXroute Trader Api',
  'Program HQ2UUt18uJqKaQFJhgV9zaTdQxUZjNrsKFgoEDquBkcx consumed 803 of 58787 compute units',
  'Program HQ2UUt18uJqKaQFJhgV9zaTdQxUZjNrsKFgoEDquBkcx success'
]
```

可以看到日志中包含`'Program log: Instruction: Buy'`信息，而我们监听的合约地址为`6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`，因此可以推断出这是一笔在pumpfun上买入代币的交易。

# 总结

本节，我们简单了解了解析交易数据和交易日志信息的通用方法，下一节我们将介绍如何解析账户数据。