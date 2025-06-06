import NoDataIcon2 from '@/components/icons/NoDataIcon2';
import { cn } from '@/helper';

interface Props {
    className?: string;
}
const NoData2 = ({ className }: Props) => {
    return (
        <div className={cn('flex flex-col gap-1 items-center justify-center text-sub', className)}>
            <NoDataIcon2 className="size-[100px]" />
            <span className="text-md">Nothing to see here frens.</span>
        </div>
    );
};

export default NoData2;
