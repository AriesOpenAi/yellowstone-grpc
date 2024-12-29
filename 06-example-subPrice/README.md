# 监听代币价格

本例子基于基于`accounts`和`accountsDataSlice`过滤条件，监听Raydium USDC/SOL流动池中SOL的相对价格，可根据不同的做市商算法和账户数据结构来获取各个流动池中代币的价格。

通过`npx esrun 06-example-subPrice/index.ts`运行，输出应如下：

```bash
sqrtPriceX64Value 8177292434225217108
WSOL价格: 196.50771845716352
---

sqrtPriceX64Value 8176915664278802990
WSOL价格: 196.48961063052332
---

sqrtPriceX64Value 8176922029527744856
WSOL价格: 196.48991654190218
---

sqrtPriceX64Value 8177308202420119387
WSOL价格: 196.50847630580762
---
```