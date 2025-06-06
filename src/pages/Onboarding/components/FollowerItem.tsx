import Button from '@/components/common/Button';
import VerifiedIcon from '@/components/icons/VerifiedIcon';
import { cn, formatNumber, truncateText } from '@/helper';
import useUserStore from '@/stores/user.store';
import { TDataFollowOnboard } from '@/type/onboard.type';

type TProps = {
    data: TDataFollowOnboard;
    handleFollow: (user: TDataFollowOnboard) => void;
    onClick?: () => void;
    isFilterTime?: boolean;
};

const FollowerItem = ({ data, handleFollow, onClick, isFilterTime = false }: TProps) => {
    const user = useUserStore((state) => state.user);
    const profit = isFilterTime ? data.profit7d : data.profit;

    return (
        <div className="flex items-center gap-x-3 p-3 bg-background-4 border-divider border justify-between rounded-lg">
            <div className="flex items-center gap-x-3">
                <img onClick={() => onClick && onClick()} src={data.photoUrl || '/images/avatar.png'} className="w-[52px] h-[52px] rounded-full" />
                <div className="flex items-start flex-col gap-y-1">
                    <button
                        className="flex items-center gap-x-1 text-lg text-main whitespace-nowrap line-clamp-1 truncate"
                        onClick={() => onClick && onClick()}
                    >
                        {truncateText(data?.username || `${data.firstName} ${data.lastName}`, 10)}{' '}
                        {data.isPremium ? <VerifiedIcon width={15} height={15} className="w-[15px] h-[15px]" /> : null}
                    </button>
                    <p className="text-sub text-sm">{data.followers || 0} followers</p>
                    <div className="text-xs text-green-1 flex items-center gap-x-1">
                        <p className="px-1.5 py-0.5 bg-background-2 rounded-sm border-[0.5px] border-solid border-divider whitespace-nowrap text-nowrap">
                            Winrate +{formatNumber(isFilterTime ? data.winRate7d : data.winRate, 2)}%
                        </p>
                        <p className="px-1.5 py-0.5 bg-background-2 rounded-sm border-[0.5px] border-solid border-divider whitespace-nowrap text-nowrap">
                            {isFilterTime ? '7D PnL' : 'PnL'} {profit >= 0 ? '+' : '-'}${formatNumber(Math.abs(profit), 2)}
                        </p>
                    </div>
                </div>
            </div>
            {user?._id !== data._id && (
                <div>
                    <Button
                        onClick={() => handleFollow(data)}
                        variant={data.isFollowing ? 'default' : 'primary'}
                        className={cn('px-[14px] py-[5px] text-sm capitalize w-[72px] text-center', {
                            'border border-green-1 bg-green-2 text-green-1': data.isFollowing
                        })}
                    >
                        {data.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FollowerItem;
