import { UIEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { differenceInDays, format, startOfDay } from 'date-fns';

import Leaderboard from './Leaderboard';
import Rules from './Rules';
import Box from '@/components/common/Box';
import UserIcon from '@/components/icons/UserIcon';
import LoadingIcon from '@/components/icons/LoadingIcon';
import ArrowIcon from '@/components/icons/ArrowIcon';
import { getEarnCampaignDetailsApi } from '@/apis/earn.api';
import { BOX_STATUS, CAMPAIGN_DETAIL_TABS, CAMPAIGN_TABS, EARN_TAB } from '@/helper/constant';
import { cn } from '@/helper';
import { ROUTES } from '@/routing/router';
import { Campaign } from '@/type/campaign.type';

const CampaignDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [campaign, setCampaign] = useState<Campaign>();
    const [tab, setTab] = useState(CAMPAIGN_DETAIL_TABS.RULES);
    const [isEnd, setIsEnd] = useState(window.innerHeight >= 840);

    const description = useMemo(() => {
        switch (campaign?.status) {
            case CAMPAIGN_TABS.LIVE:
                return <p className="text-sm text-pure-white">Ends in: </p>;

            case CAMPAIGN_TABS.UPCOMING:
                return <p className="text-sm text-pure-white">Start in: </p>;

            default:
                return null;
        }
    }, [campaign]);

    const diff = useMemo(() => {
        if (campaign) {
            const { endDate } = campaign;
            const end = new Date(endDate);
            const today = startOfDay(new Date());
            return differenceInDays(end, today);
        }
        return 0;
    }, [campaign]);

    const time = useMemo(() => {
        switch (campaign?.status) {
            case CAMPAIGN_TABS.LIVE:
                return (
                    <Box type={BOX_STATUS.IN_PROGRESS}>
                        <p className="text-md text-green-1 mx-3">{diff} days left</p>
                    </Box>
                );

            case CAMPAIGN_TABS.UPCOMING:
                return (
                    <Box type={BOX_STATUS.UPCOMING}>
                        <p className="text-md text-yellow-1 mx-3">{format(campaign.startDate, 'dd/MM/yyyy')}</p>
                    </Box>
                );

            default:
                return (
                    <Box type={BOX_STATUS.ENDED}>
                        <p className="text-md text-red-1 mx-3">Campaign is over</p>
                    </Box>
                );
        }
    }, [campaign, diff]);

    const tabs = useMemo(() => {
        return [
            {
                _id: 1,
                title: 'rules',
                value: CAMPAIGN_DETAIL_TABS.RULES
            },
            {
                _id: 2,
                title: 'leaderboard',
                value: CAMPAIGN_DETAIL_TABS.LEADERBOARD
            }
        ];
    }, []);

    const handleChangeTab = (tab: string) => {
        setTab(tab);
    };

    const handleEnd = (end: boolean) => {
        setIsEnd(end);
    };

    const onScroll = (e: UIEvent<HTMLElement>) => {
        const obj = e.currentTarget;
        if (obj.scrollTop >= obj.scrollHeight - obj.offsetHeight - 1) {
            handleEnd(true);
        } else {
            handleEnd(false);
        }
    };

    useEffect(() => {
        const getCamPaign = async () => {
            try {
                if (id) {
                    const res = await getEarnCampaignDetailsApi(+id);
                    setCampaign(res.data);
                }
            } catch (error) {
                console.log('Error fetching campaign data', error);
            }
        };

        getCamPaign();
    }, [id]);

    return !campaign ? (
        <div className="flex flex-col items-center justify-center h-full">
            <LoadingIcon />
        </div>
    ) : (
        <section className={cn('h-full overflow-y-scroll overflow-x-hidden hide-scrollbar', !isEnd && 'blur-to-bottom')} onScroll={onScroll}>
            <div className="sticky top-0 z-10 bg-pure-black">
                <button className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => navigate(`${ROUTES.EARN}?tab=${EARN_TAB.CAMPAIGN}`)}>
                    <ArrowIcon className="size-6" />
                </button>
                <h2 className="flex items-center justify-center leading-9 px-3 pb-5 pt-4 uppercase font-bold text-2xl text-main">rules</h2>
            </div>
            <div
                className={cn(
                    'size-full max-h-[120px] relative',
                    campaign?.status === CAMPAIGN_TABS.ENDED &&
                        'before:absolute before:inset-0 before:size-full before:max-h-[120px] before:bg-background-3 before:bg-opacity-50'
                )}
            >
                <LazyLoadImage src={campaign?.background} alt={campaign?.title} width={120} height={120} className="size-full object-cover" />
            </div>

            <div className="bg-pure-black pb-5 relative py-3">
                <div className="absolute -top-[50px] px-3">
                    <div
                        className={cn(
                            'size-[100px] rounded-full border-[3px] border-pure-black relative box-border',
                            campaign?.status === CAMPAIGN_TABS.LIVE &&
                                "after:absolute after:top-[5px] after:right-[5px] after:contents-[''] after:rounded-full after:size-4 after:bg-green-1 after:border-[2.5px] after:border-pure-black",
                            campaign?.status === CAMPAIGN_TABS.ENDED &&
                                'before:absolute before:-top-[3px] before:rounded-full before:size-[100px] before:bg-background-3 before:bg-opacity-50 before:-left-[3px] before:border-[3px] before:border-pure-black'
                        )}
                    >
                        <LazyLoadImage src={campaign?.logo} alt={campaign?.title} width={100} height={100} className="size-[94px] object-cover rounded-full" />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-[6px] px-3">
                    {description}
                    {time}
                </div>

                <p className="text-2xl font-bold text-main mt-[22px] uppercase px-3">{campaign?.title}</p>
                {campaign?.status === CAMPAIGN_TABS.ENDED ? (
                    <div className="flex items-center gap-1 mt-2 text-sm text-main px-3">
                        <UserIcon className="size-2.5 text-green-1" />
                        <p>{123} Participants</p>
                    </div>
                ) : null}
                <section className="mt-4 px-3">
                    <div className="border-[0.5px] rounded border-divider flex items-center w-full justify-between px-5">
                        {tabs.map((item) => {
                            return (
                                <button
                                    onClick={() => handleChangeTab(item.value)}
                                    key={item._id}
                                    className={cn(
                                        'uppercase font-medium border-b flex-1 py-[9px]',
                                        item.value === tab ? 'text-main border-b-white' : 'text-disable border-transparent'
                                    )}
                                >
                                    {item.title}
                                </button>
                            );
                        })}
                    </div>
                </section>
                {tab === CAMPAIGN_DETAIL_TABS.RULES && <Rules data={campaign?.ruleContent || ''} />}
                {tab === CAMPAIGN_DETAIL_TABS.LEADERBOARD && <Leaderboard />}
            </div>
        </section>
    );
};

export default CampaignDetail;
