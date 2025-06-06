import { cn } from '@/helper';
import { FC } from 'react';
import LoadingIcon from '../icons/LoadingIcon';

const LoadingScreen: FC<{ visible?: boolean; className?: string; }> = ({ className }) => {
    return (
        <div className={cn('flex items-center justify-center w-full h-full', className)}>
            {/* <span className="loader"></span> */}
            <LoadingIcon />
        </div>
    );
};

export { LoadingScreen };
