import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Modal from '@/components/common/modal';
import useFuturesConfig from '@/stores/futures.store';
import { cn, futuresProfit, getDecimalPrice, getProxyImageUrl, getRefLink } from '@/helper';
import { getAssetConfig, getPairConfig } from '@/selectors';
import { FeeType } from '@/type/futures.type';
import { IPost } from '@/type/feed.type';
import useUserStore from '@/stores/user.store';
import WebApp from '@twa-dev/sdk';
import { ROUTES } from '@/routing/router';
import useFeeConfig from '@/hooks/useFeeConfig';
import ShareOrderSignalImageContent from './ShareOrderSignalImageContent';
import { toast } from 'react-toastify';
import { OrderShareModalRef } from '@/pages/Futures/components/TradeHistory/Order/OrderShareModal';

interface IProps {
    post: IPost;
    open: boolean;
    onFinished: () => void;
    onSuccess: () => void;
    onCancel: () => void;
}

const ShareOrderSignalImageModal = forwardRef<OrderShareModalRef, IProps>(({ post, open, onFinished, onSuccess, onCancel }: IProps, ref) => {
    const { futureOrder: order, user } = post;
    const imgRef = useRef<{ getFile: () => Promise<File | null | undefined> }>(null);
    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, post.symbol));
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, pairConfig?.quoteAssetId));
    const decimals = {
        price: getDecimalPrice(pairConfig),
        symbol: assetConfig?.assetDigit
    };
    const { feeConfig } = useFeeConfig(FeeType.TAKER, order.partner_type);
    const userStore = useUserStore.getState().user;
    const [avatarExt, setAvatarExt] = useState<string | null>(null);
    const isSharingRef = useRef(false);
    const isReady = !!avatarExt;

    const goToBrowser = (shared: boolean) => {
        const user = useUserStore.getState().user;
        const { profit } = futuresProfit(order, useFuturesConfig.getState().tickers[order.symbol]);
        const queryString = encodeURIComponent(
            JSON.stringify({
                order: {
                    ...post,
                    futureOrder: {
                        ...order,
                        profit,
                        user_metadata: {
                            username: post.user.username,
                            photoUrl: post.user.photoUrl
                        }
                    }
                },
                decimals,
                pairConfig: {
                    baseAsset: pairConfig?.baseAsset,
                    quoteAsset: pairConfig?.quoteAsset,
                    symbol: pairConfig?.symbol,
                    baseAssetId: pairConfig?.baseAssetId
                },
                ticker: { lastPrice: useFuturesConfig.getState().tickers[order.symbol].lastPrice },
                user: {
                    username: order.user_metadata?.username,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    referralCode: user?.referralCode,
                    photoUrl: post.user.photoUrl
                },
                feeConfig: { open: feeConfig.open, close: feeConfig.close },
                sharedPnL: shared,
                isFeed: true,
                avatarExt
            })
        );
        const baseUrl = `${document.location.origin}${ROUTES.SHARE_ORDER}?params=${queryString}`;
        WebApp.openLink(baseUrl);
        onSuccess();
        onFinished();
    };

    const shareImage = async () => {
        if (!imgRef.current || !isReady || isSharingRef.current) return;
        isSharingRef.current = true;

        try {
            const fileToShare = (await imgRef.current.getFile()) as File;
            const data = {
                files: [fileToShare],
                title: '',
                text: `Scrolling & Trading on @hopium_trade, the 1st Social Perp ever on Telegram.\n \n 😎 Join me on #HOPIUM: ${getRefLink(
                    userStore?.referralCode || ''
                )}`
            };

            if (navigator.share && navigator.canShare(data)) {
                await navigator
                    .share(data)
                    .then(() => toast.success('Share Successfully!'))

                    .catch((err) => {
                        toast.error('Share Canceled');
                        console.log(err);
                        isSharingRef.current = false;
                    })
                    .finally(() => {
                        onFinished();
                        onSuccess();
                        isSharingRef.current = false;
                    });
            } else {
                goToBrowser(true);
                onFinished();
            }
        } catch (error: any) {
            console.log(error);
            return;
        }
    };
    useImperativeHandle(ref, () => ({
        onShare: shareImage
    }));
    useEffect(() => {
        const fetchImageType = async () => {
            if (!user.photoUrl) return;
            try {
                const res = await fetch(getProxyImageUrl(user.photoUrl));
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.startsWith('image')) return;
                let ext = contentType.split('/')[1] || user.photoUrl.split('.').pop() || 'jpg';

                switch (ext) {
                    case 'svg+xml':
                        ext = 'svg';
                        break;
                    case 'jpeg':
                        ext = 'jpg';
                        break;
                    default:
                        break;
                }
                setAvatarExt(ext);
            } catch (error) {
                console.error(error);
            }
        };

        if (open) {
            fetchImageType();
        }
    }, [open, isReady, imgRef, user, onFinished, onSuccess]);

    return (
        <Modal
            visible={open}
            onClose={onCancel}
            isClose
            className={cn(open ? 'top-12' : '')}
            containerClassName="max-h-[calc(100vh-40px)] h-full overflow-y-auto"
        >
            <ShareOrderSignalImageContent post={post} ref={imgRef} user={user} avatarExt={avatarExt} pairConfig={pairConfig} decimals={decimals} />
        </Modal>
    );
});

export default memo(ShareOrderSignalImageModal);
