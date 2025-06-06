import { FilterType, OrderFutures, SIDE_FUTURES, TYPE_FUTURES } from '@/type/futures.type';
import { getFilter } from '.';
import { PairConfig } from '../type/futures.type';
import useFuturesConfig from '@/stores/futures.store';
import { MMRConfig } from './constant';

export enum MODE_SLTP {
    PRICE = 'Price',
    PNL = '%PnL'
}

export const getRatioSLTP = ({ price, order }: { price: number; order: OrderFutures }) => {
    if (!+price) return '';
    const openPrice = +(order.open_price || order.price);
    const side = order.side;
    const priceDifference = side === SIDE_FUTURES.BUY ? +price - openPrice : openPrice - +price;
    const formatX = (priceDifference / openPrice) * 100;
    return +formatX.toFixed(Math.abs(formatX) > 1 ? 1 : 2);
};

export const getFuturesType = ({ order, pairConfig, lastPrice }: { order: any; pairConfig: PairConfig; lastPrice: number }) => {
    const { open_price, side } = order;
    const priceFilter: any = getFilter(FilterType.PRICE_FILTER, pairConfig);
    const percentPriceFilter: any = getFilter(FilterType.PERCENT_PRICE, pairConfig);
    const _maxPrice = priceFilter?.maxPrice;
    const _minPrice = priceFilter?.minPrice;
    const lowerBound = {
        min: Math.max(_minPrice, lastPrice * percentPriceFilter?.multiplierDown),
        max: Math.min(lastPrice, lastPrice * (1 - percentPriceFilter?.minDifferenceRatio))
    };

    const upperBound = {
        min: Math.max(lastPrice, lastPrice * (1 + percentPriceFilter?.minDifferenceRatio)),
        max: Math.min(_maxPrice, lastPrice * percentPriceFilter?.multiplierUp)
    };

    if (side === SIDE_FUTURES.BUY) {
        if (lowerBound.min < open_price && open_price < lowerBound.max) return TYPE_FUTURES.LIMIT;
        if (upperBound.min < open_price && open_price < upperBound.max) return TYPE_FUTURES.STOP;
    }
    if (side === SIDE_FUTURES.SELL) {
        if (upperBound.min < open_price && open_price < upperBound.max) return TYPE_FUTURES.LIMIT;
        if (lowerBound.min < open_price && open_price < lowerBound.max) return TYPE_FUTURES.STOP;
    }

    return TYPE_FUTURES.LIMIT;
};

export const getLastPrice = (symbol: string) => {
    return useFuturesConfig.getState().tickers[symbol]?.lastPrice;
};

export const calLiqPrice = (order: OrderFutures, pairConfig: PairConfig) => {
    const maxLeverage = pairConfig?.leverageConfig?.max || 0;
    const openPrice = order.open_price || order.price;
    const volume = order.quantity * openPrice;
    const maintenanceMargin = getMMR(maxLeverage) * volume;
    const marginDifference = (order.margin - maintenanceMargin) / order.quantity;
    if (order.side === SIDE_FUTURES.SELL) {
        return openPrice + marginDifference;
    } else {
        return openPrice - marginDifference;
    }
};

export const checkLargeVolume = (notional: number) => {
    return notional >= 30e3;
};

export const checkInFundingTime = () => {
    const now = new Date();
    const hour = now.getUTCHours();
    const min = now.getMinutes();
    return (min === 0 && hour % 8 === 0) || (min >= 50 && hour % 8 === 7);
};

export const ERROR_MESSAGES_FUTURES = {
    MAX_TOTAL_VOLUME: 'For liquidity guarantee, total trading volume for each user with this trading pair cannot exceed',
    TOO_MANY_REQUESTS: 'Sorry, you have sent us too many requests recently. Please try again later.',
    INVALID_LEVERAGE: 'Invalid Leverage',
    TRADE_NOT_ALLOWED: 'The pair is not yet supported for trading',
    BAD_SYMBOL: 'The currency pair is not yet supported for trading',
    INVALID_ORDER_TYPE: 'Order type not supported for this currency pair',
    NOT_FOUND_ORDER: 'Order not found',
    PROCESSING_FUTURES_ORDER: 'Your request failed because the order was closed',
    UNKNOWN: 'Something went wrong'
};

export const getMMR = (max: number) => {
    const keys = Object.keys(MMRConfig).map(Number);
    const closest = keys.reduce((prev, curr) => (Math.abs(curr - max) < Math.abs(prev - max) ? curr : prev));
    return MMRConfig[closest as keyof typeof MMRConfig];
};
