import { memo, useCallback, useEffect, useRef, useState } from 'react';

import FeedItem from '../../FeedItem';
import FeedSocketEventListener from '../../FeedList/FeedSocketEventListener';
import OrderCreatedEventListener from '@/components/shared-ui/OrderCreatedEventListener';
import NoData2 from '@/components/common/nodata/NoData2';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import { getCallListProfile, IGetCallListProfileParams } from '@/apis/feed.api';
import useUserStore from '@/stores/user.store';
import { FEED_PAGE_LIMIT } from '@/helper/constant';
import { IPost } from '@/type/feed.type';

interface IProps {
    params: IGetCallListProfileParams;
    isEndPage: boolean;
}
interface ICallListData {
    list: IPost[] | [];
    hasMore: boolean;
}

export interface CallListRef {
    isFetching: boolean;
}
const CallList = ({ params, isEndPage }: IProps) => {
    const controllerRef = useRef<AbortController | null>(null);
    const [isFetching, setFetching] = useState(true);
    const [isFetchingMore, setFetchingMore] = useState(false);
    const [fetchCallListParams, setFetchCallListParams] = useState<IGetCallListProfileParams | null>(null);
    const [callListData, setCallListData] = useState<ICallListData>({
        list: [],
        hasMore: true
    });
    const setUserCallListCounts = useUserStore((state) => state.setUserCallListCounts);

    const handleFollow = useCallback(
        (isFollowing: boolean, id: number) => {
            const updatedList = callListData.list.map((item) => {
                return item.userId === id ? { ...item, user: { ...item.user, isFollowing } } : item;
            });
            setCallListData({ ...callListData, list: updatedList });
        },
        [callListData]
    );

    const fetchData = useCallback(
        async (params: IGetCallListProfileParams) => {
            // Create a new AbortController for the new request
            const controller = new AbortController();
            controllerRef.current = controller;

            if (isFetchingMore) return;
            setFetchingMore(true);
            try {
                const response = await getCallListProfile({ ...params, signal: controller.signal } as IGetCallListProfileParams);
                const { data, hasMore } = response;
                if (Array.isArray(data)) {
                    setCallListData((prev) => ({ list: params.offset === 0 ? data : [...prev.list, ...data], hasMore }));
                }
                if (response.counts) {
                    setUserCallListCounts(response.counts);
                }
            } catch (error) {
                setCallListData({ list: [], hasMore: false });
                console.log('Get call list failed: ', error);
            }
            setFetching(false);
            setFetchingMore(false);
        },
        // eslint-disable-next-line
        [isFetchingMore]
    );

    const handleFetchMore = () => {
        if (params?.userId && !isFetchingMore && callListData.hasMore) {
            setFetchCallListParams((prev) => {
                const oldParams = prev ?? {};
                return { ...oldParams, userId: params.userId, offset: (prev?.offset || 0) + FEED_PAGE_LIMIT };
            });
        }
        return;
    };

    useEffect(() => {
        fetchCallListParams && fetchData(fetchCallListParams);
        // eslint-disable-next-line
    }, [fetchCallListParams]);

    useEffect(() => {
        if (controllerRef.current) {
            controllerRef.current.abort(); // Abort the previous request
        }
        setFetching(true);
        setCallListData({ list: [], hasMore: false });
        setFetchCallListParams({ limit: FEED_PAGE_LIMIT, offset: 0, ...params });
    }, [params]);

    useEffect(() => {
        isEndPage && handleFetchMore();
        // eslint-disable-next-line
    }, [isEndPage]);

    return isFetching ? (
        <LoadingScreen />
    ) : callListData.list.length ? (
        <div>
            <FeedSocketEventListener feedData={callListData} setFeedData={setCallListData} />
            <OrderCreatedEventListener />
            {callListData.list.map((post) => (
                <FeedItem key={post.id} post={post} hasUserInfo={false} onFollow={handleFollow} className="mb-3 shadow-none" />
            ))}
            {isFetchingMore && <LoadingScreen className="items-end h-full" />}
        </div>
    ) : (
        <NoData2 className="mt-10" />
    );
};

export default memo(CallList);
