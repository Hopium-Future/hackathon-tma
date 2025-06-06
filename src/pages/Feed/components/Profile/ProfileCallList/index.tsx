import { memo, useMemo, useState, useRef, useEffect } from 'react';

import CallList from './CallList';
import Chip from '@/components/common/chip';
import useUserStore from '@/stores/user.store';
import { PROFILE_CALL_LIST_TYPE } from '@/helper/constant';
import { cn } from '@/helper';
import { IProfileCallListType } from '@/type/feed.type';
import WebApp from '@twa-dev/sdk';

type IProps = {
    isEndPage: boolean;
    showCallListFirst?: boolean;
};

const ProfileCallList = ({ isEndPage, showCallListFirst }: IProps) => {
    const [tab, setTab] = useState('');
    const userProfileId = useUserStore((state) => state.userProfileId);
    const userCallListCounts = useUserStore((state) => state.userCallListCounts);
    const refContainer = useRef<HTMLDivElement>(null);
    const tabs = [
        {
            title: 'All',
            value: '',
            total: userCallListCounts.total
        },
        {
            title: 'Order',
            value: PROFILE_CALL_LIST_TYPE.PENDING,
            total: userCallListCounts.pending
        },
        {
            title: 'Position',
            value: PROFILE_CALL_LIST_TYPE.POSITION,
            total: userCallListCounts.position
        },
        {
            title: 'Closed',
            value: PROFILE_CALL_LIST_TYPE.CLOSED,
            total: userCallListCounts.closed
        }
    ];

    const getCallListParams = useMemo(
        () => ({
            userId: userProfileId || 0,
            ...(tab && { type: tab as IProfileCallListType })
        }),
        [tab, userProfileId]
    );
    useEffect(() => {
        if (showCallListFirst && refContainer.current && refContainer.current?.parentElement) {
            refContainer.current.parentElement.scrollTop = refContainer.current.offsetTop - ((WebApp?.safeAreaInset?.top ? 44 : 0) + 80);
        }
    }, [showCallListFirst]);

    return (
        <div ref={refContainer} className={cn(showCallListFirst && 'min-h-screen')}>
            <div className="bg-background-2">
                <h2 className="text-lg text-main uppercase font-bold pt-1">Call list</h2>
                <div className="overflow-x-auto thin-scroll-bar mb-1">
                    <div className="flex gap-2 pt-3 pb-1 mb-[2px] px-[1px]">
                        {tabs.map((item) => (
                            <Chip
                                key={item.value}
                                active={tab === item.value}
                                onClick={() => setTab(item.value)}
                                className={cn('rounded-lg flex items-center gap-1 mb-[2px] border border-divider ring-transparent', {
                                    'tex-white font-bold': tab === item.value,
                                    'bg-background-3': tab === item.value
                                })}
                            >
                                <span>{item.title}</span>
                                <span>({item.total})</span>
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>
            <section className="flex flex-col pb-28">{<CallList isEndPage={isEndPage} params={getCallListParams} />}</section>
        </div>
    );
};

export default memo(ProfileCallList);
