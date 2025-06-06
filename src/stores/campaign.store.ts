
import { Campaign } from '@/type/campaign.type';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
type Store = {
    campaigns: Campaign[],
    setCampaigns: (campaigns: Campaign[]) => void,
    getCampaignByType: (type: number) => Campaign[];
};

const useCampaignStore = create<Store>()(

    immer(
        (set, get) => ({
            campaigns: [],
            setCampaigns: (campaigns) => {
                set((state) => {
                    state.campaigns = campaigns;
                });
            },
            getCampaignByType: (type: number) => {
                return get().campaigns.filter((campaign) => campaign.status === type);
            },
        })
    ),
);

export default useCampaignStore;
