import { BASE_STREAM_SOCKET } from '@/config/app.config';
import { PublicSocketEvent } from '@/helper/constant';
import Emitter from '@/helper/emitter';
import FuturesMarketWatch from '@/helper/FuturesMarketWatch';
import useFuturesConfig from '@/stores/futures.store';
import usePriceSocket from '@/stores/priceSocket.store';
import { Ticker } from '@/type/futures.type';
import { io } from 'socket.io-client';
import * as timesync from 'timesync';

const initPriceSocket = () => {
    const socket = io(BASE_STREAM_SOCKET || '', {
        path: '/ws',
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 2000,
        reconnectionAttempts: Infinity
    });

    socket.on('connect', () => {
        usePriceSocket.getState().setSocket(socket);

        const ts = timesync.create({
            server: BASE_STREAM_SOCKET || '',
            interval: 50000
        });

        ts.send = (to: string, data: any, timeout: number) => {
            if (!to) return Promise.reject(new Error('Socket not initialized'));
            return new Promise<void>((resolve, reject) => {
                const timeoutFn = setTimeout(reject, timeout);
                socket.emit('timesync', data, () => {
                    clearTimeout(timeoutFn);
                    resolve();
                });
            });
        };
        socket.on('timesync', (data) => ts.receive('', data));
        usePriceSocket.getState().setTimesync(ts);
    });

    socket.on('disconnect', () => {
        usePriceSocket.getState().setSocket(null);
    });
    socket.on(PublicSocketEvent.FUTURES_TICKER_UPDATE, (data) => {
        Emitter.emit(PublicSocketEvent.FUTURES_TICKER_UPDATE + data.s, data);
        Emitter.emit(PublicSocketEvent.FUTURES_TICKER_UPDATE, data);
        const ticker = FuturesMarketWatch.create(data) as Ticker;
        useFuturesConfig.getState().setTicker(ticker);
    });

    return socket;
};

export default initPriceSocket;
