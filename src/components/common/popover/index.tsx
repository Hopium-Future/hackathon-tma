import { FC, PropsWithChildren, ReactNode } from 'react';
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from './Popover';
import { cn } from '@/helper';

type PopoverProps = {
    trigger: ReactNode;
    className?: string;
    contentClassName?: string;
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    arrow?: boolean;
    arrowClassName?: string;
    alignOffset?: number;
};

const index: FC<PropsWithChildren & PopoverProps> = ({ trigger, children, className, contentClassName, align = 'end', arrow, arrowClassName, ...props }) => {
    return (
        <Popover>
            <PopoverTrigger className={cn(className)}>{trigger}</PopoverTrigger>
            <PopoverContent className={cn('border-none bg-background-3', contentClassName)} align={align} {...props}>
                {children}
                {arrow && <PopoverArrow fill="currentColor" color="currentColor" className={cn('text-background-3', arrowClassName)} />}
            </PopoverContent>
        </Popover>
    );
};

export default index;
