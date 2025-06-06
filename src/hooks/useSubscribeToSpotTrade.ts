import useWalletStore from '@/stores/wallet.store';
import { useEffect } from 'react';
import useSocketStore from '@/stores/socket.store';

type PriceDataProps = {
    p: string;
    s: string;
    t: number;
};

const SUBSCRIBE_TOPIC = 'spot:trade';

const useSubscribeToSpotTrade = () => {
    const userSocket = useSocketStore((state) => state.socket2);

    const { updatePriceFromSocket } = useWalletStore();

    useEffect(() => {
        if (!userSocket) return;
        const handleData = (data: PriceDataProps) => {
            updatePriceFromSocket(data);
        };
        userSocket.emit('subscribe', SUBSCRIBE_TOPIC);
        userSocket.on(SUBSCRIBE_TOPIC, handleData);
        return () => {
            userSocket.emit('unsubscribe', SUBSCRIBE_TOPIC);
            userSocket.off(SUBSCRIBE_TOPIC, handleData);
        };
    }, [userSocket]);
};

export default useSubscribeToSpotTrade;
