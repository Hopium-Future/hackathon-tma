import { TDataFollowOnboard } from '@/type/onboard.type';
import baseAxios from './base.api';

export const getListFollowers = async () => {
    const res = await baseAxios.get<TDataFollowOnboard[]>('/follows/followers');
    return res;
};

export const followUser = async (followingId: number) => {
    return await baseAxios.post('/follows', { followingId });
};

export const unFollowUser = async (followingId: number) => {
    return await baseAxios.delete(`/follows/${followingId}`);
};

export const updateOnboardingUser = async () => {
    return await baseAxios.put('/users/update-onboarding');
};


