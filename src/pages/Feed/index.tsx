import { useMemo, useState } from 'react';
import WebApp from '@twa-dev/sdk';

import Modal from '@/components/common/modal';
import FeedList from './components/FeedList';
import Chip from '@/components/common/chip';
import FeedPageHeader from './components/FeedPageHeader';
import ProfileFeed from './components/Profile';
import useUserStore from '@/stores/user.store';
import { FULLSCREEN_PLATFORMS } from '@/config/fullscreen.config';
import { FEED_TAB } from '@/helper/constant';
import { cn } from '@/helper';

const Feed = () => {
    const [tab, setTab] = useState(FEED_TAB.ALL);
    const getFeedParams = useMemo(() => ({ isFollowing: tab === FEED_TAB.FOLLOWING }), [tab]);
    const isShowProfileModal = useUserStore((state) => state.isShowProfileModal);
    const currentUser = useUserStore((state) => state.user);
    const userProfileId = useUserStore((state) => state.userProfileId);
    const setShowProfileModal = useUserStore((state) => state.setShowProfileModal);

    const isMobileFullScreen = WebApp.isFullscreen && FULLSCREEN_PLATFORMS.includes(WebApp.platform);

    return (
        <section className="px-3 pt-4 h-full pb-12 overflow-hidden bg-linear-end-page">
            <FeedPageHeader />
            <div className="flex items-center gap-2 mb-4 mt-[1px]">
                <Chip
                    active={tab === FEED_TAB.ALL}
                    onClick={() => {
                        setTab(FEED_TAB.ALL);
                    }}
                    className={cn('rounded-lg', { 'tex-white font-bold': tab === FEED_TAB.ALL })}
                >
                    Explore
                </Chip>
                <Chip
                    active={tab === FEED_TAB.FOLLOWING}
                    onClick={() => {
                        setTab(FEED_TAB.FOLLOWING);
                    }}
                    className={cn('rounded-lg', { 'tex-white font-bold': tab === FEED_TAB.FOLLOWING })}
                >
                    Following
                </Chip>
            </div>

            {!isShowProfileModal ? (
                <FeedList params={getFeedParams} />
            ) : (
                <Modal
                    title={currentUser?._id === userProfileId ? 'My Profile' : 'Profile Master'}
                    visible={isShowProfileModal}
                    className="h-screen overflow-hidden bg-background-2"
                    containerClassName={cn('h-full rounded-t-none', { 'pt-11': isMobileFullScreen })}
                    onClose={() => setShowProfileModal(false)}
                >
                    <ProfileFeed />
                </Modal>
            )}
        </section>
    );
};

export default Feed;
