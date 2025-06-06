
import baseAxios from "./base.api";

export const getRankingFriendApi = async (limit?: number, offset?: number) => {
    const res = await baseAxios.get("/rank/friends", {
        params: {
            limit,
            offset
        }
    });
    return res;
};

export const getRankingGlobalApi = async (limit: number) => {
    const res = await baseAxios.get("/rank", {
        params: {
            limit
        }
    });
    return res;
};

export const getRankingPvpApi = async (limit?: number, offset?: number) => {
    const res = await baseAxios.get("/rank/pvp", {
        params: {
            limit,
            offset
        }
    });
    return res;
};

export const getRankingStatsApi = async () => {
    const res = await baseAxios.get<{ totalVolume: number; }>("/rank/pvp/stats",);
    return res;
};
