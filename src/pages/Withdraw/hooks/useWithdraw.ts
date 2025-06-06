import { paymentWithdraw } from '@/apis/payment.api';
import { WITHDRAW_RESULT } from '@/helper/constant';
import { Network } from '@/type/payment-config';
import isObject from 'lodash/isObject';
import { useState } from 'react';
import { toast } from 'react-toastify';

const errorMessageMapper = ({ error, data }: { error: any; data?: any }): string => {
    switch (error) {
        case WITHDRAW_RESULT.MissingOtp:
            return 'Please input OTP';
        case WITHDRAW_RESULT.InvalidOtp:
            return 'The verification code is invalid, please try again.';
        case WITHDRAW_RESULT.NotEnoughBalance:
            return 'Your balance is not enough';
        case WITHDRAW_RESULT.UnsupportedAddress:
            return 'Invalid wallet address';
        case WITHDRAW_RESULT.InvalidAddress:
            return 'Invalid wallet address';
        case WITHDRAW_RESULT.AmountExceeded:
        case WITHDRAW_RESULT.AmountTooSmall:
            return 'Invalid amount';
        case WITHDRAW_RESULT.InvalidAsset:
            return 'Invalid asset';
        case WITHDRAW_RESULT.INVALID_KYC_STATUS:
            return 'Please verify your account';
        case WITHDRAW_RESULT.WithdrawDisabled:
            return 'Withdrawal is currently under maintenance, please try again later.';
        case WITHDRAW_RESULT.SOTP_INVALID:
            return `Verification code is incorrect ${data?.count ?? 1}/5, please try again`;
        case WITHDRAW_RESULT.SECRET_INVALID:
            return `Verification code is incorrect ${data?.count ?? 1}/5, please get OTP from Nami Exchange App.`;
        case WITHDRAW_RESULT.INVALID_SMART_OTP_KEY:
            return 'Transaction has been processed or expired, please check transaction history.';
        case WITHDRAW_RESULT.HAVE_OPEN_POSITION:
            return 'You need to close all positions before withdrawing assets';
        case WITHDRAW_RESULT.Unknown:
        default:
            return 'Error unknown, please contact support';
    }
};

interface WithdrawParams {
    assetId: number;
    amount: number;
    network: Network['network'];
    address: string;
    memo?: string;
    successCb?: () => void;
}

const alertErr = ({ error, data }: { error?: any; data?: any }) => {
    return toast.error(errorMessageMapper({ error, data }));
};

const useWithdraw = () => {
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const onWithdraw = async ({ assetId, amount, network, address, memo, successCb }: WithdrawParams) => {
        setIsWithdrawing(true);
        try {
            const withdraw = await paymentWithdraw({
                assetId,
                amount,
                network,
                withdrawTo: address,
                tag: memo
            });
            if (withdraw.data?.status === 'ok') {
                successCb?.();
            } else {
                if (!isObject(withdraw.data?.data)) alertErr({ error: withdraw.data?.data });
                else alertErr({});
            }
        } catch (error) {
            console.log('error:', error);
            alertErr({ error });
        }
        setIsWithdrawing(false);
    };

    return { isWithdrawing, onWithdraw };
};

export default useWithdraw;
