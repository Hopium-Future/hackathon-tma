import { memo, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ArrowIcon from '@/components/icons/ArrowIcon';
import useUserStore from '@/stores/user.store';
import { AVATAR_BORDER_STYLE } from '@/helper/constant';
import { cn } from '@/helper';
import BellIcon from '@/components/icons/BellIcon';
import { useNavigate } from 'react-router-dom';
import { getMarkAsReadNotifications, getNotifications } from '@/apis/notification.api';
import SearchIcon from '@/components/icons/SearchIcon';
import SearchProfileModal from './SearchProfileModal';

const FeedPageHeader = () => {
    const user = useUserStore((state) => state.user);
    const setShowProfileModal = useUserStore((state) => state.setShowProfileModal);
    const [openSearchProfileModal, setOpenSearchProfileModal] = useState(false);
    const [numOfUnread, setNumOfUnread] = useState(0);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        const data = await getNotifications({ type: 'ALL' });
        setNumOfUnread(data?.numOfUnread || 0);
    };
    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNavigate = async () => {
        await getMarkAsReadNotifications();
        navigate('/notification');
    };
    return (
        <>
            <header className="flex pb-4 items-center justify-between sticky top-0 z-20 bg-pure-black">
                <button onClick={() => setShowProfileModal(true, user?._id)} className="flex items-center gap-2 bg-grey-1 rounded-[70px] border border-gold-1">
                    <LazyLoadImage
                        src={user?.photoUrl || '/images/avatar.png'}
                        alt=""
                        className={cn('size-8 rounded-full border ', AVATAR_BORDER_STYLE[user?.partnerType || 0])}
                    />
                    <span className="flex items-center gap-1 py-1 pr-4">
                        <span className="uppercase text-sm text-pure-white font-bold">profile</span>
                        <ArrowIcon className="rotate-180 size-[14px]" />
                    </span>
                </button>
                <div className="flex gap-2 items-center justify-center">
                    <button
                        onClick={() => setOpenSearchProfileModal(true)}
                        className="relative flex items-center justify-center size-8 rounded-full border border-divider bg-background-2"
                    >
                        <SearchIcon className="size-4 text-pure-white" color="currentColor" />
                    </button>
                    <button
                        className="relative flex items-center justify-center size-8 rounded-full border border-divider bg-background-2"
                        onClick={() => handleNavigate()}
                    >
                        <BellIcon className="text-pure-white" size="sm" />
                        {numOfUnread > 0 && <p className="absolute w-[6px] h-[6px] bg-red-1 rounded-full right-2 top-2" />}
                    </button>
                </div>
            </header>

            <SearchProfileModal visible={openSearchProfileModal} onClose={() => setOpenSearchProfileModal(false)} />
        </>
    );
};

export default memo(FeedPageHeader);
