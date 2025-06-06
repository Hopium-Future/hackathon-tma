import { useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteScroll from 'react-infinite-scroll-component';

import AssetLogo from '@/components/common/AssetLogo';
import LoadingIcon from '@/components/icons/LoadingIcon';
import UserIcon from '@/components/icons/UserIcon';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import SortIcon from '@/components/icons/SortIcon';
import { getEarnReferralsApi } from '@/apis/earn.api';
import { cn, formatBigNum, truncateText } from '@/helper';
import { SORT_LIST_TYPE } from '@/helper/constant';
import { Friend } from '@/type/auth.type';
import { ISortListType } from '@/type/common.type';

const PAGE_LIMIT = 20;
const Referrals = () => {
    const friendsRef = useRef<Friend[]>([]);
    const [isInitialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [offset, setOffset] = useState(0);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isEnd, setIsEnd] = useState(false);
    const [sortCommission, setSortCommission] = useState<ISortListType>(SORT_LIST_TYPE.UNSET);

    const getFriends = async () => {
        try {
            const response = await getEarnReferralsApi({ offset: PAGE_LIMIT * offset, limit: PAGE_LIMIT });
            if (response.data) {
                if (sortCommission !== SORT_LIST_TYPE.UNSET) {
                    setSortCommission(SORT_LIST_TYPE.UNSET);
                }
                setFriends((prevData) => {
                    const mergedResult = [...(prevData || []), ...response.data.data];
                    friendsRef.current = [...friendsRef.current, ...response.data.data];
                    return mergedResult;
                });
                setHasMore(response.data.hasMore);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setInitialLoading(false);
        }
    };

    const onScroll = (e: MouseEvent) => {
        const obj = e.target as HTMLElement;
        if (obj.scrollTop >= obj.scrollHeight - obj.offsetHeight - 1) {
            setIsEnd(true);
        } else {
            setIsEnd(false);
        }
    };

    const loadMoreData = () => {
        setOffset((prevSkip) => prevSkip + 1);
    };

    const handleSortCommission = (sortType: ISortListType) => {
        if (!Array.isArray(friends) || !friends.length) return;

        if (sortType === SORT_LIST_TYPE.UNSET && friendsRef.current.length) {
            setFriends(friendsRef.current);
        } else {
            const sortedList = [...friends];
            sortedList.sort((first, second) => (sortType === SORT_LIST_TYPE.ASC ? 1 : -1) * (first.commission - second.commission));
            setFriends(sortedList);
        }
        const scrollableList = document.querySelector('.t-scrollable__earn-ref');
        scrollableList?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onChangeSortCommission = () => {
        setSortCommission((prev) => {
            let newSortType = prev;
            switch (prev) {
                case SORT_LIST_TYPE.UNSET:
                    newSortType = SORT_LIST_TYPE.ASC;
                    break;
                case SORT_LIST_TYPE.ASC:
                    newSortType = SORT_LIST_TYPE.DESC;
                    break;
                default:
                    newSortType = SORT_LIST_TYPE.UNSET;
            }
            handleSortCommission(newSortType);
            return newSortType;
        });
    };

    useEffect(() => {
        getFriends();
    }, [offset]);

    return isInitialLoading ? (
        <LoadingScreen />
    ) : (
        <div id="t-friends-scroller" className="flex-grow flex flex-col mb-[84px]">
            <div className="flex items-center justify-between">
                <p className="text-sm text-sub uppercase">Friends</p>
                <button className="flex items-center gap-1" onClick={onChangeSortCommission}>
                    <p className="text-sm text-sub uppercase">Commission</p>
                    <SortIcon sort={sortCommission} />
                </button>
            </div>
            <div className="flex-grow flex">
                <AutoSizer className="flex-grow">
                    {({ height }) => (
                        <InfiniteScroll
                            dataLength={friends.length || 0}
                            next={loadMoreData}
                            hasMore={hasMore}
                            loader={
                                <div className="flex items-center justify-center w-full">
                                    <LoadingIcon />
                                </div>
                            }
                            scrollableTarget="t-friends-scroller"
                            height={height}
                            onScroll={onScroll}
                            className={cn('t-scrollable__earn-ref mt-3 flex flex-col gap-4 friend-wrapper pb-8', !isEnd && 'blur-to-bottom')}
                        >
                            {friends.length ? (
                                friends.map((friend, idx) => {
                                    const displayName = friend.username || `${friend.firstName} ${friend.lastName}`;
                                    return (
                                        <div key={`${idx}_${friend.firstName}`} className={cn('flex items-center justify-between w-full gap-2')}>
                                            <p className="text-base font-bold line-clamp-1 text-nowrap">{truncateText(displayName, 16)}</p>
                                            <div className="flex items-center gap-1">
                                                <p className="text-base text-main font-bold">{formatBigNum(+friend.commission, 4, true)}</p>
                                                <AssetLogo className="size-5" assetId={22} />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center">
                                    <UserIcon className="size-[80px] text-sub" />
                                    <p className="text-md text-sub mt-1">You have no friends</p>
                                </div>
                            )}
                        </InfiniteScroll>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

export default Referrals;
