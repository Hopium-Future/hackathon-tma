import { useCallback, useEffect, useMemo, useState } from 'react';

import Chip from '@/components/common/chip';
import Campaigns from './components/Campaigns';
import { getEarnCampaignApi } from '@/apis/earn.api';
import useCampaignStore from '@/stores/campaign.store';
import { CAMPAIGN_TABS } from '@/helper/constant';
import { cn } from '@/helper';

const Campaign = () => {
    const { setCampaigns, campaigns } = useCampaignStore();
    const [tab, setTab] = useState(CAMPAIGN_TABS.LIVE);

    const tabs = useMemo(() => {
        return [
            {
                _id: 1,
                title: 'Live',
                value: CAMPAIGN_TABS.LIVE
            },
            {
                _id: 2,
                title: 'Upcoming',
                value: CAMPAIGN_TABS.UPCOMING
            }
        ];
    }, []);

    const getNo = useCallback(
        (status: number) => {
            return campaigns.filter((c) => c.status === status).length;
        },
        [campaigns]
    );

    const handleChangeTab = (tab: number) => {
        setTab(tab);
    };

    useEffect(() => {
        const getCampignInformation = async () => {
            try {
                const campaign = await getEarnCampaignApi();
                setCampaigns(campaign.data);
            } catch (error) {
                console.log('Error fetching campaign data', error);
            }
        };

        getCampignInformation();
    }, []);

    return (
        <section>
            <div className="flex items-center gap-[6px] my-3">
                {tabs.map((item) => (
                    <Chip
                        key={item._id}
                        active={item.value === tab}
                        onClick={() => handleChangeTab(item.value)}
                        className={cn({ 'tex-white font-bold': item.value === tab })}
                    >
                        {item.title} ({Array.isArray(campaigns) && getNo(item.value)})
                    </Chip>
                ))}
            </div>
            <Campaigns type={tab} />
        </section>
    );
};

export default Campaign;
