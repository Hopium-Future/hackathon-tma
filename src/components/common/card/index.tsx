import { cn } from '@/helper';
import React, { forwardRef } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children: React.ReactNode;
}
const Card = ({ className, children, ...props }: Props, ref: any) => {
    return (
        <div ref={ref} {...props} className={cn('py-2 px-3 bg-background-2 ring-0.5 ring-divider flex items-center rounded', className)}>
            {children}
        </div>
    );
};

export default forwardRef<HTMLDivElement, Props>(Card);
