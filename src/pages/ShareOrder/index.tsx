import { formatNumber2, futuresProfit, getQueryParam, getRefLink } from '@/helper';
import { useMemo, useRef, useState } from 'react';
import OrderShareImage from '../Futures/components/TradeHistory/Order/OrderShareImage';
import { toast } from 'react-toastify';
import WebApp from '@twa-dev/sdk';
import { IPost } from '@/type/feed.type';
import ShareOrderSignalImageContent from '@/components/shared-ui/ShareOrderSignalImageModal/ShareOrderSignalImageContent';
import Button from '@/components/common/Button';

const ShareOrder = () => {
    const orderRef = useRef<{ getFile: () => Promise<File | null | undefined> }>(null);
    const { order, pairConfig, decimals, ticker, user, feeConfig, isFeed, avatarExt } = useMemo(() => {
        const params = JSON.parse(decodeURIComponent(getQueryParam('params') || '') || '{}');
        return {
            order: params?.order,
            pairConfig: params?.pairConfig,
            decimals: params?.decimals,
            ticker: params?.ticker,
            user: params?.user,
            feeConfig: params?.feeConfig,
            sharedPnL: params?.sharedPnL,
            isFeed: params?.isFeed,
            avatarExt: params?.avatarExt
        };
    }, []);

    const isSharingRef = useRef(false);

    const [hiddenBtn, setHiddenBtn] = useState(false);

    const downloadFile = (file: File) => {
        try {
            const a = document.createElement('a');
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = `${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.log(error);
        }
    };
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const onShare = async () => {
        if (isSharingRef.current) return;
        isSharingRef.current = true;
        try {
            await orderRef.current?.getFile();
            const file = await orderRef.current?.getFile();
            const { profit, percent } = futuresProfit(order, ticker);
            const sign = profit > 0 ? '+' : '';
            if (!file) {
                return;
            }
            const data = isFeed
                ? {
                      files: [file],
                      title: '',
                      text: `Scrolling & Trading on @hopium_trade, the 1st Social Perp ever on Telegram. \n \n😎 Join me on #HOPIUM: ${getRefLink(
                          user?.referralCode || ''
                      )}`
                  }
                : {
                      text: `Flexing my trade on #Hopium\nROI: ${sign}${percent}%.\nPnL: ${sign}${formatNumber2(
                          profit,
                          decimals.symbol
                      )}\nStart seamless Perp trading on Telegram and join the $HOPIUM Trade-to-Airdrop now! ${getRefLink(user?.referralCode || '')}`,
                      title: "Here's a file to share",
                      files: [file]
                  };
            if (navigator.share && navigator.canShare(data)) {
                navigator
                    .share(data)
                    .then(() => {
                        toast.success('Share Successfully!');
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error('Share Canceled');
                    })
                    .finally(() => {
                        WebApp.close();
                        window.close();
                        isSharingRef.current = false;
                    });
            } else {
                downloadFile(file);
            }
        } catch (error) {
            alert(error);
            onClose();
        }
    };
    const onClose = () => window.close();

    if (!order || !pairConfig) return null;

    return (
        <div className="flex flex-col w-full h-full pt-5">
            <div className="sm:max-w-[390px] w-full h-full flex flex-col justify-between  m-auto bg-background-1 p-4">
                {isFeed === true ? (
                    <ShareOrderSignalImageContent
                        post={order as IPost}
                        ref={orderRef}
                        user={user}
                        avatarExt={avatarExt}
                        pairConfig={pairConfig}
                        decimals={decimals}
                    />
                ) : (
                    <OrderShareImage
                        ref={orderRef}
                        order={order}
                        decimals={decimals}
                        pairConfig={pairConfig}
                        ticker={ticker}
                        user={user}
                        feeConfig={feeConfig}
                        onClose={onClose}
                    />
                )}
                {!hiddenBtn && (
                    <div className="h-20">
                        <Button
                            variant="primary"
                            ref={buttonRef}
                            className="mt-4 py-3"
                            onClick={() => {
                                setHiddenBtn(true);
                                onShare();
                            }}
                        >
                            Share now
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareOrder;
