import Modal from '@/components/common/modal';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import { cn, formatNumber2, formatTime } from '@/helper';
import { DecimalsFuturesType, OrderFutures, PairConfig, REASON_CLOSE_CODE, SIDE_FUTURES, STATUS_FUTURES } from '@/type/futures.type';
import OrderProfit from '@/pages/Futures/components/TradeHistory/Order/OrderProfit';
import Text from '@/components/common/text';
import { useEffect, useMemo, useRef, useState } from 'react';
import TickerField from '@/pages/Futures/components/TickerField';
import Button from '@/components/common/Button';
import OrderEditSLTPModal from './OrderEditSLTPModal';
import OrderCloseModal from './OrderCloseModal';
import ShareIcon from '@/components/icons/ShareIcon';
import OrderShareModal, { OrderShareModalRef } from './OrderShareModal';
import AssetLogo from '@/components/common/AssetLogo';
import { getRatioSLTP } from '@/helper/futures';
import { get } from 'lodash';

interface OrderDetailModalProps {
    visible: boolean;
    onClose: () => void;
    decimals: DecimalsFuturesType;
    pairConfig?: PairConfig;
    order?: OrderFutures | null;
    sharedPnL?: boolean;
    isNotice?: boolean;
}
const OrderDetailModal = ({ visible, onClose, decimals, pairConfig, order, isNotice = false, ...props }: OrderDetailModalProps) => {
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [sharedPnL, setSharedPnL] = useState(false);
    const isPending = order?.status === STATUS_FUTURES.PENDING;
    const triggerShareRef = useRef<OrderShareModalRef>(null);
    useEffect(() => {
        if (props.sharedPnL !== undefined) {
            setSharedPnL(props.sharedPnL);
        }
    }, [visible]);

    const toggleEditSLTP = () => {
        setShowEditSLTP(!showEditSLTP);
    };

    const toggleCloseModal = () => {
        setShowCloseModal(!showCloseModal);
    };

    const toggleShareModal = () => {
        setShowShareModal(!showShareModal);
        setTimeout(() => {
            triggerShareRef.current?.onShare();
        }, 1000);
        if (showShareModal) onClose();
    };

    const renderItem = (value: number, decimal = 2) => {
        if (!value) return '-';
        return formatNumber2(value, decimal);
    };

    const renderFee = (key: string, color = true) => {
        if (!order) return '-';
        const decimalFunding = 6;
        const decimal = key === 'funding_fee.total' ? decimalFunding : decimals.symbol;
        const feeMetadata = order.fee_metadata as { [key: string]: { value: number } };
        const data = feeMetadata[key] ? feeMetadata[key]['value'] : get(order, key, 0);
        const prefix = color ? (data < 0 ? '-' : '+') : '';
        if (!data) return '-';
        return (
            <span
                className={cn({
                    'text-green-1': data > 0 && color,
                    'text-red-1': data < 0 && color
                })}
            >
                {`${prefix}${formatNumber2(Math.abs(data), decimal)} ${pairConfig?.quoteAsset}`}
            </span>
        );
    };

    const isHistory = order?.status === STATUS_FUTURES.CLOSED;

    if (!order || !pairConfig) return null;
    return (
        <>
            {!isHistory && (
                <>
                    <OrderEditSLTPModal
                        visible={showEditSLTP}
                        onClose={toggleEditSLTP}
                        order={order}
                        decimals={decimals}
                        pairConfig={pairConfig}
                        onConfirm={onClose}
                    />
                    <OrderCloseModal
                        visible={showCloseModal}
                        onClose={toggleCloseModal}
                        order={order}
                        decimals={decimals}
                        pairConfig={pairConfig}
                        onConfirm={onClose}
                    />
                </>
            )}
            {isHistory && (
                <OrderShareModal
                    visible={showShareModal}
                    onClose={toggleShareModal}
                    order={order}
                    decimals={decimals}
                    pairConfig={pairConfig}
                    sharedPnL={sharedPnL}
                    ref={triggerShareRef}
                />
            )}
            <Modal title={`${isPending ? 'ORDER' : 'POSITION'} DETAILS`} visible={visible} onClose={onClose}>
                <div className="flex flex-col space-y-2">
                    <div className={cn('grid grid-cols-2 gap-2 text-md', { 'grid-cols-1': isPending })}>
                        <div className="flex items-center space-x-2">
                            <div className="px-3 py-2 ring-0.5 ring-divider bg-background-1 rounded w-8 h-8 flex items-center justify-center">
                                <ArrowUpIcon
                                    width={16}
                                    color="currentColor"
                                    className={cn('', {
                                        'text-red-1 rotate-180': order?.side === SIDE_FUTURES.SELL,
                                        'text-green-1': order?.side === SIDE_FUTURES.BUY
                                    })}
                                />
                            </div>
                            <div className="px-3 py-2 ring-0.5 ring-divider bg-background-1 rounded flex items-center justify-center flex-1 space-x-1 text-md font-bold">
                                <AssetLogo assetId={pairConfig?.baseAssetId} size={14} />
                                <span>{pairConfig?.baseAsset}</span>
                                <span className="text-green-1">{order?.leverage}x</span>
                            </div>
                        </div>
                        {!isPending && (
                            <div className="px-3 py-2 ring-0.5 ring-divider bg-background-1 rounded flex items-center justify-center flex-1">
                                <OrderProfit {...order} quoteAsset={pairConfig?.quoteAsset} decimals={decimals} className="text-center" />
                            </div>
                        )}
                    </div>
                    <div className="p-3 ring-0.5 ring-divider bg-background-1 rounded flex flex-col space-y-2 text-md">
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">ID</Text>
                            <Text>{order.displaying_id}</Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Open time</Text>
                            <Text>{formatTime(order.opened_at)}</Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">{isPending ? 'Limit' : 'Open'} Price</Text>
                            <Text>{renderItem(isPending ? order.price : order.open_price, decimals.price)}</Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Market Price</Text>
                            <Text>
                                <TickerField field="lastPrice" symbol={pairConfig?.symbol} decimal={decimals.price} />
                            </Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Volume</Text>
                            <Text>{renderItem(order.order_value, decimals.symbol)}</Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Margin</Text>
                            <Text>
                                {renderItem(order.margin, decimals.symbol)} {pairConfig?.quoteAsset}
                            </Text>
                        </div>
                        {isHistory && order?.reason_close_code === REASON_CLOSE_CODE.LIQUIDATE && (
                            <div className="flex items-center justify-between">
                                <Text variant="secondary">Maintenance Margin</Text>
                                <Text>
                                    {renderItem(order?.maintenance_margin || 0, decimals.symbol)} {pairConfig?.quoteAsset}
                                </Text>
                            </div>
                        )}
                    </div>
                    <div className="p-3 ring-0.5 ring-divider bg-background-1 rounded flex flex-col space-y-2 text-md">
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Close Price</Text>
                            <Text>{renderItem(order.close_price, decimals.price)}</Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Close Time</Text>
                            <Text>{order.closed_at ? formatTime(order.closed_at) : '-'}</Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">SL/TP</Text>
                            <Text>
                                <span className="text-red-1">{order.sl ? `${getRatioSLTP({ price: order.sl, order })}%` : 'Not Set'}</span>
                                <span className="text-disable">/</span>
                                <span className="text-green-1">{order.tp ? `+${getRatioSLTP({ price: order.tp, order })}%` : 'Not Set'}</span>
                            </Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Open Fee</Text>
                            <Text>
                                <FeeMeta order={order} type="place_order" decimal={decimals.symbol || 2} quoteAsset={pairConfig.quoteAsset} />
                            </Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Close Fee</Text>
                            <Text>
                                <FeeMeta order={order} type="close_order" decimal={decimals.symbol || 2} quoteAsset={pairConfig.quoteAsset} />
                            </Text>
                        </div>
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Funding Fee</Text>
                            <Text>{renderFee('funding_fee.total')}</Text>
                        </div>
                    </div>
                    {!isHistory && (
                        <div className="!mt-6 grid grid-cols-2 gap-2">
                            <Button variant="secondary" className="h-11 ring-0.5 ring-divider uppercase" onClick={toggleEditSLTP}>
                                Modify TP/SL
                            </Button>
                            <Button variant="secondary" className="h-11 ring-0.5 ring-divider uppercase" onClick={toggleCloseModal}>
                                {isPending ? 'Cancel' : 'Close'}
                            </Button>
                        </div>
                    )}
                    {isHistory && order.open_price > 0 && !isNotice && (
                        <Button variant="secondary" className="space-x-2 h-11 !mt-6" onClick={toggleShareModal}>
                            <span>Share</span>
                            <ShareIcon />
                        </Button>
                    )}
                    {isHistory && order.open_price > 0 && isNotice && (
                        <Button variant="secondary" className="space-x-2 h-11 !mt-6" disabled>
                            <span>{isPending ? 'Canceled' : 'Closed'}</span>
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
};

const FeeMeta = ({ type, order, decimal, quoteAsset }: { type: 'place_order' | 'close_order'; order: OrderFutures; decimal: number; quoteAsset: string }) => {
    const convertObject = (obj: { [key: string]: number }) => {
        if (obj?.currency) {
            return [
                {
                    asset: +obj?.currency,
                    value: obj?.value ?? 0
                }
            ];
        } else {
            const arr: { asset: string; value: number }[] = [];
            Object.keys(obj).map((key) => {
                arr.push({
                    asset: key,
                    value: obj[key]
                });
            });
            return arr;
        }
    };

    const fee_metadata = useMemo(() => {
        const metadata = order?.fee_data ?? order?.fee_metadata;
        const feeFilter = metadata?.[type];
        const fee = feeFilter ? convertObject(feeFilter) : [];
        return fee;
    }, [order]);

    const fee = fee_metadata?.[0]?.value;

    return fee ? `${formatNumber2(fee, decimal)} ${quoteAsset}` : '-';
};

export default OrderDetailModal;
