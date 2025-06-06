import colors from '@/config/colors';
import { cn } from '@/helper';
import { useEffect, useState } from 'react';

interface VolumeSliderProps {
    volume: number | string;
    volumeConfig: { min: number; max: number };
    onChange: (value: string) => void;
    className?: string;
}

const VolumeSlider = ({ volume, volumeConfig, onChange, className }: VolumeSliderProps) => {
    const [ratio, setRatio] = useState(0);

    const getVolumeRatio = (volume: number, volumeConfig: { min: number; max: number }) => {
        return Math.floor(((volume - volumeConfig.min) / (volumeConfig.max - volumeConfig.min)) * 100);
    };

    useEffect(() => {
        const _ratio = volume && volumeConfig.max ? getVolumeRatio(+volume, volumeConfig) : 0;
        setRatio(Math.min(_ratio, 100));
    }, [volumeConfig.max, volume]);

    const onHandleChange = (value: string) => {
        onChange(value);
    };

    return (
        <div className={cn('flex items-center justify-center h-9 text-xs uppercase space-x-2', className)}>
            <span>MIN</span>
            <div id="slider_volume" className="relative flex-1 flex items-center">
                <input
                    type="range"
                    className="w-full"
                    min={volumeConfig.min}
                    max={volumeConfig.max}
                    value={volume || 0}
                    onChange={(e) => onHandleChange(e.target.value)}
                />
                <div className="slider_track w-full flex items-center">
                    <SliderTrackIcon active={ratio > 0} />
                    <div className="relative h-[6px] flex justify-center items-center w-full bg-background-1 border-t border-b border-divider">
                        <div
                            className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center w-full bg-green-1 h-[6px]"
                            style={{ width: `${ratio}%`, maxWidth: 'calc(100%-4px)' }}
                        ></div>
                    </div>
                    <SliderTrackIcon className="rotate-180" active={ratio >= 100} />
                </div>
            </div>
            <span>MAX</span>
        </div>
    );
};

const SliderTrackIcon = ({ active, className }: { active: boolean; className?: string }) => {
    const colorActive = active ? colors.green[1] : 'black';
    return (
        <svg className={cn('slider_track_icon min-w-[2px]', className)} xmlns="http://www.w3.org/2000/svg" width="2" height="6" viewBox="0 0 2 6" fill="none">
            <rect y="1" width="1" height="4" fill={colors.divider.DEFAULT} />
            <rect x="1" width="1" height="1" fill={colors.divider.DEFAULT} />
            <rect x="1" y="5" width="1" height="1" fill={colors.divider.DEFAULT} />
            <rect width="1" height="4" transform="matrix(-1 0 0 1 2 1)" fill={colorActive} />
        </svg>
    );
};
export default VolumeSlider;
