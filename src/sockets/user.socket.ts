import { BASE_USER_SOCKET } from '@/config/app.config';
import useSocketStore from '@/stores/socket.store';
import useWalletStore from '@/stores/wallet.store';
import EventEmitter from 'eventemitter3';
import { io, Manager, Socket } from 'socket.io-client';

type Callback = (data: any) => void;

class UserSocket extends EventEmitter {
    private static instance: UserSocket | undefined;
    m!: Manager;
    socket!: Socket;
    isConnected: boolean = false;
    closeInitiated: boolean = false;
    handlers: Map<string, Callback[]> = new Map();

    constructor(token: string) {
        super();
        this.initSocket(token);
    }

    private initSocket = (token: string) => {
        this.socket = io(`${BASE_USER_SOCKET}`, {
            // extraHeaders: {
            //     Authorization: `Bearer ${initData}`
            // },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            transports: ['websocket'],
            reconnectionAttempts: Infinity,
            path: '/ws',
            query: {
                token
            }
        });

        this.socket.on('connected', () => {
            useSocketStore.getState().setSocket2(this.socket);
        });

        this.socket.on('user:update_balance:MAIN', (e) => {
            useWalletStore.getState().setWalletData(e);
        });
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.emit('connect');
            console.info('Connected to user socket');
        });

        this.socket.on('disconnect', (reason) => {
            useSocketStore.getState().setSocket2(null);
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                console.error('Socket encountered error: io server disconnect');
                this.socket.connect();

                this.isConnected = false;
                this.emit('disconnect');
            }
            // else the socket will automatically try to reconnect
        });

        this.socket.on('connect_error', (error) => {
            // ...
            console.error('Socket encountered error: ', error, 'Closing socket');
            // this.socket.close();
        });
    };

    connect = () => {
        this.isConnected = true;
        this.socket.connect();
    };

    disconnect = () => {
        this.isConnected = false;
        this.socket.disconnect();
    };

    emitEvent = (event: string, payload?: any) => {
        this.socket.emit(event, payload);
        console.info('EMIT EVENT', event);
    };

    subscribe = (event: string, callback: (data: any) => void) => {
        if (!this.isConnected) {
            console.error('Socket not connected');
            return;
        }

        // console.log("SUBCRIBE EVENT", event);

        this.socket.on(event, (data) => {
            callback(data);
        });
    };

    unsubscribe = (event: string, callback: (data: any) => void) => {
        if (!this.isConnected) {
            console.error('Socket not connected');
            return;
        }

        this.socket.off(event, (data) => {
            callback(data);
        });
    };

    removeInstance = () => {
        UserSocket.instance = undefined;
    };

    public static getInstance(initData: string): UserSocket {
        if (!UserSocket.instance) {
            UserSocket.instance = new UserSocket(initData);
        }

        return UserSocket.instance;
    }
}

export default UserSocket;
