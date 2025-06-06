import Card from '@/components/common/card';
import Modal from '@/components/common/modal';
import { cn, formatNumber, formatTime } from '@/helper';
import { UIEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DepositStatusFilter, StatusFilter, TimeFilter, TypeFilter } from './const';
import { TRANSACTION_STATUS_COLOR, WithdrawalStatusContent } from '@/helper/constant';
import { getPaymentHistory } from '@/apis/payment.api';
import { assetConfigIdMapping } from '@/stores/payment.store';
import useFuturesConfig from '@/stores/futures.store';
import { Transaction } from '@/type/payment-config';
import NoData from '@/components/common/nodata';

type ModalType = 'Type' | 'Status' | 'Time';

interface IWithdrawDepositHistory {
    filterTypes: ModalType[];
    isDepositHistory?: boolean;
}

const WithdrawDepositHistory: React.FC<IWithdrawDepositHistory> = ({ isDepositHistory, filterTypes }) => {
    const assetConfigMapping = useFuturesConfig((state) => assetConfigIdMapping(state.assetsConfig));
    const [data, setData] = useState<{ orders: Transaction[]; hasNext: boolean }>({ orders: [], hasNext: false });
    const [loading, setLoading] = useState(true);
    const [modalFilterType, setModalFilterType] = useState<ModalType | null>(null);

    const [filter, setFilter] = useState({
        type: { value: 'all', title: 'All' },
        status: { value: 'all', title: 'All' },
        time: { value: 'all', title: 'All' }
    });

    const [isScrollEnd, setScrollEnd] = useState(false);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const filterTime = filter.time.value === 'all' ? null : filter.time.value;
            const filterStatus = filter.status.value === 'all' ? null : filter.status.value;
            const lastOrderId = data.orders[data.orders.length - 1];
            const resHistory = await getPaymentHistory({
                type: isDepositHistory ? 1 : 2,
                pageSize: 20,
                lastId: lastOrderId?._id,
                time: filterTime,
                status: filterStatus
            });
            if (resHistory.data?.status === 'ok') {
                const orders = resHistory.data?.data?.orders;
                const hasNext = resHistory.data?.data?.hasNext;

                setData((prev) => ({ orders: [...prev.orders, ...orders], hasNext }));
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }, [isDepositHistory, data.orders, filter]);

    useEffect(() => {
        const abortController = new AbortController();
        const fetchHistory = async () => {
            setLoading(true);

            const filterTime = filter.time.value === 'all' ? null : filter.time.value;
            const filterStatus = filter.status.value === 'all' ? null : filter.status.value;

            try {
                const resHistory = await getPaymentHistory(
                    { type: isDepositHistory ? 1 : 2, pageSize: 20, time: filterTime, status: filterStatus },
                    {
                        signal: abortController.signal
                    }
                );
                if (resHistory.data?.status === 'ok') {
                    setData(resHistory.data.data);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
        if (typeof isDepositHistory === 'boolean') {
            fetchHistory();
        }

        return () => abortController.abort();
    }, [isDepositHistory, filter]);

    const renderFilterModalContent = useCallback(
        (type: ModalType = 'Type') => {
            let filterConst: {
                value: string | number;
                title: string;
            }[] = TypeFilter;
            if (type === 'Status') {
                filterConst = isDepositHistory ? DepositStatusFilter : StatusFilter;
            }

            if (type === 'Time') {
                filterConst = TimeFilter;
            }

            return (
                <div
                    className={cn('grid grid-cols-3 gap-2', {
                        'grid-cols-2': filterConst.length > 3
                    })}
                >
                    {filterConst.map((f) => (
                        <Card
                            onClick={() => {
                                setFilter((prev) => ({ ...prev, [type?.toLowerCase()]: f }));
                                setModalFilterType(null);
                            }}
                            key={f.value}
                            className={cn('flex cursor-pointer text-sub justify-center py-1.5 text-md', {
                                'text-main bg-background-3 font-semibold': filter[type?.toLowerCase() as keyof typeof filter].value === f.value
                            })}
                        >
                            {f.title}
                        </Card>
                    ))}
                </div>
            );
        },
        [filter, isDepositHistory]
    );

    const onScroll = (e: UIEvent<HTMLElement>) => {
        const obj = e.currentTarget;

        if (obj.scrollTop >= obj.scrollHeight - obj.offsetHeight - 1) {
            if (data.hasNext && !loading) {
                fetchHistory();
            }
            setScrollEnd(true);
        } else {
            setScrollEnd(false);
        }
    };

    return (
        <section className="h-full mt-3 space-y-3" style={{ maxHeight: 'calc(100% - 12px - 38px)' /** 12px = mt-3, 38px = tab height */ }}>
            <div className="flex space-x-1.5">
                {filterTypes.map((type) => (
                    <Card key={type} onClick={() => setModalFilterType(type)} className="text-sm cursor-pointer py-1.5 ">
                        {type}: {filter[type.toLowerCase() as keyof typeof filter].title}
                    </Card>
                ))}
            </div>
            <div
                onScroll={onScroll}
                className={cn('h-full relative overflow-y-auto', {
                    'blur-to-bottom': !isScrollEnd
                })}
                style={{ maxHeight: 'calc(100% - 12px - 12px - 24px)' /** 12px = mt-3, 24px = filter element height */ }}
            >
                {data.orders.map((transaction) => {
                    const assetId = transaction?.assetId || 22;
                    const assetConfig = assetConfigMapping[assetId];
                    return (
                        <Link
                            key={transaction?._id}
                            to={`/history/detail/${transaction?._id}`}
                            className="flex items-center justify-between py-3 border-b first:pt-0 last:border-0 border-divider"
                        >
                            <div className="flex flex-col items-start space-y-0.5">
                                <div className="font-semibold text-md">
                                    {transaction?.transactionType === 'on-chain' ? 'On chain' : transaction?.transactionType}
                                </div>
                                <div className="text-sm text-sub">
                                    {formatTime(transaction?.createdAt || transaction?.created_at || new Date(), 'hh:mm:ss dd/MM/yyyy')}
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-0.5">
                                <div className="font-semibold text-md">
                                    {isDepositHistory ? '+' : '-'}
                                    {formatNumber(transaction?.amount, assetConfig?.assetDigit)} {assetConfig?.assetCode}
                                </div>
                                <div className={cn('capitalize text-sm', TRANSACTION_STATUS_COLOR[transaction?.status || 2])}>
                                    {WithdrawalStatusContent[(transaction?.status as keyof typeof WithdrawalStatusContent) || 2]?.toLowerCase()}
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {!loading && !data.orders.length && <NoData className="h-full" />}
            </div>

            <Modal title={modalFilterType?.toUpperCase()} visible={Boolean(modalFilterType)} onClose={() => setModalFilterType(null)}>
                {modalFilterType && renderFilterModalContent(modalFilterType)}
            </Modal>
        </section>
    );
};

export default WithdrawDepositHistory;
