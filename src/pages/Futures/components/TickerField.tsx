import useFuturesConfig from '@/stores/futures.store';
import get from 'lodash/get';
import { cn, formatNumber2 } from '@/helper';
import { isNumber } from 'lodash';
import { usePrevious } from 'react-use';
import colors from '@/config/colors';
import { memo, ReactNode, useEffect, useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import usePriceSocket from '@/stores/priceSocket.store';

interface TickerFieldProps {
    symbol: string;
    field: string;
    decimal?: number;
    className?: string;
    quoteAsset?: string | ReactNode;
    sign?: boolean;
}

const replaceVNDC = (symbol: string) => symbol.replace('VNST', 'VNDC');
const TickerField = ({ symbol, field, decimal = 0, className, quoteAsset, ...props }: TickerFieldProps) => {
    const _symbol = replaceVNDC(symbol);
    const ticker = useFuturesConfig((state) => state.tickers[_symbol]);
    const value = get(ticker, field, 0);

    if (field === 'volumeRateLS') {
        const long = get(ticker, 'buyVolumeRate', 0);
        const short = get(ticker, 'sellVolumeRate', 0);
        return (
            <span className={cn('whitespace-nowrap', className)}>
                <span className="text-green-1">{(long * 100).toFixed(0)}%</span>
                <span className="text-sub">/</span>
                <span className="text-red-1">{(short * 100).toFixed(0)}%</span>
            </span>
        );
    }

    if (!value) return '-';
    if (['lastPrice', 'bid', 'ask'].includes(field)) return <LastPrice price={value} decimal={decimal} className={className} quoteAsset={quoteAsset} />;
    if (field === 'priceChangePercent') return <PriceChangePercent priceChangePercent={value} className={className} {...props} />;
    if (field === 'fundingRate') {
        const long = get(ticker, 'buyFundingRate', 0);
        const short = get(ticker, 'sellFundingRate', 0);
        return (
            <span className={cn('whitespace-nowrap', className)}>
                <span className="text-green-1">{formatNumber2(long * 100, decimal)}%</span>
                <span className="text-sub">/</span>
                <span className="text-red-1">{formatNumber2(short * 100, decimal)}%</span>
            </span>
        );
    }
    if (field === 'fundingTime') {
        return <FundingCountdown value={value} className={className} />;
    }
    return value;
};

interface LastPriceProps {
    price: number;
    decimal: number;
    className?: string;
    quoteAsset?: string | ReactNode;
}
const LastPrice = ({ price, decimal, className, quoteAsset }: LastPriceProps) => {
    const prevPrice = usePrevious(price) || 0;
    const [color, setColor] = useState(colors.green[1]);

    useEffect(() => {
        if (price !== prevPrice) {
            setColor(price > prevPrice ? colors.green[1] : colors.red[1]);
        }
    }, [price, prevPrice]);

    return (
        <span className={cn('flex items-center space-x-1', className)} style={{ color }}>
            <span>{formatNumber2(price, decimal)}</span>
            {quoteAsset && <span className="flex">{quoteAsset}</span>}
        </span>
    );
};

interface PriceChangePercentProps {
    priceChangePercent: number;
    className?: string;
    extraContent?: React.ReactNode;
    sign?: boolean;
}
const PriceChangePercent = ({ priceChangePercent, className, extraContent, sign = true, ...props }: PriceChangePercentProps) => {
    return (
        <div
            {...props}
            className={cn(
                'flex items-center justify-end text-right',
                {
                    'text-red-1': priceChangePercent < 0,
                    'text-green-1': priceChangePercent > 0
                },
                className
            )}
        >
            {isNumber(priceChangePercent) && sign && (priceChangePercent < 0 ? '' : '+')}
            {isNumber(priceChangePercent) ? formatNumber2(priceChangePercent * 100, 2) + '%' : '-'}
            {extraContent}
        </div>
    );
};

const FundingCountdown = memo(({ value, className }: { value: number; className?: string }) => {
    const timesync = usePriceSocket((state) => state.timesync);

    return (
        <Countdown
            now={() => timesync?.now() || Date.now()}
            date={value}
            renderer={({ hours, minutes, seconds }) => {
                return (
                    <span className={className}>
                        {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
                    </span>
                );
            }}
        />
    );
});
export default TickerField;
