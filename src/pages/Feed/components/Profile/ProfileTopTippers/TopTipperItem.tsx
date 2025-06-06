import { memo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import BackgroundNumber from './BackgroundNumber';
import StarIcon from '@/components/icons/StarIcon';
import { cn, formatNumber, truncateText } from '@/helper';

interface Props {
    avatar?: string;
    username?: string;
    totalStars?: number;
    numberTopTip: string;
    firstName?: string;
    lastName?: string;
}

const TopTipperItem = ({ avatar, username, totalStars, numberTopTip, lastName, firstName }: Props) => {
    const displayname = username || (firstName || lastName ? `${firstName} ${lastName}` : undefined);

    return (
        <div className="flex items-center justify-between">
            <div
                className={cn('flex-1 h-6 flex items-center bg-contain bg-no-repeat', {
                    'bg-[url(/images/profile/top_tipper_1.png)]': numberTopTip === '1',
                    'bg-[url(/images/profile/top_tipper_2.png)]': numberTopTip === '2',
                    'bg-[url(/images/profile/top_tipper_3.png)]': numberTopTip === '3'
                })}
            >
                <div className="ml-0.5">
                    <BackgroundNumber label={numberTopTip} />
                </div>
                <div className="flex items-center gap-x-1 ml-5">
                    {avatar && <LazyLoadImage src={avatar} alt="" className="size-4 rounded-full" />}
                    <span className="text-md font-bold">{displayname ? truncateText(displayname, 25) : 'Nobody'}</span>
                </div>
            </div>
            <div className="space-x-1">
                {totalStars && <span className="text-md font-bold">{formatNumber(totalStars)}</span>}
                <StarIcon className="size-[18px] text-yellow-1" />
            </div>
        </div>
    );
};

export default memo(TopTipperItem);
