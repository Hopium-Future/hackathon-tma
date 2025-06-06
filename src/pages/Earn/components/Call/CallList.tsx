import { memo, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteScroll from 'react-infinite-scroll-component';

import LoadingIcon from '@/components/icons/LoadingIcon';
import SortIcon from '@/components/icons/SortIcon';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import AssetLogo from '@/components/common/AssetLogo';
import Nodata from '@/components/common/nodata';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import { getAssetConfig, getPairConfig } from '@/selectors';
import { getEarnCallsApi } from '@/apis/earn.api';
import useFuturesConfig from '@/stores/futures.store';
import { SORT_LIST_TYPE } from '@/helper/constant';
import { cn, formatBigNum, getTimeDistance } from '@/helper';
import { ICallItem } from '@/type/earn.type';
import { SIDE_FUTURES } from '@/type/futures.type';
import { ISortListType } from '@/type/common.type';

const PAGE_LIMIT = 30;
const CallList = () => {
    const callListRef = useRef<ICallItem[]>([]);
    const [isInitialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [offset, setOffset] = useState(0);
    const [callList, setCallList] = useState<ICallItem[]>([]);
    const [isEnd, setIsEnd] = useState(false);
    const [sortTime, setSortTime] = useState<ISortListType>(SORT_LIST_TYPE.UNSET);
    const [sortCommission, setSortCommission] = useState<ISortListType>(SORT_LIST_TYPE.UNSET);

    const pairsConfig = useFuturesConfig((state) => state.pairsConfig);
    const assetsConfig = useFuturesConfig((state) => state.assetsConfig);
    const getConfig = (symbol: string) => {
        const pairConfig = getPairConfig(pairsConfig, symbol);
        const assetConfig = getAssetConfig(assetsConfig, pairConfig?.quoteAssetId);
        return { ...pairConfig, ...assetConfig };
    };

    const fetchCallList = async () => {
        try {
            const response = await getEarnCallsApi({ offset: PAGE_LIMIT * offset, limit: PAGE_LIMIT });
            if (response.data) {
                if (sortTime !== SORT_LIST_TYPE.UNSET) {
                    setSortTime(SORT_LIST_TYPE.UNSET);
                }
                if (sortCommission !== SORT_LIST_TYPE.UNSET) {
                    setSortCommission(SORT_LIST_TYPE.UNSET);
                }
                setCallList((prevData) => {
                    const mergedResult = [...(prevData || []), ...response.data.data];
                    callListRef.current = [...callListRef.current, ...response.data.data];
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

    const loadMoreData = () => {
        setOffset((prevSkip) => prevSkip + 1);
    };

    const onScroll = (e: MouseEvent) => {
        const obj = e.target as HTMLElement;
        if (obj.scrollTop >= obj.scrollHeight - obj.offsetHeight - 1) {
            setIsEnd(true);
        } else {
            setIsEnd(false);
        }
    };

    const handleSort = (sortType: ISortListType, property: string) => {
        if (!Array.isArray(callList) || !callList.length) return;

        if (sortType === SORT_LIST_TYPE.UNSET && callListRef.current.length) {
            setCallList(callListRef.current);
        } else {
            const sortedList = [...callList];
            sortedList.sort((first, second) => {
                let firstData = first.commission;
                let secondData = second.commission;
                if (property === 'createdAt') {
                    firstData = new Date(first.createdAt).getTime();
                    secondData = new Date(second.createdAt).getTime();
                }

                return (sortType === SORT_LIST_TYPE.ASC ? 1 : -1) * (firstData - secondData);
            });
            setCallList(sortedList);
        }
        const scrollableList = document.querySelector('.t-scrollable__earn-calls');
        scrollableList?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getNextSortType = (prevType: ISortListType) => {
        switch (prevType) {
            case SORT_LIST_TYPE.UNSET:
                return SORT_LIST_TYPE.ASC;
            case SORT_LIST_TYPE.ASC:
                return SORT_LIST_TYPE.DESC;
            default:
                return SORT_LIST_TYPE.UNSET;
        }
    };

    const onSortTime = () => {
        setSortCommission(SORT_LIST_TYPE.UNSET);
        setSortTime((prev) => {
            const nextType = getNextSortType(prev);
            handleSort(nextType, 'createdAt');
            return nextType;
        });
    };

    const onSortCommission = () => {
        setSortTime(SORT_LIST_TYPE.UNSET);
        setSortCommission((prev) => {
            const nextType = getNextSortType(prev);
            handleSort(nextType, 'commission');
            return nextType;
        });
    };

    useEffect(() => {
        fetchCallList();
    }, [offset]);

    return isInitialLoading ? (
        <LoadingScreen />
    ) : (
        <div id="t-call-scroller" className="flex-grow flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="w-[60px] flex items-center gap-1" onClick={onSortTime}>
                        <span className="text-sm text-sub uppercase">time</span>
                        <SortIcon sort={sortTime} height={8} />
                    </button>
                    <span className="text-sm text-sub uppercase">call</span>
                </div>
                <button className="flex items-center gap-1" onClick={onSortCommission}>
                    <span className="text-sm text-sub uppercase">commission</span>
                    <SortIcon sort={sortCommission} height={8} />
                </button>
            </div>
            <div className="flex-grow flex">
                <AutoSizer className="flex-grow">
                    {({ height }) => (
                        <InfiniteScroll
                            dataLength={callList.length || 0}
                            next={loadMoreData}
                            hasMore={hasMore}
                            loader={
                                <div className="flex items-center justify-center w-full">
                                    <LoadingIcon />
                                </div>
                            }
                            scrollableTarget="t-call-scroller"
                            height={height}
                            onScroll={onScroll}
                            className={cn('t-scrollable__earn-calls mt-3 flex flex-col gap-4 friend-wrapper pb-12', !isEnd && 'blur-to-bottom')}
                        >
                            {callList.length ? (
                                callList.map(({ createdAt, commission, side, symbol }, idx) => {
                                    return (
                                        <div key={`${idx}-${createdAt}`} className={cn('flex items-center justify-between w-full')}>
                                            <div className="flex gap-2">
                                                <span className="text-base font-bold text-main w-[60px] uppercase">{getTimeDistance(createdAt)}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="border-0.5 border-divider rounded size-5 flex items-center justify-center">
                                                        <ArrowUpIcon
                                                            className={
                                                                side.toLowerCase() === SIDE_FUTURES.SELL.toLowerCase()
                                                                    ? 'text-red-1 rotate-180'
                                                                    : 'text-green-1'
                                                            }
                                                            width={16}
                                                        />
                                                    </div>
                                                    <AssetLogo className="size-5" assetId={getConfig(symbol)?.baseAssetId || 0} />
                                                    <div className="text-base text-main font-bold">{getConfig(symbol)?.baseAsset || '...'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <p className="text-base text-main">{formatBigNum(commission || 0, 4, true)}</p>
                                                <AssetLogo className="size-5" assetId={22} />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <Nodata className="h-full" />
                            )}
                        </InfiniteScroll>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

export default memo(CallList);
