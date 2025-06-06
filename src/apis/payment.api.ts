import { AxiosRequestConfig } from 'axios';
import baseAxios from './base.api';
import { User } from '@/type/auth.type';
import { MaxDepositToWithdraw } from '@/type/payment-config';

export const getPaymentHistory = (params: any, config?: AxiosRequestConfig) =>
    baseAxios.get('/v3/payment/deposit_withdraw_history', {
        params,
        ...config
    });

export const getPaymentConfig = () => {
    return baseAxios.get('/v3/payment/config');
};

export const getDespositAddress = (params: any) => {
    return baseAxios.get('/v3/payment/deposit_address', {
        params
    });
};

export const paymentWithdraw = (payload: any) => {
    return baseAxios.post('/v3/payment/withdraw', payload, {
        timeout: 10000
    });
};

export const getMaxDepositUsd = () => baseAxios.get<{ data: MaxDepositToWithdraw; status: any }>('/v3/payment/check-max-deposit-usd');

export const getTransactionDetail = (transactionId: string) => baseAxios.get(`/v3/payment/deposit_withdraw_history/${transactionId}`);

export const getCategories = () => baseAxios.get('/v3/wallet/category');

export const getFuturesOpenOrderCount = (userId: User['_id']) =>
    baseAxios.get('/v3/futures/vndc/count-order', {
        params: {
            userId
        },
        timeout: 10000
    });
