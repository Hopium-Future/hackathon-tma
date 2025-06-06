import { useCallback } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';

import UserRole from '@/components/common/UserRole';
import VerifiedIcon from '@/components/icons/VerifiedIcon';
import { AVATAR_BORDER_STYLE, PARTNER_TYPE } from '@/helper/constant';
import { IPostUser } from '@/type/feed.type';
import useUserStore from '@/stores/user.store';
import { cn, formatNumber, truncateText } from '@/helper';
import { followUser, unFollowUser } from '@/apis/feed.api';

interface IProps {
    user: IPostUser;
    onFollow: (isFollowing: boolean, id: number) => void;
}

const UserInfo = ({ user, onFollow }: IProps) => {
    const { user: currentUser, setShowProfileModal } = useUserStore();
    const displayname = user.username || `${user.firstName} ${user.lastName}`;
    const achievement = user.achievement?.length && user.achievement.find((item) => item.timeframe === '30d');
    const userProfit = achievement?.profit || 0;
    const userWinRate = achievement?.winRate || 0;

    const handleFollow = useCallback(async () => {
        onFollow(!user.isFollowing, user._id);

        try {
            const response = user.isFollowing ? await unFollowUser(user._id) : await followUser(user._id);
            if (!response?.data?.success) {
                onFollow(!user.isFollowing, user._id);
                toast.error('Something went wrong');
            }
        } catch (error) {
            onFollow(!user.isFollowing, user._id);
            toast.error('Something went wrong');
        }
    }, [user, onFollow]);

    return user ? (
        <div className="p-2 mb-2 rounded-xl border border-divider bg-background-4">
            <div className="flex items-center gap-2">
                <button className="shrink-0" onClick={() => setShowProfileModal(true, user._id)}>
                    <LazyLoadImage
                        src={user.photoUrl || '/images/avatar.png'}
                        alt=""
                        className={cn('size-9 rounded-full border', AVATAR_BORDER_STYLE[user?.partnerType || 0])}
                    />
                </button>
                <div className="w-full flex items-center justify-between">
                    <div>
                        <UserRole
                            isLoading={false}
                            partnerName={Object.keys(PARTNER_TYPE)[user.partnerType]?.toLowerCase()}
                            partnerType={user.partnerType}
                            className="capitalize"
                        />
                        <div className="mt-1 flex items-center gap-[6px]">
                            <span className="uppercase text-md">{truncateText(displayname, 20)} </span>
                            {user.isPremium && <VerifiedIcon className="w-[12px] h-[12px]" />}
                        </div>
                    </div>
                    {currentUser?._id && currentUser?._id !== user._id && (
                        <button
                            className={cn(
                                'flex items-center justify-center h-6 w-[72px] rounded-[40px] font-bold text-sm uppercase hover:opacity-75 border',
                                !user.isFollowing ? 'border-green-1 text-green-1' : 'text-disable border-disable'
                            )}
                            onClick={handleFollow}
                        >
                            {user.isFollowing ? 'following' : 'follow'}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 py-1 px-2 mt-2 bg-background-2 border border-divider rounded-lg text-sm">
                <div className="flex flex-col items-center justify-center border-r border-divider">
                    <span className="text-sub">PnL</span>
                    <span className={`font-bold ${userProfit >= 0 ? 'text-green-1' : 'text-red-1'}`}>
                        {userProfit >= 0 ? '+' : '-'}${formatNumber(Math.abs(userProfit), 2)}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-sub">Win rate</span>
                    <span className={`font-bold ${userWinRate >= 0 ? 'text-green-1' : 'text-red-1'}`}>{formatNumber(userWinRate, 2)}%</span>
                </div>
            </div>
        </div>
    ) : null;
};

export default UserInfo;
