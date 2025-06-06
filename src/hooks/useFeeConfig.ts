import { NA3_FEE_FUTURE, PARTNER_TYPE } from '@/helper/constant';
import useFuturesConfig from '@/stores/futures.store';
import useUserStore from '@/stores/user.store';
import { FeeType } from '@/type/futures.type';
import { useMemo } from 'react';

const useFeeConfig = (feeType: FeeType, type?: number) => {
    const partnerType = useUserStore((state) => state.userInfo)?.partnerType ?? PARTNER_TYPE.NEWBIE;
    const feesConfig = useFuturesConfig((state) => state.feesConfig);
    
    const feeConfig = useMemo(() => {
        return {
            open: feesConfig?.open?.[feeType]?.[type || partnerType]?.usdt || NA3_FEE_FUTURE.OPEN,
            close: feesConfig?.close?.[feeType]?.[type || partnerType]?.usdt || NA3_FEE_FUTURE.CLOSE
        };
    }, [partnerType, type, feesConfig]);

    return { feeConfig };
};

export default useFeeConfig;
