import { memo } from 'react';

import Outline from './Outline';
import Stroke from './Stroke';
import PixelCircleBadge from '@/components/common/PixelCircleBadge';
import colors from '@/config/colors';
import { HALL_LEADERBOARD_TAB } from '@/helper/constant';
import { cn } from '@/helper';
import { IHallLeaderboardTab } from '@/type/hall.type';
import { IAchievement } from '@/type/feed.type';

interface IProps {
    type: IHallLeaderboardTab;
    achievement?: IAchievement;
    className?: string;
}
type IDataByType = Record<IHallLeaderboardTab, { title: string; suffixActiveIconUrl: string; emptyIconUrl: string }>;

const AchievementTrophyItem = ({ type, className, achievement }: IProps) => {
    const dataByType: IDataByType = {
        [HALL_LEADERBOARD_TAB.PROFIT]: {
            title: 'Profit',
            suffixActiveIconUrl: '-profit-trophies.png',
            emptyIconUrl: 'empty-trophy-profit.png'
        },
        [HALL_LEADERBOARD_TAB.LOSS]: {
            title: 'Loss',
            suffixActiveIconUrl: '-loss-trophies.png',
            emptyIconUrl: 'empty-trophy-loss.png'
        },
        [HALL_LEADERBOARD_TAB.VOLUME]: {
            title: 'Volume',
            suffixActiveIconUrl: '-volume-trophies.png',
            emptyIconUrl: 'empty-trophy-volume.png'
        },
        [HALL_LEADERBOARD_TAB.COPY_COUNTER]: {
            title: 'Copy&Counter',
            suffixActiveIconUrl: '-copy-trophies.png',
            emptyIconUrl: 'empty-trophy-copy.png'
        }
    };

    const getTrophyIconUrl = () => {
        if (!achievement) return dataByType[type].emptyIconUrl;

        const prefixIconUrl = achievement.rank === 1 ? 'gold' : achievement.rank === 2 ? 'silver' : 'bronze';
        const suffixIconUrl = dataByType[type].suffixActiveIconUrl;
        const fullIconUrl = `${prefixIconUrl}${suffixIconUrl}`;
        return fullIconUrl;
    };

    return (
        <div className={cn('flex items-center justify-between py-[9px] flex-col size-[84px] relative', className)}>
            <Outline className={`${achievement ? 'text-green-2' : 'text-background-4'} absolute size-full top-0 left-0`} />
            <Stroke
                topColor={achievement ? colors.green[9] : colors.divider.DEFAULT}
                bottomColor={achievement ? colors.green[8] : colors.divider.DEFAULT}
                className="absolute size-[calc(100%-4px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <PixelCircleBadge
                content={achievement ? achievement.counter : '#'}
                className="absolute right-0 top-0"
                color={achievement ? colors.green[1] : colors.disable}
            />
            <h4 className={`${achievement ? 'text-pure-white' : 'text-disable'} text-sm font-bold`}>{dataByType[type].title}</h4>
            <img src={`/images/hall/${getTrophyIconUrl()}`} alt="trophy icon" />
        </div>
    );
};

export default memo(AchievementTrophyItem);
