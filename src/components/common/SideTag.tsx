import { cn } from '@/helper';
import { memo } from 'react';

interface IProps {
    title: string;
    className?: string;
    contentClassName?: string;
    side: 'start' | 'end' | 'center';
}
const SideTag = ({ side, title, className, contentClassName }: IProps) => {
    return (
        <div className={cn('flex items-center border rounded-[9px] p-[1px] w-[84px] h-[18px] border-green-1', `justify-${side}`, className)}>
            <span
                className={cn(
                    'h-full flex items-center justify-center rounded-[60px] text-pure-black text-xs bg-green-1',
                    side === 'center' ? 'w-full' : 'w-16',
                    contentClassName
                )}
            >
                {title}
            </span>
        </div>
    );
};

export default memo(SideTag);
