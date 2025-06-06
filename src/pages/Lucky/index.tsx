import Button from "@/components/common/Button";
import ButtonSecondary from "@/components/common/button/ButtonSecondary";
import Drawer from "@/components/Drawer";
import { LoadingScreen } from "@/components/Loading/LoadingScreen";
import { formatNumber } from "@/helper";
import { ASSET } from "@/helper/constant";
import useUserStore from "@/stores/user.store";
import "@/styles/lucky.css";
import { LotteryResponse } from "@/type/lottery.type";
import { lazy, useMemo, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

const ErrorIcon = lazy(() => import("@/components/icons/ErrorIcon"));
const TicketIcon = lazy(() => import("@/components/icons/TicketIcon"));
const WithdrawIcon = lazy(() => import("@/components/icons/WithdrawIcon"));

const PrizesDetail = lazy(() => import("./components/PrizesDetail"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const ResultScreen = lazy(() => import("./components/ResultScreen"));

const Lucky = () => {
    const navigate = useNavigate();
    const { wallet, loading } = useUserStore();
    const [lottery, setLottery] = useState<LotteryResponse | undefined>(undefined);

    const handleLotteryData = (data: LotteryResponse) => {
        setLottery(data);
    };

    const [detail, setDetail] = useState(false);
    const handleToggleDetail = () => {
        setDetail(!detail);
    };

    const [splash, setSplash] = useState(false);
    const handleOpenSplash = () => {
        if (!isDisable) setSplash(true);
        else navigate("/task?tab=LUCKY", {
            replace: true
        });
    };
    const handleCloseSplash = () => {
        setSplash(false);
    };

    const [result, setResult] = useState(false);
    const handleOpenResult = () => {
        setResult(true);
    };
    const handleCloseResult = () => {
        setResult(false);
    };

    const isDisable = useMemo(() => {
        if (wallet) return wallet?.[ASSET.TICKET].balance < 1;
        return true;
    }, [wallet]);

    if (loading) return <div className="h-[585px]"><LoadingScreen /></div>;

    return (
        <section className="mt-6 flex flex-col items-center px-4 min-h-[720px]">
            <p className="text-base">Your ticket</p>
            <div className="flex items-center gap-x-1">
                <p className="text-4xl font-determination">{wallet?.[ASSET.TICKET].balance || 0}</p>
                <TicketIcon className="h-[30px] w-[52px]" />
            </div>
            <div className="flex items-center gap-x-[6px] mt-4">
                <ButtonSecondary point={true} className="w-[114px] h-[38px]">
                    <div className="w-full text-md flex items-center gap-x-1 line-clamp-1 px-2">
                        <p className="text-sub">TON:</p>
                        <p className="text-main">{formatNumber(wallet?.[ASSET.TON].balance || 0, 3)}</p>
                    </div>
                </ButtonSecondary>
                <ButtonSecondary point={true} className="w-[114px] h-[38px]">
                    <div className="w-full text-md flex items-center gap-x-1 line-clamp-1 px-2">
                        <span className="text-sub">CATI:</span>
                        {formatNumber(wallet?.[ASSET.CATI].balance || 0, 2)}
                    </div>
                </ButtonSecondary>
                <ButtonSecondary point={true} className="w-[114px] h-[38px]">
                    <div className="w-full text-md flex items-center gap-x-1 line-clamp-1 px-2">
                        <p className="text-sub">DOGS:</p>
                        <p className="text-main">{formatNumber(wallet?.[ASSET.DOGS].balance || 0)}</p>
                    </div>
                </ButtonSecondary>
            </div>
            {/* TODO: unused on demand */}
            
            <LazyLoadImage
                className="mt-8 object-contain"
                alt="ticket"
                height={294}
                // effect="blur"
                src="/images/lucky/bg.png"
                width={323}
            />

            <Button variant={"primary"} className="mt-6" onClick={handleOpenSplash}>
                <span className="text-base  text-pure-white">
                    {isDisable ? "Get more tickets" : "Draw"}
                </span>
            </Button>

            <div className="relative h-[44px] w-full mt-3">
                <div className="absolute size-full bg-background-1 opacity-60 z-10"></div>
                <Button variant="disable" className="w-full">
                    <div className="text-sm flex items-center gap-x-2 text-nowrap">
                        <WithdrawIcon size={"sm"} className="text-main" />
                        <p className="text-main">Withdraw (coming soon)</p>
                    </div>
                </Button>
            </div>

            <button className="flex items-center gap-x-2 mt-3" onClick={handleToggleDetail}>
                <ErrorIcon className="size-4 text-primary-1" />
                <p className="text-base text-main">Prizes Details</p>
            </button>

            <Drawer isOpen={detail} onClose={handleToggleDetail} className="text-center">
                {detail && <PrizesDetail />}
            </Drawer>

            <SplashScreen
                key={`${+splash}_splash` as React.Key}
                isOpen={splash}
                handleLotteryData={handleLotteryData}
                handleClose={handleCloseSplash}
                handleOpenResult={handleOpenResult}
            />

            <ResultScreen
                key={`${+result}_result` as React.Key}
                isOpen={result}
                handleCloseModal={handleCloseResult}
                drawLottery={handleOpenSplash}
                result={lottery}
            />
        </section>
    );
};

export default Lucky;