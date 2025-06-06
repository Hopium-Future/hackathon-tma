import { Friend, LoginResponse } from '@/type/auth.type';
import baseAxios from './base.api';
import { Response } from '@/type/index.type';

export const getProfileApi = () => {
    return baseAxios.get('/auth/profile');
};

export const getUserInfoApi = () => {
    return baseAxios.get('/users/info');
};

export const getHopiumInfoApi = () => {
    return baseAxios.get('/users/hopium-info');
};

export const loginApi = (initData: string) => {
    return baseAxios.post<LoginResponse>('/auth/login', {
        initData,
        hostname: window.location.hostname
    });
};

export const addReferralApi = async (referralCode: string) => {
    const res = await baseAxios.post('/users/add-referral', {
        referralCode
    });
    return res;
};

type GetFriendsParams = {
    limit?: number;
    offset?: number;
};

export const getFriendsApi = async (params: GetFriendsParams = { limit: 10, offset: 0 }) => {
    const res = await baseAxios.get<Response<Friend>>('/users/friends', {
        params
    });
    return res;
};
