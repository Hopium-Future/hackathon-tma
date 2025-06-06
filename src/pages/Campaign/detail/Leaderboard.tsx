import { getEarnLeaderboardCampaignApi } from '@/apis/earn.api';
import AssetLogo from '@/components/common/AssetLogo';
import Box from '@/components/common/Box';
import BgLeftCampaign from '@/components/icons/BgLeftCampaign';
import BgLeftVolume from '@/components/icons/BgLeftVolume';
import BgRightCampaign from '@/components/icons/BgRightCampaign';
import BgRightVolume from '@/components/icons/BgRightVolume';
import { formatNumber2 } from '@/helper';
import { Me, Ranking } from '@/type/campaign.type';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Rank from './Rank';
import useUserStore from '@/stores/user.store';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Leaderboard = () => {
    const { id } = useParams();
    const { user } = useUserStore();
    const [leaderboard, setLeaderboard] = useState<Ranking[]>([]);
    const [me, setMe] = useState<Me>();

    useEffect(() => {
        const getCampaign = async () => {
            try {
                if (id) {
                    const res = await getEarnLeaderboardCampaignApi(+id);

                    setLeaderboard(res.data.ranking);
                    setMe(res.data.me);
                }
            } catch (error) {
                console.log('Error fetching campaign data', error);
            }
        };

        getCampaign();
    }, [id]);

    return (
        <>
            <div className="relative">
                <BgRightVolume className="h-[64px] w-[18px] absolute top-0 right-[4px]" />
                <BgLeftVolume className="h-[64px] w-[18px] absolute top-0 left-[4px]" />
                <div className="pt-6 flex items-center gap-1 justify-center">
                    <BgLeftCampaign className="h-[15px] w-[20px]" />
                    <p className="uppercase text-2xl font-bold text-main">TOP {id == '3' ? 'PNL' : 'VOLUME'}</p>
                    <BgRightCampaign className="h-[15px] w-[20px]" />
                </div>

                <div className="mt-6 flex items-center justify-between px-3">
                    <div className="flex items-center">
                        <div className="uppercase text-sm text-sub w-[52px]">rank</div>
                        <div className="uppercase text-sm text-sub">name</div>
                    </div>
                    <div className="uppercase text-sm text-sub">{id == '3' ? 'pnl' : 'volume'}</div>
                </div>
                {me ? (
                    <div className="relative h-8 mt-3 px-1">
                        <Box className="" classContent="justify-between px-2">
                            <div className="flex items-center">
                                <div className="text-md text-main w-[48px] pl-0.5">{me.rank}</div>
                                <div className="text-md text-main flex items-center gap-1">
                                    <LazyLoadImage
                                        src={user?.photoUrl}
                                        alt={user?.username}
                                        width={16}
                                        height={16}
                                        className="size-4 object-cover rounded-full"
                                    />
                                    <p>Me</p>
                                </div>
                            </div>
                            <div className="text-md text-main flex items-center gap-1">
                                <p>{formatNumber2(me.score)}</p>
                                <AssetLogo assetId={22} size={13} />
                            </div>
                        </Box>
                    </div>
                ) : null}
            </div>
            <div className="mt-3 flex flex-col gap-3 px-3">
                {leaderboard.map((item) => (
                    <Rank
                        key={item.username}
                        rank={item.rank}
                        volume={item.score}
                        name={item.username || `${item.firstName} ${item.lastName}`}
                        photoUrl={item.photoUrl}
                    />
                ))}
            </div>
        </>
    );
};

export default Leaderboard;
