import Chip from '@/components/common/chip';
import { OrderFutures, SIDE_FUTURES } from '@/type/futures.type';
import { useMemo, useState } from 'react';
import OrderItem from './Order/OrderItem';
import { filter } from 'lodash';
import { useParams } from 'react-router-dom';
import Nodata from '@/components/common/nodata';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';

const TABS = {
    ALL: 'ALL',
    PUMP: SIDE_FUTURES.BUY,
    DUMP: SIDE_FUTURES.SELL
};

const tabs = [
    {
        title: 'All',
        value: TABS.ALL
    },
    {
        title: 'Long',
        value: TABS.PUMP
    },
    {
        title: 'Short',
        value: TABS.DUMP
    }
];

interface PositionTabProps {
    orders: OrderFutures[];
    loading: boolean;
}
const PositionTab = ({ orders, loading }: PositionTabProps) => {
    const params = useParams();
    const [side, setSide] = useState(TABS.ALL);
    const currentPair = String(params?.pair);

    const orderFilter = useMemo(() => {
        if (side === TABS.ALL) return orders;
        return filter(orders, (order) => order.side === side);
    }, [side, orders]);

    return (
        <div className="flex flex-col">
            <div className="flex items-center space-x-3 sticky top-14 z-10 py-3 bg-background-1">
                {tabs.map((e) => (
                    <Chip key={e.value} active={side === e.value} className="capitalize" onClick={() => setSide(e.value)}>
                        {e.title}
                    </Chip>
                ))}
            </div>
            {loading ? (
                <LoadingScreen className="pt-10" />
            ) : (
                <div className="flex flex-col gap-3">
                    {orderFilter.length > 0 ? (
                        orderFilter.map((order) => <OrderItem {...order} key={order.displaying_id} currentPair={currentPair} />)
                    ) : (
                        <Nodata className="mt-[120px]" />
                    )}
                </div>
            )}
        </div>
    );
};

export default PositionTab;
