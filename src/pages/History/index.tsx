import ArrowIcon from '@/components/icons/ArrowIcon';
import { cn } from '@/helper';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import CardHistory from './component/CardHistory';
import { HistoryDepositData } from '@/type/history.type';
import { useSearchParams } from 'react-router-dom';

import Chip from '@/components/common/chip';
import { getWalletHistory } from '@/apis/wallet-history.api';
import Nodata from '@/components/common/nodata';
import usePaymentConfig from '@/stores/payment.store';

type FilterHistory = 'all' | 'deposit' | 'withdraw';

const LIMIT = 20;

const filterHistory = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Deposit',
        value: 'deposit'
    },
    {
        label: 'Withdraw',
        value: 'withdraw'
    },
    {
        label: 'Commission',
        value: 'reward'
    },
    {
        label: 'Exchange',
        value: 'exchange'
    }
];

export default function History() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const categoryConfigs = usePaymentConfig((state) => state.categoryConfigs);

    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(true);

    const filterDefault = searchParams.get('filter') || 'all';
    const [filter, setFilter] = useState<FilterHistory>(filterDefault as FilterHistory);
    const [scrollHeight, setScrollHeight] = useState<number>(0);

    const headerRef = useRef<HTMLDivElement | null>(null);
    const chipRef = useRef<HTMLDivElement | null>(null);

    const [data, setData] = useState<{ result: HistoryDepositData[]; hasNext: boolean }>({
        result: [],
        hasNext: false
    });

    useEffect(() => {
        const calculateHeight = () => {
            const headerHeight = headerRef.current?.offsetHeight || 0;
            const chipHeight = chipRef.current?.offsetHeight || 0;
            const totalHeight = window.innerHeight - (headerHeight + chipHeight);

            setScrollHeight(totalHeight - 32 - 16);
        };

        calculateHeight();

        window.addEventListener('resize', calculateHeight);
        return () => {
            window.removeEventListener('resize', calculateHeight);
        };
    }, []);

    useEffect(() => {
        let mounted = false;
        const abortController = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const history = await getWalletHistory({
                    params: { type: filter, limit: LIMIT, skip: skip * LIMIT },
                    config: {
                        signal: abortController.signal
                    }
                });

                if (history?.status === 'ok' || history?.message === 'ok') {
                    setData((prevData: any) => {
                        const mergedResult = [...(prevData?.result || []), ...(history?.data?.result || [])];

                        const uniqueResult = Array.from(new Set(mergedResult.map((item) => JSON.stringify(item)))).map((item) => JSON.parse(item));

                        return {
                            ...prevData,
                            result: uniqueResult,
                            hasNext: history?.data?.hasNext
                        };
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                if (mounted) {
                    setLoading(true);
                } else setLoading(false);
            }
        };

        fetchData();

        return () => {
            mounted = true;
            abortController.abort();
        };
    }, [filter, skip]);

    const backward = () => {
        navigate(-1);
    };

    const handleChangeFilter = (value: FilterHistory) => {
        setFilter(value);
        setSkip(0);
        setData({ result: [], hasNext: false });
    };

    const loadMoreData = () => {
        setSkip((prevSkip) => prevSkip + 1);
    };

    const renderLoader = useCallback(
        () => (
            <div className="fixed top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 flex justify-center">
                <div className="loader" />
            </div>
        ),
        []
    );

    const renderData = () => {
        if (loading && !data?.result?.length) return renderLoader();
        if (data?.result.length === 0) return <Nodata className="h-full" />;
        return (
            <div className="pt-4">
                <InfiniteScroll
                    dataLength={data?.result?.length || 0}
                    next={loadMoreData}
                    height={scrollHeight - 2}
                    hasMore={!loading && data?.hasNext}
                    loader={null}
                    scrollableTarget="historyScrollableDiv"
                >
                    {data?.result?.length > 0 &&
                        data?.result?.map((item: any, index: any) => {
                            return (
                                <CardHistory
                                    warperClassName={cn(index === 0 && 'pb-3', index > 0 && 'py-3')}
                                    key={item._id}
                                    id={item._id}
                                    type={filter}
                                    walletType={item.wallet_type}
                                    createdAt={item?.created_at || item?.createdAt}
                                    amount={item?.amount || item?.money_use || item?.value || 0}
                                    item={item}
                                    categoryConfigs={categoryConfigs}
                                />
                            );
                        })}
                </InfiniteScroll>
            </div>
        );
    };

    return (
        <div className="pt-4 px-3 h-full flex flex-col">
            <div className="flex items-center justify-between h-9" ref={headerRef}>
                <button onClick={backward}>
                    <ArrowIcon className="size-6" />
                </button>
                <span className="font-bold text-2xl">History</span>
                <div />
            </div>
            <div className="pt-4" ref={chipRef}>
                <div className="flex gap-x-1">
                    {filterHistory.map((item) => {
                        const active = filter === item.value;
                        return (
                            <Chip
                                className={cn('', { 'tex-white font-bold': active })}
                                active={active}
                                key={item.value}
                                onClick={() => handleChangeFilter(item.value as FilterHistory)}
                            >
                                {item.label}
                            </Chip>
                        );
                    })}
                </div>
            </div>
            {renderData()}

            <div
                className="fixed bottom-0 left-0 right-0 h-[61px]"
                style={{
                    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%)'
                }}
            />
        </div>
    );
}
