export type PaymentAssetConfig = {
    _id: string;
    __v: number;
    assetId: number;
    createdAt: string;
    ipoable: string;
    ipoing: string;
    isLegalMoney: boolean;
    networkList: Network[];
    storage: string;
    trading: boolean;
    transferable: boolean;
    updatedAt: string;
};

export type Address = {
    _id: string;
    type: number;
    userId: number;
    assetId: number;
    network: string;
    cryptography: any;
    provider: string;
    lastSeen: string;
    address: string;
    addressTag: string;
    createdAt: string;
    updatedAt: string;
    normalizedAddress: string;
    __v: number;
};

export type Category = {
    _id: string;
    category_id: number;
    content: { vi: string; en: string };
    isShow: boolean;
    priority: number;
};

export type MaxDepositToWithdraw = {
    totalDepositUsd: number;
    maxDepositUsdToWithdraw: number;
    canWithdraw: boolean;
};

export interface Network {
    _id: string;
    __v: number;
    addressRegex: string;
    coin: string;
    depositDesc: string;
    depositEnable: boolean;
    isDefault: boolean;
    memoRegex: string;
    minConfirm: number;
    name: string;
    network: string;
    provider: string;
    resetAddressStatus: boolean;
    specialTips: string;
    unLockConfirm: number;
    withdrawDesc: string;
    withdrawEnable: boolean;
    withdrawFee: string;
    withdrawIntegerMultiple: number;
    withdrawMax: string;
    withdrawMin: string;
}

export interface Transaction {
    adminStatus: number;
    transferToRootStatus: boolean;
    _id: string;
    type: number;
    userId: number;
    provider: string;
    category?: number;
    assetId: number;
    transactionType: string;
    network: string;
    amount: number;
    actualReceive: number;
    fee: any;
    from: string;
    to: string;
    status: number;
    txId: string;
    metadata: {
        symbol: any;
        txhash: string;
        address: string;
    };
    transactionId: string;
    createdAt: string;
    created_at: string;
    updatedAt: string;
    executeAt: string;
    __v: number;
}
