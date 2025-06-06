import ArrowIcon from '@/components/icons/ArrowIcon';
import { cn } from '@/helper';
import { lazy, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TabValue, TabValues, Tabs } from './config';

const WithdrawDepositHistory = lazy(() => import('./components/WithdrawDepositHistory'));

const PaymentHistory = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const headerRef = useRef<HTMLDivElement | null>(null);

    const [tab, setTab] = useState<TabValue | null>(null);
    const tabValue = searchParams.get('tab');

    const isValidTab = tabValue && TabValues.includes(tabValue);

    useEffect(() => {
        if (tabValue && isValidTab) {
            setTab(tabValue as TabValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValidTab, tabValue]);

    const onHandleChangeTab = (tab: TabValue) => {
        navigate('/payment-history?tab=' + tab, { replace: true });
    };

    return (
        <div className="h-full px-4 pt-4">
            <div ref={headerRef} className="flex items-center ">
                <ArrowIcon className="cursor-pointer" onClick={() => navigate(-1)} />
                <h1 className="mx-auto text-2xl font-semibold uppercase">History</h1>
            </div>
            <div className="h-full mt-3" style={{ maxHeight: `calc(100% - ${12 + 26}px)` /** 12 = mt-3, 26 is header height */ }}>
                <div className="rounded ring-[0.5px] ring-divider">
                    <div className="flex justify-start w-full rounded ">
                        {Tabs.map((_tab) => {
                            const isActive = tab === _tab.value;
                            return (
                                <div
                                    onClick={() => onHandleChangeTab(_tab.value)}
                                    className={cn('cursor-pointer h-[38px] text-base uppercase w-full justify-center relative p-2 flex items-center gap-x-2 ', {
                                        'text-main font-bold after:absolute after:w-[calc(100%-40px)]  after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:bg-white after:shadow-[0px,0px,4px,0px,#FFFFFF]':
                                            isActive,
                                        'text-disable font-normal border-transparent': !isActive
                                    })}
                                    key={_tab.value}
                                >
                                    {_tab.title}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {tab === 'deposit' && <WithdrawDepositHistory isDepositHistory filterTypes={['Status', 'Time']} />}
                {tab === 'withdraw' && <WithdrawDepositHistory isDepositHistory={false} filterTypes={['Status', 'Time']} />}
            </div>
        </div>
    );
};

export default PaymentHistory;
