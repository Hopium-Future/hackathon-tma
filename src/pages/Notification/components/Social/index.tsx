import AddFriendIcon from '@/components/icons/AddFriendIcon';
import { SOCIAL_TYPE } from './contanst';
import PaperIcon from '@/components/icons/PaperIcon';
import RuningIcon from '@/components/icons/RuningIcon';
import RadioTowerIcon from '@/components/icons/RadioTowerIcon';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { CrossOrigin } from '@/components/common/AssetLogo';
import { replaceContentSocial } from './helper';
import useFuturesConfig from '@/stores/futures.store';
import { getAssetConfig, getPairConfig } from '@/selectors';
import { cn, formatNumber2, getDecimalPrice, getS3Url } from '@/helper';
import { useCallback, useMemo, useState } from 'react';
import { TDataSocial } from './types';
import AvatarStack from '../AvatarStack';
import useUserStore from '@/stores/user.store';
import { OrderFutures, PairConfig, SIDE_FUTURES } from '@/type/futures.type';
import AddVolumeModal from '@/pages/Futures/components/AddVolume/AddVolumeModal';
import OrderEditSLTPModal from '@/pages/Futures/components/TradeHistory/Order/OrderEditSLTPModal';
import OrderDetailModal from '@/pages/Futures/components/TradeHistory/Order/OrderDetailModal';

import getTimeDiff from '../../utils';
import { Divider } from '../..';
import useProfileFeedStore from '@/stores/profileFeed.store';
import { formatBigNum } from '../../../../helper/index';
import { getOrderDetail } from '@/apis/notification.api';
import { toast } from 'react-toastify';
const SocialContent = ({ content, data, pairConfig }: { content: string; data: TDataSocial; pairConfig: PairConfig }) => {
    const url = getS3Url(`/images/coins/${pairConfig.baseAssetId}.png`);
    const crossOrigin: CrossOrigin | undefined = 'anonymous';

    const option = {
        alt: `logo-${pairConfig.baseAssetId}-${12}`,
        src: url,
        width: 12,
        height: 12,
        crossOrigin,
        className: cn('rounded-full')
    };
    const replacedContent = replaceContentSocial(content, {
        Icon_side: `<div className="flex items-center flex-row" style="display:flex; align-items:center; column-gap:4px; margin-right:4px;"><div className="p-0.5 border border-divider rounded-[4px] mr-1.5 inline" style="padding:2px; border: 1px solid #2B2B37; border-radius: 4px;">
                <svg
                    style="${data.context.side === SIDE_FUTURES.SELL ? 'color:#FF2B42; rotate:180deg;' : 'color:#3BD975;'}"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 25 24"
                    fill="none"
                    
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.5 18.8037H13.5V4.00771H11.5V5.99991H9.5V7.99991H11.5V18.8037ZM9.5 7.99991L7.5 7.99991V9.99991H9.5L9.5 7.99991ZM13.5 7.99991H15.5V5.99991H13.5V7.99991ZM15.5 7.99991L15.5 9.99991H17.5V7.99991L15.5 7.99991ZM17.5 11.9999H19.5V9.99992H17.5V11.9999ZM5.5 11.9999H7.5V9.99992H5.5V11.9999Z"
                        fill="currentColor"
                    />
                </svg>
            </div>`,
        Icon_symbol: `<img src=${option.src} width="16" height="16" className="inline" style="border-radius:9999px; width:16px; height:16px;"/> </div>`
    });

    return <div dangerouslySetInnerHTML={{ __html: replacedContent }} className="flex items-start flex-col gap-y-1.5"></div>;
};

const SocialTab = ({ data }: { data: TDataSocial }) => {
    const setShowProfileModal = useUserStore((state) => state.setShowProfileModal);
    const [showAddVolumeModal, setShowAddVolumeModal] = useState(false);
    const [showModalEditTPSL, setShowModalEditTPSL] = useState(false);
    const [openDetailPositionModal, setOpenDetailPositionModal] = useState(false);
    const setIsCallList = useProfileFeedStore((state) => state.setIsCallList);
    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, data.context?.symbol_name || 'BTCUSDT'));
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, pairConfig?.quoteAssetId));
    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            symbol: assetConfig?.assetDigit
        };
    }, [pairConfig, assetConfig]);
    const [order, setOrder] = useState<OrderFutures>();

    const handleGetOrder = useCallback(
        async (orderId: number) => {
            try {
                const res = await getOrderDetail({ orderId });
                if (res.data) {
                    setOrder(res.data);
                    switch (data.type) {
                        case SOCIAL_TYPE.FUTURES_EDIT_TP_SL: {
                            return setShowModalEditTPSL(true);
                        }
                        case SOCIAL_TYPE.FUTURE_CANCEL_SEND_TO_COPIER:
                        case SOCIAL_TYPE.FUTURE_CLOSE_SEND_TO_COPIER: {
                            return setOpenDetailPositionModal(true);
                        }
                    }
                }
            } catch (err) {
                toast.error("Can't get order detail");
            }
        },
        [data, setShowModalEditTPSL, setOpenDetailPositionModal]
    );
    const handleOnClick = useCallback(() => {
        switch (data.type) {
            case SOCIAL_TYPE.FUTURE_LIQUIDATE_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_HIT_SL_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_HIT_TP_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_OPENED_SEND_TO_COPIER:
            case SOCIAL_TYPE.FOLLOWING_TP:
            case SOCIAL_TYPE.FOLLOWING_PROFIT:
            case SOCIAL_TYPE.FUTURES_CALLING: {
                setIsCallList(true);
                return setShowProfileModal(true, data.context.userId);
            }
            case SOCIAL_TYPE.NEW_FOLLOWERS:
            case SOCIAL_TYPE.NEW_FOLLOWER:
            case SOCIAL_TYPE.NEW_COPIER: {
                return setShowProfileModal(true, data.context.userId);
            }
            case SOCIAL_TYPE.FUTURES_ADD_VOL: {
                return setShowAddVolumeModal(true);
            }
            case SOCIAL_TYPE.FUTURES_EDIT_TP_SL:
            case SOCIAL_TYPE.FUTURE_CANCEL_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_CLOSE_SEND_TO_COPIER: {
                return handleGetOrder(data.context.order?.displaying_id || 0);
            }
            default: {
                return;
            }
        }
    }, [data, setShowProfileModal, setIsCallList]);
    const renderIcon = useMemo(() => {
        switch (data.type) {
            case SOCIAL_TYPE.NEW_FOLLOWER:
            case SOCIAL_TYPE.NEW_FOLLOWERS:
            case SOCIAL_TYPE.NEW_REFFERAL:
            case SOCIAL_TYPE.NEW_REFFERALS: {
                return <AddFriendIcon width={20} height={20} className="w-5 h-5" />;
            }
            case SOCIAL_TYPE.FUTURES_CALLING: {
                return <RadioTowerIcon width={20} height={20} className="w-5 h-5" />;
            }
            case SOCIAL_TYPE.NEW_COPIER: {
                return <RuningIcon width={20} height={20} className="w-5 h-5" />;
            }
            default: {
                return <PaperIcon width={20} height={20} className="w-5 h-5" />;
            }
        }
    }, [data]);

    const renderAvatar = useMemo(() => {
        if (Array.isArray(data.context.photoUrl)) {
            return (
                <div>
                    <AvatarStack avatars={data.context.photoUrl} />
                </div>
            );
        }
        if (data.type === SOCIAL_TYPE.NEW_REFFERAL || data.type === SOCIAL_TYPE.NEW_REFFERALS) {
            <LazyLoadImage
                src={data.context.photoUrl || '/images/avatar.png'}
                alt={data.context.userName}
                width={32}
                height={32}
                className="w-8 h-8 border border-pure-black rounded-full"
            />;
        }
        return (
            <LazyLoadImage
                src={data.context.photoUrl || '/images/avatar.png'}
                alt={data.context.userName}
                width={32}
                height={32}
                className="w-8 h-8 border border-pure-black rounded-full"
            />
        );
    }, [data]);

    const renderContent = useMemo(() => {
        switch (data.type) {
            case SOCIAL_TYPE.FOLLOWING_PROFIT:
            case SOCIAL_TYPE.FOLLOWING_TP:
            case SOCIAL_TYPE.FUTURE_CLOSE_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_CANCEL_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_HIT_TP_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_HIT_SL_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_LIQUIDATE_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURE_OPENED_SEND_TO_COPIER:
            case SOCIAL_TYPE.FUTURES_EDIT_TP_SL:
            case SOCIAL_TYPE.FUTURES_ADD_VOL:
            case SOCIAL_TYPE.FUTURES_CALLING: {
                return (
                    <div className="flex flex-col gap-y-3 items-start">
                        <div className="text-md">
                            <SocialContent content={data.content} data={data} pairConfig={pairConfig as PairConfig} />
                            <div className="border mt-3 border-divider rounded-md p-1.5 flex items-center justify-between min-w-[206px] gap-x-[22px] w-max bg-background-2">
                                <div className="flex items-center gap-x-1 font-bold">
                                    <p className="px-1 py-0.5 text-main text-sm uppercase bg-divider rounded-[4px] ">VOL</p>
                                    <p className="text-main text-sm">${formatBigNum(data.context.volume || 0, 2, true)}</p>
                                </div>
                                <div className="flex items-end gap-x-[22px]  font-bold">
                                    {data.context.percent_tp ? (
                                        <div className="flex items-center gap-x-1">
                                            <p className="text-sm  text-green-1">{formatNumber2(data.context.percent_tp, 2)}%</p>
                                            <p className="px-1 py-0.5 text-green-1 bg-green-2 text-sm uppercase rounded-[4px]">TP</p>
                                        </div>
                                    ) : null}
                                    {data.context.percent_sl ? (
                                        <div className="flex items-center gap-x-1">
                                            <p className="text-sm  text-red-1">{formatNumber2(data.context.percent_sl, 2)}%</p>
                                            <p className="px-1 py-0.5 text-red-1 bg-red-2 text-sm uppercase rounded-[4px]">SL</p>
                                        </div>
                                    ) : null}
                                    {data.context.pnl ? (
                                        <div className="flex items-center gap-x-1">
                                            <p className={cn('text-sm', data.context.pnl > 0 ? 'text-green-1' : 'text-red-1')}>
                                                {formatNumber2(data.context.pnl || 0, 4)} USDT
                                            </p>
                                            <p className="px-1 py-0.5 text-green-1 bg-green-2 text-sm uppercase rounded-[4px]">PNL</p>
                                        </div>
                                    ) : null}
                                    {data.context.unPnl ? (
                                        <div className="flex items-center gap-x-1">
                                            <p className={cn('text-sm', data.context.unPnl > 0 ? 'text-green-1' : 'text-red-1')}>
                                                {formatNumber2(data.context.unPnl || 0, 4)} USDT
                                            </p>
                                            <p className="px-1 py-0.5 text-green-1 bg-green-2 text-sm uppercase rounded-[4px]">Unpnl</p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        {data.context.caller_description ? <div className="italic text-md text-sub font-light">{data.context.caller_description}</div> : null}
                    </div>
                );
            }
            default: {
                return <div className="text-md" dangerouslySetInnerHTML={{ __html: data.content }}></div>;
            }
        }
    }, [data, pairConfig]);

    

    return (
        <>
            <AddVolumeModal
                visible={showAddVolumeModal}
                pairConfig={pairConfig}
                order={data.context.order}
                onClose={() => setShowAddVolumeModal(false)}
                decimals={decimals}
            />
            <OrderEditSLTPModal
                visible={showModalEditTPSL}
                onClose={() => setShowModalEditTPSL(false)}
                order={order as OrderFutures}
                decimals={decimals}
                pairConfig={pairConfig}
                isNotice
            />
            {order && openDetailPositionModal && (
                <OrderDetailModal
                    visible={openDetailPositionModal}
                    onClose={() => {
                        setOpenDetailPositionModal(false);
                        setOrder(undefined);
                    }}
                    decimals={decimals}
                    order={order}
                    pairConfig={pairConfig}
                    isNotice
                />
            )}
            <div className="flex flex-col items-start gap-y-3 " onClick={handleOnClick}>
                <div className="flex gap-x-[14px] items-center">
                    <div className="py-1.5 w-8">{renderIcon}</div>
                    <div>{renderAvatar}</div>
                </div>
                <div className="flex gap-x-[14px] items-start">
                    <div className="opacity-50 text-white text-[12px] leading-4 font-bold w-8">{getTimeDiff(data.createdAt)}</div>
                    <div>{renderContent}</div>
                </div>
            </div>
            <Divider />
        </>
    );
};
export default SocialTab;
