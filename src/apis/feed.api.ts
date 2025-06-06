import { GenericAbortSignal } from 'axios';
import baseAxios from './base.api';
import { IAchievementsData, IPostReaction, IProfileCallListType } from '@/type/feed.type';
import { TDataFollowOnboard } from '@/type/onboard.type';

export interface IGetFeedApiParams {
    limit?: number;
    offset?: number;
    isFollowing?: boolean;
    signal?: GenericAbortSignal;
}
interface ICreatePostApiParams {
    orderId: number;
    caption?: string;
}
interface IReactPostApiParams {
    postId: string;
    reaction: IPostReaction;
}
export interface IGetCallListProfileParams {
    userId: number;
    limit?: number;
    offset?: number;
    type?: IProfileCallListType;
    signal?: GenericAbortSignal;
}
interface IGetFollowProfileParams {
    userId: number;
    offset?: number;
    limit?: number;
    signal?: GenericAbortSignal;
}

export const getFeedApi = async (params: IGetFeedApiParams) => {
    const { signal, ...query } = params;
    const response = await baseAxios.get('/feed', { params: query, signal });
    return response.data;
};

export const createPostApi = async (params: ICreatePostApiParams) => {
    const response = await baseAxios.post('/feed/posts', params);
    return response.data;
};

export const reactPostApi = async (params: IReactPostApiParams) => {
    const { postId, reaction } = params;
    return await baseAxios.post(`/feed/posts/${postId}/reactions`, { reaction });
};

export const sharePostApi = async (postId: string) => {
    return await baseAxios.post(`/feed/posts/${postId}/share`);
};

export const followUser = async (followingId: number) => {
    return await baseAxios.post('/follows', { followingId });
};

export const unFollowUser = async (followingId: number) => {
    return await baseAxios.delete(`/follows/${followingId}`);
};

export const getPostStarInvoiceLink = async (postId: string, amount: number) => {
    return await baseAxios.get(`/feed/posts/${postId}/star-invoice`, { params: { amount } });
};

export const getProfileById = async (userId: number) => {
    return await baseAxios.get(`/feed/profile/${userId}`);
};

export const getEarningById = async (userId: number) => {
    return await baseAxios.get(`/feed/profile/${userId}/earnings`);
};

export const getTopStarById = async (userId: number) => {
    return await baseAxios.get(`/feed/profile/${userId}/top-stars`);
};

export const getCallListProfile = async (params: IGetCallListProfileParams) => {
    const { userId, signal, ...query } = params;
    const response = await baseAxios.get(`/feed/profile/${userId}/call-list`, { params: { ...query }, signal });
    return response.data;
};

export const getFollowingProfile = async (params: IGetFollowProfileParams) => {
    const { userId, signal, ...rest } = params;
    return await baseAxios.get<{ data: TDataFollowOnboard[]; hasMore: boolean }>(`/follows/profile/${userId}/followings`, { params: rest, signal });
};

export const getFollowersProfile = async (params: IGetFollowProfileParams) => {
    const { userId, signal, ...rest } = params;
    return await baseAxios.get<{ data: TDataFollowOnboard[]; hasMore: boolean }>(`/follows/profile/${userId}/followers`, { params: rest, signal });
};

export const searchUser = async (keyword: string) => {
    const response = await baseAxios.post('/follows/search', { keyword });
    return response.data;
};

export const getUserRecommendedList = async () => {
    const response = await baseAxios.get('follows/recommend/followings');
    return response.data;
};

export const getAchievementsProfile = async (userId: number) => {
    return await baseAxios.get<IAchievementsData>(`feed/profile/${userId}/achievements`);
};
