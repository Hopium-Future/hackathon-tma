import { useEffect } from "react";
// import useUserSocket from "./useUserSocket";
import useUserSocket from "./useUserSocket";

const useEventSocket = (
    event: string,
    callback: (data: any) => void,
) => {
    const socket = useUserSocket();

    useEffect(() => {
        if (!socket) return;

        // Emit subscribe tới channel cần lắng nghe (vd: spot:trade:btcusdt)
        socket.emitEvent('subscribe', event);

        // Tương đương với on('test-event-user', handleTestEvent);
        socket.subscribe(event, callback);
        return () => {
            // Unsubscribe tới channel để ngừng lắng nghe (giảm tải cho server/client)
            socket.emitEvent('unsubscribe', event);

            // Tương đương với off('test-event-user', handleTestEvent);
            socket.unsubscribe(event, callback);

        };
    }, [callback, event, socket]);
};

export default useEventSocket;