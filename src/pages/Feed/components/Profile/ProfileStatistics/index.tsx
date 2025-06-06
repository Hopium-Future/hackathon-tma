import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import Card from '@/components/common/card';
import Select from '@/components/common/select';
import BorderCard from '@/components/common/BorderCard';
import useProfileFeedStore from '@/stores/profileFeed.store';
import useUserStore from '@/stores/user.store';
import { cn, formatBigNum, formatNumber } from '@/helper';
import { getEarningById } from '@/apis/feed.api';
import { IEarningData } from '@/type/feed.type';

interface IEarningItem {
    title: string;
    value: string;
    valueClassName?: string;
}

const options = [
    { text: '7D', value: '7d' },
    { text: '30D', value: '30d' }
];

const Earning = () => {
    const [time, setTime] = useProfileFeedStore((state) => [state.time, state.setTime]);
    const [earnings, setEarnings] = useState<IEarningData[]>([]);
    const setEarningStore = useProfileFeedStore((state) => state.setEarning);
    const userProfileId = useUserStore((state) => state.userProfileId);
    const earning = earnings.find((item) => item.timeframe === time);

    const fetchEarningData = useCallback(
        async (userId: number) => {
            if (!userProfileId) return;
            try {
                const data = await getEarningById(userId);

                if (data.data) {
                    setEarnings(data.data);
                }
            } catch (error) {
                console.log('Get earning failed: ', error);
            }
        },
        [userProfileId]
    );

    const earningList: IEarningItem[] = useMemo(
        () => [
            {
                title: 'winrate',
                value: `${formatNumber(earning?.winRate || 0, 2)}%`,
                valueClassName: cn(earning?.winRate && 'text-green-1')
            },
            {
                title: 'pnl(usdt)',
                value: `${formatBigNum(earning?.profit || 0, 2, true)}`,
                valueClassName: cn({
                    'text-green-1': earning?.profit && earning.profit > 0,
                    'text-red-1': earning?.profit && earning.profit < 0
                })
            },
            {
                title: 'roi',
                value: `${formatNumber(earning?.roi || 0, 2)}%`,
                valueClassName: cn({
                    'text-green-1': earning?.roi && earning.roi > 0,
                    'text-red-1': earning?.roi && earning.roi < 0
                })
            },
            {
                title: 'copy/counter',
                value: `${(earning?.copies || 0) + (earning?.counters || 0)}`,
                valueClassName: cn((earning?.copies || earning?.counters) && 'text-pure-white')
            }
        ],
        [earning]
    );

    useEffect(() => {
        if (earning) setEarningStore(earning);
    }, [earning, setEarningStore]);

    useEffect(() => {
        userProfileId && fetchEarningData(userProfileId);
    }, [fetchEarningData, userProfileId]);

    return (
        <BorderCard
            hasInsideDots={false}
            outsideDotClassName="after:bg-divider bg-background-2"
            insideDotClassName="bg-divider"
            className="mt-4 p-3 border-divider bg-background-3 flex-col h-full"
        >
            <div className="flex items-center w-full">
                <h3 className="flex-1 text-sm text-main font-bold">Statistics</h3>
                <Card id="value_time" className="!bg-pure-black/70 text-sm relative space-x-1 py-1.5 px-3 border-0.5 border-divider">
                    <Select
                        label="Time: "
                        options={options}
                        value={time}
                        onChange={setTime}
                        container="#value_time"
                        optionClassName="font-bold"
                        labelClassName="font-bold"
                        alignOffset={-13}
                    />
                </Card>
            </div>
            <div className="w-full grid grid-cols-[1fr_1fr_1fr_1.2fr] mt-[10px] [&>:not(:last-child)]:border-r [&>:not(:last-child)]:border-divider">
                {earningList.map(({ title, value, valueClassName }, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-[2px] px-3 w-full">
                        <span className="text-sm uppercase font-bold text-sub">{title}</span>
                        <span className={cn('text-base font-bold text-pure-white', valueClassName)}>{value}</span>
                    </div>
                ))}
            </div>
        </BorderCard>
    );
};

export default memo(Earning);
