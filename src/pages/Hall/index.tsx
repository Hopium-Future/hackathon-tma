import { useMemo, useState } from 'react';

import HallLeaderBoard from './HallLeaderBoard';
import { HALL_LEADERBOARD_TAB } from '@/helper/constant';
import { cn } from '@/helper';
import { IHallLeaderboardTab } from '@/type/hall.type';

const Hall = () => {
    const [tab, setTab] = useState<IHallLeaderboardTab>(HALL_LEADERBOARD_TAB.PROFIT);

    const tabs = useMemo(() => {
        return [
            {
                title: 'profit',
                value: HALL_LEADERBOARD_TAB.PROFIT
            },
            {
                title: 'loss',
                value: HALL_LEADERBOARD_TAB.LOSS
            },
            {
                title: 'vol',
                value: HALL_LEADERBOARD_TAB.VOLUME
            },
            {
                title: 'copy&counter',
                value: HALL_LEADERBOARD_TAB.COPY_COUNTER
            }
        ];
    }, []);

    return (
        <main className="pt-4">
            <header className="h-[114px] bg-[url(/images/hall/wing.png)] bg-contain bg-center bg-no-repeat flex items-center justify-center">
                <div className="flex-col gap-1 max-w-[188px] items-center justify-center">
                    <h2 className="uppercase font-bold text-3xl text-pure-white text-center">hall of fame</h2>
                    <p className="text-sm text-sub text-center">Shows 30-day results, refresh at the start of each month</p>
                </div>
            </header>

            <article className="px-3 pt-2">
                <div className="border-[0.5px] rounded border-divider flex items-center gap-[45.33px] w-full justify-between px-6 overflow-x-auto no-scrollbar overflow-y-hidden">
                    {tabs.map((item) => {
                        return (
                            <button
                                onClick={() => setTab(item.value)}
                                key={item.value}
                                className={cn('uppercase font-medium flex-1 py-[11px] text-md relative', item.value === tab ? 'text-main' : 'text-disable')}
                            >
                                {item.title}
                                {item.value === tab && <hr className="h-[1px] w-full bg-white shadow-tab absolute -bottom-[0.5px]" />}
                            </button>
                        );
                    })}
                </div>

                <HallLeaderBoard tab={tab} />
            </article>
        </main>
    );
};

export default Hall;
