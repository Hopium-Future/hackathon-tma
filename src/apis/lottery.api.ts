import { LotteryResponse, PrizeLotteryResponse } from "@/type/lottery.type";
import baseAxios from "./base.api";

export const getPrizesLotteryInfoApi = async () => {
    const res = await baseAxios.get<PrizeLotteryResponse[]>("/lottery/prizes");
    return res;
};

export const drawLotteryApi = async () => {
    const res = await baseAxios.post<LotteryResponse>("/lottery/spin");
    return res;
};

