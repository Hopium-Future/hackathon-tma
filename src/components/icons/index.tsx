import { cn } from '@/helper';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const iconVariants = cva('inline', {
    variants: {
        size: {
            notification: 'w-5 h-5',
            loans: 'w-[3px] h-[6px]',
            size_6: 'w-[6px] h-[6px]', // tam toi
            size_10: 'w-[10px] h-[10x]', // tam toi
            xxs: 'w-[10px] h-[10x]',
            xs: 'w-3 h-3',
            md: 'w-6 h-6',
            sm: 'w-4 h-4',
            lg: 'w-8 h-8'
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

interface IconProps extends React.SVGAttributes<SVGSVGElement>, VariantProps<typeof iconVariants> {}

const BaseIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className, children, size, ...props }, ref) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cn(iconVariants({ className, size }))} ref={ref} {...props}>
            {children}
        </svg>
    );
});

BaseIcon.displayName = 'BaseIcon';

export { BaseIcon, iconVariants };
export type { IconProps };
