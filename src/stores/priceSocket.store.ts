import { PublicSocketEvent } from '@/helper/constant';
import initPriceSocket from '@/sockets/price.socket';
import { Socket } from 'socket.io-client';
import { TimeSync } from 'timesync';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface SocketStore {
    socket: Socket | null;
    symbolSubscribedList: string[];
    symbolSubscribedHistoryList: string[];
    initPriceSocket: () => void;
    setSocket: (socket: Socket | null) => void;
    addSymbolSubscribed: (symbol: string) => void;
    removeSymbolSubscribed: (symbol: string) => void;
    timesync: TimeSync | null;
    setTimesync: (timesync: TimeSync) => void;
}

const usePriceSocket = create<SocketStore>()(
    immer((set) => ({
        socket: null,
        symbolSubscribedList: [],
        symbolSubscribedHistoryList: [],
        setSocket(socket: Socket | null) {
            set({ socket: socket });
        },
        initPriceSocket() {
            const socket = initPriceSocket();
            set({ socket: socket });
        },
        addSymbolSubscribed: (symbol) => {
            set((state) => {
                const isNewSymbol = !state.symbolSubscribedList.includes(symbol);
                if (isNewSymbol) {
                    let validSymbol = symbol;
                    if (symbol.endsWith('VNST')) {
                        validSymbol = symbol.replace('VNST', 'VNDC');
                    }
                    state?.socket?.emit(PublicSocketEvent.SUB_TICKER_UPDATE, validSymbol);
                }
                return {
                    symbolSubscribedHistoryList: [...state.symbolSubscribedHistoryList, symbol],
                    ...(isNewSymbol && {
                        symbolSubscribedList: [...state.symbolSubscribedList, symbol]
                    })
                };
            });
        },
        removeSymbolSubscribed: (symbol) => {
            set((state) => {
                const historyUpdatedList = [...state.symbolSubscribedHistoryList];
                const idx = historyUpdatedList.indexOf(symbol);
                if (idx > -1) {
                    historyUpdatedList.splice(idx, 1);
                }
                const isRemoved = !historyUpdatedList.includes(symbol);
                if (isRemoved) {
                    state?.socket?.emit(PublicSocketEvent.UNSUB_TICKER_UPDATE, symbol);
                }
                return {
                    symbolSubscribedHistoryList: historyUpdatedList,
                    ...(isRemoved && {
                        symbolSubscribedList: state.symbolSubscribedList.filter((item) => item !== symbol)
                    })
                };
            });
        },
        timesync: null,
        setTimesync(timesync) {
            set({ timesync });
        }
    }))
);

export default usePriceSocket;
