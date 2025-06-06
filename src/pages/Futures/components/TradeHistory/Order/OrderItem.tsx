import { memo, useEffect, useMemo, useState, useRef } from 'react';
import Button from '@/components/common/Button';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import { cn, formatNumber2, getDecimalPrice } from '@/helper';
import { getAssetConfig, getPairConfig } from '@/selectors';
import useFuturesConfig from '@/stores/futures.store';
import { OrderFutures, SIDE_FUTURES, STATUS_FUTURES } from '@/type/futures.type';
import OrderProfit from './OrderProfit';
import OrderEditSLTPModal from './OrderEditSLTPModal';
import OrderDetailModal from './OrderDetailModal';
import OrderCloseModal from './OrderCloseModal';
import ShareIcon from '@/components/icons/ShareIcon';
import OrderShareModal, { OrderShareModalRef } from './OrderShareModal';
import AssetLogo from '@/components/common/AssetLogo';
import Text from '@/components/common/text';
import TickerField from '@/pages/Futures/components/TickerField';
import { calLiqPrice, getRatioSLTP } from '@/helper/futures';
import { IPost } from '@/type/feed.type';
import ShareOrderSignalModal from '@/components/shared-ui/ShareOrderSignalModal';
import AddVolumeModal from '../../AddVolume/AddVolumeModal';
import EditIcon from '@/components/icons/EditIcon';

interface OrderItemProps extends OrderFutures {
    currentPair: string;
}

const OrderItem = (order: OrderItemProps) => {
    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, order.symbol));
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, pairConfig?.quoteAssetId));
    const ordersShared = useFuturesConfig((state) => state.ordersShared);
    const setShowShareOrderSignalSuccessModal = useFuturesConfig((state) => state.setShowShareOrderSignalSuccessModal);
    const setNewPost = useFuturesConfig((state) => state.setNewPost);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const [showShareSignalModal, setShowShareSignalModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAddVolumeModal, setShowAddVolumeModal] = useState(false);
    const [isShared, setShared] = useState(!!order?.metadata?.is_share_post);
    const isPending = order.status === STATUS_FUTURES.PENDING;
    const triggerShareRef = useRef<OrderShareModalRef>(null);

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            symbol: assetConfig?.assetDigit
        };
    }, [pairConfig, assetConfig]);

    const toggleDetailModal = () => {
        setShowDetailModal(!showDetailModal);
    };

    const toggleEditSLTP = (e?: any) => {
        if (e?.stopPropagation) e?.stopPropagation();
        setShowEditSLTP(!showEditSLTP);
    };

    const toggleShareSignalModal = (e?: any) => {
        if (e?.stopPropagation) e?.stopPropagation();
        setShowShareSignalModal(!showShareSignalModal);
    };

    const checkShareSignal = (isSuccess: boolean, data: IPost) => {
        setShowShareSignalModal(false);
        if (isSuccess) {
            setNewPost(data);
            setShowShareOrderSignalSuccessModal(true);
            setShared(true);
        }
    };

    const toggleCloseModal = (e?: any) => {
        if (e?.stopPropagation) e?.stopPropagation();
        setShowCloseModal(!showCloseModal);
    };

    const toggleShareModal = (e?: any) => {
        if (e?.stopPropagation) e?.stopPropagation();
        setShowShareModal(!showShareModal);
        setTimeout(() => {
            triggerShareRef.current?.onShare();
        }, 1000);
    };

    const toggleAddVolumeModal = (e?: any) => {
        if (e?.stopPropagation) e?.stopPropagation();
        setShowAddVolumeModal(!showAddVolumeModal);
    };

    const renderSLTP = (mode: 'sl' | 'tp') => {
        if (mode === 'sl') {
            return <span className="text-red-1">{order.sl ? `${getRatioSLTP({ price: order.sl, order })}%` : '-'}</span>;
        }
        if (mode === 'tp') {
            return <span className="text-green-1">{order.tp ? `+${getRatioSLTP({ price: order.tp, order })}%` : '-'}</span>;
        }
    };

    useEffect(() => {
        if (ordersShared.length && ordersShared.includes(`${order.displaying_id}`)) {
            setShared(true);
        }
    }, [ordersShared, order]);
    if (!pairConfig) return null;
    return (
        <>
            <AddVolumeModal visible={showAddVolumeModal} onClose={toggleAddVolumeModal} order={order} decimals={decimals} pairConfig={pairConfig} />
            <OrderDetailModal visible={showDetailModal} onClose={toggleDetailModal} order={order} decimals={decimals} pairConfig={pairConfig} />
            <OrderEditSLTPModal visible={showEditSLTP} onClose={toggleEditSLTP} order={order} decimals={decimals} pairConfig={pairConfig} />
            <OrderCloseModal visible={showCloseModal} onClose={toggleCloseModal} order={order} decimals={decimals} pairConfig={pairConfig} />
            <OrderShareModal
                ref={triggerShareRef}
                visible={showShareModal}
                onClose={toggleShareModal}
                order={order}
                decimals={decimals}
                pairConfig={pairConfig}
            />
            <ShareOrderSignalModal
                visible={showShareSignalModal}
                onClose={toggleShareSignalModal}
                orderId={order.displaying_id}
                onFinished={checkShareSignal}
            />
            <div onClick={toggleDetailModal} className="p-2 rounded-md bg-background-2 flex flex-col space-y-3">
                <div className={cn('grid grid-cols-2 gap-2 text-md', { 'grid-cols-1': isPending })}>
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
                        <div className="px-3 py-2 ring-0.5 ring-divider bg-background-1 rounded flex items-center justify-center flex-1 space-x-1 font-bold">
                            <AssetLogo assetId={pairConfig?.baseAssetId} size={14} />
                            <span>{pairConfig?.baseAsset}</span>
                            <span className="text-green-1">{order.leverage}x</span>
                        </div>
                    </div>
                    {!isPending && (
                        <div className="flex items-center space-x-2">
                            <div className="px-3 py-2 ring-0.5 ring-divider bg-background-1 rounded flex items-center justify-center flex-1">
                                <OrderProfit {...order} quoteAsset={pairConfig?.quoteAsset} decimals={decimals} className="text-center" />
                            </div>
                            <div
                                onClick={toggleShareModal}
                                className="px-3 py-2 ring-0.5 ring-divider bg-background-1 rounded w-8 h-8 flex items-center justify-center"
                            >
                                <ShareIcon />
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-3 text-sm">
                    <div className="flex flex-col">
                        <Text variant="secondary">{isPending ? 'SL' : 'Volume'}</Text>
                        <Text>{isPending ? renderSLTP('sl') : formatNumber2(order.order_value, decimals.symbol)}</Text>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Text variant="secondary">Margin</Text>
                        <Text>{formatNumber2(order.margin, decimals.symbol)}</Text>
                    </div>
                    <div className="flex flex-col items-end">
                        <Text variant="secondary">Market Price</Text>
                        <Text>
                            <TickerField symbol={pairConfig.symbol} field="lastPrice" decimal={decimals.price} className="!text-main" />
                        </Text>
                    </div>
                </div>
                <div className="grid grid-cols-3 text-sm">
                    <div className="flex flex-col">
                        <Text variant="secondary" className="flex items-center space-x-1">
                            <span>{isPending ? 'TP' : 'TP/SL'}</span> {!isPending && <EditIcon size={12} onClick={toggleEditSLTP} />}
                        </Text>
                        <Text>
                            {isPending ? (
                                renderSLTP('tp')
                            ) : (
                                <>
                                    {renderSLTP('tp')}
                                    <span className="text-sub">/</span>
                                    {renderSLTP('sl')}
                                </>
                            )}
                        </Text>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Text variant="secondary">{isPending ? 'Volume' : 'Entry Price'}</Text>
                        <Text>{isPending ? formatNumber2(order.order_value, decimals.symbol) : formatNumber2(order.open_price, decimals.price)}</Text>
                    </div>
                    <div className="flex flex-col items-end">
                        <Text variant="secondary">{isPending ? 'Limit Price' : 'Liq. Price'} </Text>
                        <Text>{isPending ? formatNumber2(order.price, decimals.price) : formatNumber2(calLiqPrice(order, pairConfig), decimals.price)}</Text>
                    </div>
                </div>

                <div className={`grid gap-2 text-sm ${isShared ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    <Button variant="secondary" className="uppercase ring-0" onClick={isPending ? toggleEditSLTP : toggleAddVolumeModal}>
                        {isPending ? 'Modify TP/SL' : 'ADD VOLUME'}
                    </Button>
                    {!isShared && (
                        <Button variant="secondary" className="uppercase ring-0" onClick={toggleShareSignalModal}>
                            make the call
                        </Button>
                    )}
                    <Button variant="secondary" className="uppercase ring-0" onClick={toggleCloseModal}>
                        {isPending ? 'cancel' : 'close'}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default memo(
    OrderItem,
    (prev, next) => prev.displaying_id === next.displaying_id && prev.sl === next.sl && prev.tp === next.tp && prev.open_price === next.open_price
);
