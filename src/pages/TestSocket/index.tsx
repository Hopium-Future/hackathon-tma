import useUserSocket from "@/hooks/useUserSocket"
// import BaseInput from "../Withdraw/components/BaseInput";
import { useEffect, useState } from "react";

const TestSocket = () => {
    const socket = useUserSocket();
    const [list, setList] = useState<any[]>([])

    useEffect(() => {
        if (!socket) return;
        const handleTestEvent = (data: any) => {
            console.log(data);
            setList((prev) => {
                return [data, ...prev].slice(0, 100);
            })
        }


        // Emit subscribe tới channel cần lắng nghe (vd: spot:trade:btcusdt)
        socket.emitEvent('subscribe', 'test-channel');

        // Tương đương với on('test-event-user', handleTestEvent);
        socket.subscribe('test-event-user', handleTestEvent);
        return () => {
            // Unsubscribe tới channel để ngừng lắng nghe (giảm tải cho server/client)
            socket.emitEvent('unsubscribe', 'test-channel');

            // Tương đương với off('test-event-user', handleTestEvent);
            socket.unsubscribe('test-event-user', handleTestEvent);

        }
    }, [socket]);

    // const 
    return (
        <div>
            <h1 className="font-semibold text-lg mb-2">Test Socket</h1>


            <pre>
                {list.map((item) => JSON.stringify(item, null, 2)).join('\n')}
            </pre>
        </div>
    )
}

export default TestSocket