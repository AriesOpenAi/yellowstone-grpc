# 订阅全链数据

本例子基于`blocks`过滤条件来订阅区块，希望获取到尽可能全的区块数据，这是目前一些数据服务商和交易平台的后端所需要的。

通过`npx esrun 07-example-subBlock/index.ts`运行，输出应如下：

```bash

  filters: [ 'block' ],
  account: undefined,
  slot: undefined,
  transaction: undefined,
  transactionStatus: undefined,
  block: {
    slot: '310572801',
    blockhash: '7EExTPoZ8JvN83mCkoZvReHqQ2U5UL9EjorA1WX3tSHB',
    rewards: { rewards: [Array], numPartitions: undefined },
    blockTime: { timestamp: '1735481206' },
    blockHeight: { blockHeight: '288903946' },
    parentSlot: '310572800',
    parentBlockhash: '7WsfigFZk6bnVM7VeKrrPifVYpjiAQ7XcC3HRL5uZW5z',
    executedTransactionCount: '1537',
    transactions: [
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      ... 1437 more items
    ],
    updatedAccountCount: '5384',
    accounts: [
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      ... 5284 more items
    ],
    entriesCount: '482',
    entries: []
  },
  ping: undefined,
  pong: undefined,
  blockMeta: undefined,
  entry: undefined
}
```