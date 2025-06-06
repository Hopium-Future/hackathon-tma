export const TRADE_DATA = [
    {
        categoryName: 'TRADE',
        title: 'Trade Update Order',
        type: 'FUTURES_OPEN_POSITION',
        createdAt: '2024-10-21T08:29:31.290Z',
        context: {
            assetId: 22,
            baseAsset: 'USDT',
            orderId: 3308,
            leverage: 50
        },
        content: '[assetCode] [leverage] has been filled.'
    },
    {
        type: 'FUTURES_LIQUIDATE',
        categoryName: 'TRADE',
        title: 'Trade Update Order',
        content: '[assetCode] [leverage] has been liquidated',
        context: {
            assetId: 22,
            baseAsset: 'USDT',
            orderId: 3308,
            leverage: 50
        },
        createdAt: '2024-10-21T08:29:31.290Z'
    },
    {
        type: 'FUTURES_HIT_TP',
        categoryName: 'TRADE',
        title: 'Trade Update Order',
        content: '[assetCode] [leverage] has reached TP price',
        context: {
            assetId: 22,
            baseAsset: 'USDT',
            orderId: 3308,
            leverage: 50
        },
        createdAt: '2024-10-21T08:29:31.290Z'
    },
    {
        type: 'FUTURES_HIT_SL',
        categoryName: 'TRADE',
        title: 'Trade Update Order',
        content: '[assetCode] [leverage] has has reached SL price',
        context: {
            assetId: 564,
            baseAsset: 'TON',
            orderId: 3308,
            leverage: 50
        },
        createdAt: '2024-10-21T08:29:31.290Z'
    }
];
