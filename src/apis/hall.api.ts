import baseAxios from './base.api';
import { IHallLeaderboard, IHallLeaderboardTab } from '@/type/hall.type';

export interface IGetHallLeaderboardResponse {
    me?: IHallLeaderboard;
    data: IHallLeaderboard[];
}

export const getHallLeaderboardApi = async (tab: IHallLeaderboardTab) => await baseAxios.get<IGetHallLeaderboardResponse>('leaderboard', { params: { tab } });
