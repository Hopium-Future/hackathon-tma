import { cn } from '@/helper';
import { ForwardedRef, forwardRef, ReactNode } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'default' | 'disable' | 'secondary';
    title?: string;
    className?: string;
    children?: ReactNode;
}

const Button = forwardRef(({ variant = 'default', className, children, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
        <button
            ref={ref}
            className={cn(
                'w-full rounded flex items-center justify-center py-[6px] font-bold uppercase',
                {
                    'bg-green-1 active:bg-green-1/80 text-pure-black': variant === 'primary',
                    'bg-background-3 active:bg-background-3/80 text-pure-white ring-0.5 ring-divider': variant === 'secondary',
                    'bg-background-3 ring-0.5 ring-divider text-disable pointer-events-none select-none ': props.disabled
                },
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

export default Button;
