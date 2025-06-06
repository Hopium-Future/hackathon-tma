import { memo } from 'react';
import { cn } from '@/helper';

interface IProps {
    rank: number;
    className?: string;
    contentClassName?: string;
}

const MedalItem = ({ className, contentClassName, rank }: IProps) => {
    return (
        <div className={cn('relative size-6 bg-[url(/images/hall/medal-icon-bg.png)] bg-contain bg-no-repeat', className)}>
            <span className={cn('text-xs leading-[8px] text-pure-black absolute left-1/2 -translate-x-1/2 bottom-[3.5px]', contentClassName)}>{rank}</span>
        </div>
    );
};

export default memo(MedalItem);
