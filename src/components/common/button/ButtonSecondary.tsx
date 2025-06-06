import { cn } from '@/helper';
import { ForwardedRef, forwardRef, ReactNode } from 'react';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    point?: boolean,
    title?: string,
    className?: string,
    classNameBorder?: string,
    classNameBackground?: string,
    children?: ReactNode;
}


const ButtonSecondary = forwardRef(
    ({ point = true, className, classNameBorder, classNameBackground, children, ...props }: ButtonProps
        , ref: ForwardedRef<HTMLButtonElement>) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "relative font-bold text-white group",
                    className
                )}
                {...props}
            >
                <div className={cn("absolute top-0 left-1 bottom-0 right-1 bg-divider", classNameBorder)} />
                <div className={cn("absolute top-0.5 left-0.5 bottom-0.5 right-0.5 bg-divider", classNameBorder)} />
                <div className={cn("absolute top-1 left-0 bottom-1 right-0 bg-divider", classNameBorder)} />

                <div className={cn("absolute top-0.5 left-1 bottom-0.5 right-1 bg-background-2", classNameBackground)} />
                <div className={cn("absolute top-1 left-0.5 bottom-1 right-0.5 bg-background-2", classNameBackground)} />

                {/* Point */}
                <div className={cn(
                    "absolute size-0.5 top-1.5 left-1.5 bg-divider", classNameBorder,
                    !point && "hidden"
                )}></div>
                <div className={cn(
                    "absolute size-0.5 bottom-1.5 left-1.5 bg-divider", classNameBorder,
                    !point && "hidden"
                )}></div>
                <div className={cn(
                    "absolute size-0.5 top-1.5 right-1.5 bg-divider", classNameBorder,
                    !point && "hidden"
                )
                }></div>
                <div className={cn(
                    "absolute size-0.5 bottom-1.5 right-1.5 bg-divider", classNameBorder,
                    !point && "hidden"
                )}></div>

                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-normal max-w-full max-h-full'>
                    {children}
                </div>
            </button >
        );
    }
);

export default ButtonSecondary
