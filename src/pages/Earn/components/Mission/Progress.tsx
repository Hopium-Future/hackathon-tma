import HeadProgress from "@/components/icons/HeadProgress";
import { cn } from "@/helper";
import { FC } from "react";
type ProgressProps = {
    progress: number,
    total: number,
    done: boolean;
};
const Progress: FC<ProgressProps> = ({ progress = 10, total, done }) => {
    return (
        <div className="w-full relative">
            {/* border pixel */}
            <>
                <section className={
                    cn(
                        "size-0.5 absolute bg-background-2 top-0 left-0 z-10",
                        "after:absolute after:contents-[''] after:size-[1px] after:bottom-0 after:right-0 after:block",
                        !done && progress > 0 ? "after:bg-green-1" : "after:bg-divider"
                    )
                } />
                <section className={
                    cn(
                        "size-0.5 absolute bg-background-2 top-0 right-0 z-10",
                        "after:absolute after:contents-[''] after:size-[1px] after:bottom-0 after:left-0 after:block",
                        !done && progress >= total ? "after:bg-green-1" : "after:bg-divider"
                    )
                } />
                <section className={
                    cn(
                        "size-0.5 absolute bg-background-2 bottom-0 left-0 z-10",
                        "after:absolute after:contents-[''] after:size-[1px] after:top-0 after:right-0 after:block",
                        !done && progress > 0 ? "after:bg-green-1" : "after:bg-divider"
                    )
                } />
                <section className={
                    cn(
                        "size-0.5 absolute bg-background-2 bottom-0 right-0 z-10",
                        "after:absolute after:contents-[''] after:size-[1px] after:top-0 after:left-0 after:block",
                        !done && progress >= total ? "after:bg-green-1" : "after:bg-divider"
                    )
                } />
            </>
            <section className={
                cn(
                    "h-2 flex justify-center items-center w-full",
                    "bg-divider"
                )
            }>
                {
                    !done ? <section
                        className="absolute top-0 left-0 flex items-center w-full"
                    >
                        <div
                            className=" bg-green-1 h-2"
                            style={{
                                width: `${(progress / total) * 100}%`,
                            }}
                        />
                        {
                            progress > 0 && progress < total ? <HeadProgress className="size-2" /> : null
                        }
                    </section> : null
                }
            </section>
        </div>
    );
};
export default Progress;