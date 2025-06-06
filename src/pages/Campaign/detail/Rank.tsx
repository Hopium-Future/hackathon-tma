import AssetLogo from '@/components/common/AssetLogo';
import TailFristIcon from '@/components/icons/TailFirstIcon';
import TailSecondIcon from '@/components/icons/TailSecondIcon';
import TailThirdIcon from '@/components/icons/TailThirdIcon';
import { cn, formatNumber2, truncateText } from '@/helper';
import { FC, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type RankProps = {
    rank: number;
    volume: number;
    name: string;
    photoUrl: string;
};

const Rank: FC<RankProps> = ({ rank, volume, name, photoUrl }) => {
    const tail = useMemo(() => {
        switch (rank) {
            case 1:
                return <TailFristIcon className="h-5 w-[18px]" />;

            case 2:
                return <TailSecondIcon className="h-5 w-[18px]" />;

            case 3:
                return <TailThirdIcon className="h-5 w-[18px]" />;

            default:
                return null;
        }
    }, [rank]);
    return (
        <div className="items-center flex justify-between h-5 relative">
            <section
                className={cn(
                    `size-[3px] absolute top-0 left-0`,
                    'bg-pure-black',
                    "after:absolute after:contents-[''] after:size-[1.5px] after:bottom-0 after:right-0 after:block",
                    'after:bg-[#FFB62933]'
                )}
            />
            <section
                className={cn(
                    `size-[3px] absolute bottom-0 left-0`,
                    'bg-pure-black',
                    `after:absolute after:contents-[''] after:size-[1.5px] after:top-0 after:right-0 after:block`,
                    'after:bg-[#FFB62933]'
                )}
            />
            <div className="flex items-center flex-1 flex-shrink-0">
                <div
                    className={cn(
                        'flex items-center bg-no-repeat bg-cover w-full ',
                        rank === 1 && 'bg-[#FFB62933]',
                        rank === 2 && 'bg-[#1991FF33]',
                        rank === 3 && 'bg-background-3'
                    )}
                >
                    <div className="w-[50px] p-0.5">
                        <div className="text-md w-4 relative">
                            {rank < 4 ? <LazyLoadImage src={`/images/campaign/${rank}.png`} alt="daily" className={cn('size-4')} /> : null}
                            <p
                                className={cn(
                                    ' font-bold absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
                                    rank < 4 ? 'text-pure-black' : 'text-main'
                                )}
                            >
                                {rank}
                            </p>
                        </div>
                    </div>
                    <div className="text-md text-main flex items-center gap-1">
                        <LazyLoadImage src={photoUrl} alt={name} width={16} height={16} className="size-4 object-cover rounded-full" />
                        <p>{truncateText(name, 20)}</p>
                    </div>
                </div>
                {tail}
            </div>
            <div className="text-md text-main flex items-center gap-1">
                <p>{formatNumber2(volume)}</p>
                <AssetLogo assetId={22} size={13} />
            </div>
        </div>
    );
};

export default Rank;
