import { cn, formatNumber2, futuresProfit } from '@/helper';
import initPriceSocket from '@/sockets/price.socket';
import useFuturesConfig from '@/stores/futures.store';
import usePriceSocket from '@/stores/priceSocket.store';
import { DecimalsFuturesType, OrderFutures, STATUS_FUTURES } from '@/type/futures.type';
import { useEffect } from 'react';

interface OrderProfitProps extends OrderFutures {
    quoteAsset?: string;
    decimals: DecimalsFuturesType;
    isRatio?: boolean;
    currencyPrefix?: string;
    className?: string;
    dynamicText?: {
        text: string;
        position: 'before' | 'after';
        hasBackground?: boolean;
        className?: string;
    };
}
const OrderProfit = ({ quoteAsset, decimals, isRatio, currencyPrefix, className, dynamicText, ...order }: OrderProfitProps) => {
    const ticker = useFuturesConfig((state) => (order.status === STATUS_FUTURES.CLOSED ? null : state.tickers[order.symbol]));
    const { profit, percent } = futuresProfit(order, ticker);
    const profitParse = ticker ? profit : order?.raw_profit ? order.raw_profit : order.profit;
    const sign = profitParse ? (profitParse > 0 ? '+' : '-') : '';
    const profitDisplayed = profitParse ? formatNumber2(Math.abs(profitParse), decimals.symbol) : 0;
    const addSymbolSubscribed = usePriceSocket((state) => state.addSymbolSubscribed);

    useEffect(() => {
        if (!ticker) {
            initPriceSocket();
            addSymbolSubscribed(order.symbol);
        }
    }, [ticker]);

    const dynamicTextElement = dynamicText ? (
        <span
            className={cn(
                {
                    'text-green-1': profitParse > 0,
                    'text-red-1': profitParse < 0,
                    'bg-green-1/15': profitParse > 0 && dynamicText?.hasBackground,
                    'bg-red-1/15': profitParse < 0 && dynamicText?.hasBackground
                },
                dynamicText?.className
            )}
        >
            {dynamicText.text}
        </span>
    ) : null;

    return (
        <>
            {dynamicText && dynamicText.position === 'after' && dynamicTextElement}
            <div className={cn('font-bold w-full', { 'text-green-1': profitParse > 0, 'text-red-1': profitParse < 0 }, className)}>
                {sign}
                {currencyPrefix && currencyPrefix}
                <span>{profitDisplayed}</span> {!isRatio && !currencyPrefix && quoteAsset}
                {isRatio && (
                    <span className="text-md">
                        ({sign}
                        {Math.abs(+percent)}%)
                    </span>
                )}
            </div>
            {dynamicText && dynamicText.position === 'before' && dynamicTextElement}
        </>
    );
};

export default OrderProfit;
