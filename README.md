# Yellowstone gRPC 教程

Yellowstone gRPC 是获取 Solana 链上数据最快的方式。数据以流的方式推送，客户端需要配置订阅来获取和解析数据。

本教程旨在提供一些简单的订阅配置例子，帮助你快速熟悉此工具。

---

在阅读之前，需要运行如下来安装@triton-one/yellowstone-grpc，本教程使用的版本为1.3.0。

```bash
npm install @triton-one/yellowstone-grpc@1.3.0
```

之后，可通过 npx esrun xxx/index.ts 来运行每节的代码。

## 目录

### 基础

0. [创建订阅](./0-sub/)
1. [订阅格式](./01-format/)

### 进阶

2. [交易数据解析](./02-txn-parser/)
3. [账户数据解析](./03-account-parser/)

### 实战

4. [监听pump新流动池创建](./04-example-subNewPool/)
5. [监听钱包](./05-example-subWallet/)
6. [监听代币价格](./06-example-subPrice/)
7. [订阅全链数据](./07-example-subBlock/)

## 参考

- https://docs.triton.one/project-yellowstone/dragons-mouth-grpc-subscriptions
- https://docs.helius.dev/data-streaming/geyser-yellowstone
- https://github.com/rpcpool/yellowstone-grpc

## 捐赠

如果你想支持Buff社区的发展，可通过向 `buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ` 地址捐赠Solana链上资产。

社区资金将被用于奖励社区贡献者，贡献包括但不限于 `PR`。