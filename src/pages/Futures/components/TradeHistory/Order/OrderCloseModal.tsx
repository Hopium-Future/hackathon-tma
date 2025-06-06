import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import { DecimalsFuturesType, OrderFutures, PairConfig, SIDE_FUTURES, STATUS_FUTURES } from '@/type/futures.type';
import classNames from 'classnames';
import TickerField from '@/pages/Futures/components/TickerField';
import { formatNumber2, formatSide } from '@/helper';
import OrderProfit from '@/pages/Futures/components/TradeHistory/Order/OrderProfit';
import Button from '@/components/common/Button';
import { useState } from 'react';
import { fetchOrderFutures } from '@/apis/futures.api';
import Emitter from '@/helper/emitter';
import useFuturesConfig from '@/stores/futures.store';

interface OrderCloseModalProps {
    visible: boolean;
    onClose: (e?: any) => void;
    order: OrderFutures;
    pairConfig?: PairConfig;
    decimals: DecimalsFuturesType;
    onConfirm?: VoidFunction;
}
const OrderCloseModal = ({ visible, onClose, pairConfig, onConfirm, decimals, order }: OrderCloseModalProps) => {
    const [loading, setLoading] = useState(false);
    const isPending = order?.status === STATUS_FUTURES.PENDING;
    const removeOrderShared = useFuturesConfig((state) => state.removeOrderShared);

    const onCloseOrder = async () => {
        setLoading(true);
        try {
            const data = await fetchOrderFutures('delete', {
                displaying_id: order.displaying_id,
                special_mode: 1
            });
            if (data?.status === 'ok') {
                removeOrderShared(`${order.displaying_id}`);
            }
            Emitter.emit('order:close', JSON.stringify({ order, pairConfig, decimals, status: data?.status }));
            if (data.status === 'ok' && onConfirm) onConfirm();
        } catch (error) {
            console.log(error);
        } finally {
            onClose();
            setLoading(false);
        }
    };

    if (!pairConfig) return null;
    return (
        <>
            <Modal
                title={
                    <div className="flex items-center space-x-1">
                        <span>
                            {isPending ? 'Cancel' : 'Close'} {pairConfig?.baseAsset}
                        </span>
                        <div
                            className={classNames('px-2 py-0.5 bg-background-3 rounded-sm ring-0.5 ring-divider font-bold text-sm uppercase', {
                                'text-green-1': order.side === SIDE_FUTURES.BUY,
                                'text-red-1': order.side === SIDE_FUTURES.SELL
                            })}
                        >
                            {formatSide(order.side)}
                        </div>
                    </div>
                }
                visible={visible}
                onClose={onClose}
            >
                <div className="flex flex-col space-y-3 text-md">
                    <div className="flex items-center justify-between">
                        <Text variant="secondary">Market Price</Text>
                        <Text>
                            <TickerField field="lastPrice" decimal={decimals.price} symbol={pairConfig?.symbol} />
                        </Text>
                    </div>
                    <div className="flex items-center justify-between">
                        <Text variant="secondary">Current Volume</Text>
                        <Text>
                            {formatNumber2(order.order_value, decimals.symbol)} {pairConfig?.quoteAsset}
                        </Text>
                    </div>
                    {!isPending && (
                        <div className="flex items-center justify-between">
                            <Text variant="secondary">Estimated PNL</Text>
                            <Text>
                                <OrderProfit {...order} quoteAsset={pairConfig?.quoteAsset} decimals={decimals} isRatio />
                            </Text>
                        </div>
                    )}
                </div>
                <Button disabled={loading} variant="primary" className="h-11 font-bold mt-6 uppercase" onClick={onCloseOrder}>
                    {isPending ? 'CONFIRM' : 'CLOSE POSITION'}
                </Button>
            </Modal>
        </>
    );
};

export default OrderCloseModal;
