import { memo, useEffect } from 'react';

import TickerField from '@/pages/Futures/components/TickerField';
import usePriceSocket from '@/stores/priceSocket.store';

interface IProps {
    symbol: string;
    decimal: number;
}

const PriceSubscriber = ({ symbol, decimal }: IProps) => {
    const addSymbolSubscribed = usePriceSocket((state) => state.addSymbolSubscribed);
    const removeSymbolSubscribed = usePriceSocket((state) => state.removeSymbolSubscribed);

    useEffect(() => {
        if (symbol) {
            addSymbolSubscribed(symbol);
            return () => {
                removeSymbolSubscribed(symbol);
            };
        }
    }, [symbol, addSymbolSubscribed, removeSymbolSubscribed]);
    return <TickerField field="lastPrice" symbol={symbol} decimal={decimal} />;
};

export default memo(PriceSubscriber);
