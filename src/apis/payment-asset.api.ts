import baseAxios from "./base.api";


export const getPaymentAssetDeposit = async() => {
    const res = await baseAxios.get("/payment/assets");
    return res;
}