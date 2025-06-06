import { memo, useMemo } from 'react';

import colors from '@/config/colors';
import { IPost } from '@/type/feed.type';
import { chartTypes } from '@/components/TVChartContainer/constantsTrading';
import TVChartContainer, { TVChartLineOptions } from '@/components/TVChartContainer';
import useFuturesConfig from '@/stores/futures.store';
import { futuresProfit } from '@/helper';
import { STATUS_FUTURES } from '@/type/futures.type';

interface IProps {
    post: IPost;
}

const TradingChartContainer = ({ post }: IProps) => {
    const { futureOrder: order, symbol } = post;
    const ticker = useFuturesConfig((state) => state.tickers[symbol.replace('VNST', 'VNDC')]);
    const { profit } = futuresProfit(order, ticker);
    const profitParse = ticker ? profit : order.profit;

    const currentPosition = useMemo(() => {
        if (order.status === STATUS_FUTURES.ACTIVE) {
            return profitParse > 0 ? 1 : profitParse < 0 ? -1 : 0;
        }
        if (order.status === STATUS_FUTURES.CLOSED) {
            return order.profit > 0 ? 1 : order.profit < 0 ? -1 : 0;
        }
        return 0;
    }, [profitParse, order]);

    const lineStrokeColor = currentPosition === 0 ? colors.white : currentPosition === -1 ? colors.red[1] : colors.green[1];

    const staticLines: TVChartLineOptions[] = useMemo(() => {
        const lines: TVChartLineOptions[] = [];

        if (order.tp) {
            lines.push({
                id: 'tp',
                text: 'TP',
                price: order.tp,
                bodyTextColor: colors.green[1],
                lineColor: colors.green[1]
            });
        }

        if (order.sl) {
            lines.push({
                id: 'sl',
                text: 'SL',
                price: order.sl,
                bodyTextColor: colors.red[1],
                lineColor: colors.red[1]
            });
        }

        if (order.close_price) {
            lines.push({
                id: 'closed',
                text: 'Closed',
                price: order.close_price,
                bodyTextColor: colors.main,
                lineColor: colors.disable,
                lineStyle: 2
            });
        }
        return lines;
    }, [order]);

    const dynamicLines = useMemo(
        () => [
            {
                id: 'open',
                text: '',
                price: order.open_price || order.price,
                bodyTextColor: currentPosition === 0 ? colors.pure.black : colors.white,
                lineColor: currentPosition === 0 ? colors.white : currentPosition === 1 ? colors.green[1] : colors.red[1],
                lineStyle: 2
            }
        ],
        [order, currentPosition]
    );

    return (
        <TVChartContainer
            isMobile
            type={chartTypes.Line}
            symbol={post.symbol}
            timeframe="60"
            bgColor={colors.background[4]}
            classNameChart="h-full"
            staticLines={staticLines}
            dynamicLines={dynamicLines}
            staticOverrides={{
                'mainSeriesProperties.showPriceLine': false,
                'scalesProperties.showSeriesLastValue': false,
                'mainSeriesProperties.lineStyle.color': colors.disable // default line chart color
            }}
            dynamicOverrides={{
                'mainSeriesProperties.lineStyle.color': lineStrokeColor
            }}
            disableFeatures={['scales_context_menu']}
        />
    );
};

export default memo(TradingChartContainer);
