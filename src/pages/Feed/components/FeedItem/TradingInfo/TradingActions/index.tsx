import { memo, useRef, useState } from 'react';

import { cn } from '@/helper';
import TradingActionModal from './TradingActionModal';
import { IPost, ITradeType, ITradingData } from '@/type/feed.type';
import { DecimalsFuturesType, PairConfig } from '@/type/futures.type';
import TradingActionSuccessModal from './TradingActionSuccessModal';
import ShareOrderSignalSuccessModal from '@/components/shared-ui/ShareOrderSignalSuccessModal';
import { TRADE_TYPE } from '@/helper/constant';
import ShareOrderSignalImageModal from '@/components/shared-ui/ShareOrderSignalImageModal';
import { sharePostApi } from '@/apis/feed.api';
import ShareOrderSignalModal from '@/components/shared-ui/ShareOrderSignalModal';
import useFuturesConfig from '@/stores/futures.store';
import { OrderShareModalRef } from '@/pages/Futures/components/TradeHistory/Order/OrderShareModal';

interface ITradingActionsProps {
    post: IPost;
    decimals: DecimalsFuturesType;
    pairConfig?: PairConfig;
}

const TradingActions = ({ decimals, post, pairConfig }: ITradingActionsProps) => {
    const { futureOrder: order, engagement } = post;
    const [tradeType, setTradeType] = useState<ITradeType | null>(null);
    const [tradingData, setTradingData] = useState<ITradingData | undefined>(undefined);
    const [showTradingActionModal, setShowTradingActionModal] = useState(false);
    const [showShareSignalSuccessModal, setShowShareSignalSuccessModal] = useState(false);
    const [showTradingActionSuccessModal, setShowTradingActionSuccessModal] = useState(false);
    const [openShareImageModal, setOpenShareImageModal] = useState(false);
    const [copies, setCopies] = useState(engagement?.copies || 0);
    const [counters, setCounters] = useState(engagement?.counters || 0);
    const [newPost, setNewPost] = useState<IPost | null>(null);
    const [showShareOrderSignalModal, setShowShareOrderSignalModal] = useState(false);
    const newOrderId = useFuturesConfig((state) => state.newOrderCreatedId);
    const setNewOrderCreatedId = useFuturesConfig((state) => state.setNewOrderCreatedId);
    const triggerShareRef = useRef<OrderShareModalRef>(null);
    const buttonStyles = 'basis-1/2 flex items-center justify-center gap-1 rounded-lg font-bold uppercase text-pure-black text-md hover:opacity-75';

    const onClickTradeButton = (type: ITradeType) => {
        setTradeType(type);
        setShowTradingActionModal(true);
    };

    const onTradingSuccess = (data: ITradingData) => {
        setShowTradingActionModal(false);
        if (data.metadata.side === TRADE_TYPE.copy) {
            setCopies((prev) => prev + 1);
        } else {
            setCounters((prev) => prev + 1);
        }
        setTradingData(data);
        setShowTradingActionSuccessModal(true);
    };

    const onShare = () => {
        setShowTradingActionSuccessModal(false);
        setShowShareOrderSignalModal(true);
    };

    const onShareFinished = (isSuccess: boolean, data: IPost) => {
        setNewOrderCreatedId(null);
        setShowShareOrderSignalModal(false);
        if (isSuccess) {
            setNewPost(data);
            setShowShareSignalSuccessModal(true);
        }
    };

    const onShareImage = () => {
        setShowShareSignalSuccessModal(false);
        setOpenShareImageModal(true);
        setTimeout(() => {
            triggerShareRef.current?.onShare();
        }, 1500);
    };

    return (
        <>
            <div className="mt-2 h-7 flex gap-2">
                <button className={cn(buttonStyles, 'bg-green-1')} onClick={() => onClickTradeButton('copy')}>
                    <span>copy</span>
                    <span>({copies})</span>
                </button>
                <button className={cn(buttonStyles, 'bg-red-1')} onClick={() => onClickTradeButton('counter')}>
                    <span>counter</span>
                    <span>({counters})</span>
                </button>
            </div>

            <TradingActionModal
                onSuccess={onTradingSuccess}
                tradeType={tradeType || TRADE_TYPE.copy}
                visible={showTradingActionModal}
                onClose={() => setShowTradingActionModal(false)}
                order={order}
                decimals={decimals}
                pairConfig={pairConfig}
            />

            {pairConfig && (
                <TradingActionSuccessModal
                    order={tradingData}
                    decimals={decimals}
                    pairConfig={pairConfig}
                    visible={showTradingActionSuccessModal}
                    onClose={() => setShowTradingActionSuccessModal(false)}
                    onShare={onShare}
                />
            )}
            {newOrderId && (
                <ShareOrderSignalModal
                    visible={showShareOrderSignalModal}
                    onClose={() => setShowShareOrderSignalModal(false)}
                    orderId={newOrderId}
                    onFinished={onShareFinished}
                    useDebounce
                />
            )}
            <ShareOrderSignalSuccessModal
                visible={showShareSignalSuccessModal}
                onClose={() => setShowShareSignalSuccessModal(false)}
                onShareImage={onShareImage}
            />
            {newPost && (
                <ShareOrderSignalImageModal
                    ref={triggerShareRef}
                    open={openShareImageModal}
                    post={newPost}
                    onSuccess={() => sharePostApi(newPost.id)}
                    onFinished={() => setOpenShareImageModal(false)}
                    onCancel={() => setOpenShareImageModal(false)}
                />
            )}
        </>
    );
};

export default memo(TradingActions);
