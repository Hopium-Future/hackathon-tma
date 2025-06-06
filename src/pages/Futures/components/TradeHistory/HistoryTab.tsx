import { getOrdersHistory } from '@/apis/futures.api';
import Text from '@/components/common/text';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import { cn, formatNumber2, formatTime, getDecimalPrice } from '@/helper';
import { getAssetConfig, getPairConfig } from '@/selectors';
import useFuturesConfig from '@/stores/futures.store';
import { OrderFutures, REASON_CLOSE_CODE, SIDE_FUTURES, TYPE_FUTURES } from '@/type/futures.type';
import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import OrderDetailModal from './Order/OrderDetailModal';
import Nodata from '@/components/common/nodata';
import Emitter from '@/helper/emitter';
import SelectModal from '@/components/common/modal/SelectModal';

const sideOptions = [
    {
        title: 'All',
        value: null
    },
    {
        title: 'Long',
        value: SIDE_FUTURES.BUY
    },
    {
        title: 'Short',
        value: SIDE_FUTURES.SELL
    }
];

const statusOptions = [
    {
        title: 'All',
        value: null
    },
    {
        title: 'Take Profit',
        value: REASON_CLOSE_CODE.HIT_TP
    },
    {
        title: 'Stop Loss',
        value: REASON_CLOSE_CODE.HIT_SL
    },
    {
        title: 'Liquidation',
        value: REASON_CLOSE_CODE.LIQUIDATE
    },
    {
        title: 'Normal',
        value: REASON_CLOSE_CODE.NORMAL
    }
];

const timeOptions = [
    {
        title: 'All',
        value: null
    },
    {
        title: '1 day',
        value: '1'
    },
    {
        title: '7 days',
        value: '7'
    },
    {
        title: '30 days',
        value: '30'
    }
];
const HistoryTab = ({ tab }: { tab: string }) => {
    const [orders, setOrders] = useState<OrderFutures[]>([]);
    const [loading, setLoading] = useState(true);
    const hasNext = useRef(false);
    const [paging, setPaging] = useState({
        page: 0,
        pageSize: 10
    });
    const [filter, setFilter] = useState({
        reasonCloseCode: null,
        side: null,
        range: null
    });
    const [height, setHeight] = useState(0);
    const infinityRef = useRef<InfiniteScroll>(null);

    const fetchOrdersHistory = async (page?: number) => {
        try {
            const data = await getOrdersHistory({ ...filter, ...paging, page: page ?? paging.page });
            if (!data) return;
            hasNext.current = data?.hasNext;
            const _orders = !page ? data?.orders : [...orders].concat(data?.orders);
            setOrders(_orders);
            setPaging((prev) => ({ ...prev, page: page || 0 }));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 'HISTORY') fetchOrdersHistory(0);
        return () => {
            if (infinityRef.current && (infinityRef.current as any)?.el) (infinityRef.current as any).el.scrollTop = 0;
        };
    }, [filter, tab]);

    const onChangeFilter = (key: string, value: string | number | null) => {
        setLoading(true);
        setPaging((prev) => ({ ...prev, page: 0 }));
        setFilter((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const reFetchOrdersHistory = (e: string) => {
        if (e === 'recall') fetchOrdersHistory(0);
    };

    useEffect(() => {
        const el = document.querySelector('#trade-history');
        if (el) setHeight(el?.clientHeight - 110);
        Emitter.on('orders:tabs:history', reFetchOrdersHistory);
        return () => {
            Emitter.off('orders:tabs:history', reFetchOrdersHistory);
        };
    }, []);

    return (
        <div className="flex flex-col px-[0.5px]">
            <div className="flex items-center space-x-1 sticky top-14 z-10 py-3 bg-background-1">
                <SelectModal title="Side" value={filter.side} cols={3} options={sideOptions} onChange={(e) => onChangeFilter('side', e)} />
                <SelectModal
                    title="Status"
                    value={filter.reasonCloseCode}
                    cols={2}
                    options={statusOptions}
                    onChange={(e) => onChangeFilter('reasonCloseCode', e)}
                />
                <SelectModal title="Time" value={filter.range} cols={2} options={timeOptions} onChange={(e) => onChangeFilter('range', e)} />
            </div>
            {loading || !height ? (
                <LoadingScreen className="pt-10" />
            ) : (
                <InfiniteScroll
                    dataLength={orders.length || 0}
                    next={() => {
                        fetchOrdersHistory(paging.page + 1);
                    }}
                    height={height}
                    hasMore={hasNext.current}
                    loader={<h4 className="text-center">...</h4>}
                    scrollableTarget="trade-history"
                    className="divide-y-[0.5px] divide-divider"
                    ref={infinityRef}
                >
                    {orders.length > 0 ? orders.map((order) => <OrderHistory key={order.displaying_id} order={order} />) : <Nodata className="mt-[120px]" />}
                </InfiniteScroll>
            )}
        </div>
    );
};

const OrderHistory = ({ order }: { order: OrderFutures }) => {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, order?.symbol));
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, pairConfig?.quoteAssetId));

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            symbol: assetConfig?.assetDigit
        };
    }, [pairConfig, assetConfig]);

    const toggleDetailModal = () => {
        setShowDetailModal(!showDetailModal);
    };

    const renderReasonClose = () => {
        switch (order?.reason_close_code) {
            case REASON_CLOSE_CODE.NORMAL:
                return 'Normal';
            case REASON_CLOSE_CODE.HIT_SL:
                return 'Hit SL';
            case REASON_CLOSE_CODE.HIT_TP:
                return 'Hit TP';
            case REASON_CLOSE_CODE.LIQUIDATE:
                return 'Liquidate';
            default:
                return '';
        }
    };

    const profit = order.raw_profit ? order.raw_profit : order.profit;

    return (
        <>
            <OrderDetailModal visible={showDetailModal} onClose={toggleDetailModal} order={order} decimals={decimals} pairConfig={pairConfig} />
            <div onClick={toggleDetailModal} className="py-5 first:pt-0 after:pb-0 flex items-center justify-between px-[0.5px]">
                <div className="flex items-center space-x-2 flex-1">
                    <div className="px-3 py-2 ring-0.5 ring-divider bg-background-1 rounded w-8 h-8 flex items-center justify-center">
                        <ArrowUpIcon
                            width={16}
                            color="currentColor"
                            className={cn('', {
                                'text-red-1 rotate-180': order.side === SIDE_FUTURES.SELL,
                                'text-green-1': order.side === SIDE_FUTURES.BUY
                            })}
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-1">
                            <div className="font-bold">{pairConfig?.baseAsset || '-'}</div>
                            <Text variant="secondary" className="text-md">
                                -
                            </Text>
                            <Text variant="secondary" className="text-md">
                                {order.type === TYPE_FUTURES.MARKET ? 'Market' : 'Limit'}
                            </Text>
                            <span className="py-[1px] px-[6px] rounded-sm bg-background-2 text-green-1 font-medium text-sm ring-0.5 ring-divider">
                                {order.leverage}x
                            </span>
                        </div>
                        <Text variant="secondary" className="text-sm">
                            {formatTime(order.closed_at)}
                        </Text>
                    </div>
                </div>
                <div className="flex flex-col space-y-0.5 text-right">
                    <div className={classNames('font-bold', { 'text-green-1': profit > 0, 'text-red-1': profit < 0 })}>
                        {profit > 0 ? '+' : ''}
                        {formatNumber2(profit, decimals.symbol)} {pairConfig?.quoteAsset || '-'}
                    </div>
                    <Text variant="secondary" className="text-sm">
                        {renderReasonClose()}
                    </Text>
                </div>
            </div>
        </>
    );
};

export default HistoryTab;
