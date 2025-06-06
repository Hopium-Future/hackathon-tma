import { memo, useCallback, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { VariableSizeList as List, ListOnItemsRenderedProps, ListOnScrollProps } from 'react-window';

import FeedItem from '../FeedItem';
import FeedSocketEventListener from './FeedSocketEventListener';
import Nodata from '@/components/common/nodata';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import OrderCreatedEventListener from '@/components/shared-ui/OrderCreatedEventListener';
import { getFeedApi, IGetFeedApiParams } from '@/apis/feed.api';
import { FEED_PAGE_LIMIT } from '@/helper/constant';
import { IPost } from '@/type/feed.type';
import useProfileFeedStore from '@/stores/profileFeed.store';
import ScrollTopButton from '@/components/common/ScrollTopButton';

interface IProps {
    params: IGetFeedApiParams;
}
interface IFeedData {
    list: IPost[] | [];
    hasMore: boolean;
}
const FeedList = ({ params }: IProps) => {
    const listRef = useRef<any>(null);
    const rowHeightsRef = useRef<Record<number, number>>({});
    const controllerRef = useRef<AbortController | null>(null);
    const [isFetching, setFetching] = useState(true);
    const [isFetchingMore, setFetchingMore] = useState(false);
    const [fetchParams, setFetchParams] = useState<IGetFeedApiParams | null>(null);
    const [feedData, setFeedData] = useState<IFeedData>({
        list: [],
        hasMore: true
    });
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const isReload = useProfileFeedStore((state) => state.isReload);
    const setIsReload = useProfileFeedStore((state) => state.setIsReload);

    const Row = memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
        const rowRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (rowRef.current) {
                setRowHeight(index, rowRef.current.clientHeight);
            }
            // eslint-disable-next-line
        }, [rowRef]);

        return (
            <div style={style}>
                <div ref={rowRef}>
                    <FeedItem post={feedData.list[index]} hasUserInfo={true} onFollow={handleFollow} />
                </div>
            </div>
        );
    });

    const getRowHeight = (index: number) => {
        return rowHeightsRef.current[index] + 8 || 433;
    };

    const setRowHeight = (index: number, size: number) => {
        listRef.current.resetAfterIndex(0);
        rowHeightsRef.current = { ...rowHeightsRef.current, [index]: size };
    };

    const handleFollow = useCallback(
        (isFollowing: boolean, id: number) => {
            const updatedList = feedData.list.map((item) => {
                return item.userId === id ? { ...item, user: { ...item.user, isFollowing } } : item;
            });
            setFeedData({ ...feedData, list: updatedList });
        },
        [feedData]
    );

    const fetchData = useCallback(
        async (params: IGetFeedApiParams) => {
            // Create a new AbortController for the new request
            const controller = new AbortController();
            controllerRef.current = controller;

            if (isFetchingMore) return;
            setFetchingMore(true);
            try {
                const response = await getFeedApi({ ...params, signal: controller.signal });
                const { data, hasMore } = response;
                if (Array.isArray(data)) {
                    setFeedData((prev) => ({ list: params.offset === 0 ? data : [...prev.list, ...data], hasMore }));
                }
            } catch (error) {
                setFeedData({ list: [], hasMore: false });
                console.log('Get feed failed: ', error);
            }
            setFetching(false);
            setFetchingMore(false);
            setIsReload(false);
        },
        // eslint-disable-next-line
        [isFetchingMore]
    );

    const handleItemRendered = ({ visibleStopIndex }: ListOnItemsRenderedProps) => {
        if (visibleStopIndex === feedData.list.length - 1 && !isFetchingMore && feedData.hasMore) {
            setFetchParams((prev) => ({ ...prev, offset: (prev?.offset || 0) + FEED_PAGE_LIMIT }));
        }
    };

    const onScroll = ({ scrollOffset }: ListOnScrollProps) => {
        setShowScrollTopButton(scrollOffset > 600);
    };

    const handleScrollTop = () => {
        listRef.current?.scrollToItem(0);
    };

    const handlePullToRefresh = async () => {
        setIsReload(true);
    };

    useEffect(() => {
        fetchParams && fetchData(fetchParams);
        // eslint-disable-next-line
    }, [fetchParams]);

    useEffect(() => {
        if (controllerRef.current) {
            controllerRef.current.abort(); // Abort the previous request
        }
        setFetching(true);
        setFeedData({ list: [], hasMore: false });
        setFetchParams({ limit: FEED_PAGE_LIMIT, offset: 0, ...params });
    }, [params]);

    useEffect(() => {
        if (isReload) {
            setFetching(true);
            setFetchParams((prev) => ({ ...prev, limit: FEED_PAGE_LIMIT, offset: 0 }));
        }
    }, [isReload]);

    return isFetching ? (
        <LoadingScreen />
    ) : feedData.list.length ? (
        <>
            <FeedSocketEventListener feedData={feedData} setFeedData={setFeedData} />
            <OrderCreatedEventListener />
            <PullToRefresh onRefresh={handlePullToRefresh} pullingContent="">
                <AutoSizer>
                    {({ height, width }) => {
                        return (
                            <List
                                className="pb-12 scroll-smooth"
                                ref={listRef}
                                height={height}
                                itemCount={feedData.list.length}
                                itemSize={getRowHeight}
                                onItemsRendered={handleItemRendered}
                                onScroll={onScroll}
                                width={width}
                            >
                                {Row}
                            </List>
                        );
                    }}
                </AutoSizer>
            </PullToRefresh>
            {showScrollTopButton && <ScrollTopButton onClick={handleScrollTop} className="bottom-24 bg-divider border-divider-secondary" />}
            {isFetchingMore && <LoadingScreen className="items-end h-full" />}
        </>
    ) : (
        <PullToRefresh onRefresh={handlePullToRefresh} pullingContent="">
            <Nodata className="h-full" />
        </PullToRefresh>
    );
};

export default memo(FeedList);
