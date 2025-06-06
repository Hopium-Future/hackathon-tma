import UserSocket from '@/sockets/user.socket';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
type Store = {
    isSocketConnected: boolean;
    setIsSocketConnected: (isConnected: boolean) => void;
    socket?: UserSocket;
    setSocket: (socket: UserSocket | undefined) => void;
    reset: () => void;

    socket2?: Socket | null;
    setSocket2: (socket: Socket | null) => void;
};

const useSocketStore = create<Store>()(
    immer((set) => ({
        isSocketConnected: false,
        setIsSocketConnected(isConnected) {
            set((state) => {
                state.isSocketConnected = isConnected;
            });
        },
        socket: undefined,
        setSocket(socket: any | undefined) {
            set((state) => {
                state.socket = socket;
            });
        },
        reset: () =>
            set((state) => {
                state.socket = undefined;
            }),
        socket2: null,
        setSocket2(socket: Socket | null) {
            set((prev) => ({ ...prev, socket2: socket }));
        }
    }))
);

export default useSocketStore;
