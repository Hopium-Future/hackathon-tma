import { gamePlayApi } from "@/apis/game.api";
import LineArrow from "@/components/icons/LineArrow";
import { cn } from "@/helper";
import { SIDE } from "@/helper/constant";
import useVibration from "@/hooks/useVibration";
import useUserStore from "@/stores/user.store";
import { GAME_SIDE } from "@/type/game.type";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";

type PixelButtonPumpProps = {
    handleCoundDown: (side: string) => void;
    disable: boolean;
    sideActive: string;
    playSound: () => void;
};

const PixelButtonPump: FC<PixelButtonPumpProps> = ({ handleCoundDown, disable, sideActive, playSound }) => {
    const { setTurn } = useUserStore();
    const [active, setActive] = useState(false);
    const { vibrate } = useVibration();

    const play = async () => {
        playSound();
        handleCoundDown(SIDE.PUMP);
        vibrate()
        
        try {
            setActive(true);
            const result = await gamePlayApi(GAME_SIDE.PUMP);
            setTurn(result.data);
        } catch (error: any) {
            toast.error(
                <div className="flex gap-2 items-center text-red-1">
                    {error.message}
                </div>,
                {
                    autoClose: 2000,
                    className: "p-0 border !border-red-1 !max-w-[calc(100dvw-32px)] mx-auto top-[16px]",
                    icon: false,

                    hideProgressBar: true,
                    closeButton: false,
                }
            );
        }
    };

    useEffect(() => {
        if (!disable) setActive(false);
    }, [disable]);

    return (
        <button
            onClick={play}
            disabled={disable}
            className="h-[50px]"
        >
            <div
                className="pushable bg-contain bg-top bg-no-repeat w-[104px] tall:w-[104.95px] group duration-300 ease-in-out cursor-pointer"
                style={{
                    backgroundImage: !(disable && sideActive !== SIDE.PUMP) ? "url(/images/home/pump_button/3d_back_pump.png)" : "url(/images/home/pump_button/3d_back_pump_dark.png)"
                }}
            >
                <div
                    className={
                        cn(
                            "front bg-contain bg-top bg-no-repeat w-full",
                            "text-primary-2",
                            !disable && "group-active:translate-y-[0px]",
                            active && disable && "!translate-y-[0px]"
                        )
                    }
                    style={{
                        backgroundImage: !(disable && sideActive !== SIDE.PUMP) ? "url(/images/home/pump_button/3d_front_pump.png)" :
                            "url(/images/home/pump_button/3d_front_pump_dark.png)"
                    }}
                >
                    <div className="flex items-center gap-[6px]">

                        <span className="text-determination-2xl font-determination uppercase">pump</span>
                        <LineArrow className="w-4 h-[18px]" />
                    </div>
                </div>
            </div>
        </button>
    );
};

export default PixelButtonPump;