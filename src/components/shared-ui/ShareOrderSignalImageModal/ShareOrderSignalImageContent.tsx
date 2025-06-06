import AssetLogo from '@/components/common/AssetLogo';
import SideTag from '@/components/common/SideTag';
import LogoIcon from '@/components/icons/LogoIcon';
import { cn, formatNumber2, getProxyImageUrl, truncateText } from '@/helper';
import { getRatioSLTP } from '@/helper/futures';
import OrderProfit from '@/pages/Futures/components/TradeHistory/Order/OrderProfit';
import { User } from '@/type/auth.type';
import { IPost } from '@/type/feed.type';
import { PairConfig, SIDE_FUTURES, STATUS_FUTURES } from '@/type/futures.type';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import DomToImage from 'dom-to-image';

type TProps = {
    post: IPost;
    user: User;
    avatarExt: string | null;
    pairConfig: PairConfig | undefined;
    decimals: {
        price: number;
        symbol: number | undefined;
    };
};
interface OrderShareImageRef {
    target?: HTMLDivElement | null;
    getFile: () => Promise<File | null | undefined>;
}
const ShareOrderSignalImageContent = forwardRef<OrderShareImageRef, TProps>(({ post, user, avatarExt, pairConfig, decimals }, ref) => {
    const { futureOrder: order } = post;
    const imgRef = useRef<HTMLDivElement>(null);
    const isBuy = order.side === SIDE_FUTURES.BUY;
    const displayname = user.username || `${user.firstName} ${user.lastName}`;
    const isClosedOrder = order.status === STATUS_FUTURES.CLOSED;
    const isActiveOrder = order.status === STATUS_FUTURES.ACTIVE;
    const orderProfit = order?.raw_profit ?? order.profit;

    const renderStatusShared = useCallback(() => {
        if (isClosedOrder) {
            return <SideTag side="center" className="border-disable" contentClassName="bg-disable" title="Closed" />;
        }
        if (isActiveOrder) {
            return <SideTag side="end" title="Position" />;
        }
        return <SideTag side="start" className="border-yellow-1" contentClassName="bg-yellow-1" title="Open Order" />;
    }, [post]);
    const getFile = async () => {
        const el = imgRef.current;
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
        target: imgRef.current,
        getFile: getFile
    }));
    return (
        <div ref={imgRef} className={cn('inline-flex max-w-[400px] w-full aspect-[334/342] p-[10px] mx-auto rounded-lg overflow-hidden', 'bg-green-1')}>
            <div className="w-full h-full bg-[url(/images/bg-share-signal-feed-v1.png)] bg-contain bg-no-repeat">
                <div className="flex items-end justify-between px-[35px]">
                    <div className="mb-3 flex items-center gap-[2px] flex-1">
                        <LogoIcon className="size-3 text-pure-white" />
                        <span className="text-xs font-bold text-pure-white">HOPIUM</span>
                    </div>
                    <img
                        crossOrigin="anonymous"
                        src={
                            user?.photoUrl || order.user_metadata.photo_url
                                ? getProxyImageUrl(user.photoUrl || order.user_metadata.photo_url) + `&a.${avatarExt}`
                                : '/images/avatar.png'
                        }
                        alt=""
                        className="size-20 rounded-full border shrink-0"
                    />
                    <div className="mb-3 text-right flex flex-col text-sub text-xs flex-1">
                        <span>
                            {new Date(post.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                        <span>
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                <p className="mt-2 text-center text-main">
                    <span className="mb-1 text-sm line-clamp-1">{truncateText(displayname)}</span>
                    <span className="block uppercase text-lg font-bold">follow my call</span>
                </p>

                <p className="px-6 text-center text-sm italic mt-1 font-jetbrains">{post.caption}</p>

                <div className="flex items-center justify-center gap-10 mt-6">
                    {pairConfig && (
                        <>
                            <div className="flex items-center gap-2">
                                <AssetLogo
                                    useProxy
                                    assetId={pairConfig.baseAssetId}
                                    size={36}
                                    className={`border ${isBuy ? 'border-green-1' : 'border-red-1'}`}
                                    isLazyLoading={false}
                                />
                                <div>
                                    <span className="block text-main font-bold text-base">{pairConfig.baseAsset}</span>
                                    <div className="flex gap-1 text-md">
                                        <span className={`uppercase ${isBuy ? 'text-green-1' : 'text-red-1'}`}>{isBuy ? 'long' : 'short'}</span>
                                        <span className="text-main">{order.leverage}x</span>
                                    </div>
                                </div>
                            </div>
                            {(isClosedOrder || isActiveOrder) && (
                                <div className="flex flex-col">
                                    <span className="text-base text-sub">{isClosedOrder ? 'PnL' : 'Current PnL'}</span>
                                    <div className="text-md">
                                        {isClosedOrder ? (
                                            <span className={`${orderProfit >= 0 ? 'text-green-1' : 'text-red-1'}`}>
                                                {orderProfit >= 0 ? '+' : '-'}
                                                {formatNumber2(Math.abs(orderProfit), decimals?.symbol || 4)} {pairConfig?.quoteAsset}
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

                <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs text-sub">Status:</span>
                    {renderStatusShared()}
                </div>

                <div className="flex items-center justify-center mt-6 px-[30px] text-center">
                    <div className="border-r border-divider flex-1">
                        <span className="text-sub text-sm block">Entry Price</span>
                        <span className="text-sm text-main font-bold">{formatNumber2(order.open_price || order.price, decimals.price)}</span>
                    </div>
                    {order.status === STATUS_FUTURES.CLOSED ? (
                        <div className="flex-1">
                            <span className="text-sub text-sm block">Closed Price</span>
                            <span className="text-sm font-bold text-main">{formatNumber2(order.close_price, decimals.price)}</span>
                        </div>
                    ) : (
                        <>
                            <div className="border-r border-divider flex-1">
                                <span className="text-sub text-sm block">TP PnL</span>
                                <span className="text-sm font-bold text-green-1">{order.tp ? `+${getRatioSLTP({ price: order.tp, order })}%` : '-'}</span>
                            </div>
                            <div className="flex-1">
                                <span className="text-sub text-sm block">SL PnL</span>
                                <span className="text-sm font-bold text-red-1">{order.sl ? `${getRatioSLTP({ price: order.sl, order })}%` : '-'}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ShareOrderSignalImageContent;
