import { memo, useRef } from 'react';
import StarIcon from '@/components/icons/StarIcon';
import useClickOutside from '@/hooks/useClickOutside';
import useVibration from '@/hooks/useVibration';

interface IProps {
    onSelect: (star: number) => void;
    onCancel: () => void;
}

const PostInfoStarSelect = ({ onSelect, onCancel }: IProps) => {
    const ref = useRef(null);
    const starList = [1, 5, 10, 50, 100];
    const { vibrate } = useVibration();
    useClickOutside(ref, onCancel);
    return (
        <div ref={ref} className="absolute -top-[4.75rem] left-[50%] -translate-x-1/2 w-full flex flex-col gap-y-8 items-center justify-center z-[9999]">
            <div className="flex items-center gap-3 p-[8px] rounded-[35px] bg-background-4 border border-divider">
                {starList.map((star, idx) => (
                    <button
                        key={idx}
                        className="flex gap-[2px] py-[2px] px-1"
                        onClick={() => {
                            onSelect(star);
                            vibrate();
                        }}
                    >
                        <span className="text-main text-base">{star}</span>
                        <StarIcon className="size-[16px] text-yellow-1" />
                    </button>
                ))}
            </div>
            <p className="text-md text-sub mt-[8px] bg-grey-2">Click to select the number of stars to give</p>
        </div>
    );
};

export default memo(PostInfoStarSelect);
