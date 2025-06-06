import { memo, UIEvent, useMemo, useState } from 'react';

import Trade from './Trade';
import Tasks from './Tasks';
import SuccessModal from './SuccessModal';
import { MISSION_TAB, MISSION_TYPE } from '@/helper/constant';
import { cn } from '@/helper';
import Chip from '@/components/common/chip';

const Mission = () => {
    const [isEnd, setIsEnd] = useState(false);
    const [tab, setTab] = useState(MISSION_TAB.TRADE2AIRDROP);

    const tabs = useMemo(() => {
        return [
            {
                _id: 1,
                title: 'Trade2Airdrop',
                value: MISSION_TAB.TRADE2AIRDROP
            },
            {
                _id: 2,
                title: 'social',
                value: MISSION_TAB.SOCIAL
            },
            {
                _id: 3,
                title: 'partnership',
                value: MISSION_TAB.PARTNERSHIP
            }
        ];
    }, []);

    const handleChangeTab = (tab: string) => {
        setTab(tab);
    };

    const handleEnd = (end: boolean) => {
        setIsEnd(end);
    };

    const onScroll = (e: UIEvent<HTMLElement>) => {
        const obj = e.currentTarget;
        if (obj.scrollTop >= obj.scrollHeight - obj.offsetHeight - 1) {
            handleEnd(true);
        } else {
            handleEnd(false);
        }
    };
    return (
        <section>
            <div
                className={cn(
                    'flex-grow max-h-[calc(100vh-95px-60px-38px-32px)] overflow-y-scroll',
                    !isEnd && '[mask-image:linear-gradient(to_bottom,transparent,black_0%,black_90%,transparent)]'
                )}
                onScroll={onScroll}
            >
                <div className="pt-4 flex gap-x-[6px]">
                    {tabs.map((item) => {
                        return (
                            <Chip
                                key={item._id}
                                active={item.value === tab}
                                onClick={() => handleChangeTab(item.value)}
                                className={item.value === tab ? 'tex-white font-bold' : ''}
                            >
                                {item.title}
                            </Chip>
                        );
                    })}
                </div>
                {tab === MISSION_TAB.TRADE2AIRDROP && <Trade />}
                {tab === MISSION_TAB.SOCIAL && <Tasks type={MISSION_TYPE.OUTBOND_MISSION} blur />}
                {tab === MISSION_TAB.PARTNERSHIP && <Tasks type={MISSION_TYPE.PARTNERSHIP} blur />}
            </div>

            <SuccessModal />
        </section>
    );
};

export default memo(Mission);
