import { getBalanceInfoApi } from '@/apis/wallet.api';
import { ASSET } from '@/helper/constant';
import { HopiumInfo, User, UserInfo, UserSettings } from '@/type/auth.type';
import { IUserCallListCounts } from '@/type/feed.type';
import { GameInformation, GameResult } from '@/type/game.type';
import { WalletBalance } from '@/type/wallet.type';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Store = {
    taskClaimed: {
        value: number;
        assetId: number;
    } | null;
    setTaskClaimed: ({ value, assetId }: { value: number; assetId: number }) => void;

    isNew: boolean;
    setIsNew: (value: boolean) => void;
    user: User | null;
    setUser: (user: User) => void;
    token: string | null;
    setToken: (token: string) => void;

    // User info
    userInfo: Partial<UserInfo> | null;
    setUserInfo: (userInfo: UserInfo) => void;
    setHopiumBalance: (value: number) => void;
    // Hopium info
    hopiumInfo: Partial<HopiumInfo>;
    setHopiumInfo: (hopiumInfo: HopiumInfo) => void;

    // Balance
    setBalance: (walletBalance: WalletBalance) => void;
    loading: boolean;
    getBalance: () => void;
    wallet: {
        [ASSET.TICKET]: Omit<WalletBalance, 'currency'>;
        [ASSET.HOPIUM]: Omit<WalletBalance, 'currency'>;
        [ASSET.DOGS]: Omit<WalletBalance, 'currency'>;
        [ASSET.TON]: Omit<WalletBalance, 'currency'>;
        [ASSET.CATI]: Omit<WalletBalance, 'currency'>;
        [ASSET.USDT]: Omit<WalletBalance, 'currency'>;
        [x: number]: Omit<WalletBalance, 'currency'>;
    };

    turn: GameInformation | null;
    setTurn: (turn: GameInformation) => void;

    result: GameResult | null;
    setResult: (result: GameResult) => void;

    price: number;
    setPrice: (price: number) => void;

    userSettings: UserSettings;
    setUserSettings: (settings: UserSettings) => void;

    userProfileId: number | null;
    isShowProfileModal: boolean;
    setShowProfileModal: (show: boolean, userId?: number) => void;

    isShowNotEnoughFundModal: boolean;
    setShowNotEnoughFundModal: (show: boolean) => void;

    userCallListCounts: IUserCallListCounts;
    setUserCallListCounts: (callListCounts: IUserCallListCounts) => void;
};

const useUserStore = create<Store>()(
    immer((set) => ({
        taskClaimed: null,
        setTaskClaimed(task) {
            set((state) => {
                state.taskClaimed = task;
            });
        },

        loading: false,

        hopiumInfo: {},
        setHopiumInfo(hopiumInfo) {
            set((state) => {
                state.hopiumInfo = hopiumInfo;
            });
        },

        userInfo: null,
        setUserInfo(userInfo) {
            set((state) => {
                state.userInfo = userInfo;
            });
        },
        setHopiumBalance(value) {
            set((state) => {
                state.userInfo = {
                    ...state.userInfo,
                    hopium: value
                };
            });
        },

        isNew: false,
        setIsNew: (value: boolean) => {
            set((state) => {
                state.isNew = value;
            });
        },

        token: null,
        setToken: (token: string) => {
            set((state) => {
                state.token = token;
            });
        },

        user: null,
        setUser: (user: User) => {
            set((state) => {
                state.user = user;
            });
        },

        wallet: {
            [ASSET.TICKET]: {
                balance: 0,
                locked: 0,
                available: 0,
                assetId: ASSET.TICKET
            },
            [ASSET.CATI]: {
                balance: 0,
                locked: 0,
                assetId: ASSET.CATI,
                available: 0
            },
            [ASSET.HOPIUM]: {
                balance: 0,
                locked: 0,
                assetId: ASSET.HOPIUM,
                available: 0
            },
            [ASSET.DOGS]: {
                balance: 0,
                locked: 0,
                assetId: ASSET.DOGS,
                available: 0
            },
            [ASSET.TON]: {
                balance: 0,
                locked: 0,
                assetId: ASSET.TON,
                available: 0
            },
            [ASSET.USDT]: {
                balance: 0,
                locked: 0,
                assetId: ASSET.USDT,
                available: 0
            }
        },
        setBalance: (walletBalance: WalletBalance) => {
            set((state) => {
                if (walletBalance.assetId === ASSET.DOGS) {
                    state.wallet = {
                        ...state.wallet,
                        [ASSET.DOGS]: {
                            balance: walletBalance.balance,
                            locked: walletBalance.locked,
                            available: walletBalance.available,
                            assetId: walletBalance.assetId
                        }
                    };
                }
                if (walletBalance.assetId === ASSET.TON) {
                    state.wallet = {
                        ...state.wallet,
                        [ASSET.TON]: {
                            balance: walletBalance.balance,
                            locked: walletBalance.locked,
                            available: walletBalance.available,
                            assetId: walletBalance.assetId
                        }
                    };
                }
                if (walletBalance.assetId === ASSET.TICKET) {
                    state.wallet = {
                        ...state.wallet,
                        [ASSET.TICKET]: {
                            balance: walletBalance.balance,
                            locked: walletBalance.locked,
                            available: walletBalance.available,
                            assetId: walletBalance.available
                        }
                    };
                }
                if (walletBalance.assetId === ASSET.CATI) {
                    state.wallet = {
                        ...state.wallet,
                        [ASSET.CATI]: {
                            balance: walletBalance.balance,
                            locked: walletBalance.locked,
                            available: walletBalance.available,
                            assetId: walletBalance.assetId
                        }
                    };
                }
                if (walletBalance.assetId === ASSET.USDT) {
                    state.wallet = {
                        ...state.wallet,
                        [ASSET.USDT]: {
                            balance: walletBalance.balance,
                            locked: walletBalance.locked,
                            available: walletBalance.available,
                            assetId: walletBalance.assetId
                        }
                    };
                }
            });
        },
        getBalance: async () => {
            try {
                const result = await getBalanceInfoApi();
                // const { data } = await getBalanceApi();

                set((state) => {
                    //   state.balance = (data as WalletBalance).balance - data.locked;
                    state.wallet = result.data;
                });
            } catch (error) {
                console.log(error);
            }
        },

        turn: null,
        setTurn: (turn) => {
            set((state) => {
                state.turn = turn;
            });
        },

        result: null,
        setResult: (result) => {
            set((state) => {
                state.result = result;
            });
        },

        price: 0,
        setPrice(price) {
            set((state) => {
                state.price = price;
            });
        },

        userSettings: {
            alert: {
                TELEGRAM: true,
                lang: 'en'
            }
        },
        setUserSettings: (settings) => {
            set((state) => {
                state.userSettings = { ...state.userSettings, ...settings };
            });
        },
        userProfileId: null,
        isShowProfileModal: false,
        setShowProfileModal: (show, userId) => {
            set((state) => {
                state.userProfileId = userId ?? null;
                state.isShowProfileModal = show;
            });
        },

        isShowNotEnoughFundModal: false,
        setShowNotEnoughFundModal: (show) => {
            set((state) => {
                state.isShowNotEnoughFundModal = show;
            });
        },

        userCallListCounts: {
            closed: 0,
            pending: 0,
            position: 0,
            total: 0
        },
        setUserCallListCounts: (callListCounts) => {
            set((state) => {
                state.userCallListCounts = callListCounts;
            });
        }
    }))
);

export const useUserWallet = () =>
    useUserStore((state) => {
        return {
            ...state.wallet,
            available: state.wallet[ASSET.HOPIUM].balance - state.wallet[ASSET.HOPIUM].locked
        };
    });

export default useUserStore;
