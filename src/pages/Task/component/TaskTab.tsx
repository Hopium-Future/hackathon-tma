import { getTasksApi } from '@/apis/task.api';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import { cn } from '@/helper';
import { TASK_TYPE } from '@/helper/constant';
import { Task } from '@/type/task.type';
import React, { memo, useEffect, useMemo, useState } from 'react';


// const BookmarkIcon = lazy(() => import('@/components/icons/BookmarkIcon'));
// const CalenderCheckIcon = lazy(() => import('@/components/icons/CalenderCheckIcon'));
// const CheckIcon = lazy(() => import('@/components/icons/CheckIcon'));
// const PvpIcon = lazy(() => import('@/components/icons/PvpIcon'));
// const TelegramIcon = lazy(() => import('@/components/icons/TelegramIcon'));
// const TwitterIcon = lazy(() => import('@/components/icons/TwitterIcon'));
// const UserPlusIcon = lazy(() => import('@/components/icons/UserPlusIcon'));
// const WalletIcon = lazy(() => import('@/components/icons/WalletIcon'));
// const GhostDriveIcon = lazy(() => import('@/components/icons/GhostDriveIcon'));

// Partner
// const HybridIcon = lazy(() => import('@/components/icons/partners/HybridIcon'));
// const AaoIcon = lazy(() => import('@/components/icons/partners/AaoIcon'));
// const KaiaIcon = lazy(() => import('@/components/icons/partners/KaiaIcon'));
// const LionGoalIcon = lazy(() => import('@/components/icons/partners/LionGoalIcon'));
// const HabitNetworkIcon = lazy(() => import('@/components/icons/partners/HabitNetworkIcon'));
// const BullsIcon = lazy(() => import('@/components/icons/partners/BullsIcon'));
// const HamsterRepublicIcon = lazy(() => import('@/components/icons/partners/HamsterRepublicIcon'));
// const MemeTownIcon = lazy(() => import('@/components/icons/partners/MemeTownIcon'));
// const MonkeyPawIcon = lazy(() => import('@/components/icons/partners/MonkeyPawIcon'));
// const NanozapIcon = lazy(() => import('@/components/icons/partners/NanozapIcon'));
// const UniquidIcon = lazy(() => import('@/components/icons/partners/UniquidIcon'));
// const BeeverseIcon = lazy(() => import('@/components/icons/partners/BeeverseIcon'));
// const YuligoIcon = lazy(() => import('@/components/icons/partners/YuligoIcon'));
// const CatchTheChickIcon = lazy(() => import('@/components/icons/partners/CatchTheChickIcon'));
// const TonFlashIcon = lazy(() => import('@/components/icons/partners/TonFlashIcon'));
// const P4LAIIcon = lazy(() => import('@/components/icons/partners/P4LAIIcon'));
// const AlgotradeIcon = lazy(() => import('@/components/icons/partners/AlgotradeIcon'));
// const CoinFlipGameIcon = lazy(() => import('@/components/icons/partners/CoinFlipGameIcon'));
// const UTXORDIcon = lazy(() => import('@/components/icons/partners/UTXORDIcon'));

type TabProps = {
    type: string;
    reload: boolean;
    setReload: () => void;
    handleChangeDetail: (detail: Task) => void;
    handleToggleDrawer: (status: boolean) => void;
};

const TaskTab: React.FC<TabProps> = ({ type, reload }) => {
    const [loading, setLoading] = useState<boolean>(false);
    // const [data, setData] = useState<Task[]>([]);
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const resTasks = await getTasksApi(type);
                if (resTasks.data) {

                    // setData(resTasks.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [reload, type]);

    const [selected, setSelected] = useState(TASK_TYPE.ALL);
    const handleOnSelect = (option: string) => {
        setSelected(option);
    };

    const filters = useMemo(() => {
        return [
            {
                label: "All",
                value: TASK_TYPE.ALL
            },
            {
                label: "One time",
                value: TASK_TYPE.ONE_TIME
            },
            {
                label: "Daily",
                value: TASK_TYPE.DAILY
            },
            {
                label: "Partner",
                value: TASK_TYPE.PARTNER
            },
        ];
    }, []);

    // const renderIconTask = (key: string) => {
    //     switch (key) {
    //         case KEY_ICON_TASK.USER_PLUS_ICON:
    //             return <UserPlusIcon />;
    //         case KEY_ICON_TASK.TELEGRAM_ICON:
    //             return <TelegramIcon />;
    //         case KEY_ICON_TASK.BOOKMARK_ICON:
    //             return <BookmarkIcon />;
    //         case KEY_ICON_TASK.TWITTER_ICON:
    //             return <TwitterIcon />;
    //         case KEY_ICON_TASK.TON_ICON:
    //             return <WalletIcon />;
    //         case KEY_ICON_TASK.PVP_ICON:
    //             return <PvpIcon className="size-5" />;

    //         // Partner
    //         case KEY_ICON_TASK.KAIA_ICON:
    //             return <KaiaIcon />;
    //         case KEY_ICON_TASK.LION_GOAL_ICON:
    //             return <LionGoalIcon />;
    //         case KEY_ICON_TASK.MEME_TOWN_ICON:
    //             return <MemeTownIcon />;
    //         case KEY_ICON_TASK.CAT_PLANETS_ICON:
    //             return <LazyLoadImage
    //                 src="/images/partner/CATS_icon.png"
    //                 className="size-6"
    //             />;
    //         case KEY_ICON_TASK.HABIT_NETWORK_ICON:
    //             return <HabitNetworkIcon />;
    //         case KEY_ICON_TASK.AAO_ICON:
    //             return <AaoIcon />;
    //         case KEY_ICON_TASK.MONKEY_PAW_ICON:
    //             return <MonkeyPawIcon />;
    //         case KEY_ICON_TASK.HAMSTER_REPUBLIC_ICON:
    //             return <HamsterRepublicIcon />;
    //         case KEY_ICON_TASK.UNIQUID_ICON:
    //             return <UniquidIcon />;
    //         case KEY_ICON_TASK.NANOZAP_ICON:
    //             return <NanozapIcon />;
    //         case KEY_ICON_TASK.BULLS_ICON:
    //             return <BullsIcon />;
    //         case KEY_ICON_TASK.HYBIRD_ICON:
    //             return <HybridIcon />;
    //         case KEY_ICON_TASK.GHOSTDRIVE_ICON:
    //             return <GhostDriveIcon />;
    //         case KEY_ICON_TASK.BEEVERSE_ICON:
    //             return <BeeverseIcon />;
    //         case KEY_ICON_TASK.BITHOVEN_ICON:
    //             return <UTXORDIcon />;
    //         case KEY_ICON_TASK.YULIGO_ICON:
    //             return <YuligoIcon />;
    //         case KEY_ICON_TASK.CAT_THE_CHICK_ICON:
    //             return <CatchTheChickIcon />;
    //         case KEY_ICON_TASK.TON_FLASH_ICON:
    //             return <TonFlashIcon />;
    //         case KEY_ICON_TASK.P4L_ICON:
    //             return <P4LAIIcon />;
    //         case KEY_ICON_TASK.AKEFISH_ICON:
    //             return <LazyLoadImage
    //                 src="/images/partner/AKEFish_icon.png"
    //                 className="size-6"
    //             />;
    //         case KEY_ICON_TASK.AIGOTRADE_ICON:
    //             return <AlgotradeIcon />;
    //         case KEY_ICON_TASK.COIN_FLIP_ICON:
    //             return <CoinFlipGameIcon />;

    //         default:
    //             return <CalenderCheckIcon />;
    //     }
    // };

    // const handleClickIconTask = (task: Task, e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.stopPropagation();
    //     if (task.condition === CONDITION_TASK.INVITE_FRIEND) {
    //         navigate('/invite');
    //     }
    //     else {
    //         if (task.status === STATUS_TASK.CLAIMABLE) {
    //             handleToggleDrawer(true);
    //             handleChangeDetail({
    //                 ...task
    //             });
    //         }
    //     }
    // };

    // const renderStatusIcon = (status: string, task: Task) => {
    //     switch (status) {
    //         case STATUS_TASK.UNCOMPLETED:
    //             return <ButtonSecondary classNameBorder="group-hover:bg-primary-1" classNameBackground="group-hover:bg-primary-2" point={true} className="text-md w-20 h-8">Start</ButtonSecondary>;
    //         case STATUS_TASK.CLAIMABLE:
    //             return <ButtonSecondary classNameBorder="group-hover:bg-primary-1" classNameBackground="group-hover:bg-primary-2" onClick={(e) => handleClickIconTask(task, e)} point={true} className="text-md w-20 h-8">Check</ButtonSecondary>;
    //         case STATUS_TASK.COMPLETED:
    //             return <CheckIcon className="text-primary-1" />;
    //         default:
    //             break;
    //     }
    // };

    // const handleClickLink = async (link: string, id: number) => {
    //     const res = await clickTaskApi(id);
    //     if (res) {
    //         // fetch();
    //         setReload();
    //     }
    //     handleToggleDrawer(false);
    //     if (link) {
    //         if (link.startsWith('https://t.me')) {
    //             WebApp.openTelegramLink(link);
    //         }
    //         else {
    //             WebApp.openLink(link);
    //         }
    //     }
    // };

    // const handleClickTask = useCallback((task: Task) => {
    //     if (task.condition === CONDITION_TASK.INVITE_FRIEND) {
    //         navigate('/invite');
    //     }
    //     else {
    //         if (task.status === STATUS_TASK.UNCOMPLETED || task.status === STATUS_TASK.CLAIMABLE) {
    //             handleClickLink(task.link, task._id);
    //         }
    //     }
    // }, []);

    // const tasks = useMemo(() => {
    //     if (selected === TASK_TYPE.ALL) {
    //         return data
    //             .sort((a) => (a.status === STATUS_TASK.COMPLETED ? 1 : -1));
    //     }
    //     return data
    //         .filter(item => item.type === selected)
    //         .sort((a) => (a.status === STATUS_TASK.COMPLETED ? 1 : -1));
    // }, [selected, data]);

    if (loading) return <div className="h-[585px]"><LoadingScreen /></div>;

    return (
        <>
            {/* Filter */}
            <div className="flex items-center gap-x-2 mt-4">
                {
                    filters.map(item => {
                        return <div
                            key={item.label}
                            className={
                                cn(
                                    "text-main text-sm border border-transparent px-3 py-1",
                                    selected === item.value && "border-primary-1 bg-primary-2"
                                )
                            }
                            onClick={() => handleOnSelect(item.value)}
                        >
                            {item.label}
                        </div>;
                    })
                }
            </div>
            {/* <div className="mt-4 flex flex-col gap-y-4">
                {tasks.map((task) => {
                    return (
                        <TaskCard
                            key={task._id}
                            iconTask={renderIconTask(task.icon)}
                            detail={task}
                            iconType={renderStatusIcon(task.status, task)}
                            onClick={handleClickTask}
                        />
                    );
                })}
            </div> */}
        </>
    );
};

export default memo(TaskTab);