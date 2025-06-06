import Button from '@/components/common/Button';
import CloseIcon from '@/components/icons/CloseIcon';
import DogsIcon from '@/components/icons/DogsIcon';
import TicketIcon from '@/components/icons/TicketIcon';
import TonIcon from '@/components/icons/TonIcon';
import { cn } from '@/helper';
import { ASSET, PRIZE_TYPE } from '@/helper/constant';
import useUserStore from '@/stores/user.store';
import { LotteryResponse } from '@/type/lottery.type';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

type ResultScreenProps = {
    isOpen: boolean;
    handleCloseModal: () => void;
    drawLottery: () => void;
    result?: LotteryResponse;
};

const ResultScreen: FC<ResultScreenProps> = ({ isOpen, handleCloseModal, drawLottery, result }) => {
    const { wallet } = useUserStore();
    const navigate = useNavigate();
    const tickets = useMemo(() => {
        return wallet[ASSET.TICKET].balance;
    }, [wallet]);

    const isDisable = useMemo(() => {
        return wallet[ASSET.TICKET].balance === 0;
    }, [wallet]);

    const [out, setOut] = useState<boolean>(false);
    useEffect(() => {

        return () => setOut(false);
    }, []);

    const handleReDraw = () => {
        if (!isDisable) {
            onClose();
            drawLottery();
        } else navigate("/task?tab=LUCKY", {
            replace: true
        });
    };

    const onClose = () => {
        setOut(true);
        handleCloseModal();
    };

    const renderTitle = (key: string | undefined) => {
        switch (key) {
            case PRIZE_TYPE.HOPIUM:
                return "HOPIUM";
            case PRIZE_TYPE.TON:
                return "TON";
            case PRIZE_TYPE.DOGS:
                return "DOGS";
            case PRIZE_TYPE.TICKET:
                return "Tickets";
            case PRIZE_TYPE.CATI:
                return "CATI";

            default:
                break;
        }
    };

    const renderIcon = (key: string | undefined) => {
        switch (key) {
            case PRIZE_TYPE.HOPIUM:
                return <LazyLoadImage
                    className="w-full h-[100px] object-contain"
                    alt="avatar"
                    height={100}
                    src={
                        "/images/home/hopium.png"
                    }
                    width={100}

                />;
            case PRIZE_TYPE.TON:
                return <TonIcon className="size-[100px]" />;
            case PRIZE_TYPE.DOGS:
                return <DogsIcon className="size-[100px]" />;
            case PRIZE_TYPE.TICKET:
                return <TicketIcon className="size-[100px]" />;
            case PRIZE_TYPE.CATI:
                return <LazyLoadImage
                    src="/images/lucky/cati.png"
                    className="w-full h-[100px] object-contain"
                    alt="avatar"
                    height={100}
                    width={100}
                />;

            default:
                break;
        }
    };

    return (
        <div id="result-modal-container" className={cn(isOpen && "two", out && "out")}>
            <div className="modal-background relative flex flex-col justify-between items-center p-4">
                <LazyLoadImage
                    className="object-contain absolute top-[53px] position-center-x"
                    alt="avatar"
                    height={475}
                    src={
                        "/images/lucky/carots.png"
                    }
                    width={263}

                />
                <section className="flex flex-col items-center justify-start h-full content w-full">
                    <button className="flex items-center justify-end w-full" onClick={onClose}>
                        <CloseIcon />
                    </button>
                    <p className="text-4xl title text-green-1 mt-10 font-determination">Congratulations!</p>
                    <div className="lucky-bg-sun bg-contain bg-center bg-no-repeat logo relative flex flex-col items-center justify-center size-[234px]">
                        {renderIcon(result?.prize)}
                        <p className="text-2xl font-bold absolute position-center-x bottom-[22px] whitespace-nowrap">+{result?.quantity} {renderTitle(result?.prize)}</p>
                    </div>
                </section>

                <div className="result w-full flex flex-col items-center justify-center">
                    <Button variant={"primary"} className="mt-6" onClick={handleReDraw}>
                        <span className="text-base  text-pure-white">
                            {isDisable ? "Get more tickets" : "Draw again"}
                        </span>
                    </Button>
                    <div className="flex items-center gap-x-2 mt-3 text-base text-sub">
                        <p>Remaining attempts: {tickets}</p>
                        <TicketIcon className="h-[13px] w-[24px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ResultScreen);