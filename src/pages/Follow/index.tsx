import { useMemo } from 'react';

import FollowList from './FollowList';
import TabCustom from '@/components/common/tabs';
import useProfileFeedStore from '@/stores/profileFeed.store';
import { PROFILE_FOLLOW_TAB } from '@/helper/constant';
import { ListContent, ListTab } from '@/type/tab.type';

const Follow = () => {
    const tab = useProfileFeedStore((state) => state.tabModalFollower);

    const listTab: ListTab[] = [
        {
            value: PROFILE_FOLLOW_TAB.FOLLOWING,
            title: 'Following'
        },
        {
            value: PROFILE_FOLLOW_TAB.FOLLOWER,
            title: 'Followers'
        }
    ];

    const listContent: ListContent[] = useMemo(
        () => [
            {
                value: PROFILE_FOLLOW_TAB.FOLLOWING,
                children: <FollowList tab={PROFILE_FOLLOW_TAB.FOLLOWING} />
            },
            {
                value: PROFILE_FOLLOW_TAB.FOLLOWER,
                children: <FollowList tab={PROFILE_FOLLOW_TAB.FOLLOWER} />
            }
        ],
        []
    );

    return (
        <TabCustom
            defaultValue={tab}
            listTab={listTab}
            listContent={listContent}
            listTabClassName="border mb-6 rounded-md"
            listContentClassName="h-[68vh] overflow-y-auto"
            triggerClassName="flex-1 py-2.5 uppercase font-medium data-[state=active]:text-main text-sub data-[state=active]:border-b"
        />
    );
};

export default Follow;
