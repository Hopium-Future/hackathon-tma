import Button from '@/components/common/Button';
import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import N3SuccessIcon from '@/components/icons/N3SuccessIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import { useEffect, useRef, useState } from 'react';
import OrderShareModal, { OrderShareModalRef } from './OrderShareModal';
import LoadingIcon from '@/components/icons/LoadingIcon';
import { formatSide } from '@/helper';
import { DecimalsFuturesType, OrderFutures, PairConfig, STATUS_FUTURES } from '@/type/futures.type';
import { getOrderDetail } from '@/apis/futures.api';
import Emitter from '@/helper/emitter';
import OrderDetailModal from './OrderDetailModal';
import { fetchTask } from '@/apis/task.api';
import N3ErrorIcon from '@/components/icons/N3ErrorIcon';

const OrderCloseAlertModal = () => {
    const [order, setOrder] = useState<OrderFutures | null>(null);
    const [decimals, setDecimals] = useState<DecimalsFuturesType | null>(null);
    const [pairConfig, setPairConfig] = useState<PairConfig | null>(null);
    const triggerShareRef = useRef<OrderShareModalRef>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
    const orderDetail = useRef<OrderFutures | null>(null);
    const [sharedPnL, setSharedPnL] = useState(false);
    const isPending = order?.status === STATUS_FUTURES.PENDING;
    const [status, setStatus] = useState<string | null>(null);
    const isClosed = status === 'ok';

    const checkTask = async () => {
        try {
            const response = await fetchTask('get', `tasks/claim/other/X001/${order?.displaying_id}`);
            const success = response.data.success;
            setSharedPnL(success);
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    };

    const onOrderClose = (e: any) => {
        try {
            const { order, decimals, pairConfig, status } = JSON.parse(e) as {
                order: OrderFutures;
                pairConfig: PairConfig;
                decimals: DecimalsFuturesType;
                status: string;
            };
            setOrder(order);
            setDecimals(decimals);
            setPairConfig(pairConfig);
            setStatus(status);
            setShowAlertModal(true);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!showAlertModal) orderDetail.current = null;
        if (showAlertModal && status === 'ok') checkTask();
    }, [showAlertModal]);

    useEffect(() => {
        Emitter.on('order:close', onOrderClose);
        return () => {
            Emitter.off('order:close', onOrderClose);
        };
    }, [Emitter]);

    const fetchOrderDetail = async (orderId: string | number) => {
        try {
            setLoadingDetail(true);
            const data = await getOrderDetail(orderId);
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingDetail(false);
        }
    };

    const onShare = async () => {
        try {
            if (orderDetail.current || loadingDetail || !order) return;
            const data = await fetchOrderDetail(order.displaying_id);
            if (data) orderDetail.current = data;
        } catch (error) {
            console.log(error);
        } finally {
            toggeShareModal();
        }
    };

    const goHistory = () => {
        setShowShareModal(false);
        setShowAlertModal(false);
        setShowOrderDetailModal(true);
        Emitter.emit('orders:tabs', 'HISTORY');
    };

    const onGoHistory = async () => {
        try {
            if (orderDetail.current || loadingDetail || !order) return;
            const data = await fetchOrderDetail(order.displaying_id);
            if (data) {
                orderDetail.current = data;
                goHistory();
            }
        } catch (error) {
            console.log(error);
        } finally {
            toggeShareModal();
            if (orderDetail.current) goHistory();
        }
    };

    const toggleAlertModal = () => {
        setShowAlertModal(!showAlertModal);
    };

    const toggeShareModal = () => {
        setShowShareModal(!showShareModal);
        setShowAlertModal(false);
        setTimeout(() => {
            triggerShareRef.current?.onShare();
        }, 1000);
    };

    const toggeOrderDetailModal = () => {
        if (showOrderDetailModal) Emitter.emit('orders:tabs:history', 'recall');
        setShowOrderDetailModal(!showOrderDetailModal);
        setShowAlertModal(false);
    };

    const renderIcon = () => {
        if (isClosed) return <N3SuccessIcon />;
        return <N3ErrorIcon />;
    };

    const renderMsg = () => {
        if (isClosed) {
            if (isPending) return 'Order canceled successfully';
            return 'Position closed';
        }
        return 'Error';
    };

    const renderContent = () => {
        if (isClosed) return `${pairConfig?.baseAsset} ${formatSide(order?.side).toUpperCase()}`;
        return 'TRY AGAIN';
    };

    if (!order || !decimals || !pairConfig) return null;
    return (
        <>
            <OrderDetailModal
                visible={showOrderDetailModal}
                onClose={toggeOrderDetailModal}
                order={orderDetail.current}
                decimals={decimals}
                pairConfig={pairConfig}
                sharedPnL={sharedPnL}
            />
            <Modal visible={showAlertModal} onClose={toggleAlertModal}>
                <div className="flex flex-col items-center">
                    {renderIcon()}
                    <Text variant="secondary" className="text-md mt-3 mb-1">
                        {renderMsg()}
                    </Text>
                    <Text className="text-2xl font-bold">{renderContent()}</Text>
                    <div className="mt-6 grid grid-cols-1 gap-4 w-full">
                        {isClosed ? (
                            <>
                                {!isPending && (
                                    <Button className="flex items-center space-x-1 h-11" variant="primary" onClick={onShare}>
                                        <span>Share</span>
                                        <ShareIcon />
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button variant="secondary" onClick={toggleAlertModal} className="h-11">
                                CLOSE
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>
            {orderDetail.current ? (
                <OrderShareModal
                    visible={showShareModal}
                    onClose={toggeShareModal}
                    order={orderDetail.current}
                    decimals={decimals}
                    pairConfig={pairConfig}
                    sharedPnL={sharedPnL}
                    ref={triggerShareRef}
                />
            ) : (
                <Modal visible={showShareModal} onClose={toggeShareModal}>
                    <div className="flex flex-col items-center">
                        <LoadingIcon className="w-20 h-20" />
                        <Text variant="secondary" className="text-md mt-3">
                            System processing, please try again later.
                        </Text>
                        <div className="mt-6 w-full">
                            <Button className="h-11" variant="secondary" onClick={onGoHistory}>
                                History
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default OrderCloseAlertModal;
