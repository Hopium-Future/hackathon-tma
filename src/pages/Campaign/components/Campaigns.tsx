import { cn } from '@/helper';
import { FC, Fragment, UIEvent, useEffect, useState } from 'react';
import CampaignItem from './Item';
import useCampaignStore from '@/stores/campaign.store';
import { Campaign } from '@/type/campaign.type';

type CampaignsProps = {
    type: number;
};
const Campaigns: FC<CampaignsProps> = ({ type }) => {
    const [getCampaignByType, list] = useCampaignStore(
        state => [state.getCampaignByType, state.campaigns]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    const [isEnd, setIsEnd] = useState(false);
    const onScroll = (e: UIEvent<HTMLElement>) => {
        const obj = e.target as HTMLElement;
        if (obj.scrollTop >= (obj.scrollHeight - obj.offsetHeight - 1)) {
            setIsEnd(true);
        } else {
            setIsEnd(false);
        }
    };

    useEffect(() => {        
        setCampaigns(getCampaignByType(type));
    }, [list, type]);

    return (
        <section
            className={
                cn(
                    "mt-3 size-full max-h-[calc(100vh-325px)] pb-7 overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2 hide-scrollbar",
                    !isEnd && "[mask-image:linear-gradient(to_bottom,transparent,black_0%,black_90%,transparent)]"
                )
            }
            onScroll={onScroll}
        >
            {
                campaigns.map((campaign) => {
                    return <Fragment key={campaign.id}>
                        <CampaignItem type={type} campaign={campaign} />
                    </Fragment>;
                })
            }
        </section>
    );
};

export default Campaigns;