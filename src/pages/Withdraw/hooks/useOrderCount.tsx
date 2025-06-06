import { getFuturesOpenOrderCount } from '@/apis/payment.api';
import useUserStore from '@/stores/user.store';
import { useEffect, useState } from 'react';

const useOrderCount = () => {
    const [isLoading, setLoading] = useState(false);
    const [orderCount, setOrderCount] = useState(0);

    const userInfo = useUserStore((state) => state.user);

    useEffect(() => {
        const checkOpenOrderCount = async () => {
            if (!userInfo) return;
            setLoading(true);
            try {
                const orderCount = await getFuturesOpenOrderCount(userInfo?._id);
                if (orderCount.data?.status === 'ok') {
                    setOrderCount(orderCount?.data?.data as number);
                } else {
                    setOrderCount(0);
                }
            } catch (error) {
                console.log('getFuturesOpenOrderCount error:', error);
            }
            setLoading(false);
        };
        checkOpenOrderCount();
    }, [userInfo]);

    return { isLoading, orderCount };
};

export default useOrderCount;
