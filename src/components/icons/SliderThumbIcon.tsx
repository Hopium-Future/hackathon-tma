import { memo } from 'react';
import { cn } from '@/helper';
import colors from '@/config/colors';

const SliderThumbIcon = ({ active, className }: { active: boolean; className?: string }) => {
    const colorActive = active ? colors.green[1] : colors.black;
    return (
        <svg className={cn('slider_track_icon min-w-[2px]', className)} xmlns="http://www.w3.org/2000/svg" width="2" height="6" viewBox="0 0 2 6" fill="none">
            <rect y="1" width="1" height="4" fill={colors.divider.DEFAULT} />
            <rect x="1" width="1" height="1" fill={colors.divider.DEFAULT} />
            <rect x="1" y="5" width="1" height="1" fill={colors.divider.DEFAULT} />
            <rect width="1" height="4" transform="matrix(-1 0 0 1 2 1)" fill={colorActive} />
        </svg>
    );
};

export default memo(SliderThumbIcon);
