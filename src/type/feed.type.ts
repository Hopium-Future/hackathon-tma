import { POST_REACTIONS, POST_STATUS, PROFILE_CALL_LIST_TYPE, PROFILE_FOLLOW_TAB, TRADE_TYPE } from '@/helper/constant';
import { ValueOf } from './common.type';
import { OrderFutures, SIDE_FUTURES } from './futures.type';
import { User } from './auth.type';
import { IHallLeaderboardTab } from './hall.type';

export type ITradeType = ValueOf<typeof TRADE_TYPE>;
export type IPostReaction = ValueOf<typeof POST_REACTIONS>;
export type IPostStatus = ValueOf<typeof POST_STATUS>;
export type IFollowTabType = ValueOf<typeof PROFILE_FOLLOW_TAB>;
export type IProfileCallListType = ValueOf<typeof PROFILE_CALL_LIST_TYPE>;

export interface IPostUser extends User {
    isFollowing: boolean;
    following: number;
    followers: number;
    profit: number;
    winRate: number;
    achievement: [
        {
            timeframe: '7d' | '30d';
            winRate: number;
            profit: number;
            roi: number;
        }
    ];
}

export interface IPost {
    id: string;
    userId: number;
    orderId: number;
    caption: string;
    symbol: string;
    side: ValueOf<typeof SIDE_FUTURES>;
    createdAt: string;
    updatedAt: string;
    user: IPostUser;
    profit: number;
    futureOrder: OrderFutures;
    status: IPostStatus;
    engagement?: {
        copies: number;
        stars: number;
        counters: number;
        shares: number;
    };
    reactions?: {
        like: number;
        dislike: number;
        share: number;
    };
    userReact?: {
        isLike: boolean;
        isDislike: boolean;
        isStar: boolean;
        isShare: boolean;
    };
}
export interface ITradingData {
    created_at: string;
    displaying_id: string;
    leverage: number;
    liquidity_broker: string;
    margin: number;
    metadata: { follow_order_id: number; side: ITradeType; caller_user_id: number };
    price: number;
    quoteQty: number;
    requestId: number;
    side: SIDE_FUTURES.BUY | SIDE_FUTURES.SELL;
    signature: string;
    sl: number;
    status: number;
    symbol: string;
    tp: number;
    type: ValueOf<typeof SIDE_FUTURES>;
    useQuoteQty: boolean;
    user_id: number;
}

export interface IEarningData {
    timeframe: '7d' | '30d';
    winRate: number;
    profit: number;
    copies: number;
    counters: number;
    totalVolume: number;
    roi: number;
}

export interface ITopStar {
    totalStars: number;
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
}

export type IUserCallListCounts = { closed: number; pending: number; position: number; total: number };

export type IAchievement = {
    rank: number;
    counter: number;
};
export interface IAchievementsData {
    trophy: Record<IHallLeaderboardTab, IAchievement>;
    medal: Record<IHallLeaderboardTab, IAchievement>;
}
