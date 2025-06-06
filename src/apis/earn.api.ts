import baseAxios from './base.api';
import { LeaderboardResponse } from '@/type/campaign.type';
import { ITiers } from '@/type/earn.type';

interface IGetEarnTiersResponse {
    currentVolume: number
    data: ITiers[],
}

export const getEarnCallsApi = async (params: { offset?: number; limit?: number }) => {
    return await baseAxios.get('earn/calls', { params });
};

export const getEarnReferralsApi = async (params: { offset?: number; limit?: number }) => {
    return await baseAxios.get('earn/referrals', { params });
};

export const getEarnCampaignApi = async () => {
    return await baseAxios.get('earn/campaigns');
};

export const getEarnCampaignDetailsApi = async (id: number) => {
    return await baseAxios.get(`earn/campaigns/${id}`);
};

export const getEarnLeaderboardCampaignApi = async (id: number) => {
    return await baseAxios.get<LeaderboardResponse>(`earn/campaigns/${id}/leaderboard`);
};

export const getEarnTiersApi = async () => {
    return await baseAxios.get<IGetEarnTiersResponse>('earn/tiers');
};
