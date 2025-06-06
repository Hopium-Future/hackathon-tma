import { QueryParams } from "@/type/query.type";
import baseAxios from "./base.api";
import { HistoryData, HistoryPvpData } from "@/type/history.type";
import { BASE_PRICE_API_URL } from "@/config/app.config";

interface GameTurnParams extends QueryParams {
    state: string;
}

type HistoryResponse = {
    data: HistoryData[],
    hasMore: boolean
}

export const getGameTurnApi = async (params: GameTurnParams) => {
    const res = await baseAxios.get<HistoryResponse>("/game/turns", {
        params
    });
    return res;
};

type HistoryPvpParams = {
    limit?: number;
    offset?: number;
};

type PvpHistoryResponse = {
    data: HistoryPvpData[],
    hasMore: boolean
}

export const getPvpHistoryApi = async (params: HistoryPvpParams) => {
    const res = await baseAxios.get<PvpHistoryResponse>("/game/history/pvp", {
        params
    });
    return res;
};

export const getGameStatsApi = async () => {
    const res = await baseAxios.get("/game/stats");
    return res;
}; 

type HistoryDepositParams = {
    limit?: number;
    offset?: number;
};

type HistoryWithdrawParams = {
    limit?: number;
    offset?: number;
};

export const getHistoryDeposit = async(params: HistoryDepositParams) => {
    const res = await baseAxios.get("/payment/deposit", {
        params
    });
    return res;
}

export const getHistoryWithdraw = async(params: HistoryWithdrawParams) => {
    const res = await baseAxios.get("/payment/withdraw", {
        params
    });
    return res;
}

interface IGetPriceHistoryParams {
    symbol: string;
    resolution: string;
    from: number;
    to: number;
}
export const getPriceHistory = async (params: IGetPriceHistoryParams) => {
    const url = '/api/v1/chart/history';
    return await baseAxios.get(url, {
        params: {
            ...params,
            broker: 'NAMI_FUTURES'
        },
        baseURL: BASE_PRICE_API_URL
    });
};