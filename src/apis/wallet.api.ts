import { User } from '@/type/auth.type';
import { Account, ConnectAdditionalRequest, TonProofItemReplySuccess } from '@tonconnect/ui';
import baseAxios from './base.api';
import { LotteryBalance } from '@/type/lottery.type';
import { LoanConfigResponse, WalletBalanceResponse } from '@/type/wallet.type';

export class CustomError extends Error {
    cause: Error;

    constructor(message: string, options: { cause: Error }) {
        super(message);
        this.cause = options.cause;

        // Maintain proper stack trace for where this error was thrown (only in V8 engines like Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.name = 'CustomError'; // Set the error name explicitly
    }
}

export const getBalanceApi = () => {
    return baseAxios.get('/wallets/balance');
};

export const getBalanceInfoApi = async () => {
    const res = await baseAxios.get<LotteryBalance>('/wallets/all-balance');
    return res;
};

export const tonGeneratePayloadApi = async (): Promise<ConnectAdditionalRequest | null> => {
    try {
        const res = await baseAxios.get<{ payload: string }>('/ton/generate-payload');
        return { tonProof: res.data.payload };
    } catch (error) {
        return null;
    }
};

export const tonConnectApi = async (proof: TonProofItemReplySuccess['proof'], account: Account) => {
    const reqBody = {
        address: account.address,
        network: account.chain,
        publicKey: account.publicKey,
        proof: {
            ...proof,
            stateInit: account.walletStateInit
        }
    };
    const res = await baseAxios.post<User>('/ton/connect', reqBody);
    return res.data;
};

export const getLoanConfig = async (): Promise<LoanConfigResponse | any> => {
    try {
        const res = await baseAxios.get('spot/loan-config');
        return res?.data?.data || [];
    } catch (error) {
        throw new CustomError('API get loan config failed', { cause: error as Error });
    }
};
export const getLoanPriceAll = async (): Promise<Map<number, number>> => {
    try {
        const res = await baseAxios.get('spot/loan/price/all');
        const newInitPriceMap = new Map<number, number>();

        if (res?.data?.data?.length > 0) {
            res.data.data.forEach(({ assetId, price }: { assetId: number; price: number }) => {
                newInitPriceMap.set(assetId, price);
            });
        }
        return newInitPriceMap;
    } catch (error) {
        throw new CustomError('API get loan config failed', { cause: error as Error });
    }
};

export const getWalletBalance = async (): Promise<WalletBalanceResponse> => {
    try {
        const res = await baseAxios.get('v3/wallet/balance');
        return res?.data?.data || [];
        //  return MOCKUP_WALLET.data;
    } catch (error) {
        throw new CustomError('API get balance failed', { cause: error as Error });
    }
};
