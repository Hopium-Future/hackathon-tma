import { HALL_LEADERBOARD_TAB, HALL_LEADERBOARD_TYPE } from '@/helper/constant';
import { ValueOf } from './common.type';
import { User } from './auth.type';

export type IHallLeaderboardTab = ValueOf<typeof HALL_LEADERBOARD_TAB>;
export type IHallLeaderboardType = ValueOf<typeof HALL_LEADERBOARD_TYPE>;

export interface IHallLeaderboard {
    _id: string;
    time: string;
    type: IHallLeaderboardType;
    userId: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
    value: number;
    user: Pick<User, '_id' | 'username' | 'firstName' | 'lastName' | 'photoUrl'>;
}
