import { PROFILE_FOLLOW_TAB } from '@/helper/constant';
import { IEarningData, IFollowTabType, IPostUser } from '@/type/feed.type';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Store = {
    user: IPostUser | null;
    setUser: (user: IPostUser) => void;

    earning: IEarningData | null;
    setEarning: (earning: IEarningData) => void;
    tabModalFollower: IFollowTabType;
    openModalFollower: boolean;
    setOpenModalFollower: (bol: boolean, tab?: IFollowTabType) => void;
    time: string;
    setTime: (time: string) => void;
    isReload: boolean;
    setIsReload: (bol: boolean) => void;
    isCallList: boolean;
    setIsCallList: (bol: boolean) => void;
};

const useProfileFeedStore = create<Store>()(
    immer((set) => ({
        user: null,
        setUser: (user: IPostUser) => {
            set((state) => {
                state.user = user;
            });
        },
        time: '7d',
        setTime: (time) => {
            set((state) => {
                state.time = time;
            });
        },
        earning: null,
        setEarning: (earning: IEarningData) => {
            set((state) => {
                state.earning = earning;
            });
        },
        tabModalFollower: PROFILE_FOLLOW_TAB.FOLLOWING,
        openModalFollower: false,
        setOpenModalFollower: (bol, tab) => {
            set((state) => {
                state.openModalFollower = bol;
                if (tab) {
                    state.tabModalFollower = tab;
                }
            });
        },
        isReload: true,
        setIsReload: (bol) => {
            set((state) => {
                state.isReload = bol;
            });
        },
        isCallList: false,
        setIsCallList: (bol) => {
            set((state) => {
                state.isCallList = bol;
            });
        }
    }))
);

export default useProfileFeedStore;
