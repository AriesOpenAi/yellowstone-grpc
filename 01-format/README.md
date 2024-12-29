# 订阅格式

本部分将了解订阅的基本格式，建议对照`SubscribeRequest`接口进行学习。

`SubscribeRequest`接口定义如下：

```ts
// 本地路径为 node_modules/@triton-one/yellowstone-grpc/dist/grpc/geyser.d.ts
export interface SubscribeRequest {
    accounts: {
        [key: string]: SubscribeRequestFilterAccounts;
    };
    slots: {
        [key: string]: SubscribeRequestFilterSlots;
    };
    transactions: {
        [key: string]: SubscribeRequestFilterTransactions;
    };
    transactionsStatus: {
        [key: string]: SubscribeRequestFilterTransactions;
    };
    blocks: {
        [key: string]: SubscribeRequestFilterBlocks;
    };
    blocksMeta: {
        [key: string]: SubscribeRequestFilterBlocksMeta;
    };
    entry: {
        [key: string]: SubscribeRequestFilterEntry;
    };
    commitment?: CommitmentLevel | undefined;
    accountsDataSlice: SubscribeRequestAccountsDataSlice[];
    ping?: SubscribeRequestPing | undefined;
}
```

所以，一个空白的订阅请求如下所示：

```ts
{
    accounts: {},
    slots: {},
    transactions: {},
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    entry: {},
    accountsDataSlice: [],
    commitment: undefined,
    ping: undefined,
};
```

接下来，我们将按照是否常用从高到低排序讲解。

## 1. commitment

用于指定订阅数据的确认级别。

在实时监听场景下，`processed`为最低级别，也是最常用的级别，要以最快的方式获取链上数据，应使用此级别。其后依次为`confirmed`、`finalized`等。

一个指定确认级别为`processed`的request示例如下：

```ts
{
    accounts: {},
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

## 2. ping

用于维持连接。

正如上部分的例子，建议以定时器的方式定期向服务端发送ping请求。从经验来看，5秒钟发送一次较为合适。

一个在向服务端发送ping请求的request示例如下：

```ts
{
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
```

## 3. transactions & transactionsStatus

`transactions`用于过滤符合条件的交易，可添加如下过滤条件：

```ts
{
    vote?: boolean | undefined;
    failed?: boolean | undefined;
    signature?: string | undefined;
    accountInclude: string[];
    accountExclude: string[];
    accountRequired: string[];
}
```

- `vote`: 是否监听投票交易
- `failed`: 是否监听失败交易
- `signature`: 指定监听交易的签名
- `accountInclude`: 监听此列表中账户的交易
- `accountExclude`: 不监听此列表中的账户的交易
- `accountRequired`: 监听的交易需要包含列表中的所有账户

> 注意：各个字段之间为`AND`关系，而单个字段列表中的值为`OR`关系。

一个只监听`6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`账户（pumpfun合约）交易的request示例如下：

```ts
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
    commitment: undefined,
    ping: undefined,
};
```

`transactionsStatus`用于监听交易状态，request格式与`transactions`相同，但返回的数据无交易的详细信息。

## 4. accounts & accountsDataSlice

`accounts`用于订阅账户更新，可添加如下过滤条件：

```ts
{
    account: string[];
    owner: string[];
    filters: SubscribeRequestFilterAccountsFilter[]; // 类似http rpc的getProgramAccounts方法
    nonemptyTxnSignature?: boolean | undefined;
}
```

- `account`: 监听此列表中的账户
- `owner`: 监听账户的owner
- `filters`: 过滤条件, 包含`memcmp`、`datasize`、`tokenAccountState`、`lamports`，可参考[https://solana.com/docs/rpc#filter-criteria](https://solana.com/docs/rpc#filter-criteria)。
- `nonemptyTxnSignature`: 是否监听非空交易

一个监听`8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj`账户（Raydium WSOL/USDC CLMM流动池）的request示例如下：

```ts
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

`accountsDataSlice`用于指定获取账户数据的分片，可添加如下过滤条件：

```ts
{
    offset: string;
    length: string;
}
```

- `offset`: 偏移量
- `length`: 长度

一个监听Raydium WSOL/USDC CLMM流动池中`sqrtPriceX64`数据的request示例如下：

```ts
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
        accountsDataSlice: [ { offset: "253", length: "16" } ],
        commitment: CommitmentLevel.PROCESSED,
        ping: undefined,
    };
```

## 5. blocks & blocksMeta

`blocks`用于过滤订阅区块数据，可添加如下过滤条件：

```ts
{
    accountInclude: string[];
    includeTransactions?: boolean | undefined;
    includeAccounts?: boolean | undefined;
    includeEntries?: boolean | undefined;
}
```

- `accountInclude`: 监听包含此列表中的账户的区块
- `includeTransactions`: 是否监听区块中的交易信息
- `includeAccounts`: 是否监听区块中的账户信息
- `includeEntries`: 是否监听区块中的entry信息

一个获取区块全部交易信息的request示例如下：

```ts
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
```

`blocksMeta`用于过滤订阅区块元数据，目前暂无过滤器支持。

## 6. entry

`entry`用于过滤订阅entry数据，目前暂无过滤器支持。

## 7. slots

`slots`用于过滤订阅slot更新。

```ts
{
    filterByCommitment?: boolean | undefined;
}
```

# 总结

本部分，我们学习了订阅请求的格式，并大致了解了各个字段的作用，之后使用时，可按照需求自定义订阅格式。

在获取到数据后，需要对数据进行解析，这是下部分的内容。