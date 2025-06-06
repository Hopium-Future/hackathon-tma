import { SIDE_FUTURES } from './futures.type';

export type IAssetReward = {
    assetId: number;
    assetQuantity: number;
};

export interface ITiers {
    _id: number;
    name: string;
    metadata?: {
        accumulatedVolume: number;
        rewards: IAssetReward[];
        fee: {
            taker: number;
            maker: number;
        };
    };
}

export interface ICallItem {
    createdAt: string;
    symbol: string;
    side: SIDE_FUTURES;
    commission: number;
}
