import { getPrizesLotteryInfoApi } from "@/apis/lottery.api";
import DogsIcon from "@/components/icons/DogsIcon";
import ErrorIcon from "@/components/icons/ErrorIcon";
import { RankingNumberOneIcon, RankingNumberThreeIcon, RankingNumberTwoIcon } from "@/components/icons/RankingNumberIcon";
import TicketIcon from "@/components/icons/TicketIcon";
import TonIcon from "@/components/icons/TonIcon";
import { LoadingScreen } from "@/components/Loading/LoadingScreen";
import { PRIZE_ICON } from "@/helper/constant";
import { useAsyncFunc } from "@/hooks/useAsyncFunc";
import { PrizeLotteryResponse } from "@/type/lottery.type";
import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PrizesDetail = () => {
    const { loading, state, fetch } = useAsyncFunc(getPrizesLotteryInfoApi);

    const renderIcon = (key: string) => {
        switch (key) {
            case PRIZE_ICON.HOPIUM_ICON:
                return <LazyLoadImage className="size-5" src="/images/home/hopium.png" />;
            case PRIZE_ICON.TON_ICON:
                return <TonIcon className="size-5" />;
            case PRIZE_ICON.DOGS_ICON:
                return <DogsIcon className="size-5" />;
            case PRIZE_ICON.LOTTERY_TICKET:
                return <TicketIcon className="size-5" />;
            case PRIZE_ICON.CATI_ICON:
                return <LazyLoadImage className="size-5" src="/images/lucky/cati.png" />;

            default:
                break;
        }
    };

    const renderColumOne = (key: number) => {
        switch (key) {
            case 1:
                return <RankingNumberOneIcon />;
            case 2:
                return <RankingNumberTwoIcon />;
            case 3:
                return <RankingNumberThreeIcon />;
            default:
                return `#${key}`;
        }
    };

    const renderTitle = (item: PrizeLotteryResponse) => {
        switch (item.icon) {
            case PRIZE_ICON.HOPIUM_ICON:
                return "HOPIUM";
            case PRIZE_ICON.TON_ICON:
                return "TON";
            case PRIZE_ICON.DOGS_ICON:
                return "DOGS";
            case PRIZE_ICON.LOTTERY_TICKET:
                return item.quantity > 1 ? "Tickets" : "Ticket";
            case PRIZE_ICON.CATI_ICON:
                return "CATI";

            default:
                break;
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    if (loading) return <div className="h-[585px]"><LoadingScreen /></div>;

    return (
        <section className="flex flex-col items-center">
            <ErrorIcon className="size-20" />
            <p className="mt-3 text-2xl">Prizes Details</p>
            <p className="mt-3 text-base">You can receive one of the following prizes after each draw.</p>
            <div className="mt-8 w-full">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-sub">Rank</p>
                    <p className="text-sm text-sub">Prizes</p>
                </div>
                <div className="max-h-[276px] overflow-y-scroll">
                    {
                        state?.data.map((item, index) => {

                            return <div className="flex items-center justify-between w-full mt-3">
                                {
                                    renderColumOne(index + 1)
                                }

                                <div className="flex items-center gap-x-2">
                                    <p className="text-base font-bold text-main">{item.quantity}</p>
                                    <p className="text-base font-bold text-main">{renderTitle(item)}</p>
                                    <p>{renderIcon(item.icon)}</p>
                                </div>
                            </div>;
                        })
                    }
                </div>
            </div>
        </section>
    );
};

export default PrizesDetail;