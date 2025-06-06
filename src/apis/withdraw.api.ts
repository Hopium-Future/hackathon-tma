import baseAxios from "./base.api";

type PayloadWithdraw = {
    asset: string;
    amount: number;
};

export const createWithdrawPayment = async(payload: PayloadWithdraw) => {
    const res = await baseAxios.post("/payment/withdraw", payload);
    return res;
}