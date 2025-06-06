import { cn } from "@/helper";
import { STATUS_TASK } from "@/helper/constant";
import { Task } from "@/type/task.type";
import { memo, ReactNode } from "react";

type Props = {
    iconTask: ReactNode;
    iconType: ReactNode;
    detail: Task;
    onClick?: (detail: Task) => void;
};

function TaskCard({ detail, iconType, onClick, iconTask }: Props) {

    // const description = useMemo(() => {
    //     const { condition, rewardQuantity, group } = detail;
    //     const unit = group === "HOPIUM" ? "HOPIUM" : "Ticket";
    //     switch (condition) {
    //         case CONDITION_TASK.DAILY_CHECK_IN:
    //             return `${formatNumber(rewardQuantity)} ${unit}/day`;
    //         case CONDITION_TASK.INVITE_FRIEND:
    //             return `${formatNumber(rewardQuantity)} ${unit}/successful invite`;
    //         default:
    //             return `${formatNumber(rewardQuantity)} ${unit}`;
    //     }
    // }, [detail]);

    return (
        <div className={cn("flex items-center justify-between gap-x-4 p-3 border border-solid border-divider shadow-task", {
            "cursor-pointer": detail.status === STATUS_TASK.UNCOMPLETED || detail.status === STATUS_TASK.CLAIMABLE
        })} onClick={() => {
            if (detail && onClick) {
                onClick(detail);
            }
        }}>
            <div className="flex items-center gap-x-3">
                <div>
                    {iconTask}
                </div>
                <div>
                    <div className="font-bold text-sm">
                        {detail.title}
                    </div>
                    {/* <p className="text-sub text-md">{description}</p> */}
                </div>
            </div>
            <div>
                {iconType}
            </div>
        </div>
    );
}

export default memo(TaskCard);