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

type DailyItemSevenProps = {
    seven: {
        _id: number,
        title: string,
        value: number,
        active: boolean,
        status: string;
    };
    toggleModal: () => void;
    handleReload: () => void;
};

const DailyItemSeven: FC<DailyItemSevenProps> = ({ seven, toggleModal, handleReload }) => {
    const [loading, setLoading] = useState(false);
    const { setTaskClaimed } = useUserStore();
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

    const navigate = useNavigate();
    const routeToTrade = () => {
        navigate("/futures/BTCUSDT");
    };

    const IconDone = useMemo(() => {
        if (seven.status === STATUS_TASK.COMPLETED) {
            return (
                <CheckIcon className="size-5 text-green-1" />
            );
        }
        if (seven.status === STATUS_TASK.CLAIMABLE) {
            return <Button
                onClick={() => handleClaim(seven._id)}
                disabled={loading}
                className=" bg-green-1 h-6 py-[6px] w-20 text-sm text-pure-black font-bold">
                {loading ? <LoadingIcon /> : 'Claim'}
            </Button>;
        }
        if (seven.status === STATUS_TASK.AVAILABLE) {
            return <Button
                onClick={routeToTrade}
                className=" bg-green-2 h-6 py-[6px] w-20 text-sm text-green-1 font-bold border-[0.5px] border-green-1">
                Trade
            </Button>;
        }

        return <LockIcon className="size-5 text-pure-white" />;
    }, [seven]);

    return (
        <div className="relative w-full">
            <>
                {/* top */}
                <div className="absolute top-0 left-0 bg-pure-black size-[2px] z-10"></div>
                <div className="absolute top-0 right-0 bg-pure-black size-[2px] z-10"></div>

                {/* bottom */}
                <div className={
                    cn(
                        "absolute bottom-0 left-0 size-[3px] z-10 after:contents-[''] after:absolute after:bottom-0 after:left-0 after:size-[2px] after:bg-pure-black",
                        seven.active ? "bg-green-1" : "bg-divider"
                    )
                }></div>
                <div className={
                    cn(
                        "absolute bottom-0 right-0 size-[3px] z-10 after:contents-[''] after:absolute after:bottom-0 after:right-0 after:size-[2px] after:bg-pure-black",
                        seven.active ? "bg-green-1" : "bg-divider"
                    )
                }></div>
            </>

            {/* Content */}
            <div
                className={
                    cn(
                        "text-sm",
                        seven.active ? "bg-green-1 text-pure-black font-bold border-green-1" : "text-pure-white bg-background-3 border-divider"
                    )
                }
            >
                <div className="text-center py-1">
                    <p>{seven.title}</p>
                </div>
            </div>

            <div className={
                cn(
                    "p-2 border flex items-center justify-between px-[30px] max-h-[118px] w-full",
                    "bg--seven__hopium",
                    seven.active ? "border-green-1 border-t-transparent" : "border-divider border-t-transparent"
                )
            }>
                <LazyLoadImage
                    src={`images/daily/${seven._id}.png`}
                    alt="daily"
                    className="w-[137px] h-[108px]"
                />
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 py-0.5 px-[14px] justify-center w-[116px] h-[40px] bg-prize--seven__hopium">
                        <p className={cn("text-lg font-bold text-pure-white")}>{seven.value}</p>
                        <AssetLogo className="size-[14px] text-pure-white" assetId={33} />
                    </div>
                    <div className={
                        cn(
                            "text-center mt-3",
                        )
                    }>
                        {IconDone}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyItemSeven;