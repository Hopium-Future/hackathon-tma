// upgrade version of Box
import { FC, PropsWithChildren } from 'react';
import { cn } from '@/helper';

type BoxProps = {
    className?: string;
    dotClassName?: string;
    outsideDotClassName?: string;
    insideDotClassName?: string;
    hasInsideDots?: boolean;
};

const BorderCard: FC<PropsWithChildren & BoxProps> = ({ children, className, outsideDotClassName, insideDotClassName, hasInsideDots = true }) => (
    <div className={cn('relative border flex items-center justify-center w-full bg-green-5 border-green-3', className)}>
        {/* Outside dots */}
        {[
            '-top-[1px] -left-[1px] after:top-[1px] after:left-[1px]',
            '-top-[1px] -right-[1px] after:top-[1px] after:right-[1px]',
            '-bottom-[1px] -left-[1px] after:bottom-[1px] after:left-[1px]',
            '-bottom-[1px] -right-[1px] after:bottom-[1px] after:right-[1px]'
        ].map((position, index) => (
            <span
                key={index}
                className={cn(
                    'absolute size-[2px] bg-pure-black after:absolute after:content-[""] after:size-[1px] after:bg-green-3',
                    position,
                    outsideDotClassName
                )}
            />
        ))}

        {/* Inside dots */}
        {hasInsideDots &&
            ['top-[3px] left-[3px]', 'top-[3px] right-[3px]', 'bottom-[3px] left-[3px]', 'bottom-[3px] right-[3px]'].map((position, index) => (
                <span key={index} className={cn('absolute size-[1px] bg-green-3', position, insideDotClassName)} />
            ))}

        {children}
    </div>
);

export default BorderCard;
