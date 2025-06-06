import { PvpPosition } from "@/type/pvp.type";
import baseAxios from "./base.api";

export const getPvpPositionsApi = async (userId?: number, sort: string = "ASC") => {
    return await baseAxios.get<PvpPosition[]>("/game/pvps", {
        params: {
            userId,
            sort
        }
    });
};

type CreatePositionType = {
    target: string;
    amount: number;
};

export const createPositionApi = async (payload: CreatePositionType) => {
    const res = await baseAxios.post("/game/pvp/create", payload);
    return res;
};

type AcceptReponse = {
    createdAt: number;
    id: string;
};

export const acceptPositionApi = async (key: string) => {
    const res = await baseAxios.put<AcceptReponse>(`/game/pvp/accept/${key}`);
    return res;
};

type ResultResponse = {
    winnerId: number,
    loserId: number;
};

export const getResultByRoomId = async (roomId: string) => {
    const res = await baseAxios.get<ResultResponse>(`/pvp/${roomId}`);
    return res;

};