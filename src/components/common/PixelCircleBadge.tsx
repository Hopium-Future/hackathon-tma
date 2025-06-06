import { ReactNode } from 'react';
import { cn } from '@/helper';
import colors from '@/config/colors';

interface IProps {
    content: ReactNode;
    size?: number;
    className?: string;
    color?: string;
}

const PixelCircleBadge = ({ className, content, color = colors.green[1] }: IProps) => {
    return (
        <div className={cn('relative flex items-center justify-center size-3', className)}>
            <div className="z-[2] text-[9px] leading-3 font-bold text-pure-black">{content}</div>
            <svg className={`absolute top-0 left-0 w-full h-full z-[1]`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.125 1.125H2.25V0H9.75V1.125H10.875V2.25H12V9.75H10.875V10.875H9.75V12H2.25V10.875H1.125V9.75H0V2.25H1.125V1.125Z"
                    fill={color}
                />
            </svg>
        </div>
    );
};

export default PixelCircleBadge;
