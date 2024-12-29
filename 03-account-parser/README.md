# 账户数据解析

账户数据的解析方法与[之前的教程](https://github.com/ChainBuff/solana-web3js/tree/main/09-buffer)类似，这要求我们需要提前清楚账户数据的结构，这往往是此账户相关的合约里定义的。

如Raydium USDC/SOL CLMM流动池的账户`8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj`，其账户数据保存了此流动池当前的状态，数据结构可以在[合约源码](https://github.com/raydium-io/raydium-clmm/blob/678dc67bc7bdbacb8f81889f8237007fde0a0039/programs/amm/src/states/pool.rs#L58)中找到，包括偏移量，字段长度等信息。

通过如下request，我们可以订阅到此账户的状态变化：

```ts
// 创建订阅请求
const request: SubscribeRequest = {
    accounts: {
        txn: {
            account: ["8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj"],
            owner: ["CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"],
            filters: [],
            nonemptyTxnSignature: true,
        }
    },
    slots: {},
    transactions: {},
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    entry: {},
    accountsDataSlice: [],
    commitment: CommitmentLevel.PROCESSED,
    ping: undefined,
};
```

示例的订阅数据如下：

```ts
{
  filters: [ 'account' ],
  account: {
    account: {
      pubkey: <Buffer 74 e7 00 9c 13 1f 85 6a 30 62 da 1c b2 5e ec 1b b5 18 91 73 5f df 47 56 db fd 7c 27 f5 66 2f 80>,
      lamports: '1426364460',
      owner: <Buffer a5 d5 ca 9e 04 cf 5d b5 90 b7 14 ba 2f e3 2c b1 59 13 3f c1 c1 92 b7 22 57 fd 07 d3 9c b0 40 1e>,
      executable: false,
      rentEpoch: '18446744073709551615',
      data: <Buffer f7 ed e3 f5 d7 c3 de 46 fb 81 6e 66 63 0c 3b b7 24 dc 59 e4 9f 6c c4 30 6e 60 3a 6a ac ca 06 fa 3e 34 e2 b4 0a d5 97 9d 8d 58 3a 6b bb 1c 51 0e f4 3f ... 1494 more bytes>,
      writeVersion: '1510854150789',
      txnSignature: <Buffer fe d6 6b c3 8a fd 73 e4 af 6d 1c 06 53 10 69 f8 14 c3 63 4e bc 83 ee 09 1b ef 7e 61 cf 36 98 ae 82 d1 4c 89 f0 a5 d6 cd d6 57 e0 70 8e 72 55 34 d6 5d ... 14 more bytes>
    },
    slot: '310566532',
    isStartup: false
  },
  slot: undefined,
  transaction: undefined,
  transactionStatus: undefined,
  block: undefined,
  ping: undefined,
  pong: undefined,
  blockMeta: undefined,
  entry: undefined
}
```

在这里，我们主要关心的是`data.account.account.data`部分，这包含了此账户的当前状态。

如需要USDC/SOL流动池价格信息的话，可配合`accountsDataSlice`单独获取此价格字段进行解析，示例如下：

```ts
// 获取订阅数据
stream.on("data", async (data) => {
    if (data.account) {

        // console.log(data.account.account.data);

        const sqrtPriceX64Value = new BN(data.account.account.data, 'le'); // 使用小端字节序创建BN实例
        console.log(`sqrtPriceX64Value`, sqrtPriceX64Value.toString());
        // 计算价格
        const sqrtPriceX64BigInt = BigInt(sqrtPriceX64Value.toString());
        const sqrtPriceX64Float = Number(sqrtPriceX64BigInt) / (2 ** 64);
        const price = sqrtPriceX64Float ** 2 * 1e9 / 1e6;
        console.log(`WSOL价格:`, price.toString())
        console.log('---\n')

    }
});
```

示例输出如下：

```bash
sqrtPriceX64Value 8148105887049610621
WSOL价格: 195.10746368470518
---

sqrtPriceX64Value 8149200902555373958
WSOL价格: 195.15990778810752
---

sqrtPriceX64Value 8148391978755567616
WSOL价格: 195.1211649320479
---

sqrtPriceX64Value 8147974865559671808
WSOL价格: 195.10118908164628
---

sqrtPriceX64Value 8148007064812491849
WSOL价格: 195.1027310905575
---

sqrtPriceX64Value 8147933772405969711
WSOL价格: 195.09922115634814
---

sqrtPriceX64Value 8147701252217193933
WSOL价格: 195.0880860976425
---
```

# 总结

本部分，我们学习如何将账户数据解析为可读的格式，并从中提取出特定的信息。