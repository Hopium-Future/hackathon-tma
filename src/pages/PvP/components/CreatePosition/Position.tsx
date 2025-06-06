import ClockIcon from '@/components/icons/ClockIcon';
import SideIcon from '@/components/icons/SideIcon';
import { cn } from '@/helper';
import { SIDE } from '@/helper/constant';
import usePvPStore from '@/stores/pvp.store';
import React, { memo, useEffect, useState } from 'react';
import Countdown, { CountdownRenderProps, zeroPad } from 'react-countdown';

type PositionProps = {
    title: string;
    onclick: () => void;
    blur?: boolean;
    side: string;
    hopium: number;
    timestamp: number;
    getPositions: () => void;
    pvpKey: string;
};

const timeout = 1000 * 24 * 60 * 60; // 1 day

const renderer =
    ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
        if (!completed) {
            // Render a completed state
            return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
        }
        return null;
    };

const Position: React.FC<PositionProps> = ({ onclick, title, side, hopium, timestamp, getPositions, pvpKey }) => {
    const { accecpted } = usePvPStore();
    const handleOnClick = () => {
        onclick?.();
    };

    const [animation, setAnimation] = useState(false);
    const [completed, setCompleted] = useState(false);
    const handleOnCompleted = () => {
        setCompleted(true);
        setTimeout(() => {
            setAnimation(true);
            getPositions();
        }, 2000);
    };

    useEffect(() => {
        if (accecpted) {
            if (accecpted.pvpKey === pvpKey) {
                setTimeout(() => {
                    setAnimation(true);
                    getPositions();
                }, 2000);
            }
        }
    }, [accecpted]);
    return (
        <div
            className={
                cn(
                    "relative w-full",
                    "transition-all duration-1000 ease-in-out",
                    "create-position--item",
                    !animation && "show mt-3",
                )
            }
        >
            <section className={
                cn(
                    "p-3 border border-solid border-divider shadow-task flex flex-col gap-2",
                    "transition-all duration-700 ease-in-out",
                    "item",
                    !animation && "show"
                )
            } onClick={handleOnClick}>

                <div className={
                    cn(
                        "flex items-center justify-between gap-2",

                    )
                }>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <p className="text-main text-base font-bold">{title}</p>
                            <SideIcon className={cn(
                                "w-[10px] h-[11px]",
                                side === SIDE.PUMP ? "text-green-1 rotate-180" : "text-red-1"
                            )} />
                        </div>
                        <p className="text-md text-sub">{hopium} Hopium</p>
                    </div>
                    {
                        completed ?
                            <p className="text-red-1 text-sm">
                                Waiting time has ended
                            </p> :
                            <>
                                <div className="flex items-center gap-x-1">
                                    <ClockIcon className="size-4" />
                                    <Countdown
                                        date={new Date(timestamp + timeout)}
                                        intervalDelay={0}
                                        precision={3}
                                        renderer={renderer}
                                        onComplete={handleOnCompleted}
                                    />
                                </div>
                            </>
                    }
                </div>
            </section>
        </div>
    );
};

export default memo(Position);