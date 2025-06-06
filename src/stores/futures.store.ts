import { fetchFavorite, getAssetsConfig, getFeesConfig, getPairsConfig, getTickers } from '@/apis/futures.api';
import { LOCAL_STORAGE_KEY } from '@/helper/constant';
import FuturesMarketWatch from '@/helper/FuturesMarketWatch';
import { IPost } from '@/type/feed.type';
import { AssetConfigType, FeeConfigType, PairConfig, Ticker } from '@/type/futures.type';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
type Store = {
    pairsConfig: PairConfig[];
    getPairsConfig: VoidFunction;

    assetsConfig: AssetConfigType[];
    getAssetsConfig: VoidFunction;

    tickers: { [key: string]: Ticker };
    getTickers: VoidFunction;
    setTicker: (ticker: Ticker) => void;

    favoritePairs: string[];
    getFavoritePairs: VoidFunction;
    setFavoritePairs: (pairs: string[]) => void;

    feesConfig: FeeConfigType | null;
    getFeesConfig: VoidFunction;

    keyboardHeight: number;
    setKeyboardHeight: (height: number) => void;

    showShareOrderSignalSuccessModal: boolean;
    setShowShareOrderSignalSuccessModal: (show: boolean) => void;

    ordersShared: string[];
    addOrderShared: (id: string) => void;
    removeOrderShared: (id: string) => void;
    setOrdersShared: (orders: string[]) => void;

    newPost: IPost | null;
    setNewPost: (post: IPost) => void;

    newOrderCreatedId: number | null;
    setNewOrderCreatedId: (id: number | null) => void;
};

const useFuturesConfig = create<Store>()(
    immer((set) => ({
        //pairsConfig
        pairsConfig: [],
        getPairsConfig: async () => {
            const data = await getPairsConfig();
            if (data) {
                set((state) => {
                    state.pairsConfig = data;
                });
            }
        },
        //assetsConfig
        assetsConfig: [],
        getAssetsConfig: async () => {
            const data = await getAssetsConfig();
            if (data) {
                set((state) => {
                    state.assetsConfig = data;
                });
            }
        },
        //ticker
        tickers: {},
        getTickers: async () => {
            const data = await getTickers();
            if (data) {
                const marketWatch: any = {};
                data.map((o: any) => (marketWatch[o.s] = FuturesMarketWatch.create(o)));
                set((state) => {
                    state.tickers = marketWatch;
                });
            }
        },
        setTicker: (ticker: Ticker) => {
            set((state) => ({
                tickers: {
                    ...state.tickers,
                    [ticker.symbol]: ticker
                }
            }));
        },
        //favorite
        favoritePairs: [],
        getFavoritePairs: async () => {
            const data = await fetchFavorite('get', 2, null);
            if (data) {
                set((state) => {
                    state.favoritePairs = data;
                });
            }
        },
        setFavoritePairs: (pairs: string[]) => {
            set((state) => {
                state.favoritePairs = pairs;
            });
        },

        feesConfig: null,
        getFeesConfig: async () => {
            const data = await getFeesConfig();
            if (data) {
                set((state) => {
                    state.feesConfig = data;
                });
            }
        },

        keyboardHeight: 0,
        setKeyboardHeight: (height: number) => {
            set((state) => {
                state.keyboardHeight = height;
            });
        },

        showShareOrderSignalSuccessModal: false,
        setShowShareOrderSignalSuccessModal: (isShow) => {
            set((state) => {
                state.showShareOrderSignalSuccessModal = isShow;
            });
        },

        ordersShared: [],
        addOrderShared: (id) => {
            set((state) => {
                const newList = [...state.ordersShared, id];
                localStorage.setItem(LOCAL_STORAGE_KEY.ORDERS_SHARED, newList.join(','));
                state.ordersShared = newList;
            });
        },
        removeOrderShared: (id) => {
            set((state) => {
                const newList = state.ordersShared.filter((orderId) => orderId !== id);
                localStorage.setItem(LOCAL_STORAGE_KEY.ORDERS_SHARED, newList.join(','));
                state.ordersShared = newList;
            });
        },
        setOrdersShared: (orders) => {
            set((state) => {
                state.ordersShared = orders;
            });
        },

        newPost: null,
        setNewPost: (post) => {
            set((state) => {
                state.newPost = post;
            });
        },

        newOrderCreatedId: null,
        setNewOrderCreatedId: (id) => {
            set((state) => {
                state.newOrderCreatedId = id;
            });
        }
    }))
);

export default useFuturesConfig;
