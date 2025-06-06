import Drawer from "@/components/Drawer";
import HistoryIcon from "@/components/icons/HistoryIcon";
import { cn, formatNumber } from "@/helper";
import { SIDE } from "@/helper/constant";
import useEventSocket from "@/hooks/useEventSocket";
import useHomeStore from "@/stores/home.store";
import useUserStore, { useUserWallet } from "@/stores/user.store";
import { GameResult } from "@/type/game.type";
import { lazy, useCallback, useEffect, useRef, useState } from "react";
import PixelButtonDump from "./components/PixelButtonDump";
import PixelButtonPump from "./components/PixelButtonPump";
import SoundIcon from "@/components/icons/SoundIcon";
import SpeedOdo from "@/components/SpeedOdo";
import useTma from "@/hooks/useTma";
import '@/styles/home.css';
import { Howl } from "howler";

const audioUrl = "/sounds/bg_sound.mp3";
const slienceUrl = "/sounds/silence.mp3";

const History = lazy(() => import("@/components/History"));

const Home = () => {
    const { turn, setResult, price } = useUserStore();
    const { activeCooldown, cooldown, setActiveCooldown, volume, setVolume } = useHomeStore();
    const wallet = useUserWallet();

    const [openHistory, setOpenHistory] = useState<boolean>(false);
    const [sideActive, setSideActive] = useState<string>("");
    // const audioRef = useRef<HTMLAudioElement>(new Audio(audioUrl));
    const audioRef = useRef<Howl>();
    const isTma = useTma();

    // other options to handle sound
    // const [play, { sound, pause, }] = useSound(
    //     '/sounds/bg_sound.mp3',
    //     {
    //         loop: true,
    //         preload: true,
    //         soundEnabled: true,
    //     }
    // );

    // backup for mounted
    useEffect(() => {
        audioRef.current = new Howl({
            src: audioUrl,
            preload: true,
            autoplay: true,
            loop: true,
            html5: true,
            mute: !volume
        });

        console.log("initial audio::", audioRef.current);

        if (audioRef.current)

            if (isTma) {
                console.log(1);
                audioRef.current.play();
            } else {
                console.log(2);
                audioRef.current.pause();
            }

        return () => {
            audioRef.current?.pause();
        };
    }, [isTma]);

    useEffect(() => {
        console.log("volume::", volume);
        console.log("tma::", isTma);
        // play audio
        if (audioRef.current) {
            audioRef.current.mute(!volume);
        }

    }, [volume]);

    const handleOnSound = () => {
        setTimeout(function () { audioRef.current?.pause(); }, 5500);
        setTimeout(function () { audioRef.current?.play(); }, 9000);
    };

    const toggleSound = () => {
        setVolume(!volume);
    };

    const handleOnClose = () => {
        setOpenHistory(false);
    };

    const toggleIsCount = (side: string) => {
        setSideActive(side);
        setActiveCooldown(true);
    };

    const handleClickHistory = () => {
        setOpenHistory(true);
    };

    // Setup sub turn closed have result
    const cbTurnClosed = useCallback((data: GameResult) => {
        console.log("TURN IS CLOSED");

        if (turn?._id === data._id) {
            setResult(data);
        }
    }, [turn?._id]);

    useEventSocket("turn.closed", cbTurnClosed);

    return (
        <>
            <iframe src={slienceUrl} allow="autoplay" id="audio" className="hidden"></iframe>
            <div className="bg-background-1 relative flex flex-col justify-start h-full duration-300 ease-in-out">
                <section
                    className={
                        cn(
                            "relative w-full min-w-full duration-200 ease-in-out bg-cover",
                            activeCooldown && sideActive === SIDE.PUMP ? "home-bg-1__dark--pump" : "home-bg-1",
                            activeCooldown && sideActive === SIDE.DUMP ? "home-bg-1__dark--dump" : "home-bg-1"
                        )
                    }
                >
                    {/* BTC price Section */}
                    <section
                        className="mx-auto bg-btc-price tall:mt-9 mt-[22px] bg-contain bg-center bg-no-repeat"
                    >
                        <p className="text-determination-base font-determination text-center pt-2 tall:pt-3">BTC PRICE</p>
                        <p className="tall:pt-3 pt-2 text-[32px] leading-[38.4px] font-determination text-center">
                            $ {formatNumber(price, 2)}
                        </p>
                    </section>
                </section>

                <section
                    className={
                        cn(
                            "w-full pb-24 tall:pt-5 pt-3 duration-300 ease-in-out flex-auto bg-cover",
                            activeCooldown ? "home-bg-2__dark" : "home-bg-2"
                        )
                    }
                >
                    {/* Balance Section */}
                    <section className="w-full flex items-center justify-center">
                        <section
                            className="home-bg-balance flex w-full flex-col items-center justify-center"
                        >
                            {
                                !activeCooldown ? <>
                                    <p className="text-determination-xs font-determination text-clip text-center">Remaining HOPIUM</p>
                                    <div className="h-[21.6px] flex items-center">
                                        <SpeedOdo value={formatNumber(wallet.available, 3)} key={cooldown} />
                                    </div>

                                </> :
                                    <p className="text-determination-2xl font-determination text-center">00:0{cooldown}</p>
                            }
                        </section>
                    </section>

                    <section className="mt-6 flex gap-3 justify-center">
                        <section
                            className="bg-contain bg-bottom bg-no-repeat w-[116px] h-[54px] relative flex items-end cursor-pointer"
                            style={{
                                backgroundImage: !(activeCooldown && sideActive !== SIDE.PUMP) ? "url(/images/home/bg_button_base.png)" : "url(/images/home/bg_button_base_dark.png)"
                            }}
                        >
                            <section className="absolute button-3d__center cursor-pointer">
                                <PixelButtonPump handleCoundDown={toggleIsCount} disable={activeCooldown} sideActive={sideActive} playSound={handleOnSound} />
                            </section>
                        </section>
                        <section
                            className="bg-contain bg-bottom bg-no-repeat w-[116px] h-[54px] relative flex items-end cursor-pointer"
                            style={{
                                backgroundImage: !(activeCooldown && sideActive !== SIDE.DUMP) ? "url(/images/home/bg_button_base.png)" : "url(/images/home/bg_button_base_dark.png)"
                            }}
                        >
                            <section className="absolute button-3d__center">
                                <PixelButtonDump handleCoundDown={toggleIsCount} disable={activeCooldown} sideActive={sideActive} playSound={handleOnSound} />
                            </section>
                        </section>
                    </section>
                </section>
                <section className="absolute top-[12px] right-[12px] flex gap-[6px]">
                    <div className="w-9 h-9 flex items-center justify-center bg-action-button">
                        <button onClick={toggleSound}>
                            {
                                !volume ? <SoundIcon.SoundIconOff scale={2} /> : <SoundIcon.SoundIconOn scale={2} />
                            }
                        </button>
                    </div>
                    <div className="w-9 h-9 flex items-center justify-center bg-action-button">
                        <button onClick={handleClickHistory}><HistoryIcon scale={2} /></button>
                    </div >
                </section>
                <Drawer isOpen={openHistory} onClose={handleOnClose} className="text-center">
                    {openHistory && <History />}
                </Drawer>
            </div>
        </>
    );
};

export default Home;