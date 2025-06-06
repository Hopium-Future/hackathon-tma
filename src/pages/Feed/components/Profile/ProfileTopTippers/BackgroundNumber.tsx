import { cn } from "@/helper";

interface Props {
    label: string;
}

const BackgroundNumber = ({ label }: Props) => {

    const colorMap: Record<string, string> = {
        "1": "bg-yellow-1",
        "2": "bg-blue-1",
    };
    const bg = colorMap[label] || "bg-sub";

    return (
        <div className="w-4 h-4 relative bg-transparent">
            <div className={cn("absolute w-full top-[3px] bottom-[3px]", bg)} />
            <div className={cn("absolute h-full right-[3px] left-[3px]", bg)} />
            <div className={cn("absolute w-[calc(100%-3px)] h-[calc(100%-3px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", bg)} />
            <div className="text-md font-bold text-pure-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{label}</div>
        </div>
    )
}

export default BackgroundNumber