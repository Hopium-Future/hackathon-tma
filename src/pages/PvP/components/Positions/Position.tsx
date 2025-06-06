import { acceptPositionApi, getResultByRoomId } from '@/apis/pvp.api';
import ButtonSecondary from '@/components/common/button/ButtonSecondary';
import SideIcon from '@/components/icons/SideIcon';
import { cn } from '@/helper';
import { SIDE } from '@/helper/constant';
import usePvPStore from '@/stores/pvp.store';
import useUserStore from '@/stores/user.store';
import React, { lazy, memo, useEffect, useMemo, useState } from 'react';
import Countdown, { CountdownRenderProps, zeroPad } from 'react-countdown';
import { Insufficient, Rejected } from "./ErrorModal";

type PositionProps = {
    title: string;
    side: string;
    hopium: number;
    name: string;
    id: string;
    pvpKey: string;
    timestamp: number;
};

const TIMEOUT_ACCEPT = 1000 * 6; // 5 seconds + 1 second to wait animation
const TIMEOUT_ORDER = 1000 * 5 * 60; // 5 minutes 

const Drawer = lazy(() => import("@/components/Drawer"));

enum ERROR_TYPE {
    INSUFFICIENT = "InsufficientBalanceError",
    NOT_FOUND = "PvPNotFoundError"
}

const renderer =
    ({ minutes, seconds, completed }: CountdownRenderProps) => {
        if (!completed) {

            // Render a completed state
            return <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
        }
        return;
    };

const Position: React.FC<PositionProps> = ({ title, side, hopium, name, pvpKey, timestamp, id }) => {
    const { results } = usePvPStore();
    const { user } = useUserStore();
    const [animation, setAnimation] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [isWinner, setIsWinner] = useState(false);
    const [error, setError] = useState(false);
    const [typeError, setTypeError] = useState("");
    const handleToggleError = () => {
        setError(pre => !pre);
    };

    useEffect(() => {
        if (results.length > 0) {
            const result = results.find(item => item.pvpId === id);
            setIsWinner(user?._id === result?.winnerId);
        }

    }, [results]);

    const handleOnClickAccept = async () => {
        try {
            const res = await acceptPositionApi(pvpKey);
            if (res.data) {

                setRoomId(res.data.id);
            }

            setClicked(true);
        } catch (error: any) {
            const errorType = error?.response?.data?.error;
            setTypeError(errorType);
            handleToggleError();
            console.error(`Accept error: ${error.message}`);

            // Remove on show error modal
            if (errorType === ERROR_TYPE.NOT_FOUND) {
                setTimeout(() => {
                    setAnimation(true);
                }, 2000);
            }
        }
    };

    const handleOnCompleted = async () => {
        setCompleted(true);
        if (isWinner === null) {
            try {
                const res = await getResultByRoomId(roomId);
                if (res.data) {
                    setIsWinner(user?._id === res.data.winnerId);
                }
            } catch (error) {
                const err = error as Error;
                console.error(`Get result error: ${err.message}`);
            }
        }
        setTimeout(() => {
            setAnimation(true);
        }, 2000);
    };

    const count = useMemo(() => {
        if (clicked) return Date.now() + TIMEOUT_ACCEPT;
        return 0;
    }, [clicked]);

    const handleOnEnd = () => {
        setAnimation(true);
    };

    return (
        <div
            className={cn(
                "relative w-full",
                "transition-all duration-1000 ease-in-out",
                "position-item",
                !animation && "show mt-3",
            )}>
            <section className={
                cn(
                    "p-3 flex flex-col gap-2 w-full",
                    "border border-solid border-divider shadow-task",
                    "transition-all duration-700 ease-in-out",
                    "item",
                    !animation && "show"
                )
            }>
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <div className="text-base text-main flex items-center gap-x-1">
                            <p>Name:</p>
                            <p className="max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis">{name}</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <p className="text-main text-base font-bold">{title}</p>
                            <SideIcon className={cn(
                                "w-[10px] h-[11px]",
                                side === SIDE.PUMP ? "text-green-1 rotate-180" : "text-red-1"
                            )} />
                        </div>
                        <p className="text-md text-sub">{hopium} Hopium (Tax 5%)</p>
                    </div>

                    <div className={cn(
                        "transition-all ease-linear duration-300",
                        "!text-determination-3xl font-determination uppercase",
                        completed ? "block" : "hidden",
                        isWinner ? "text-green-1" : "text-red-1"
                    )}>
                        {isWinner ? "win" : "lose"}
                    </div>

                    <ButtonSecondary point={true} className={
                        cn("min-w-[96px] h-[28px] text-sm py-1 transition-all ease-linear duration-300", completed && "hidden")
                    } onClick={handleOnClickAccept}>
                        {
                            !clicked ? <p className="text-main text-sm">Accept</p> :
                                <Countdown
                                    date={count}
                                    intervalDelay={0}
                                    precision={3}
                                    renderer={renderer}
                                    onComplete={handleOnCompleted}
                                />
                        }
                    </ButtonSecondary>

                    <Countdown
                        className="hidden"
                        date={new Date(timestamp + TIMEOUT_ORDER)}
                        intervalDelay={0}
                        precision={3}
                        onComplete={handleOnEnd}
                    />
                </div>
            </section>

            <Drawer isOpen={error} onClose={handleToggleError}>
                {error && (typeError === ERROR_TYPE.NOT_FOUND ? <Rejected /> : <Insufficient />)}
            </Drawer>
        </div>
    );
};

export default memo(Position);