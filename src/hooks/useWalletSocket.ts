import { useEffect } from "react";
// import useUserSocket from "./useUserSocket";
import { SOCKET_TOPIC } from "@/helper/constant";
import useUserSocket from "./useUserSocket";

const useWalletSocket = (
    callback: any
) => {
    const socket = useUserSocket();

    useEffect(() => {
        if (!socket) return;

        // Tương đương với on('test-event-user', handleTestEvent);
        socket.subscribe(SOCKET_TOPIC.WALLET_UPDATED, callback);
        return () => {

            // Tương đương với off('test-event-user', handleTestEvent);
            socket.unsubscribe(SOCKET_TOPIC.WALLET_UPDATED, callback);

        };
    }, [callback, socket]);
};

export default useWalletSocket;