import { Socket } from 'socket.io-client';
import Provider from './Provider';
import usePriceSocket from '@/stores/priceSocket.store';

// const _subs: DataSubscribers = {}
const _subs: any[] = [];
let socket = usePriceSocket.getState().socket;
// Take a single trade, and subscription record, return updated bar
function updateBar(data: any, sub: any): any {
    const lastBar = sub?.lastBar;
    if (!lastBar) return;
    let { resolution } = sub;
    if (resolution.includes('D')) {
        // 1 day in minutes === 1440
        resolution = 1440;
    } else if (resolution.includes('W')) {
        // 1 week in minutes === 10080
        resolution = 10080;
    }
    const coeff = resolution * 60;
    const rounded = Math.floor(data.ts / coeff) * coeff;
    const lastBarSec = lastBar.time / 1000;
    let _lastBar;
    if (rounded > lastBarSec) {
        // create a new candle, use last close as open **PERSONAL CHOICE**
        _lastBar = {
            time: rounded * 1000,
            open: lastBar.close,
            high: lastBar.close,
            low: lastBar.close,
            close: data.price,
            volume: data.volume
        };
    } else {
        // update lastBar candle!
        if (data.price < lastBar.low) {
            lastBar.low = data.price;
        } else if (data.price > lastBar.high) {
            lastBar.high = data.price;
        }
        lastBar.volume += data.volume;
        lastBar.close = data.price;
        _lastBar = lastBar;
    }
    // eslint-disable-next-line consistent-return
    return _lastBar;
}

export default class StreamChart {
    mode: string | null = null;

    symbol: string | null = null;

    isFuture: boolean | null = true;

    constructor(mode: string | null, isFuture = true) {
        this.mode = mode;
        this.isFuture = isFuture;
    }

    // Charting Library calls this function when it wants
    // to receive real-time updates for a symbol. The Library assumes that you will call onRealtimeCallback every time you want
    // to update the most recent bar or to add a new one.
    subscribeBars(symbolInfo: any, resolution: any, onRealtimeCallback: any, listenerUID: any, resetCache: any) {
        // socket?.emit(PublicSocketEvent.SUB_TICKER_UPDATE, symbolInfo.symbol);
        try {
            // reassign to use later
            const newSub = {
                exchange: symbolInfo.exchange,
                symbol: symbolInfo.symbol,
                uid: listenerUID,
                resolution,
                symbolInfo,
                lastBar: Provider?.historyData?.[symbolInfo.symbol]?.lastBar,
                listener: onRealtimeCallback,
                resetCache
            };
            _subs.unshift(newSub);
        } catch (e) {
            console.error('__ subscribeBars e', e);
        }
    }

    // Charting Library calls this function when it doesn't want to receive updates
    // for this subscriber any more. subscriberUID will be the same object that Library passed to subscribeBars before.
    public unsubscribeBars(listenerGuid: string): void {
        const subIndex = _subs.findIndex((e) => e.uid === listenerGuid);
        if (subIndex === -1) {
            // console.log("No subscription found for ",uid)
            return;
        }
        // socket.emit('unsubscribe:recent_trade', lastSymbol);
        _subs.splice(subIndex, 1);
    }

    static _updateData(_: any, sub: any): void {
        if (_subs.length === 0) {
            return;
        }
        const { lastBar } = sub;
        if (lastBar) {
            sub.listener(lastBar);
        }
    }

    public reconnectSocket(_socket: Socket): void {
        socket = _socket;
        _subs.map((sub) => {
            sub.resetCache();
        });
        tickerUpdate(_socket);
    }
}

socket?.on('connect', () => {});

socket?.on('disconnect', () => {});

const tickerUpdate = (socket: Socket | null) => {
    socket?.on('futures:ticker:update', (update: any) => {
        const { s: symbol, t: time, p: price } = update;
        const sub = _subs.find((e) => e.symbol === symbol && e.exchange === 'NAMI_FUTURES');
        const data = {
            ts: Math.floor(time / 1000),
            price
        };
        if (sub) {
            if (!sub?.lastBar?.time) return;
            // eslint-disable-next-line no-unsafe-optional-chaining
            if (data.ts < (sub && sub?.lastBar?.time / 1000)) {
                return;
            }
            const _lastBar = updateBar(data, sub);
            sub.listener(_lastBar);
            // update our own record of lastBar
            sub.lastBar = _lastBar;
        }
    });
};

tickerUpdate(socket);
