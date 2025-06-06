import { getRecentTrades } from '@/apis/futures.api';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import { cn, formatNumber2 } from '@/helper';
import useSocketStore from '@/stores/socket.store';
import { SIDE_FUTURES } from '@/type/futures.type';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled from 'styled-components';
import { useWindowSize } from 'usehooks-ts';

type Item = {
    photo_url: string;
    username: string;
    base_asset: string;
    order_value: number;
    side: SIDE_FUTURES;
    displaying_id: number;
};

const LIMIT = 10;
const RecentTrade = () => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [dataSource, setDataSource] = useState<Item[]>([]);
    const userSocket = useSocketStore((state) => state.socket2);
    const [iHidden, setIHidden] = useState(0);
    const { height } = useWindowSize();

    const initData = async () => {
        const data = await getRecentTrades(LIMIT);
        if (data) setDataSource(data);
    };

    const onAddOrder = (e: Item) => {
        setDataSource((prev) => [e, ...prev.slice(0, LIMIT)]);
    };

    useEffect(() => {
        if (!userSocket) return;
        userSocket.emit('subscribe', 'futures:recent_trade');
        userSocket.on('future:update_recent_trade', onAddOrder);
        return () => {
            userSocket.emit('unsubscribe', 'futures:recent_trade');
            userSocket.off('future:update_recent_trade', onAddOrder);
        };
    }, [userSocket]);

    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        const el = document.getElementById('current_pair');
        if (!el) return;
        el.style.paddingLeft = showDrawer ? '101px' : '0';
        return () => {
            el.style.paddingLeft = '0';
        };
    }, [showDrawer]);

    useEffect(() => {
        if (!iHidden) return;
        const chart = document.getElementById('chart');
        if (!chart) return;
        chart.style.height = '100%';
        chart.style.maxHeight = '100%';
        setTimeout(() => {
            const container = document.getElementById('recent-trade-orders');
            if (container) {
                chart.style.height = `${container.clientHeight}px`;
                chart.style.maxHeight = `${container.clientHeight}px`;
            }
        }, 300);
        // return () => clearTimeout(timer);
    }, [iHidden, height]);

    useEffect(() => {
        const timer = setTimeout(() => {
            checkHidden();
        }, 100);
        return () => clearTimeout(timer);
    }, [dataSource.length, height]);

    const checkHidden = () => {
        const container = document.getElementById('recent-trade');
        const items = document.querySelectorAll('.recent-trade-item');
        if (!container || !items.length) return;
        for (let index = 0; index < items.length; index++) {
            if (isPartiallyHidden(items[index] as HTMLElement, container)) {
                setIHidden(index);
                break;
            } else {
                setIHidden(0);
            }
        }
    };

    const isPartiallyHidden = (element: HTMLElement, container: HTMLElement) => {
        if (!container) return false;
        const rect = element.getBoundingClientRect();
        const viewportHeight = container?.getBoundingClientRect().bottom;
        return !rect.bottom || rect.bottom > viewportHeight;
    };

    const substring = (str: string, start = 10, end = -4) => (str.length > start ? `${str.substr(0, start)}...${str.substr(end)}` : str);

    return (
        <div
            id="recent-trade"
            className={cn('h-full w-0 transition-all duration-300 bg-background-3 z-10 absolute left-0 top-0', {
                'w-[100px] ': showDrawer
            })}
        >
            <div
                id="recent-trade-orders"
                className={cn('overflow-hidden h-max bg-background-3 relative z-20 py-1', {
                    'border-r-0.5 border-divider': showDrawer
                })}
            >
                {dataSource.map(
                    (item, index) =>
                        !(index >= iHidden && iHidden > 0) && (
                            <div
                                className={cn('p-2 flex flex-col space-y-1 text-xs font-medium recent-trade-item', {
                                    'opacity-0 invisible': index >= iHidden && iHidden > 0
                                })}
                                key={`${item.displaying_id}_${item.side}`}
                            >
                                <div className="flex items-center space-x-1">
                                    <LazyLoadImage style={{ width: 10, height: 10 }} src={item.photo_url} alt={item.username} className="rounded-full" />
                                    <span className="line-clamp-1 break-words">{substring(item.username, 8, item.username.length)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div
                                        style={{ width: 10, height: 10 }}
                                        className="p-0.5 ring-0.5 ring-divider bg-background-1 rounded-sm flex items-center justify-center"
                                    >
                                        <ArrowUpIcon
                                            width={6}
                                            color="currentColor"
                                            className={cn('', {
                                                'text-red-1 rotate-180': item.side === SIDE_FUTURES.SELL,
                                                'text-green-1': item.side === SIDE_FUTURES.BUY
                                            })}
                                        />
                                    </div>
                                    <div className="text-sub line-clamp-1 break-words">
                                        <span>{item.base_asset}</span>&nbsp;
                                        <span>${formatNumber2(item.order_value)}</span>
                                    </div>
                                </div>
                            </div>
                        )
                )}
            </div>
            <DrawerWrapper $showDrawer={showDrawer} className="after:bg-background-2">
                <DrawerIcon onClick={() => setShowDrawer(!showDrawer)} showDrawer={showDrawer} />
            </DrawerWrapper>
        </div>
    );
};

const DrawerWrapper = styled.div<{ $showDrawer: boolean }>`
    &::after {
        content: '';
        display: ${({ $showDrawer }) => ($showDrawer ? 'block' : 'none')};
        position: absolute;
        top: 0;
        right: -8px;
        width: 8px;
        height: 100%;
    }
`;

const DrawerIcon = ({ onClick, showDrawer }: { onClick: VoidFunction; showDrawer: boolean }) => {
    return (
        <div onClick={onClick} className={cn('absolute top-1/2 -right-4 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="63" viewBox="0 0 11 63" fill="none">
                <mask id="path-1-inside-1_3257_61521" fill="white">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.52588e-05 0.594727L4.45151e-06 62.4052C5.08844e-06 58.7623 3.01668 55.8841 5.97853 53.7633C9.01882 51.5863 11 48.0245 11 44L11 19C11 14.9754 9.01882 11.4136 5.97854 9.23663C3.01669 7.11582 1.46219e-05 4.23758 1.52588e-05 0.594727Z"
                    />
                </mask>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.52588e-05 0.594727L4.45151e-06 62.4052C5.08844e-06 58.7623 3.01668 55.8841 5.97853 53.7633C9.01882 51.5863 11 48.0245 11 44L11 19C11 14.9754 9.01882 11.4136 5.97854 9.23663C3.01669 7.11582 1.46219e-05 4.23758 1.52588e-05 0.594727Z"
                    fill="#1D1C21"
                />
                <path
                    d="M5.97853 53.7633L5.68744 53.3567L5.97853 53.7633ZM5.97854 9.23663L5.68745 9.64316L5.97854 9.23663ZM-0.499985 0.594726L-0.499996 62.4052L0.500004 62.4052L0.500015 0.594727L-0.499985 0.594726ZM0.500004 62.4052C0.500005 60.7293 1.19254 59.2045 2.27267 57.8212C3.3548 56.4353 4.80588 55.2179 6.26962 54.1698L5.68744 53.3567C4.18933 54.4295 2.65116 55.7116 1.48448 57.2057C0.315809 58.7025 -0.499995 60.4382 -0.499996 62.4052L0.500004 62.4052ZM6.26962 54.1698C9.4354 51.903 11.5 48.1926 11.5 44L10.5 44C10.5 47.8564 8.60224 51.2696 5.68744 53.3567L6.26962 54.1698ZM11.5 44L11.5 19L10.5 19L10.5 44L11.5 44ZM11.5 19C11.5 14.8073 9.4354 11.0969 6.26963 8.8301L5.68745 9.64316C8.60225 11.7303 10.5 15.1435 10.5 19L11.5 19ZM6.26963 8.8301C4.80589 7.782 3.35481 6.56461 2.27268 5.17873C1.19255 3.79541 0.500015 2.27064 0.500015 0.594727L-0.499985 0.594726C-0.499985 2.56166 0.315818 4.29744 1.48449 5.79416C2.65116 7.28832 4.18934 8.57045 5.68745 9.64316L6.26963 8.8301Z"
                    fill="#2B2B37"
                    mask="url(#path-1-inside-1_3257_61521)"
                />
            </svg>
            <svg
                className={cn('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', { '-rotate-180': !showDrawer })}
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.44444 10L5.33333 10L5.33333 2L4.44444 2L4.44444 3L3.55555 3L3.55555 4.5L2.66666 4.5L2.66666 5.5L1.77777 5.5L1.77777 6.5L2.66666 6.5L2.66666 7.5L3.55555 7.5L3.55555 9L4.44444 9L4.44444 10Z"
                    fill="#3BD975"
                />
            </svg>
        </div>
    );
};
export default RecentTrade;
