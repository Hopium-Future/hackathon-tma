import { claimTaskApi } from '@/apis/task.api';
import AssetLogo from '@/components/common/AssetLogo';
import Button from '@/components/common/Button';
import CheckIcon from '@/components/icons/CheckIcon';
import LoadingIcon from '@/components/icons/LoadingIcon';
import LockIcon from '@/components/icons/LockIcon';
import NoteMultipleIcon from '@/components/icons/NoteMultipleIcon';
import { cn } from '@/helper';
import { STATUS_TASK } from '@/helper/constant';
import useUserStore from '@/stores/user.store';
import { FC, useMemo, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type DailyItemProps = {
    item: {
        _id: number,
        title: string,
        value: number,
        active: boolean,
        status: string;
        text: boolean;
        buttonText: string;
    };
    toggleModal: () => void;
    handleReload: () => void;
};

const DailyItem: FC<DailyItemProps> = ({ item, toggleModal, handleReload }) => {
    const [loading, setLoading] = useState(false);
    const { setTaskClaimed } = useUserStore();
    const navigate = useNavigate();
    const routeToTrade = () => {
        navigate("/futures/BTCUSDT");
    };
    const handleClaim = async (id: number) => {
        setLoading(true);
        try {
            await claimTaskApi(id).then((res) => {
                if (res) {

                    setTaskClaimed({
                        assetId: res.data.rewardAsset,
                        value: res.data.rewardQuantity
                    });

                    setTimeout(() => {
                        toggleModal();
                    }, 0);

                    setTimeout(() => {
                        handleReload();
                    }, 500);
                }
            });
        } catch (error) {
            const err = error as Error;
            toast.error(
                <div className="text-sub flex gap-2 items-center">
                    <NoteMultipleIcon className='text-primary-1 size-4' /> {err.message}
                </div>,
                {
                    autoClose: 1000000,
                    className: "p-0 shadow-copy !bg-background-3 !max-w-[calc(100dvw-32px)] mx-auto",
                    icon: false,
                    hideProgressBar: true,
                    closeButton: false,
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const IconDone = useMemo(() => {
        if (item.status === STATUS_TASK.COMPLETED) {
            return (
                <CheckIcon className="size-5 text-green-1" />
            );
        }
        if (item.status === STATUS_TASK.CLAIMABLE) {
            return <Button
                onClick={() => handleClaim(item._id)}
                disabled={loading}
                className=" bg-green-1 h-6 py-[6px] w-20 text-sm text-pure-black font-bold">
                {loading ? <LoadingIcon /> : 'Claim'}
            </Button>;
        }
        if (item.status === STATUS_TASK.AVAILABLE) {
            return <Button
                onClick={routeToTrade}
                className=" bg-green-2 h-6 py-[6px] w-20 text-sm text-green-1 font-bold border-[0.5px] border-green-1">
                Trade
            </Button>;
        }

        return <LockIcon className="size-5 text-pure-white" />;
    }, [item]);

    return (
        <>
            <div className="min-w-[110px] relative">
                <>
                    {/* top */}
                    <div className="absolute top-0 left-0 bg-pure-black size-[2px] z-10"></div>
                    <div className="absolute top-0 right-0 bg-pure-black size-[2px] z-10"></div>

                    {/* bottom */}
                    <div className={
                        cn(
                            "absolute bottom-0 left-0 size-[3px] z-10 after:contents-[''] after:absolute after:bottom-0 after:left-0 after:size-[2px] after:bg-pure-black",
                            item.active ? "bg-green-1" : "bg-background-3"
                        )
                    }></div>
                    <div className={
                        cn(
                            "absolute bottom-0 right-0 size-[3px] z-10 after:contents-[''] after:absolute after:bottom-0 after:right-0 after:size-[2px] after:bg-pure-black",
                            item.active ? "bg-green-1" : "bg-background-3"
                        )
                    }></div>
                </>

                <div
                    className={
                        cn(
                            "",
                            item.active ? "bg-green-1 border-green-1" : " border-divider bg-background-3"
                        )
                    }
                >
                    <div
                        className={
                            cn(
                                "text-center py-1 font-bold text-sm",
                                item.text && item.active ? "text-pure-black" :
                                    item.text ? "text-pure-white" : "text-disable"
                            )
                        }
                    >
                        <p>{item.title}</p>
                    </div>
                </div>
                <div className={
                    cn(
                        "p-2 border bg-background-2 flex flex-col items-center",
                        item.active ? "border-green-1 border-t-transparent" : "border-background-3 border-t-transparent"
                    )
                }>
                    <div className="relative">
                        <LazyLoadImage
                            src={`images/daily/${item._id}.png`}
                            alt="daily"
                            className={
                                cn(
                                    "w-[69px] h-[52px] bg-opacity-50",
                                    !item.text && "opacity-50"
                                )
                            }
                        />
                    </div>
                    <div
                        className="flex items-center gap-1 py-0.5 px-[14px] w-[68px] justify-center bg-prize__hopium h-5 mt-1"
                    >
                        <p className={cn("text-md font-bold", item.text ? "text-pure-white" : "text-disable")}>{item.value}</p>
                        <AssetLogo className="size-[14px] text-pure-white" assetId={33} />
                    </div>
                    <div className={
                        cn(
                            "mt-2 text-center",
                        )
                    }>
                        {IconDone}
                    </div>
                </div>
            </div>


        </>
    );
};

export default DailyItem;