export interface TradeContext {
    assetId: number;
    baseAsset: string;
    orderId: string;
    leverage: number;
    side: string;
}

export interface TradeData {
    _id: string;
    categoryName: string;
    title: string;
    type: string;
    createdAt: string;
    context: TradeContext;
    content: string;
}
