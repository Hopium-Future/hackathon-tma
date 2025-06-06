import VectorIcon from "@/components/icons/VectorIcon";
import { cn } from "@/helper";
import { GAME_RESULT, SIDE } from "@/helper/constant";
import dayjs from "dayjs";

type Props = {
    guess: string;
    result: string;
    pnl: number;
    streak: number;
    closeTime: number;
};

export default function CardHistory({ guess, result, pnl, streak, closeTime }: Props) {

    const calculateStreak = (streak: number) => {
        switch (streak) {
            case 1:
            case 2:
                return streak;
            default:
                return streak * 2;
        }
    };

    return (
        <div className="py-4 border-b border-solid border-divider">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                    <span className="text-sub text-md">Your Guess</span>
                    <span className=" uppercase flex items-center gap-x-1 font-bold">
                        {guess}
                        <VectorIcon className={cn("size-3", {
                            "text-red-1": guess === SIDE.DUMP,
                            "text-green-1 rotate-180": guess === SIDE.PUMP
                        })} />
                    </span>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-sub text-md">Result</span>
                    <span className="font-bold">
                        {result === GAME_RESULT.WIN ? GAME_RESULT.BLESSED : GAME_RESULT.REJECTED}
                    </span>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-sub text-md">Pnl (HOPIUM)</span>
                    <div className="flex items-center gap-x-1">
                        <span className="font-bold">{pnl > 0 && "+"}{pnl}</span>
                        <img className="size-3" src="/images/home/hopium.png" />
                    </div>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-sub text-md">Streak</span>
                    <span className="font-bold">
                        {streak > 0 ? `x${calculateStreak(streak)}` : streak}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between">

            </div>
            <p className="text-sub text-md text-start mt-3">
                {dayjs(closeTime).format('MMM D, YYYY [at] hh:mm:ss A')}
            </p>
        </div>
    );
}