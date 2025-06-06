import { lazy, useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';

import ArrowIcon from '@/components/icons/ArrowIcon';
import { TABS, TabType } from './constants';
import { cn, getDecimalPrice } from '@/helper';
import { getNotifications, getOrderDetail } from '@/apis/notification.api';
import EmptyIcon from '@/components/icons/EmptyIcon';
import LoadingIcon from '@/components/icons/LoadingIcon';
import OrderDetailModal from '../Futures/components/TradeHistory/Order/OrderDetailModal';
import useFuturesConfig from '@/stores/futures.store';
import { getAssetConfig, getPairConfig } from '@/selectors';
import OrderShareModal, { OrderShareModalRef } from '../Futures/components/TradeHistory/Order/OrderShareModal';
import classNames from 'classnames';
import useUserStore from '@/stores/user.store';
import Modal from '@/components/common/modal';
import WebApp from '@twa-dev/sdk';
import { FULLSCREEN_PLATFORMS } from '@/config/fullscreen.config';
import useProfileFeedStore from '@/stores/profileFeed.store';

const TransactionsTab = lazy(() => import('./components/Transactions'));
const TradeTab = lazy(() => import('./components/Trade'));
const SocialTab = lazy(() => import('./components/Social'));
const EarnTab = lazy(() => import('./components/Earn'));

const TransactionDetail = lazy(() => import('./components/Transactions/detail'));
const ProfileFeed = lazy(() => import('@/pages/Feed/components/Profile'));

const renderEmpty = () => {
    return (
        <section className="mt-10 text-center">
            <EmptyIcon className="w-[100px] h-[100px]" />
            <p className="mt-1 text-sub text-md">Oops, no data</p>
        </section>
    );
};

export const Divider = () => {
    return <div className="border-[0.5px] border-divider my-3" />;
};

const categoryComponentMap: Record<string, any> = {
    trade: TradeTab,
    transactions: TransactionsTab,
    social: SocialTab,
    earn: EarnTab
};

const tabComponentMap: Record<Exclude<TabType, 'all'>, React.ElementType> = {
    transaction: TransactionsTab,
    earn: EarnTab,
    trade: TradeTab,
    social: SocialTab
};

const initState = {
    detail: { open: false, data: null, category: '', type: '' },
    orderDetail: null
};

const EXCLUDED_TRADE_TYPES = ['FUTURES_LIQUIDATE', 'FUTURES_HIT_SL'];

const Notification = () => {
    const navigate = useNavigate();
    const isShowProfileModal = useUserStore((state) => state.isShowProfileModal);
    const setShowProfileModal = useUserStore((state) => state.setShowProfileModal);
    const [isCallList, setIsCallList] = useProfileFeedStore((state) => [state.isCallList, state.setIsCallList]);
    const isMobileFullScreen = WebApp.isFullscreen && FULLSCREEN_PLATFORMS.includes(WebApp.platform);

    const [orderDetail, setOrderDetail] = useState<any>(initState.orderDetail);

    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, orderDetail?.symbol));
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, pairConfig?.quoteAssetId));

    const [tab, setTab] = useState<TabType>('all');
    const [notifications, setNotifications] = useState<{
        hasNext: boolean;
        numOfUnread: number;
        results: Array<any>;
    }>({
        hasNext: true,
        numOfUnread: 0,
        results: []
    });

    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [detail, seDetail] = useState<{ open: boolean; data: any; category: string; type: string }>(initState.detail);

    const listRef = useRef<any>(null);
    const tabRef = useRef<HTMLElement>(null);
    const isFetchingRef = useRef<boolean>(false);
    const rowHeights = useRef<{ [key: number]: number }>({});
    const triggerShareRef = useRef<OrderShareModalRef>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications({ type: tab.toUpperCase() });
            setNotifications(data);
        } catch (error) {
            console.error(`Error fetching notifications: ${error}`);
        } finally {
            isFetchingRef.current = false;
        }
    };

    const fetchOrderDetail = async () => {
        try {
            const { status, data } = await getOrderDetail({ orderId: detail?.data });
            if (status === 'ok') {
                setOrderDetail(data);
            }
        } catch (error) {
            console.error(`Error fetching order detail: ${error}`);
        } finally {
            isFetchingRef.current = false;
        }
    };

    useEffect(() => {
        isFetchingRef.current = true;
        setNotifications((prev) => ({ ...prev, results: [] }));
        fetchNotifications();
    }, [tab]);

    useEffect(() => {
        if (detail?.category === 'trade' && detail?.open) {
            isFetchingRef.current = true;
            fetchOrderDetail();
        }
    }, [detail]);

    useEffect(() => {
        if (detail?.open && detail?.category === 'trade' && orderDetail && triggerShareRef.current && !EXCLUDED_TRADE_TYPES.includes(detail?.type)) {
            const timeout = setTimeout(() => {
                triggerShareRef.current?.onShare();
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [detail?.open, detail?.category, orderDetail, detail?.type]);

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            symbol: assetConfig?.assetDigit
        };
    }, [pairConfig, assetConfig]);

    const handleClose = () => {
        seDetail(initState.detail);
        if (orderDetail) {
            setOrderDetail(initState.orderDetail);
        }
    };
    const fetchMore = useCallback(
        async ({ lastId }: { lastId?: string }) => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;
            try {
                const moreData = await getNotifications({ type: tab.toUpperCase(), lastId });
                setNotifications((prev) => ({ ...moreData, results: [...prev.results, ...moreData.results] }));
            } catch (error) {
                console.error(`Error fetching more notifications: ${error}`);
            } finally {
                isFetchingRef.current = false;
            }
        },
        [tab]
    );

    const setSize = useCallback((index: number, size: number) => {
        if (rowHeights.current[index] !== size) {
            rowHeights.current[index] = size;
            if (listRef.current) {
                listRef.current.resetAfterIndex(index, true);
            }
        }
    }, []);

    const getSize = (index: number) => rowHeights.current[index] || 50;

    const handleScroll = useCallback(
        ({ scrollOffset, scrollUpdateWasRequested }: any) => {
            setIsScrolled((prev) => (prev !== scrollOffset > 0 ? scrollOffset > 0 : prev));
            if (!notifications?.hasNext) return;
            if (isFetchingRef.current) return;

            if (!scrollUpdateWasRequested && listRef.current) {
                const { scrollHeight, clientHeight } = listRef.current._outerRef;
                if (scrollOffset + clientHeight >= scrollHeight - 100) {
                    const lastId = notifications.results?.[notifications.results.length - 1]?._id;
                    fetchMore({ lastId });
                }
            }
        },
        [fetchMore, notifications?.results]
    );

    // Render từng item
    const Row = memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
        const item = notifications?.results?.[index];
        const ref = useRef<HTMLDivElement>(null);

        let Component: React.ElementType;
        if (tab === 'all') {
            const category = item?.categoryName?.toLocaleLowerCase();
            Component = categoryComponentMap[category] || null;
        } else {
            Component = tabComponentMap[tab?.toLocaleLowerCase() as Exclude<TabType, 'all'>] || TransactionsTab;
        }

        useEffect(() => {
            const node = ref.current;
            if (!node) return;

            const observer = new ResizeObserver(([entry]) => {
                setSize(index, entry.contentRect.height);
                listRef.current?.resetAfterIndex(index, true); // Chỉ reset từ index hiện tại
            });

            observer.observe(node);

            return () => observer.disconnect();
        }, [index, setSize]);

        return Component ? (
            <div ref={ref} style={{ ...style, height: 'auto' }}>
                <Component data={item} onDetail={seDetail} />
            </div>
        ) : null;
    });

    useEffect(() => {
        if (mainRef.current) {
            setHeaderHeight(mainRef.current.offsetHeight);
        }
    }, [mainRef.current]);

    const renderContent = () => {
        if (notifications.results?.length === 0 && isFetchingRef?.current)
            return (
                <section className="w-full h-full flex items-center justify-center">
                    <LoadingIcon />
                </section>
            );

        if (notifications?.results?.length === 0) {
            return renderEmpty();
        }

        return (
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        height={height}
                        width={width}
                        itemCount={(+notifications?.results?.length || 0) + (isFetchingRef?.current ? 1 : 0)}
                        itemSize={getSize}
                        overscanCount={5}
                        onScroll={handleScroll}
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        );
    };

    const renderModal = () => {
        if (isShowProfileModal) {
            return (
                <Modal
                    title={'Profile Master'}
                    visible={isShowProfileModal}
                    className="h-screen overflow-hidden bg-background-2"
                    containerClassName={cn('h-full rounded-t-none', { 'pt-11': isMobileFullScreen })}
                    onClose={() => {
                        setShowProfileModal(false);
                        setIsCallList(false);
                    }}
                >
                    <ProfileFeed showCallListFirst={isCallList} />
                </Modal>
            );
        }

        if (detail?.open && detail?.category === 'transaction') {
            return <TransactionDetail data={detail?.data} open={detail?.open} onClose={handleClose} />;
        }

        if (detail?.open && detail?.category === 'trade') {
            const type = detail?.type;

            if (EXCLUDED_TRADE_TYPES?.includes(type)) {
                return <OrderDetailModal visible={!!orderDetail} onClose={handleClose} order={orderDetail} decimals={decimals} pairConfig={pairConfig} />;
            }

            return (
                <OrderShareModal
                    ref={triggerShareRef}
                    visible={!!orderDetail}
                    onClose={() => {
                        handleClose();
                    }}
                    order={orderDetail}
                    decimals={decimals}
                    pairConfig={pairConfig}
                />
            );
        }
    };
    return (
        <>
            <main className="mx-3 overflow-y-scroll h-full" ref={mainRef}>
                <section ref={tabRef}>
                    {/* Header */}
                    <section className="mt-4 flex h-9 items-center w-full relative">
                        <ArrowIcon className="cursor-pointer" onClick={() => navigate('/feed')} />
                        <p className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">NOTIFICATIONS</p>
                    </section>

                    {/* Tabs */}
                    <section className="flex justify-start gap-x-[6px] my-3">
                        {TABS.map((value) => (
                            <section
                                key={`tab_notification_${value}`}
                                className={cn('capitalize px-3 text-sm py-[6px] rounded border-[0.5px] text-sub border-divider', {
                                    'text-main bg-background-2 font-bold': value === tab
                                })}
                                onClick={() => {
                                    setTab(value as TabType);
                                }}
                            >
                                {value === 'transaction' ? 'Transactions' : value}
                            </section>
                        ))}
                    </section>
                </section>
                {/* Danh sách thông báo */}
                <section
                    className={cn(classNames('flex-1 overflow-hidden transition-all duration-300 pt-3', { 'pt-0': isScrolled }))}
                    style={{
                        height: `${headerHeight - 28 - (tabRef.current?.offsetHeight || 0)}px`
                    }}
                >
                    {renderContent()}
                </section>
                <div className="absolute w-full left-0 h-[40px] bottom-0 gradient-overlay"></div>
            </main>

            {renderModal()}
        </>
    );
};

export default Notification;
