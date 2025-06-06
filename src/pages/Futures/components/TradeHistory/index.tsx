import TabCustom from '@/components/common/tabs';
import { ListContent, ListTab } from '@/type/tab.type';
import { useEffect, useMemo, useState } from 'react';
import PositionTab from './PositionTab';
import HistoryTab from './HistoryTab';
import { getQueryParam } from '@/helper';
import Emitter from '@/helper/emitter';
import useSocketStore from '@/stores/socket.store';
import { getOrders } from '@/apis/futures.api';
import { LOCAL_STORAGE_KEY, PublicSocketEvent } from '@/helper/constant';
import { toast } from 'react-toastify';
import usePriceSocket from '@/stores/priceSocket.store';
import { OrderFutures, STATUS_FUTURES } from '@/type/futures.type';
import OrderCloseAlertModal from './Order/OrderCloseAlertModal';
import FundingTab from './FundingTab';

const TABS = {
    POSITION: 'POSITION',
    PENDING: 'OPEN ORDERS',
    HISTORY: 'HISTORY',
    FUNDING: 'FUNDING'
};
const getInitialTab = () => {
    const tab = getQueryParam('tab')?.toUpperCase();
    if (!tab) return null;
    return Object.values(TABS).includes(tab) ? tab : null;
};

const TradeHistory = () => {
    const [tab, setTab] = useState(getInitialTab() || TABS.POSITION);
    const userSocket = useSocketStore((state) => state.socket2);
    const priceSocket = usePriceSocket((state) => state.socket);
    const [orders, setOrders] = useState<OrderFutures[]>([]);
    const [loading, setLoading] = useState(true);

    const getOrdersList = async () => {
        try {
            const orders = await getOrders();
            const symbols = [...new Set([...orders.orders.map((rs: any) => rs.symbol)])];
            localStorage.setItem(LOCAL_STORAGE_KEY.SYMBOLS_ACTIVE, JSON.stringify(symbols));
            if (priceSocket && symbols && symbols.length) priceSocket.emit(PublicSocketEvent.SUB_TICKER_UPDATE, symbols);
            setOrders(orders.orders);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentTab = getInitialTab();
        if (currentTab) {
            const element = document.getElementById('trade-history');
            element?.scrollIntoView();
        }
        const onSetTab = (tab: string) => setTab(tab);
        Emitter.on('orders:tabs', onSetTab);

        getOrdersList();
        const FETCH_INTERVAL = 1 * 60 * 1000; // 1m
        const timer = setInterval(getOrdersList, FETCH_INTERVAL);

        return () => {
            Emitter.off('orders:tabs', onSetTab);
            localStorage.removeItem(LOCAL_STORAGE_KEY.SYMBOLS_ACTIVE);
            clearInterval(timer);
        };
    }, []);

    const alertOrderError = (e: any) => {
        toast.error(e?.error?.error?.message);
    };

    useEffect(() => {
        const storageActive = localStorage.getItem(LOCAL_STORAGE_KEY.SYMBOLS_ACTIVE);
        const symbolsActive = storageActive ? JSON.parse(storageActive) : [];
        if (!priceSocket || !symbolsActive.length) return;
        priceSocket?.emit(PublicSocketEvent.SUB_TICKER_UPDATE, symbolsActive);
    }, [priceSocket]);

    useEffect(() => {
        if (!userSocket) return;
        userSocket.emit('subscribe', 'futures:order');
        userSocket.on('future:update_opening_order', getOrdersList);
        userSocket.on('future:processing_order_error', alertOrderError);
        return () => {
            userSocket.emit('unsubscribe', 'futures:order');
            userSocket.off('future:update_opening_order', getOrdersList);
            userSocket.off('future:processing_order_error', alertOrderError);
        };
    }, [userSocket]);

    const tabs: ListTab[] = useMemo(() => {
        return Object.values(TABS).map((value) => ({
            value,
            title: value
        }));
    }, []);

    const listContent: ListContent[] = [
        {
            value: TABS.POSITION,
            children: <PositionTab orders={orders.filter((rs) => rs.status === STATUS_FUTURES.ACTIVE)} loading={loading} />
        },
        {
            value: TABS.PENDING,
            children: <PositionTab orders={orders.filter((rs) => rs.status === STATUS_FUTURES.PENDING)} loading={loading} />
        },
        {
            value: TABS.HISTORY,
            children: <HistoryTab tab={tab} />
        },
        {
            value: TABS.FUNDING,
            children: <FundingTab tab={tab} />
        }
    ];

    return (
        <>
            <TabCustom
                defaultValue={tab}
                listTab={tabs}
                triggerClassName="px-3 mx-0"
                listTabClassName="[&>button]:w-full border rounded"
                listContent={listContent}
                // listContentClassName="pb-10"
                tabsClassName="pb-4"
                className="sticky top-0 bg-background-1 z-10 pt-4"
                handleChangeTab={setTab}
                forceMount
                activeClassName="custom_tab_active"
            />
            <OrderCloseAlertModal />
        </>
    );
};

export default TradeHistory;
