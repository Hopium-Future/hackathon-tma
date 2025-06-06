import VectorIcon from "@/components/icons/VectorIcon";
import { cn, formatNumber } from "@/helper";
import { GAME_RESULT, SIDE } from "@/helper/constant";
import dayjs from "dayjs";
import { useMemo } from "react";

type Props = {
    guess: string;
    result: boolean;
    createdAt: string;
    volumeWinning: number;
    amount: number;
};

export default function CardPvp({ guess, result, createdAt, volumeWinning, amount }: Props) {
    const side = useMemo(() => guess.toUpperCase(), [guess]);
    const pnl = useMemo(() => {
        if (result) return volumeWinning - amount;
        return amount;
    }, [volumeWinning, amount, result]);
    return (
        <div className="py-4 border-b border-solid border-divider">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                    <span className="text-sub text-md">Your Guess</span>
                    <span className=" uppercase flex items-center gap-x-1 font-bold">
                        {guess}
                        <VectorIcon className={cn("size-3", {
                            "text-red-1": side === SIDE.DUMP,
                            "text-green-1 rotate-180": side === SIDE.PUMP
                        })} />
                    </span>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-sub text-md">Result</span>
                    <span className="font-bold">
                        {result ? GAME_RESULT.BLESSED : GAME_RESULT.REJECTED}
                    </span>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-sub text-md">Pnl (HOPIUM)</span>
                    <div className="flex items-center gap-x-1">
                        <span className="font-bold">{result ? "+" : "-"}{formatNumber(pnl || 0)}</span>
                        <img className="size-3" src="/images/home/hopium.png" />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">

            </div>
            <p className="text-sub text-md text-start mt-3">
                {dayjs(createdAt).format('MMM D, YYYY [at] hh:mm:ss A')}
            </p>
        </div>
    );
}