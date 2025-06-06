import { getMaxDepositUsd } from '@/apis/payment.api';
import { MaxDepositToWithdraw } from '@/type/payment-config';
import { useEffect, useState } from 'react';
import { ASSET } from '@/helper/constant.ts';

const defaultMaxDepositState = {
    totalDepositUsd: 0,
    maxDepositUsdToWithdraw: 0,
    canWithdraw: false
};

const useMaxDepositUsd = (assetId: any) => {
    const [isLoading, setLoading] = useState(true);

    const [maxDeposit, setMaxDeposit] = useState<MaxDepositToWithdraw>(defaultMaxDepositState);

    useEffect(() => {
        const checkMaxDepositUsd = async () => {
            setLoading(true);
            try {
                const maxDepositResponse = await getMaxDepositUsd();
                if (maxDepositResponse.data?.status === 'ok') {
                    setMaxDeposit(maxDepositResponse?.data.data);
                } else {
                    setMaxDeposit(defaultMaxDepositState);
                }
            } catch (error) {
                console.log('checkMaxDepositUsd error:', error);
            }
            setLoading(false);
        };
        if(+assetId === ASSET.USDT){
            checkMaxDepositUsd();
        }else{
            setMaxDeposit({
                totalDepositUsd: 0,
                maxDepositUsdToWithdraw: 0,
                canWithdraw: true
            });
        }
    }, [assetId]);

    return { isLoading, maxDeposit };
};

export default useMaxDepositUsd;
