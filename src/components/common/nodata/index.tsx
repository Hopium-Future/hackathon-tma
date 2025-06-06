import { cn } from '@/helper';

interface Props {
    className?: string;
}
const Nodata = ({ className }: Props) => {
    return (
        <div className={cn('flex flex-col items-center justify-center', className)}>
            <img src="/images/no-data.png" width={100} height={100} alt="no data" />
            <span className="text-sm text-sub">Oops, no data</span>
        </div>
    );
};

export default Nodata;
