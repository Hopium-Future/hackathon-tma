import UserSocket from '@/sockets/user.socket';
import useSocketStore from '@/stores/socket.store';
import useUserStore from '@/stores/user.store';
import { useCallback, useEffect } from 'react';

const useUserSocket = () => {
    // const socket = useRef<UserSocket | null>(null);
    const { token } = useUserStore();
    // Save socket to store: TODO
    const { socket, setSocket, setIsSocketConnected } = useSocketStore();
    const onConnect = useCallback(() => {
        setIsSocketConnected(true);
    }, []);

    const onDisconnect = useCallback(() => {
        setSocket(undefined);
        setIsSocketConnected(false);
    }, []);

    useEffect(() => {
        if (!token) return;

        let _socket = socket;
        if (!_socket) {
            _socket = UserSocket.getInstance(token);
            _socket.connect();
            setSocket(_socket);
        }

        // Callback on event socket
        _socket?.subscribe('connect', onConnect);
        _socket?.subscribe('disconnect', onDisconnect);
        return () => {
            _socket?.unsubscribe('connect', onConnect);
            _socket?.unsubscribe('disconnect', onDisconnect);
        };
    }, [token]);

    return socket;
};

export default useUserSocket;
