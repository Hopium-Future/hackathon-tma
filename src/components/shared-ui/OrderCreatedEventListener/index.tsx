import { SOCKET_TOPIC } from '@/helper/constant';
import useEventSocket from '@/hooks/useEventSocket';
import useFuturesConfig from '@/stores/futures.store';
import { memo } from 'react';

const OrderCreatedEventListener = () => {
    const setNewOrderCreatedId = useFuturesConfig((state) => state.setNewOrderCreatedId);
    const handleOrderCreated = (orderId: number) => {
        setNewOrderCreatedId(orderId);
    };

    useEventSocket(SOCKET_TOPIC.ORDER_CREATED, (data) => handleOrderCreated(data.orderId));
    return <></>;
};

export default memo(OrderCreatedEventListener);
