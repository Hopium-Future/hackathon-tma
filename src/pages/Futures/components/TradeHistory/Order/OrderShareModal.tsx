import Modal from '@/components/common/modal';
import { DecimalsFuturesType, FeeType, OrderFutures, PairConfig } from '@/type/futures.type';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { toast } from 'react-toastify';
import WebApp from '@twa-dev/sdk';
import OrderShareImage from './OrderShareImage';
import { ROUTES } from '@/routing/router';
import useFuturesConfig from '@/stores/futures.store';
import useUserStore from '@/stores/user.store';
import { cn, formatNumber2, futuresProfit, getRefLink } from '@/helper';
import useFeeConfig from '@/hooks/useFeeConfig';

interface OrderShareModalProps {
    visible: boolean;
    onClose: VoidFunction;
    order: OrderFutures;
    decimals: DecimalsFuturesType;
    pairConfig?: PairConfig;
    sharedPnL?: boolean;
}

export interface OrderShareModalRef {
    onShare: () => Promise<void>;
}
const OrderShareModal = forwardRef<OrderShareModalRef, OrderShareModalProps>(({ visible, onClose, order, decimals, pairConfig }: OrderShareModalProps, ref) => {
    const orderRef = useRef<{ getFile: () => Promise<File | null | undefined> }>(null);
    const { feeConfig } = useFeeConfig(FeeType.TAKER, order?.partner_type);
    const isSharingRef = useRef(false);

    const goToBrowser = (shared: boolean) => {
        onClose();

        const ticker = useFuturesConfig.getState().tickers[order.symbol];
        const { profit } = futuresProfit(order, ticker);
        const user = useUserStore.getState().user;

        const params = {
            symbol: order.symbol,
            status: order.status,
            side: order.side,
            leverage: order.leverage,
            open_price: order.open_price,
            close_price: order.close_price,
            opened_at: order.opened_at,
            profit: profit,
            margin: order.margin,
            quantity: order.quantity,
            fee: order.fee,
            created_at: order.created_at,
            user_metadata: {
                username: user?.username,
                photo_url: user?.photoUrl
            }
        };

        const queryString = encodeURIComponent(
            JSON.stringify({
                order: params,
                decimals,
                pairConfig: {
                    baseAsset: pairConfig?.baseAsset,
                    quoteAsset: pairConfig?.quoteAsset,
                    symbol: pairConfig?.symbol,
                    baseAssetId: pairConfig?.baseAssetId
                },
                ticker: { lastPrice: useFuturesConfig.getState().tickers[order.symbol].lastPrice },
                user: { username: user?.username, firstName: user?.firstName, lastName: user?.lastName, referralCode: user?.referralCode },
                feeConfig: { open: feeConfig.open, close: feeConfig.close },
                sharedPnL: shared
            })
        );
        const baseUrl = `${document.location.origin}${ROUTES.SHARE_ORDER}?params=${queryString}`;

        WebApp.openLink(baseUrl);
    };

    const onShare = async () => {
        if (isSharingRef.current) return;
        isSharingRef.current = true;

        try {
            const file = await orderRef.current?.getFile();
            if (!file) {
                return;
            }
            const ticker = useFuturesConfig.getState().tickers[order.symbol];
            const { profit, percent } = futuresProfit(order, ticker);
            const user = useUserStore.getState().user;
            const sign = profit > 0 ? '+' : '';
            const fileShare = {
                text: `Flexing my trade on #Hopium\nROI: ${sign}${percent}%.\nPnL: ${sign}${formatNumber2(
                    profit,
                    decimals.symbol
                )}\n \nStart seamless Perp trading on Telegram and join the $HOPIUM Trade-to-Airdrop now! \n ${getRefLink(user?.referralCode || '')}`,
                title: "Here's a file to share",
                files: [file]
            };
            if (navigator.share && navigator.canShare(fileShare)) {
                await navigator
                    .share(fileShare)
                    .then(() => {
                        toast.success('Share Successfully!');
                    })
                    .catch((err) => {
                        toast.error('Share Canceled!');
                        console.log(err);
                    })
                    .finally(() => {
                        onClose();
                        isSharingRef.current = false;
                    });
            } else {
                goToBrowser(true);
                onClose();
            }
        } catch (error) {
            console.log(error);
            return;
        }
    };
    useImperativeHandle(ref, () => ({
        onShare: onShare
    }));
    return (
        <Modal
            visible={visible}
            onClose={() => {
                onClose();
            }}
            isClose
            className={cn('top-12 max-h-[calc(100vh-40px)]')}
            containerClassName={cn('overflow-auto flex flex-col !bg-background-1 h-full')}
        >
            {pairConfig && (
                <OrderShareImage
                    ref={orderRef}
                    order={order}
                    decimals={decimals}
                    pairConfig={pairConfig}
                    onClose={onClose}
                    sharedPnL
                    shareBtn
                    loading={false}
                    onShare={onShare}
                />
            )}
        </Modal>
    );
});

export default OrderShareModal;
