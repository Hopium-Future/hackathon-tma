import { memo } from 'react';

import CirclePixel from './CirclePixel';
import BackgroundPixel from './BackgroundPixel';
import PixelCircleBadge from '@/components/common/PixelCircleBadge';
import MedalItem from '@/components/common/MedalItem';
import { cn } from '@/helper';
import { HALL_LEADERBOARD_TAB } from '@/helper/constant';
import { IHallLeaderboardTab } from '@/type/hall.type';
import { IAchievement } from '@/type/feed.type';

interface IProps {
    type: IHallLeaderboardTab;
    achievement: IAchievement;
    className?: string;
}

const AchievementMedalItem = ({ type, className, achievement }: IProps) => {
    const titleByType: Record<IHallLeaderboardTab, string> = {
        [HALL_LEADERBOARD_TAB.PROFIT]: 'Profit',
        [HALL_LEADERBOARD_TAB.LOSS]: 'Loss',
        [HALL_LEADERBOARD_TAB.VOLUME]: 'Volume',
        [HALL_LEADERBOARD_TAB.COPY_COUNTER]: 'Copy&Counter'
    };

    return (
        <div className={cn('relative flex items-center gap-[6px] min-w-[76px] min-h-[30px] pr-4 pl-[2px]', className)}>
            <BackgroundPixel className="absolute top-0 left-0" />
            <div className="size-[26.25px] relative flex items-center justify-center flex-shrink-0">
                <CirclePixel className="size-[26.25px] text-green-5 absolute top-0 left-0" />
                <MedalItem className="size-5" contentClassName="text-[6.67px] leading-[6.67px] bottom-[2.8px]" rank={achievement.rank} />
            </div>
            <h3 className="text-main text-sm font-bold relative z-[1]">{titleByType[type]}</h3>
            <PixelCircleBadge content={achievement.counter} className="absolute -top-[6px] right-0" />
        </div>
    );
};

export default memo(AchievementMedalItem);
