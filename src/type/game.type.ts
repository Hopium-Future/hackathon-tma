export enum GAME_SIDE {
    PUMP = "PUMP",
    DUMP = "DUMP"
}

export type GameResult = {
    _id: string;
    userId: number;
    margin: number;
    profit: number;
    openPrice: number;
    side: string;
    state: string;
    openTime: number;
    closePrice: number;
    closeTime: number;
    result: string;
    winStreak: number;
};

export type GameInformation = {
    userId: number;
    margin: number;
    profit: number;
    openPrice: number;
    side: string;
    state: string;
    openTime: number;
    _id: string;
}

