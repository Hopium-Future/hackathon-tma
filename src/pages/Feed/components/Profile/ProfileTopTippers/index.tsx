import { memo, useCallback, useEffect, useState } from 'react';

import TopTipperItem from './TopTipperItem';
import { getTopStarById } from '@/apis/feed.api';
import useUserStore from '@/stores/user.store';
import { ITopStar } from '@/type/feed.type';

const TopTippers = () => {
    const [topStars, setTopStars] = useState<ITopStar[]>([]);
    const userProfileId = useUserStore((state) => state.userProfileId);

    const fetchTopStars = useCallback(
        async (userId: number) => {
            if (!userProfileId) return;
            try {
                const data = await getTopStarById(userId);

                if (data.data) {
                    setTopStars(data.data);
                }
            } catch (error) {
                console.log('Get top tipper failed: ', error);
            }
        },
        [userProfileId]
    );

    useEffect(() => {
        userProfileId && fetchTopStars(userProfileId);
    }, [fetchTopStars, userProfileId]);

    return (
        <div className="mt-7 mb-6">
            <h2 className="text-lg font-bold uppercase">TOP TIPPERS</h2>
            <div className="mt-2 space-y-2">
                <TopTipperItem
                    numberTopTip="1"
                    avatar={topStars[0]?.photoUrl}
                    username={topStars[0]?.username}
                    totalStars={topStars[0]?.totalStars}
                    firstName={topStars[0]?.firstName}
                    lastName={topStars[0]?.lastName}
                />
                <TopTipperItem
                    numberTopTip="2"
                    avatar={topStars[1]?.photoUrl}
                    username={topStars[1]?.username}
                    totalStars={topStars[1]?.totalStars}
                    firstName={topStars[1]?.firstName}
                    lastName={topStars[1]?.lastName}
                />
                <TopTipperItem
                    numberTopTip="3"
                    avatar={topStars[2]?.photoUrl}
                    username={topStars[2]?.username}
                    totalStars={topStars[2]?.totalStars}
                    firstName={topStars[2]?.firstName}
                    lastName={topStars[2]?.lastName}
                />
            </div>
        </div>
    );
};

export default memo(TopTippers);
