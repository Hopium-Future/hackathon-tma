import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';
import Emitter from '@/helper/emitter';

import ProfileShareModal, { ProfileShareModalRef } from './ProfileShareModal';
import UserRole from '@/components/common/UserRole';
import ShareIcon from '@/components/icons/ShareIcon';
import useUserStore from '@/stores/user.store';
import useProfileFeedStore from '@/stores/profileFeed.store';
import { followUser, getProfileById, unFollowUser } from '@/apis/feed.api';
import { AVATAR_BORDER_STYLE, PARTNER_TYPE, PROFILE_FOLLOW_TAB } from '@/helper/constant';
import { cn, formatNumber, truncateText } from '@/helper';
import { IPostUser } from '@/type/feed.type';

const ProfileUserInfo = () => {
    const triggerShareRef = useRef<ProfileShareModalRef>(null);
    const { user: currentUser } = useUserStore();
    const userProfileId = useUserStore((state) => state.userProfileId);
    const setUserStore = useProfileFeedStore((state) => state.setUser);
    const [user, setUser] = useState<IPostUser | null>(null);
    const [openShareImageModal, setOpenShareImageModal] = useState(false);
    const displayname = user?.username || `${user?.firstName} ${user?.lastName}`;

    const fetchUserData = useCallback(
        async (userId: number) => {
            if (!userProfileId) return;
            try {
                const data = await getProfileById(userId);
                if (data.data) {
                    setUser(data.data);
                    setUserStore(data.data);
                }
            } catch (error) {
                console.log('Get profile failed: ', error);
            }
        },
        [setUserStore, userProfileId]
    );

    const handleFollow = useCallback(async () => {
        if (!user) return;
        try {
            const response = user.isFollowing ? await unFollowUser(user._id) : await followUser(user._id);
            if (!response?.data?.success) {
                toast.error('Something went wrong');
            } else {
                const newFollowers = user.isFollowing ? user.followers - 1 : (user.followers || 0) + 1;
                setUser((prev) => (prev ? { ...prev, isFollowing: !prev.isFollowing, followers: newFollowers } : prev));
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    }, [user]);

    const handleOpenShare = (open: boolean) => {
        setOpenShareImageModal(open);
    };

    const onShareImage = () => {
        handleOpenShare(true);
        setTimeout(() => {
            triggerShareRef.current?.onShare();
        }, 1500);
    };

    const setOpenModalFollower = useProfileFeedStore((state) => state.setOpenModalFollower);

    useEffect(() => {
        userProfileId && fetchUserData(userProfileId);
    }, [fetchUserData, userProfileId]);

    useEffect(() => {
        const updateUser = (isFollow: boolean) => {
            setUser((prev) => (prev ? { ...prev, following: isFollow ? prev?.following + 1 : prev.following - 1 } : null));
        };
        Emitter.on('profile:following_updated', updateUser);
        return () => {
            Emitter.off('profile:following_updated', updateUser);
        };
    }, []);

    return (
        <div>
            <div className="flex items-center gap-2">
                <LazyLoadImage
                    src={user?.photoUrl || '/images/avatar.png'}
                    alt=""
                    className={cn('size-16 rounded-full border shrink-0', AVATAR_BORDER_STYLE[user?.partnerType || 0])}
                />
                <div className="w-full flex items-center justify-between">
                    <div>
                        {user ? (
                            <UserRole
                                isLoading={false}
                                partnerName={Object.keys(PARTNER_TYPE)[user.partnerType]?.toLowerCase()}
                                partnerType={user.partnerType}
                                className="capitalize"
                            />
                        ) : (
                            <div className="h-[15px] w-12 bg-disable/25 rounded animate-pulse" />
                        )}

                        {user ? (
                            <h2 className="uppercase text-lg mt-1 font-bold">{truncateText(displayname, 20)} </h2>
                        ) : (
                            <div className="h-[22px] mt-1 rounded bg-disable/25 animate-pulse" />
                        )}

                        <div className="flex items-center gap-x-3 mt-2 text-md font-bold">
                            <button
                                onClick={() => {
                                    setOpenModalFollower(true, PROFILE_FOLLOW_TAB.FOLLOWING);
                                }}
                            >
                                {formatNumber(user?.following)} <span className="text-sub font-normal">Following</span>
                            </button>
                            <div className="w-[1px] h-3 bg-divider" />
                            <button
                                onClick={() => {
                                    setOpenModalFollower(true, PROFILE_FOLLOW_TAB.FOLLOWER);
                                }}
                            >
                                {formatNumber(user?.followers || 0)} <span className="text-sub font-normal">Followers</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {!user ? (
                <div className="h-[38px] mt-6 bg-disable/25 rounded animate-pulse" />
            ) : currentUser?._id && currentUser?._id !== user._id ? (
                <div className="flex items-center gap-x-2 mt-4">
                    <button
                        className={cn(
                            'flex flex-1 items-center justify-center py-2.5 rounded-[4px] font-bold text-md uppercase hover:opacity-75',
                            user.isFollowing ? 'border-green-1 text-green-1 border bg-green-2' : 'bg-green-1 text-pure-black'
                        )}
                        onClick={handleFollow}
                    >
                        {user.isFollowing ? 'following' : 'follow'}
                    </button>
                    <button onClick={onShareImage} className="text-green-1 p-2.5 border border-green-1 bg-green-2 rounded-[4px] hover:opacity-75">
                        <ShareIcon />
                    </button>
                </div>
            ) : (
                <button
                    className="w-full flex items-center gap-x-1 justify-center py-2.5 mt-6 rounded-[4px] font-bold text-md hover:opacity-75 border-green-1 text-green-1 bg-green-2 border uppercase"
                    onClick={onShareImage}
                >
                    <ShareIcon />
                    SHARE MY PROFILE
                </button>
            )}
            <ProfileShareModal
                ref={triggerShareRef}
                open={openShareImageModal}
                onFinished={() => setOpenShareImageModal(false)}
                onCancel={() => setOpenShareImageModal(false)}
            />
        </div>
    );
};

export default memo(ProfileUserInfo);
