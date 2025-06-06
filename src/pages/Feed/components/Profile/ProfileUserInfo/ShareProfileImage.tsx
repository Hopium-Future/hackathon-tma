import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import DomToImage from 'dom-to-image';

import LogoIcon from '@/components/icons/LogoIcon';
import UserRole from '@/components/common/UserRole';
import BorderCard from '@/components/common/BorderCard';
import { PARTNER_TYPE } from '@/helper/constant';
import { cn, formatBigNum, formatNumber, getProxyImageUrl, truncateText } from '@/helper';
import { IEarningData, IPostUser } from '@/type/feed.type';

interface ShareProfileImageRef {
    target?: HTMLDivElement | null;
    getFile: () => Promise<File | null | undefined>;
}

interface ShareProfileImageProps {
    avatarExt: string | null;
    userProfileStore: IPostUser | null;
    earningStore: IEarningData | null;
}

interface IEarningItem {
    title: string;
    value: string;
    valueClassName?: string;
}

const ShareProfileImage = forwardRef<ShareProfileImageRef, ShareProfileImageProps>(({ avatarExt, userProfileStore, earningStore }, ref) => {
    const imgRef = useRef<HTMLDivElement>(null);
    const displayname = userProfileStore?.username || `${userProfileStore?.firstName} ${userProfileStore?.lastName}`;

    const earningList: IEarningItem[] = useMemo(
        () => [
            {
                title: 'winrate',
                value: `${formatNumber(earningStore?.winRate || 0, 2)}%`,
                valueClassName: cn(earningStore?.winRate && 'text-green-1')
            },
            {
                title: `${earningStore?.timeframe} pnl`,
                value: `${formatBigNum(earningStore?.profit || 0, 4, true)} USDT`,
                valueClassName: cn({
                    'text-green-1': earningStore?.profit && earningStore.profit > 0,
                    'text-red-1': earningStore?.profit && earningStore.profit < 0
                })
            },
            {
                title: 'roi',
                value: `${formatNumber(earningStore?.roi || 0, 2)}%`,
                valueClassName: cn({
                    'text-green-1': earningStore?.roi && earningStore.roi > 0,
                    'text-red-1': earningStore?.roi && earningStore.roi < 0
                })
            },
            {
                title: 'copy/counter',
                value: `${(earningStore?.copies || 0) + (earningStore?.counters || 0)}`,
                valueClassName: cn((earningStore?.copies || earningStore?.counters) && 'text-pure-white')
            }
        ],
        [earningStore]
    );

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
        <div className="h-full overflow-auto">
            <div ref={imgRef} className="inline-flex max-w-[400px] w-full flex-col aspect-square p-[10px] mx-auto  rounded-lg overflow-hidden bg-green-1">
                <div className="w-full h-full bg-[url(/images/bg-share-signal-v1.png)] bg-contain bg-no-repeat">
                    <div className="flex items-end justify-between px-[35px]">
                        <div className="mb-3 flex items-center gap-[2px] flex-1">
                            <LogoIcon className="size-3 text-pure-white" />
                            <span className="text-xs font-bold text-pure-white">HOPIUM</span>
                        </div>
                        <img
                            crossOrigin="anonymous"
                            src={userProfileStore?.photoUrl ? getProxyImageUrl(userProfileStore.photoUrl) + `&a.${avatarExt}` : '/images/avatar.png'}
                            alt=""
                            className="size-20 rounded-full border shrink-0"
                        />
                        <div className="mb-3 text-right flex flex-col text-sub text-xs flex-1">
                            <span>
                                {new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </span>
                            <span>
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center mt-2">
                        <UserRole
                            isLoading={false}
                            partnerName={Object.keys(PARTNER_TYPE)[userProfileStore?.partnerType || 0]?.toLowerCase()}
                            partnerType={userProfileStore?.partnerType}
                            className="capitalize"
                        />
                        <h1 className="text-lg font-bold uppercase mt-1">{truncateText(displayname, 20)}</h1>
                        <div className="mt-2 flex items-center gap-x-[25px] text-sm relative">
                            <div className="flex flex-col items-center px-[9px]">
                                <span className="text-sub">Following</span>
                                <span className="font-bold">{formatNumber(userProfileStore?.following)}</span>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[26px] bg-divider" />
                            <div className="flex flex-col items-center px-[9px]">
                                <span className="text-sub">Follower</span>
                                <span className="font-bold">{formatNumber(userProfileStore?.followers || 0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-5 px-8">
                        {earningList.map(({ title, value, valueClassName }, idx) => (
                            <BorderCard
                                key={idx}
                                outsideDotClassName="bg-pure-black after:bg-green-1"
                                insideDotClassName="bg-green-1"
                                className="flex flex-col items-center gap-[2px] border-green-1 h-10 bg-linear--dark-green-2"
                            >
                                <span className="text-xs uppercase font-medium text-sub">{title}</span>
                                <span className={cn('text-sm font-bold', valueClassName)}>{value}</span>
                            </BorderCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ShareProfileImage;
