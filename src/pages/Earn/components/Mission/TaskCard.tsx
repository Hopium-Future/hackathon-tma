import { claimTaskApi, clickTaskApi } from "@/apis/task.api";
import Button from "@/components/common/Button";
import CheckIcon from "@/components/icons/CheckIcon";
import LockIcon from "@/components/icons/LockIcon";
import NoteMultipleIcon from "@/components/icons/NoteMultipleIcon";
import { cn, formatNumber2 } from "@/helper";
import { MISSION_TYPE, STATUS_TASK, TASK_CONDITION } from "@/helper/constant";
import useModalStore from "@/stores/success.modal.store";
import useUserStore from "@/stores/user.store";
import { Task } from "@/type/task.type";
import WebApp from "@twa-dev/sdk";
import { FC, memo, useCallback, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Progress from "./Progress";

type TaskCardProps = {
    detail: Task;
    onClick?: (detail: Task) => void;
    handleReload?: () => void;
    type?: string;
};

const TaskCard: FC<TaskCardProps> = ({ detail, onClick, handleReload, type }) => {
    const navigate = useNavigate();
    const { setTaskClaimed } = useUserStore();
    const { handleClose } = useModalStore();
    const done = useMemo(() => detail.status === STATUS_TASK.COMPLETED, []);

    const disable = useMemo(() => {
        return detail.status === STATUS_TASK.AVAILABLE && detail.condition === TASK_CONDITION.COMPLETE_CHILD_MISSION;
    }, []);

    const renderStatusIcon = useCallback(() => {
        switch (detail.status) {
            case STATUS_TASK.AVAILABLE:
                return <Button
                    onClick={() => handleClickLink(detail.link, detail._id)}
                    className="border-[0.5px] border-divider bg-background-3 h-6 py-[6px] w-20 text-sm uppercase font-bold max-w-[80px] overflow-hidden text-ellipsis"
                    disabled={disable}
                >
                    {detail.buttonText}
                </Button>;

            case STATUS_TASK.CLAIMABLE:
                return <Button
                    onClick={() => handleClaim(detail._id)}
                    className=" bg-green-1 h-6 py-[6px] w-20 text-sm text-pure-black uppercase font-bold">
                    Claim
                </Button>;

            case STATUS_TASK.COMPLETED:
                return <CheckIcon className="text-disable" />;

            default:
                return <LockIcon className="size-5 text-pure-white" />;

        }
    }, [detail]);

    const handleClickLink = async (link: string, id: number) => {
        const res = await clickTaskApi(id);
        if (res) {
            handleReload && handleReload();
        }

        if (link) {
            if (link.startsWith('https://t.me')) {
                WebApp.openTelegramLink(link);
            } else if (link.startsWith('/')) {
                navigate(link);
            }
            else {
                WebApp.openLink(link);
            }
        }
    };

    const handleClaim = async (id: number) => {
        try {
            await claimTaskApi(id).then((res) => {
                if (res) {
                    setTaskClaimed({
                        assetId: res.data.rewardAsset,
                        value: res.data.rewardQuantity
                    });

                    setTimeout(() => {
                        handleClose();
                    }, 0);

                    setTimeout(() => {
                        handleReload && handleReload();
                    }, 500);
                }
            });
        } catch (error) {
            const err = error as Error;
            toast.error(
                <div className="text-sub flex gap-2 items-center ">
                    <NoteMultipleIcon className='text-primary-1 size-4' /> {err.message}
                </div>,
                {
                    autoClose: 1000,
                    className: "p-0 shadow-copy !bg-background-3 !max-w-[calc(100dvw-32px)] mx-auto",
                    icon: false,
                    hideProgressBar: true,
                    closeButton: false,
                }
            );
        }
    };

    const process = useMemo(() => {
        if (detail.metadata) {
            const percent = detail.metadata.progress > detail.metadata.total ? detail.metadata.total : detail?.metadata.progress;
            return <p
                className={
                    cn(
                        "text-xs",
                        done ? "text-disable" : "text-main"
                    )
                }>
                <span className={
                    cn(
                        percent < detail.metadata.total && "text-sub",
                        done && "text-disable"
                    )
                }>{formatNumber2(percent, 2, false)}</span>/{formatNumber2(detail.metadata.total, 2, false)}
            </p>;
        }
        return null;
    }, [detail]);

    const description = useMemo(() => {
        if (detail.condition === TASK_CONDITION.COMPLETE_CHILD_MISSION) {
            return <p className={
                cn(
                    "text-sm",
                    done ? "text-disable" : "text-sub",
                )
            }>RANDOM HOPIUM & TON (↑100 TON)</p>;
        }
        return <p className={
            cn(
                done ? "text-disable" : "text-sub",
                "text-sm"
            )
        }>+{detail.rewardQuantity} HOPIUM</p>;
    }, [detail, done]);

    return (
        <div className="relative w-full">
            <>
                {/* top */}
                <div className={
                    cn(
                        "absolute top-0 left-0 size-[3px] z-10 bg-divider",
                        "after:contents-[''] after:absolute after:top-0 after:left-0 after:size-[2px] after:bg-pure-black"

                    )
                }></div>
                <div className={
                    cn(
                        "absolute top-0 right-0 size-[3px] z-10 bg-divider",
                        "after:contents-[''] after:absolute after:top-0 after:right-0 after:size-[2px] after:bg-pure-black"
                    )
                }></div>

                {/* bottom */}
                <div className={
                    cn(
                        "absolute bottom-0 left-0 size-[3px] z-10  bg-divider",
                        "after:contents-[''] after:absolute after:bottom-0 after:left-0 after:size-[2px] after:bg-pure-black"
                    )
                }></div>
                <div className={
                    cn(
                        "absolute bottom-0 right-0 size-[3px] z-10  bg-divider",
                        "after:contents-[''] after:absolute after:bottom-0 after:right-0 after:size-[2px] after:bg-pure-black"
                    )
                }></div>
            </>

            {/* Content */}
            <div
                className={
                    cn(
                        "flex items-center justify-between gap-x-4 p-3 border border-divider bg-background-2",
                        {
                            "cursor-pointer": detail.status === STATUS_TASK.UNCOMPLETED || detail.status === STATUS_TASK.CLAIMABLE
                        }
                    )
                }
                onClick={() => {
                    if (detail && onClick) {
                        onClick(detail);
                    }
                }}>
                <div className="flex items-center gap-x-3 w-full">
                    <div className={cn(
                        "relative size-6",
                        done && "after:absolute after:contents-[''] after:size-6 after:bg-background-2 after:inset-0 after:z-100 after:opacity-70"
                    )} >

                        <LazyLoadImage
                            src={detail.icon}
                            width={24}
                            height={24}
                            className="size-6 object-contain"
                        />
                    </div>

                    <section className="w-full">
                        <div
                            className={
                                cn(
                                    "font-bold text-md",
                                    done && "text-disable"
                                )}
                        >
                            {detail.title}
                        </div>
                        {description}
                        {
                            type === MISSION_TYPE.TRADE2AIRDROP && <div className="mt-1 flex items-center gap-2">
                                <div className="max-w-[160px] w-full">
                                    <Progress progress={detail.metadata?.progress || 0} total={detail.metadata?.total || 100} done={done} />
                                </div>
                                {process}
                            </div>
                        }

                    </section>
                </div>
                <div>
                    {renderStatusIcon()}
                </div>
            </div>
        </div>
    );
};

export default memo(TaskCard);