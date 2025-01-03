# 订阅pump交易

本例子基于`transactions`过滤条件来订阅pump交易，通过监听指定 bondingCurve 账户的交易，来获取 Pump 代币的价格变动信息。主要包括买入、卖出和 launch 三种类型的交易。

通过`npx esrun 08-example-subPumpSwap/index.ts`运行，输出应如下：

```bash
{
  signature: '54DnbJ8bdykkittRAo98UsX3XZg8ji4bkV2onJP2Q7XLVEkSYmh1zXRoYrfMZyV32z47Q56dFxm4jdTC2DK3fLj7',
  type: 'sell',
  bondingCurve: '7USfti8SXfV9k6fxbmsRejqUnHUvKDo8qFprUPaoa5ep',
  progress: 0.824495508317647,
  price: 3.11158241145335e-7,
  swapSolAmount: -0.19179295
}
{
  signature: '5ipujYpa6Lzk9YA7RrtrgagKWwToMir6kTBtZadU7D1rEYHcrEVXGstAtfV7qinWxsUrhavrE9VwfUdDKcCvdYh6',
  type: 'sell',
  bondingCurve: '7USfti8SXfV9k6fxbmsRejqUnHUvKDo8qFprUPaoa5ep',
  progress: 0.8221539605764706,
  price: 3.099218666246187e-7,
  swapSolAmount: -0.199031558
}
```

输出数据说明:

- signature: 交易签名
- type: 交易类型，包括 buy(买入)、sell(卖出)、launch(发射)
- bondingCurve: bondingCurve 账户地址
- progress: launch 进度，范围 0-1
- price: 当前价格(SOL/TOKEN)，若需与gmgn一致 请乘以当前sol价格
- swapSolAmount: 交易的 SOL 数量，买入为正数，卖出为负数

要监听其他 Pump 代币，只需修改 main 函数中的 bondingCurve 地址即可：
```typescript
new PumpPriceSubscriber(
    ['7USfti8SXfV9k6fxbmsRejqUnHUvKDo8qFprUPaoa5ep'], // 在这里修改要监听的 bondingCurve 地址
    o => console.log(o)
).listen();
```