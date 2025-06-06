import useFuturesConfig from '@/stores/futures.store';
import Chart from './components/Chart';
import PlaceOrder from './components/PlaceOrder';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { cn, getDecimalPrice } from '@/helper';
import { getAssetConfig, getPairConfig } from '@/selectors';
import { lazy, useEffect, useMemo, useRef, useState } from 'react';
import Balance from './components/Balance';
import ShareOrderSignalSuccessModal from '@/components/shared-ui/ShareOrderSignalSuccessModal';
import { LOCAL_STORAGE_KEY } from '@/helper/constant';
import ShareOrderSignalImageModal from '@/components/shared-ui/ShareOrderSignalImageModal';
import { sharePostApi } from '@/apis/feed.api';
import { OrderShareModalRef } from './components/TradeHistory/Order/OrderShareModal';
const TradeHistory = lazy(() => import('./components/TradeHistory'));

const Futures = () => {
    const params = useParams();
    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, params?.pair));
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, pairConfig?.quoteAssetId));
    const showShareOrderSignalSuccessModal = useFuturesConfig((state) => state.showShareOrderSignalSuccessModal);
    const newPost = useFuturesConfig((state) => state.newPost);
    const setShowShareOrderSignalSuccessModal = useFuturesConfig((state) => state.setShowShareOrderSignalSuccessModal);
    const setOrdersShared = useFuturesConfig((state) => state.setOrdersShared);
    const [openShareImageModal, setOpenShareImageModal] = useState(false);
    const triggerShareRef = useRef<OrderShareModalRef>(null);
    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            symbol: assetConfig?.assetDigit
        };
    }, [pairConfig, assetConfig]);

    useEffect(() => {
        const orderShared = localStorage.getItem(LOCAL_STORAGE_KEY.ORDERS_SHARED);
        setOrdersShared(orderShared ? orderShared.split(',') : []);
    }, []);

    const containerClassName = 'flex flex-col gap-2 px-3';
    return (
        <FuturesWrapper className="h-full">
            <div id="place-order" className={cn(containerClassName, 'pt-4 gap-4')}>
                <div className="flex flex-col gap-2 flex-1">
                    <Balance pairConfig={pairConfig} decimals={decimals} />
                    <Chart pairConfig={pairConfig} decimals={decimals} />
                </div>
                <PlaceOrder pairConfig={pairConfig} decimals={decimals} />
            </div>
            <div id="trade-history" className={cn(containerClassName)}>
                <TradeHistory />
            </div>
            <ShareOrderSignalSuccessModal
                visible={showShareOrderSignalSuccessModal}
                onClose={() => setShowShareOrderSignalSuccessModal(false)}
                onShareImage={() => {
                    setOpenShareImageModal(true);
                    setTimeout(() => {
                        triggerShareRef.current?.onShare();
                    }, 1500);
                }}
            />
            {newPost && (
                <ShareOrderSignalImageModal
                    open={openShareImageModal}
                    post={newPost}
                    onSuccess={() => sharePostApi(newPost.id)}
                    onFinished={() => setOpenShareImageModal(false)}
                    onCancel={() => setOpenShareImageModal(false)}
                    ref={triggerShareRef}
                />
            )}
        </FuturesWrapper>
    );
};
const FuturesWrapper = styled.section`
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    #place-order,
    #trade-history {
        overflow: auto;
        scroll-snap-align: start;
        height: 100%;
    }
`;

export default Futures;
