import { memo, useEffect, useState } from 'react';

import AchievementTrophyItem from './AchievementTrophyItem';
import AchievementMedalItem from './AchievementMedalItem';
import useUserStore from '@/stores/user.store';
import { getAchievementsProfile } from '@/apis/feed.api';
import { HALL_LEADERBOARD_TAB } from '@/helper/constant';
import { IAchievementsData } from '@/type/feed.type';

const ProfileAchievement = () => {
    const userProfileId = useUserStore((state) => state.userProfileId);
    const [loading, setLoading] = useState(true);
    const [achievementsData, setAchievementData] = useState<IAchievementsData | null>(null);

    const fetchData = async (userId: number) => {
        try {
            const res = await getAchievementsProfile(userId);
            if (res.data) {
                setAchievementData(res.data);
            }
        } catch (error) {
            console.log('Get achievement failed!!!! : ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        userProfileId && fetchData(userProfileId);
        // eslint-disable-next-line
    }, [userProfileId]);

    return (
        <div className="mt-6">
            <h2 className="text-lg font-bold uppercase mb-4">achievement</h2>
            <div className="flex flex-wrap items-center justify-center gap-[7.33px]">
                {loading
                    ? Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="size-[84px] rounded bg-disable/25 animate-pulse" />)
                    : Object.values(HALL_LEADERBOARD_TAB).map((type) => (
                          <AchievementTrophyItem key={type} type={type} achievement={achievementsData?.trophy?.[type]} />
                      ))}
            </div>

            {loading ? (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="w-20 h-[30px] rounded-3xl bg-disable/25 animate-pulse" />
                    ))}
                </div>
            ) : Object.keys(achievementsData?.medal || {}).length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {Object.values(HALL_LEADERBOARD_TAB).map(
                        (type) => achievementsData?.medal?.[type] && <AchievementMedalItem key={type} type={type} achievement={achievementsData.medal[type]} />
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default memo(ProfileAchievement);
