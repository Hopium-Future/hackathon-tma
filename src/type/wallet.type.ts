export type WalletBalance = {
    balance: number;
    available: number;
    locked: number;
    assetId: number;
};

export type Wallet = {
    _id: string;
    walletAddress: string;
    email?: string;
    enabledNoti: boolean;
    balance: number;
    nonce?: string;
    isVerified: boolean;
};

interface LoanConfig {
    _id: string;
    baseAsset: string;
    quoteAsset: string;
    baseAssetId: number;
    quoteAssetId: number;
    symbol: string;
    ltv: number;
    liquidationRate: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    status: string;
}
export interface LoanConfigResponse {
    statusCode: number;
    message: string;
    data: LoanConfig[];
}

interface AssetPrice {
    assetId: number;
    price: number;
}

export interface AssetPriceResponse {
    statusCode: number;
    message: string;
    data: AssetPrice[];
}

export type WalletData = {
    value: number;
    lockedValue: number;
    walletType: string;
    assetId?: string;
};

export type WalletBalanceResponse = {
    [assetId: number]: WalletData;
};

export interface AssetData {
    assetId: number;
    value: number;
    lockedValue: number;
    ltv: number;
    liquidationRate: number;
    name: string;
    price: number;
}
