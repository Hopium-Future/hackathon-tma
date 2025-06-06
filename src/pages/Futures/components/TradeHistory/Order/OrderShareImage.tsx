import LogoIcon from '@/components/icons/LogoIcon';
import { cn, formatNumber2, futuresProfit, getProxyImageUrl, truncateText } from '@/helper';
import useFuturesConfig from '@/stores/futures.store';
import useUserStore from '@/stores/user.store';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { DecimalsFuturesType, OrderFutures, PairConfig, STATUS_FUTURES, Ticker } from '@/type/futures.type';
import DomToImage from 'dom-to-image';
import { User } from '@/type/auth.type';
import AssetLogo from '@/components/common/AssetLogo';
import OrderProfit from './OrderProfit';

interface OrderShareImageProps {
    order: OrderFutures;
    pairConfig: PairConfig;
    decimals: DecimalsFuturesType;
    ticker?: Ticker;
    user?: User;
    feeConfig?: { open: number; close: number };
    onClose?: VoidFunction;
    sharedPnL?: boolean;
    onShare?: VoidFunction;
    shareBtn?: boolean;
    loading?: boolean;
    setIsShare?: React.Dispatch<React.SetStateAction<boolean>>;
    isShare?: boolean;
}
interface OrderShareImageRef {
    target?: HTMLDivElement | null;
    getFile: () => Promise<File | null | undefined>;
}
const OrderShareImage = forwardRef<OrderShareImageRef, OrderShareImageProps>(({ order, pairConfig, decimals, ticker: _ticker, user: _user }, ref) => {
    const isHistory = order.status === STATUS_FUTURES.CLOSED;
    const user = useUserStore((state) => _user || state.user);
    const ticker = useFuturesConfig((state) => _ticker || (isHistory ? null : state.tickers[order.symbol]));
    const image = useRef<HTMLDivElement>(null);
    const [avatarExt, setAvatarExt] = useState('');
    const { profit } = futuresProfit(order, ticker);
    useEffect(() => {
        const fetchImageType = async () => {
            if (!user?.photoUrl) return;
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
        fetchImageType();
    }, []);
    const getFile = async () => {
        const el = image.current;
        if (!el) return null;
        try {
            const scale = 2;
            const option = {
                height: el.offsetHeight * scale,
                width: el.offsetWidth * scale,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${el.offsetWidth}px`,
                    height: `${el.offsetHeight}px`
                }
            };
            const blob = await DomToImage.toBlob(el, option);
            return new File([blob], `${Date.now()}.png`, { type: blob.type });
        } catch (error) {
            console.log(error);
        }
    };
    useImperativeHandle(ref, () => ({
        target: image.current,
        getFile: getFile
    }));
    const isBuy = order.side === 'Buy';
    return (
        <div className={cn('h-full', 'overflow-auto')}>
            <div
                ref={image}
                className={cn(
                    'inline-flex max-w-[400px] w-full flex-col aspect-square p-[10px] mx-auto  rounded-lg overflow-hidden',
                    profit > 0 ? 'bg-green-1' : 'bg-red-1'
                )}
            >
                <div className="w-full h-full bg-[url(/images/bg-share-signal-v1.png)] bg-contain bg-no-repeat">
                    <div className="flex items-end justify-between px-[35px]">
                        <div className="mb-3 flex items-center gap-[2px] flex-1">
                            <LogoIcon className="size-3 text-pure-white" />
                            <span className="text-xs font-bold text-pure-white">HOPIUM</span>
                        </div>
                        <img
                            crossOrigin="anonymous"
                            src={
                                user?.photoUrl || order.user_metadata.photo_url
                                    ? getProxyImageUrl(user?.photoUrl || order.user_metadata.photo_url) + `&a.${avatarExt}`
                                    : '/images/avatar.png'
                            }
                            alt=""
                            className="size-20 rounded-full border shrink-0"
                        />
                        <div className="mb-3 text-right flex flex-col text-sub text-xs flex-1">
                            <span>
                                {new Date(order.created_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </span>
                            <span>
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-main">
                        <span className="mb-1 text-lg uppercase line-clamp-1">
                            {truncateText(order?.user_metadata?.username || user?.username || `${user?.firstName} ${user?.lastName}`)}
                        </span>
                    </p>

                    <div className="flex items-center justify-center gap-10 mt-[36px] mb-5">
                        {pairConfig && (
                            <>
                                <div className="flex items-center gap-2">
                                    <AssetLogo
                                        useProxy
                                        assetId={pairConfig?.baseAssetId}
                                        size={36}
                                        className={`border ${isBuy ? 'border-green-1' : 'border-red-1'}`}
                                    />
                                    <div>
                                        <span className="block text-main font-bold text-base">{pairConfig.baseAsset}</span>
                                        <div className="flex gap-1 text-md">
                                            <span className={`uppercase ${isBuy ? 'text-green-1' : 'text-red-1'}`}>{isBuy ? 'long' : 'short'}</span>
                                            <span className="text-main">{order.leverage}x</span>
                                        </div>
                                    </div>
                                </div>
                                {(order.status === STATUS_FUTURES.CLOSED || order.status === STATUS_FUTURES.ACTIVE) && (
                                    <div className="flex flex-col">
                                        <span className="text-base text-sub">{order.status === STATUS_FUTURES.CLOSED ? 'PnL' : 'Current PnL'}</span>
                                        <div className="text-md">
                                            {order.status === STATUS_FUTURES.CLOSED ? (
                                                <span className={`${profit >= 0 ? 'text-green-1' : 'text-red-1'}`}>
                                                    {profit >= 0 ? '+' : '-'}
                                                    {formatNumber2(Math.abs(profit), decimals?.symbol || 4)} {pairConfig?.quoteAsset}
                                                </span>
                                            ) : (
                                                <OrderProfit {...order} quoteAsset={pairConfig?.quoteAsset} decimals={decimals} />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-center mt-[36px] px-[30px] text-center">
                        <div className="border-r border-divider flex-1">
                            <span className="text-sub text-sm block">Entry Price</span>
                            <span className="text-sm text-main font-bold">{formatNumber2(order.open_price || order.price, decimals.price)}</span>
                        </div>
                        <div className="flex-1">
                            <span className="text-sub text-sm block">{order.status === STATUS_FUTURES.CLOSED ? 'Closed Price' : 'Market Price'}</span>
                            <span className="text-sm font-bold text-main">{formatNumber2(order.close_price || ticker?.lastPrice, decimals.price)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default OrderShareImage;
