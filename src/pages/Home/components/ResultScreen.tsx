import { cn, formatNumber } from '@/helper';
import useHomeStore from '@/stores/home.store';
import useUserStore from '@/stores/user.store';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import useSound from 'use-sound';

type ResultScreenProps = {
    isOpen: boolean;
};

const ResultScreen: FC<ResultScreenProps> = ({ isOpen }) => {
    const [out, setOut] = useState<boolean>(false);
    const { result } = useUserStore();
    const { volume } = useHomeStore();

    const [playWin, { stop: stopWin, sound: soundWin }] = useSound(
        '/sounds/win.mp3',
        {
            volume: 0.25,
            loop: false,
            preload: true
        }
    );
    const [playLoss, { stop: stopLoss, sound: soundLoss }] = useSound(
        '/sounds/loss.mp3',
        {
            volume: 0.25,
            loop: false,
            preload: true
        }
    );

    useEffect(() => {
        if (isOpen) {

            result?.result === "WIN" ? playWin() : playLoss();

            setTimeout(() => {
                setOut(true);

                stopWin();
                stopLoss();
            }, 3000);
        }

        return () => setOut(false);
    }, [isOpen]);

    useEffect(() => {
        if (soundWin && soundLoss) {
            if (volume) {
                soundWin.volume(0.25);
                soundLoss.volume(0.25);
            }
            else {
                soundWin.volume(0);
                soundLoss.volume(0);
            }
        }
    }, [soundLoss, soundWin, volume]);

    const diff = useMemo(() => {
        if (result?.closePrice && result?.openPrice) {
            const diff = (result?.closePrice - result.openPrice) / (result.openPrice);
            return (diff);
        }
        return 0;
    }, [result]);

    return (
        <div id="modal-container" className={cn(isOpen && "two", out && "out")}>
            <div className="modal-background">
                <section className="flex flex-col items-center justify-center h-full content">
                    <div className="relative">
                        <LazyLoadImage
                            className="w-full h-[200px] logo object-contain"
                            alt="avatar"
                            height={200}
                            src={
                                (result?.result === "WIN") ? "/images/home/result_modal/win.gif" : "/images/home/result_modal/loss.gif"
                            }
                            width={200}
                            
                        />
                        <div className="textbox absolute top-0 right-[30px] z-10">
                            <div className={
                                cn(
                                    "w-[88px] h-[76px] textbox-smoke-bg flex justify-center",
                                    !(result?.winStreak && result?.winStreak > 1) && "hidden"
                                )
                            }>
                                <span className="pt-2 text-primary-2 font-determination text-[26px] leading-[31.2px]">X{result?.winStreak}</span>
                            </div>
                        </div>
                    </div>
                    <LazyLoadImage
                        className="w-[320px] h-fit title"
                        alt="result_title"
                        height={74}
                        src={
                            (result?.result === "WIN") ? "/images/home/result_modal/blessed.png" : "/images/home/result_modal/rejected.png"
                        }
                        width={320}
                    />
                    <section className="mt-4 flex gap-2 items-center result">
                        <div className="flex items-center text-2xl gap-1 font-bold text-white">
                            <span>{(result?.profit && result?.profit > 0) ? "+" : ""}{result?.profit}</span>
                            HOPIUM
                        </div>

                        <LazyLoadImage
                            className="w-[32px] h-[32px]"
                            alt="hopium_coin"
                            height={32}
                            src="/images/home/hopium.png"
                            width={32}
                        />
                    </section>

                    <section className="flex flex-col items-center information">
                        <p className="text-base mt-6 font-bold text-white">BTC Price</p>
                        <section className={
                            cn(
                                diff > 0 ? "text-green-1" : "text-red-1",
                                "text-4xl font-bold"
                            )
                        }>
                            <span>{(diff && diff > 0) ? "+" : ""}{formatNumber(diff, 7)}%</span>
                        </section>
                        <section className="text-base text-sub flex items-center gap-2 font-bold">
                            <p>From</p>
                            <span className="text-white">{result?.openPrice}</span>
                            <p>to</p>
                            <span className="text-white">{result?.closePrice}</span>
                        </section>
                    </section>
                </section>
            </div>
        </div>
    );
};

export default memo(ResultScreen);