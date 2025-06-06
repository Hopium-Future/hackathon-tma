import { memo, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Nodata from '@/components/common/nodata';
import LoadingIcon from '@/components/icons/LoadingIcon';
import FollowerItem from '../Onboarding/components/FollowerItem';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import useUserStore from '@/stores/user.store';
import useProfileFeedStore from '@/stores/profileFeed.store';
import { PROFILE_FOLLOW_TAB } from '@/helper/constant';
import { followUser, getFollowersProfile, getFollowingProfile, unFollowUser } from '@/apis/feed.api';
import Emitter from '@/helper/emitter';
import { TDataFollowOnboard } from '@/type/onboard.type';
import { IFollowTabType } from '@/type/feed.type';

interface IProps {
    tab: IFollowTabType;
}
interface IGetFollowList {
    page: number;
    tab: IFollowTabType;
    userId: number;
}

const FollowList = ({ tab }: IProps) => {
    // ------------------- STATES -------------------
    const PAGE_LIMIT = 20;

    const controllerRef = useRef<AbortController | null>(null);

    const [data, setData] = useState<{
        data: TDataFollowOnboard[];
        hasMore: boolean;
    }>({
        data: [],
        hasMore: false
    });

    const [pagination, setPagination] = useState(0);
    const [loading, setLoading] = useState(true);
    const time = useProfileFeedStore((state) => state.time);
    const userProfileId = useUserStore((state) => state.userProfileId);
    const setShowProfileModal = useUserStore((state) => state.setShowProfileModal);
    const setOpenModalFollower = useProfileFeedStore((state) => state.setOpenModalFollower);
    // <> -------------------------------------------

    const fetchFollowList = useCallback(async ({ page, tab, userId }: IGetFollowList) => {
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        try {
            const params = {
                userId,
                limit: PAGE_LIMIT,
                offset: page * PAGE_LIMIT
            };

            const res =
                tab === PROFILE_FOLLOW_TAB.FOLLOWING
                    ? await getFollowingProfile({ ...params, signal: controller.signal })
                    : await getFollowersProfile({ ...params, signal: controller.signal });

            if (res?.data) {
                setData((prev) => {
                    return {
                        data: [...prev.data, ...res.data.data],
                        hasMore: res.data.hasMore
                    };
                });
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFollow = useCallback(
        async (follower: TDataFollowOnboard) => {
            const { isFollowing, _id: followerId } = follower;
            const res = isFollowing ? await unFollowUser(followerId) : await followUser(followerId);

            if (res?.data?.success) {
                Emitter.emit('profile:following_updated', !isFollowing);

                setData((prev) => {
                    const newList = prev.data.map((item) =>
                        item._id === followerId
                            ? {
                                  ...item,
                                  isFollowing: !item.isFollowing,
                                  followers: isFollowing ? item.followers - 1 : (item.followers || 0) + 1
                              }
                            : item
                    );

                    return {
                        ...prev,
                        data: newList
                    };
                });
            }
        },
        [data]
    );

    useEffect(() => {
        if (userProfileId) {
            if (controllerRef.current) {
                controllerRef.current.abort(); // Abort the previous request
            }
            fetchFollowList({ page: pagination, userId: userProfileId, tab });
        }
    }, [pagination, tab, userProfileId, fetchFollowList]);

    return (
        <div id="t-follow-list" className="h-full overflow-y-scroll">
            <InfiniteScroll
                dataLength={data.data.length}
                next={() => setPagination((prev) => prev + 1)}
                loader={
                    loading ? (
                        <div className="flex items-center justify-center w-full py-3">
                            <LoadingIcon />
                        </div>
                    ) : null
                }
                hasMore={data.hasMore}
                scrollableTarget="t-follow-list"
            >
                <ul className="flex flex-col gap-y-4" id="t-follow-list">
                    {data.data?.length ? (
                        data.data.map((item, idx) => {
                            return (
                                <li key={`${item._id}_${idx}`}>
                                    <FollowerItem
                                        data={item}
                                        handleFollow={handleFollow}
                                        onClick={() => {
                                            setOpenModalFollower(false);
                                            setShowProfileModal(true, item._id);
                                        }}
                                        isFilterTime={time === '7d'}
                                    />
                                </li>
                            );
                        })
                    ) : loading ? (
                        <LoadingScreen className="mt-10" />
                    ) : (
                        <Nodata />
                    )}
                </ul>
            </InfiniteScroll>
        </div>
    );
};

export default memo(FollowList);
