import { getTasksApi } from '@/apis/task.api';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import { cn } from '@/helper';
import { MISSION_TYPE, STATUS_TASK } from '@/helper/constant';
import { Task } from '@/type/task.type';
import { FC, memo, UIEvent, useCallback, useEffect, useMemo, useState } from 'react';
import TaskCard from './TaskCard';

type TaskProps = {
    type?: string;
    className?: string;
    blur?: boolean;
};

const Tasks: FC<TaskProps> = ({ type = MISSION_TYPE.OUTBOND_MISSION, className, blur = false }) => {
    const [reload, setReload] = useState(false);
    const handleReload = useCallback(() => {
        setReload((pre) => !pre);
    }, []);
    const [data, setData] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const resTasks = await getTasksApi(type);
                if (resTasks.data) {
                    setData(resTasks.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [reload]);

    const tasks = useMemo(() => {
        return data.sort((a, b) => (a._id < b._id ? 1 : -1)).sort((a) => (a.status === STATUS_TASK.COMPLETED ? 1 : -1));
    }, [data]);

    const [isEnd, setIsEnd] = useState(false);
    const handleEnd = (end: boolean) => {
        setIsEnd(end);
    };
    const onScroll = (e: UIEvent<HTMLElement>) => {
        const obj = e.currentTarget;
        if (obj.scrollTop >= obj.scrollHeight - obj.offsetHeight - 1) {
            handleEnd(true);
        } else {
            handleEnd(false);
        }
    };

    if (loading)
        return (
            <div className="h-[585px]">
                <LoadingScreen />
            </div>
        );

    return (
        <div
            className={cn(
                'mt-3 flex flex-col gap-y-2 h-[calc(100vh-260px)] overflow-y-scroll',
                !isEnd && blur && '[mask-image:linear-gradient(to_bottom,transparent,black_0%,black_95%,transparent)]',
                className
            )}
            onScroll={onScroll}
        >
            {tasks.map((task) => {
                return <TaskCard type={type} key={task._id} detail={task} handleReload={handleReload} />;
            })}
        </div>
    );
};

export default memo(Tasks);
