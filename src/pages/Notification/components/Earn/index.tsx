import React from 'react';
import StarIcon from '@/components/icons/StarIcon';
import GiftIcon from '@/components/icons/GiftIcon';
import AvatarStack from '../AvatarStack';
import { EarnType, TDataEarn } from './types';
import { Card, CardContent, CardHeader, CardIcon } from '../Card';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { formatNumber } from '@/helper';
import { replaceContentEarn } from './helper';
import getTimeDiff from '../../utils';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routing/router';
import { PARTNER_TYPE } from '@/helper/constant';

const Divider = () => {
    return <div className="border-[0.5px] border-divider my-3" />;
};

type EarnTabProps = {
    data: any;
};
const EarnContent = ({ content }: { content: string }) => {
    const replacedContent = replaceContentEarn(content, {
        icon_pocket_money: `💰`
    });

    return <div dangerouslySetInnerHTML={{ __html: replacedContent }}></div>;
};

const EarnTab: React.FC<EarnTabProps> = ({ data }) => {
    const navigator = useNavigate();
    const typeClassNames = {
        [PARTNER_TYPE.NEWBIE]: 'text-sub',
        [PARTNER_TYPE.ROOKIE]: 'text-[#36A3B9]',
        [PARTNER_TYPE.DEGEN]: 'text-green-1',
        [PARTNER_TYPE.PRO]: 'text-[#BF7FFF]',
        [PARTNER_TYPE.ELITE]: 'text-[#E5A607]',
        [PARTNER_TYPE.LEGEND]: 'text-[#FF2B00]'
    };
    const template: Record<string, (item: TDataEarn) => JSX.Element> = {
        TIP_STAR: (item) => {
            return (
                <Card key={`earn_card_${item.type}`} onClick={() => navigator(ROUTES.EARN)}>
                    <CardHeader justify="start">
                        <CardIcon>
                            <StarIcon className="text-yellow-1" size="notification" />
                        </CardIcon>
                        <p className="text-center text-md font-bold text-sub">{getTimeDiff(item.createdAt)}</p>
                    </CardHeader>
                    <section>
                        <LazyLoadImage src={item.context.photoUrl as string} width={32} height={32} className="rounded-full" />
                        <CardContent>
                            <p className="space-x-1 flex items-center flex-wrap">
                                <span className="text-white font-bold">{item?.context.username}</span>
                                <span className="text-white">tipped you</span>
                                <StarIcon className="text-yellow-1" size="sm" />
                                <span className="text-white">
                                    {item?.context.amount} ~ {formatNumber(item.context.convertedAmount, 4)}
                                </span>
                                <LazyLoadImage src="/images/ton.png" width={16} height={16} />
                            </p>
                        </CardContent>
                    </section>
                </Card>
            );
        },
        TIP_STARS: (item) => {
            return (
                <Card key={`earn_card_${item.type}`} onClick={() => navigator(ROUTES.EARN)}>
                    <CardHeader justify="start">
                        <CardIcon>
                            <StarIcon className="text-yellow-1" size="notification" />
                        </CardIcon>
                        <p className="text-center text-md font-bold text-sub">{getTimeDiff(item.createdAt)}</p>
                    </CardHeader>
                    <section>
                        <AvatarStack avatars={item?.context.photoUrl as string[]} />
                        <CardContent>
                            <p className="space-x-1 flex items-center flex-wrap">
                                <span className="text-white">
                                    <span className="font-bold">{item?.context.username}</span> and {item.context.photoUrl.length - 1} others
                                </span>
                                <span className="text-white">tipped you</span>
                                <StarIcon className="text-yellow-1" size="sm" />
                                <span className="text-white">
                                    {item?.context.amount} ~ {formatNumber(item.context.convertedAmount, 4)}
                                </span>
                                <LazyLoadImage src="/images/ton.png" width={16} height={16} />
                            </p>
                        </CardContent>
                    </section>
                </Card>
            );
        },
        COMMISSION_REF: (item) => {
            return (
                <Card key={`earn_card_${item.type}`} onClick={() => navigator(ROUTES.EARN)}>
                    <CardHeader justify="start">
                        <CardIcon>
                            <GiftIcon className="text-green-1" size="notification" />
                        </CardIcon>
                        <p className="text-center text-md font-bold text-sub">{getTimeDiff(item.createdAt)}</p>
                    </CardHeader>
                    <section>
                        <LazyLoadImage src="/images/usdt.png" width={32} height={32} className="rounded-full w-8 h-8" />
                        <CardContent>
                            <EarnContent content={item.content} />
                        </CardContent>
                    </section>
                </Card>
            );
        },
        COMMISSION_SHARE: (item) => {
            return (
                <Card key={`earn_card_${item.type}`} onClick={() => navigator(ROUTES.EARN)}>
                    <CardHeader justify="start">
                        <CardIcon>
                            <GiftIcon className="text-green-1" size="notification" />
                        </CardIcon>
                        <p className="text-center text-md font-bold text-sub">{getTimeDiff(item.createdAt)}</p>
                    </CardHeader>
                    <section>
                        <LazyLoadImage src="/images/usdt.png" width={32} height={32} className="rounded-full w-8 h-8" />
                        <CardContent>
                            <EarnContent content={item.content} />
                        </CardContent>
                    </section>
                </Card>
            );
        },
        RANK_CHANGED: (item) => {
            return (
                <Card key={`earn_card_${item.type}`}>
                    <CardHeader justify="start">
                        <CardIcon>
                            <GiftIcon className="text-green-1" size="notification" />
                        </CardIcon>
                        <p className="text-center text-md font-bold text-sub">{getTimeDiff(item.createdAt)}</p>
                    </CardHeader>
                    <section>
                        <LazyLoadImage src="/images/usdt.png" width={32} height={32} className="rounded-full w-8 h-8" />
                        <CardContent>
                            <div className="flex items-center gap-x-1">
                                You reached <span className={`${typeClassNames[item?.context?.userType || 0]}`}>{item.context.tierName}</span> Tier & got
                                <span className="text-green-1 font-bold">{item.context.amountCUsdt} C-USDT</span>,
                                <span className="text-green-1 font-bold">{item.context.amountLUsdt} L-USDT</span>.
                            </div>
                        </CardContent>
                    </section>
                </Card>
            );
        }
    };
    const type = data?.type?.toUpperCase() as EarnType;
    const Component = template?.[type];
    if (!Component) return null;

    return (
        <>
            {Component(data)}
            <Divider />
        </>
    );
};
export default EarnTab;
