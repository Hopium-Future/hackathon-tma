export type HistoryData = {
    _id: string,
    userId: number,
    margin: number,
    profit: number,
    openPrice: number,
    side: string,
    state: string,
    openTime: number,
    closePrice: number,
    closeTime: number,
    result: string,
    winStreak: number;
    target: string;
    volumeWinning: number;
    amount: number;
    createdAt: number;
    winnerId: number;
};

export type StatsData = {
    total: number,
    win: number,
    miss: number;
};

export type HistoryPvpData = {
    _id: string;
    creatorId: number;
    acceptorId: number;
    amount: number;
    target: string;
    openPrice: number;
    chatId: number;
    messageId: number;
    type: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    closePrice: number;
    volumeWinning: number;
    winnerId: number;
};

export type HistoryDepositData = {
    _id: string;
    amount: number;
    asset: string;
    createdAt: Date;
    fromAddress: string;
    status: string;
    transactionHash: string;
    userId: number;
    updatedAt: Date
}

export type HistoryWithdrawData = {
    _id: string,
    userId: number,
    toAddress: string,
    jettonAddress: string,
    amount: number,
    asset: string,
    status: string,
    fee: number,
    createdAt: Date,
    updatedAt: Date,
    transactionHash: string,
}