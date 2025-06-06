import colors from '@/config/colors';
import { cn } from '@/helper';
import { SIDE_FUTURES } from '@/type/futures.type';

interface IProps {
    side: SIDE_FUTURES;
    setSide: (value: SIDE_FUTURES) => void;
}
const OrderSide = ({ side, setSide }: IProps) => {
    return (
        <div className="flex-1 flex items-center space-x-1 h-full font-bold">
            <button onClick={() => setSide(SIDE_FUTURES.BUY)} className="relative flex flex-1 h-full">
                <div
                    className={cn('w-[calc(100%-20px)] h-full ring-0.5 ring-transparent absolute z-[1] top-0 left-0 rounded-l-md', {
                        'bg-green-1': side === SIDE_FUTURES.BUY,
                        'ring-divider bg-background-4 h-[calc(100%-1px)] top-[0.5px]': side !== SIDE_FUTURES.BUY
                    })}
                ></div>
                <SVG
                    active={side === SIDE_FUTURES.BUY}
                    className={cn('absolute h-full top-0 text-transparent bg-background-1 -right-1.5', {
                        'text-green-1': side === SIDE_FUTURES.BUY,
                        'text-background-4 z-[2]': side !== SIDE_FUTURES.BUY
                    })}
                />
                <div
                    className={cn('absolute inset-0 z-[11] flex items-center justify-center text-pure-black uppercase', {
                        'text-sub': side !== SIDE_FUTURES.BUY
                    })}
                >
                    Long
                </div>
            </button>
            <button onClick={() => setSide(SIDE_FUTURES.SELL)} className="relative flex flex-1 h-full">
                <div
                    className={cn('w-[calc(100%-20px)] h-full ring-0.5 ring-transparent absolute z-[1] top-0 right-0 rounded-r-md', {
                        'bg-red-1': side === SIDE_FUTURES.SELL,
                        'ring-divider bg-background-4 h-[calc(100%-1px)] top-[0.5px]': side !== SIDE_FUTURES.SELL
                    })}
                ></div>
                <SVG
                    active={side === SIDE_FUTURES.SELL}
                    className={cn('absolute h-full top-0 text-transparent z-10 -left-1.5 rotate-180', {
                        'text-red-1': side === SIDE_FUTURES.SELL,
                        'text-background-4 z-[2]': side !== SIDE_FUTURES.SELL
                    })}
                />
                <div
                    className={cn('absolute inset-0 z-[11] flex items-center justify-center text-pure-black uppercase', {
                        'text-sub': side !== SIDE_FUTURES.SELL
                    })}
                >
                    Short
                </div>
            </button>
        </div>
    );
};

const SVG = ({ active, ...props }: { className: string; active: boolean }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 32" fill="none">
        <path
            fill="currentColor"
            d="M-62 0.25H5.56602C8.23814 0.25 10.7218 1.62655 12.138 3.89251L25.963 26.0125C27.5241 28.5102 25.7284 31.75 22.783 31.75H-62C-64.0711 31.75 -65.75 30.0711 -65.75 28V4C-65.75 1.92893 -64.0711 0.25 -62 0.25Z"
            stroke={active ? 'currentColor' : colors.divider.DEFAULT}
            strokeWidth={0.5}
        ></path>
    </svg>
);

export default OrderSide;
