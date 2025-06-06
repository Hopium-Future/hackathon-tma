import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import PriceSubscriber from './PriceSubscriber';
import AssetLogo from '@/components/common/AssetLogo';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import OrderProfit from '@/pages/Futures/components/TradeHistory/Order/OrderProfit';
import { formatBigNum, formatNumber2 } from '@/helper';
import { getRatioSLTP } from '@/helper/futures';
import { IPost } from '@/type/feed.type';
import { PairConfig, SIDE_FUTURES, STATUS_FUTURES } from '@/type/futures.type';

export interface ITradingChartHeaderProps {
    post: IPost;
    decimals: {
        price: number;
        symbol: number | undefined;
    };
    pairConfig: PairConfig;
}
const TradingChartHeader = ({ decimals, post, pairConfig }: ITradingChartHeaderProps) => {
    const navigate = useNavigate();
    const { side, futureOrder: order } = post;
    const totalProfit = order?.raw_profit ? order.raw_profit : order.profit;
    const renderSLTP = useCallback(() => {
        if (!order.sl && !order.tp) {
            return null;
        }
        const data = {
            label: order.tp ? 'TP' : 'SL',
            price: order.tp ? order.tp : order.sl,
            color: order.tp ? 'text-green-1' : 'text-red-1',
            bgColor: order.tp ? 'bg-green-1/20' : 'bg-red-1/15'
        };
        return (
            <div className={`flex items-center gap-[6px] ${data.color}`}>
                <span>{data.price ? `${getRatioSLTP({ price: data.price, order })}%` : '--'}</span>
                <span className={`py-[2px] px-1 rounded text-sm ${data.bgColor}`}>{data.label}</span>
            </div>
        );
    }, [order]);
    return (
        <>
            <div className="flex items-center text-md font-bold border-b border-divider">
                <div className="h-9 flex items-center gap-1 px-2 border-r border-divider">
                    <ArrowUpIcon className={side === SIDE_FUTURES.SELL ? 'text-red-1  rotate-180' : 'text-green-1'} width={18} />
                    <span className="text-main uppercase">{order.type}</span>
                </div>
                <div className="flex items-center justify-between flex-grow gap-1 px-2 overflow-x-auto thin-scroll-bar">
                    <div className="h-full flex items-center justify-center gap-[6px] text-main">
                        <span className="py-[2px] px-1 bg-divider rounded text-sm">VOL</span>
                        <span>${formatBigNum(order?.order_value, 2, true)}</span>
                    </div>
                    {order.status === STATUS_FUTURES.CLOSED ? (
                        <span className="text-md text-main text-nowrap whitespace-nowrap">
                            🚀 Total PnL{' '}
                            <span className={totalProfit >= 0 ? 'text-green-1' : 'text-red-1'}>
                                {totalProfit >= 0 ? '+' : '-'}${formatNumber2(Math.abs(totalProfit))}
                            </span>
                        </span>
                    ) : order?.status === STATUS_FUTURES.ACTIVE ? (
                        <div className="h-full flex items-center justify-center gap-[6px] text-main">
                            <OrderProfit
                                {...order}
                                quoteAsset={pairConfig?.quoteAsset}
                                decimals={decimals}
                                currencyPrefix="$"
                                dynamicText={{
                                    text: 'UnPnL',
                                    position: 'before',
                                    className: 'py-[2px] px-1 rounded text-sm',
                                    hasBackground: true
                                }}
                            />
                        </div>
                    ) : (
                        renderSLTP()
                    )}
                </div>
            </div>
            <div className=" flex-grow text-md font-bold flex items-center gap-x-2 px-2">
                <button className="flex items-center gap-x-1 py-3" onClick={() => navigate(`/futures/${pairConfig?.baseAsset}${pairConfig?.quoteAsset}`)}>
                    <AssetLogo assetId={pairConfig?.baseAssetId} size={16} />
                    <span className="text-main">{pairConfig?.baseAsset}</span>
                    <span className="text-main/50">{order.leverage}x</span>
                </button>
                <span className="text-sub">•</span>
                <PriceSubscriber symbol={post.symbol} decimal={decimals.price} />
            </div>
        </>
    );
};

export default memo(TradingChartHeader);
