import { memo, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import BorderBoard from '@/components/common/BorderBoard';
import AssetLogo from '@/components/common/AssetLogo';
import colors from '@/config/colors';
import { cn, formatBigNum, truncateText } from '@/helper';
import { HALL_LEADERBOARD_TAB } from '@/helper/constant';
import { IHallLeaderboardTab } from '@/type/hall.type';
import AvatarBorderPixel from '@/components/icons/AvatarBorderPixel';

interface IProps {
    type: IHallLeaderboardTab;
    value: number;
    ranking: number;
    username: string;
    userPhotoUrl?: string;
    className?: string;
}
interface ITrophiesData {
    suffixIconUrl: string;
    title: string;
    hasNegativeNumber: boolean;
    hasCurrency: boolean;
}
interface IRankingData {
    title: string;
    strokeColor: string;
    bgColor: string;
}

const TrophyItem = ({ type, value, ranking, username, userPhotoUrl, className }: IProps) => {
    const trophiesDataByType: Record<string, ITrophiesData> = useMemo(
        () => ({
            [HALL_LEADERBOARD_TAB.PROFIT]: {
                title: 'pnl',
                suffixIconUrl: '-profit-trophies.png',
                hasCurrency: true,
                hasNegativeNumber: true
            },
            [HALL_LEADERBOARD_TAB.LOSS]: {
                title: 'pnl',
                suffixIconUrl: '-loss-trophies.png',
                hasCurrency: true,
                hasNegativeNumber: true
            },
            [HALL_LEADERBOARD_TAB.VOLUME]: {
                title: 'volume',
                suffixIconUrl: '-volume-trophies.png',
                hasCurrency: true,
                hasNegativeNumber: false
            },
            [HALL_LEADERBOARD_TAB.COPY_COUNTER]: {
                title: 'total',
                suffixIconUrl: '-copy-trophies.png',
                hasCurrency: false,
                hasNegativeNumber: false
            }
        }),
        []
    );

    const rankingDataByIndex: Record<number, IRankingData> = useMemo(
        () => ({
            0: {
                title: 'gold',
                strokeColor: colors.yellow[1],
                bgColor: colors.yellow[2]
            },
            1: {
                title: 'silver',
                strokeColor: colors.blue[1],
                bgColor: colors.blue[2]
            },
            2: {
                title: 'bronze',
                strokeColor: colors.sub,
                bgColor: colors.background[2]
            }
        }),
        []
    );

    return (
        <div className={cn('flex flex-col items-center gap-2 justify-center h-[135px] w-[112px] p-[10px] relative', className)}>
            <div className="flex flex-col items-center justify-center gap-1">
                <img src={`/images/hall/${rankingDataByIndex[ranking].title}${trophiesDataByType[type].suffixIconUrl}`} alt="trophies icon" className="w-7" />
                <div className="relative">
                    <AvatarBorderPixel className="absolute top-0 left-0" style={{ color: rankingDataByIndex[ranking].strokeColor }} />
                    <LazyLoadImage src={userPhotoUrl || '/images/avatar.png'} alt="user avatar" className="size-6 rounded-full" />
                </div>
                <span className="text-md text-main font-bold line-clamp-1 text-nowrap">{truncateText(username, 10)}</span>
            </div>

            <div className="flex flex-col items-center justify-center">
                <span className="text-sub text-sm uppercase">{trophiesDataByType[type].title}</span>
                <div className="flex items-center gap-1">
                    <span className={cn('text-md font-bold text-green-1', { 'text-red-1': type === HALL_LEADERBOARD_TAB.LOSS })}>
                        {trophiesDataByType[type].hasNegativeNumber ? (value > 0 ? '+' : '') : ''}
                        {trophiesDataByType[type].hasCurrency ? formatBigNum(value, 2, true) : value}
                    </span>
                    {trophiesDataByType[type].hasCurrency && <AssetLogo assetId={22} size={16} />}
                </div>
            </div>

            <BorderBoard
                strokeColor={rankingDataByIndex[ranking].strokeColor}
                bgColor={rankingDataByIndex[ranking].bgColor}
                className="absolute w-full h-full left-0 top-0 -z-10"
            />
        </div>
    );
};

export default memo(TrophyItem);
