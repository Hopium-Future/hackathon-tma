import { ASSET, PRIZE_TYPE } from "@/helper/constant";

export type PrizeLotteryResponse = {
    title: string;
    icon: string;
    quantity: number;
};

export type LotteryResponse = {
    prize: PRIZE_TYPE,
    quantity: number;
};

export interface LotteryBalance {
    [ASSET.HOPIUM]: Data;
    [ASSET.TON]: Data;
    [ASSET.DOGS]: Data;
    [ASSET.TICKET]: Data;
    [ASSET.CATI]: Data;
    [ASSET.USDT]: Data;
    [x: string]: Data;
}

export interface Data {
    balance: number;
    locked: number;
    available: number;
    assetId: number;
}
