import { cn } from '@/helper';
import SidePixel from './SidePixel';

interface IProps {
    className?: string;
}

const BackgroundPixel = ({ className }: IProps) => {
    return (
        <div className={cn('size-full', className)}>
            <div className="flex items-center justify-between size-full relative">
                <SidePixel className="h-full" />
                <SidePixel className="h-full" side="right" />
                <div className="bg-green-10 absolute h-full w-[calc(100%-30px)] top-0 left-1/2 -translate-x-1/2" />
            </div>
        </div>
    );
};

export default BackgroundPixel;
