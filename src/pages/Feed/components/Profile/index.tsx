import { UIEvent, useRef, useState } from 'react';

import ProfileUserInfo from './ProfileUserInfo';
import ProfileAchievement from './ProfileAchievement';
import ProfileStatistics from './ProfileStatistics';
import ProfileTopTippers from './ProfileTopTippers';
import ProfileCallList from './ProfileCallList';
import ScrollTopButton from '@/components/common/ScrollTopButton';
import ArrowIcon from '@/components/icons/ArrowIcon';
import Modal from '@/components/common/modal';
import useProfileFeedStore from '@/stores/profileFeed.store';
import Follow from '@/pages/Follow';
import { cn } from '@/helper';

const ProfileFeed = ({ showCallListFirst }: { showCallListFirst?: boolean }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isEndPage, setEndPage] = useState(false);
    const [showScrollTopButton, setScrollTopButton] = useState(false);
    const setOpenModalFollower = useProfileFeedStore((state) => state.setOpenModalFollower);
    const openModalFollower = useProfileFeedStore((state) => state.openModalFollower);

    const onScroll = (e: UIEvent<HTMLElement>) => {
        const target = e.currentTarget;

        const isBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 1;
        setScrollTopButton(target.scrollTop > 200);
        setEndPage(isBottom);
    };
    const handleScrollTop = (e: UIEvent<HTMLElement>) => {
        e.preventDefault();
        ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section ref={ref} onScroll={onScroll} className="h-[calc(100vh-80px)] overflow-y-auto hidden-scrollbar">
            {openModalFollower && (
                <Modal
                    visible={openModalFollower}
                    onClose={() => setOpenModalFollower(false)}
                    headerPrefix={
                        <button onClick={() => setOpenModalFollower(false)}>
                            <ArrowIcon size={'md'} />
                        </button>
                    }
                    title="FOLLOWING/FOLLOWERS"
                    isClose={true}
                    closeIconClassName="!size-6 !p-0"
                >
                    <Follow />
                </Modal>
            )}
            <div className={cn(showCallListFirst && 'min-h-[428px]')}>
                <ProfileUserInfo />
                <ProfileAchievement />
                <ProfileStatistics />
                <ProfileTopTippers />
            </div>
            <ProfileCallList isEndPage={isEndPage} showCallListFirst={showCallListFirst} />
            {showScrollTopButton && <ScrollTopButton onClick={handleScrollTop} />}
        </section>
    );
};

export default ProfileFeed;
