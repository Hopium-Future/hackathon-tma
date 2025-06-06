import { AxiosRequestConfig } from 'axios';
import baseAxios from './base.api';

interface getWalletHistoryParams {
    type?: string;
    limit?: number;
    skip?: number;
}

type Params = {
    params: getWalletHistoryParams;
    config?: AxiosRequestConfig;
};

// baseAxios.defaults.baseURL = 'https://test.nami.exchange/api/';

const TRANSACTION_TYPE = ['deposit', 'withdraw'];

export const getWalletHistory = async ({ params: { type = 'all', limit = 20, skip = 0 }, config }: Params) => {
    const res = await baseAxios.get(`v3/wallet/history`, {
        params: {
            ...(type !== 'all' && { type: TRANSACTION_TYPE.includes(type) ? 'depositwithdraw' : type }),
            ...(TRANSACTION_TYPE.includes(type) && { isNegative: type === 'withdraw' }),
            limit,
            skip
        },
        ...config
    });
    return res?.data;
};

// return baseAxios.get(`v3/wallet/history/transaction`,{
//     headers: {
//         fakeauthorization: '18'
//     })};
