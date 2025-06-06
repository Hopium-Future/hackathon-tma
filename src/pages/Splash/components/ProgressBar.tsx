import { useIdle } from 'react-use';
import DoubleCheckIcon from '@/components/icons/DoubleCheckIcon';
import CloseIcon from '@/components/icons/CloseIcon';

type ProgressBar = {
    seconds: number;
    title: string;
};

const ProgressBar = ({ seconds, title }: ProgressBar) => {
    const isIdle = useIdle(seconds);
    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-base ">{title}</p>
                {
                    isIdle ? <DoubleCheckIcon /> : <CloseIcon />
                }
            </div>
            <div className="progress progress-striped animation-duration-5">
                <div className="progress-bar">
                </div>
            </div>
        </section>
    );
};

export default ProgressBar;