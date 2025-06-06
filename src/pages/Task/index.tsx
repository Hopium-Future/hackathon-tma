import { claimTaskApi, clickTaskApi } from "@/apis/task.api";
import Drawer from "@/components/Drawer";
import Button from "@/components/common/Button";
import TabCustom from "@/components/common/tabs";
import CheckIcon from "@/components/icons/CheckIcon";
import NoteMultipleIcon from "@/components/icons/NoteMultipleIcon";
import { STATUS_TASK, TASK_TAB } from "@/helper/constant";
import { ListContent, ListTab } from "@/type/tab.type";
import { Task } from "@/type/task.type";
import WebApp from "@twa-dev/sdk";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Avaiable from "./Avaiable";
import Features from "./Features";
import TaskTab from "./component/TaskTab";

export default function TaskPage() {
    const [searchParams] = useSearchParams();

    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
    const handleToggleDrawer = useCallback((status: boolean) => {
        setIsOpenDrawer(status);
    }, []);

    const [detail, setDetail] = useState<Task | null>(null);
    const handleChangeDetail = useCallback((detail: Task) => {
        setDetail(detail);
    }, []);

    const [reload, setReload] = useState(false);
    const handleReload = useCallback(() => {
        setReload(pre => !pre);
    }, []);

    const handleClickLink = async (link: string, id: number) => {
        const res = await clickTaskApi(id);
        if (res) {
            handleReload();
        }
        setIsOpenDrawer(false);
        if (link) {
            if (link.startsWith('https://t.me')) {
                WebApp.openTelegramLink(link);
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
                    handleReload();
                    toast.success(
                        <div className="text-sub flex gap-2 items-center bg-primary-2">
                            <CheckIcon className='text-primary-1' /> Claim completed task
                        </div>,
                        {
                            autoClose: 1000,
                            className: "p-0 border shadow-copy !bg-primary-2 !border-primary-1 !max-w-[calc(100dvw-32px)] mx-auto",
                            icon: false,
                            hideProgressBar: true,
                            closeButton: false,
                        }
                    );
                    setIsOpenDrawer(false);
                }
            });
        } catch (error) {
            const err = error as Error;
            toast.error(
                <div className="text-sub flex gap-2 items-center bg-primary-2">
                    <NoteMultipleIcon className='text-primary-1' /> {err.message}
                </div>,
                {
                    autoClose: 1000,
                    className: "p-0 border shadow-copy !bg-primary-2 !border-primary-1 !max-w-[calc(100dvw-32px)] mx-auto",
                    icon: false,
                    hideProgressBar: true,
                    closeButton: false,
                }
            );
        }
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
    };

    // Tab
    const tabDefault = useMemo(() => {
        return searchParams.get("tab") as string || TASK_TAB.HOPIUM;
    }, [searchParams]);

    const listTab: ListTab[] = useMemo(() => {
        return [{
            value: TASK_TAB.HOPIUM,
            title: 'HOPIUM'
        }, {
            value: TASK_TAB.LUCKY,
            title: 'Tickets'
        },];
    }, []);

    const listContent: ListContent[] = [
        {
            value: TASK_TAB.HOPIUM,
            children: <TaskTab
                key={TASK_TAB.HOPIUM}
                type={TASK_TAB.HOPIUM}
                handleChangeDetail={handleChangeDetail}
                handleToggleDrawer={handleToggleDrawer}
                reload={reload}
                setReload={handleReload}
            />
        },
        {
            value: TASK_TAB.LUCKY,
            children: <TaskTab
                key={TASK_TAB.LUCKY}
                type={TASK_TAB.LUCKY}
                handleChangeDetail={handleChangeDetail}
                handleToggleDrawer={handleToggleDrawer}
                reload={reload}
                setReload={handleReload}
            />
        },
    ];

    return (
        <>
            <div className="px-4 pt-10 pb-24">
                <Avaiable />
                <Features />

                <TabCustom
                    className="mt-4"
                    defaultValue={tabDefault}
                    listTab={listTab}
                    listTabClassName="[&>button]:w-full"
                    listContent={listContent}
                />
            </div>

            {
                isOpenDrawer && detail && (
                    <Drawer isOpen={isOpenDrawer} onClose={handleCloseDrawer} className="text-center">
                        <div className="p-4">
                            <h1 className="text-2xl font-bold">{detail.title}</h1>
                            <p className="text-base font-normal">{detail.rewardQuantity} HOPIUM</p>
                            <Button variant='primary' className="mt-4 text-white font-medium" onClick={() => {
                                // if (detail.type === TASK_TYPE.ONE_TIME || detail.type === TASK_TYPE.DAILY) {
                                if (detail.status === STATUS_TASK.UNCOMPLETED) {
                                    handleClickLink(detail.link, detail._id);
                                }
                                if (detail.status === STATUS_TASK.CLAIMABLE) {
                                    handleClaim(detail._id);
                                }
                                // }
                            }
                            }>
                                Check
                            </Button>
                        </div>
                    </Drawer>
                )
            }

            <div className="fixed w-full h-24 bottom-0 left-0 bg-background-1" />
        </>
    );
}