import AssetLogo from '@/components/common/AssetLogo';
import GiftIcon from '@/components/icons/GiftIcon';
import UserIcon from '@/components/icons/UserIcon';
import { cn, formatNumber2 } from '@/helper';
import { CAMPAIGN_TABS } from '@/helper/constant';
import { Campaign } from '@/type/campaign.type';
import { differenceInDays, format, startOfDay } from 'date-fns';
import { FC, Fragment, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import Box from './Box';

type CampaignItemProps = {
    className?: string;
    type: number;
    campaign: Campaign;
};

const CampaignItem: FC<CampaignItemProps> = ({ className, type, campaign }) => {

    const diff = useMemo(() => {
        const { endDate } = campaign;
        const end = new Date(endDate);
        const today = startOfDay(new Date());
        return differenceInDays(end, today);
    }, [campaign]);

    const description = useMemo(() => {
        if (type === CAMPAIGN_TABS.LIVE) {
            return `Ends in: ${diff} days left`;
        }
        if (type === CAMPAIGN_TABS.UPCOMING) {
            return `Start in: ${format(campaign.startDate, "dd/MM/yyyy")}`;
        }
        return `${123} Participants`;
    }, [type, campaign]);

    const navigation = useNavigate();
    const routeToDetail = () => {
        navigation(`/campaign/${campaign.id}`);
    };

    return (
        <button onClick={routeToDetail} className="w-full">
            <section className={
                cn(
                    "relative",
                    className
                )
            }>
                {/* border pixel */}
                <>
                    <section className={
                        cn(
                            "size-0.5 absolute bg-pure-black top-0 left-0",
                            "after:absolute after:contents-[''] after:size-[1px] after:bg-green-3 after:bottom-0 after:right-0 after:block"
                        )
                    } />
                    <section className={
                        cn(
                            "size-0.5 absolute bg-pure-black top-0 right-0",
                            "after:absolute after:contents-[''] after:size-[1px] after:bg-green-3 after:bottom-0 after:left-0 after:block"
                        )
                    } />
                    <section className={
                        cn(
                            "size-0.5 absolute bg-pure-black bottom-0 left-0",
                            "after:absolute after:contents-[''] after:size-[1px] after:bg-green-3 after:top-0 after:right-0 after:block"
                        )
                    } />
                    <section className={
                        cn(
                            "size-0.5 absolute bg-pure-black bottom-0 right-0",
                            "after:absolute after:contents-[''] after:size-[1px] after:bg-green-3 after:top-0 after:left-0 after:block"
                        )
                    } />
                </>
                <>
                    <section className="absolute size-[1px] bg-divider top-1 left-1"></section>
                    <section className="absolute size-[1px] bg-divider top-1 right-1"></section>
                    <section className="absolute size-[1px] bg-divider bottom-1 left-1"></section>
                    <section className="absolute size-[1px] bg-divider bottom-1 right-1"></section>
                </>

                <section className={
                    cn(
                        "border border-divider bg-background-2 box-border h-full flex flex-col justify-start items-start w-full p-3"
                    )
                }>
                    <div className="flex items-center">
                        <div className={
                            cn(
                                "size-7 mr-3 relative",
                                type === CAMPAIGN_TABS.LIVE && "after:absolute after:top-[1px] after:right-[1px] after:contents-[''] after:rounded-full after:size-[7px] after:bg-green-1 after:border-[1.5px] after:border-background-2",
                                type === CAMPAIGN_TABS.ENDED && "before:absolute before:inset-0 before:rounded-full before:size-7 before:bg-background-3 before:bg-opacity-70"
                            )
                        }>
                            <LazyLoadImage
                                src={campaign.logo}
                                alt={campaign.title}
                                width={28}
                                height={28}
                                className="size-7 object-cover rounded-full"
                            />
                        </div>
                        <div className="">
                            <p className={
                                cn(
                                    "text-main text-md",
                                    type === CAMPAIGN_TABS.ENDED ? "text-disable" :
                                        "text-main"
                                )
                            }>{campaign.title}</p>
                            <p className={
                                cn(
                                    "text-xs mt-0.5 flex items-center gap-1",
                                    type === CAMPAIGN_TABS.LIVE && "text-green-1",
                                    type === CAMPAIGN_TABS.UPCOMING && "text-yellow-1",
                                    type === CAMPAIGN_TABS.ENDED && "text-disable",
                                )
                            }>
                                {
                                    type === CAMPAIGN_TABS.ENDED && <UserIcon className="size-2.5 text-disable" />
                                }
                                <span>{description}</span>
                            </p>
                        </div>
                    </div>

                    <Box
                        className="mt-[14px] w-full"
                        wrapper="background-2"
                        border="divider"
                        bg="pure-black"
                    >
                        <GiftIcon className={
                            cn(
                                "size-4 text-green-1 mr-[6px]",
                                type === CAMPAIGN_TABS.ENDED ? "text-disable" : "text-green-1"
                            )
                        } />
                        <div className="flex items-center text-main gap-1">
                            {
                                campaign.totalReward.map((item, index) => {
                                    return <Fragment key={item.assetId}>
                                        <div className="flex items-center gap-1">
                                            <span className={
                                                cn(
                                                    "font-bold text-md",
                                                    type === CAMPAIGN_TABS.ENDED ? "text-disable" : "text-green-1"
                                                )
                                            }>{formatNumber2(item.assetQuantity)}</span>
                                            <div className={cn(
                                                "size-3 mr-3 relative",
                                                type === CAMPAIGN_TABS.ENDED && "before:absolute before:inset-0 before:rounded-full before:size-3 before:bg-background-3 before:bg-opacity-70"
                                            )}>
                                                <AssetLogo assetId={item.assetId} className="size-3" />
                                            </div>
                                        </div>
                                        {
                                            index < campaign.totalReward.length - 1 && <div>-</div>
                                        }
                                    </Fragment>;
                                })
                            }
                        </div>
                    </Box>
                </section>
            </section>
        </button>
    );
};

export default CampaignItem;
