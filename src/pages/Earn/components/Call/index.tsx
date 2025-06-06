import { memo } from 'react';

import GiftIcon from '@/components/icons/GiftIcon';
import StarIcon from '@/components/icons/StarIcon';
import BorderCard from '@/components/common/BorderCard';
import AssetLogo from '@/components/common/AssetLogo';
import BaseTooltip from '@/components/common/BaseTooltip';
import CallList from './CallList';
import { formatBigNum } from '@/helper';

interface IProps {
    commission: number;
    star: number;
}

const Call = ({ commission, star }: IProps) => {
    return (
        <section className="pt-4 flex-grow flex flex-col overflow-hidden">
            <BorderCard className="h-8 mb-2 bg-linear--dark-green-1">
                <div className="flex items-center gap-[10px]">
                    <GiftIcon className="size-[18px] text-green-1" />
                    <p className="text-sm text-main">
                        Earn <span className="text-green-1 font-bold">5%</span> from Copy/Counter Profit
                    </p>
                </div>
            </BorderCard>

            <div className="flex items-center gap-2 h-[47px] mb-6">
                <BorderCard outsideDotClassName="after:bg-divider" insideDotClassName="bg-divider" className="border-divider bg-background-2 flex-col h-full">
                    <h3 className="font-bold uppercase text-sm">commission</h3>
                    <div className="flex items-center gap-1">
                        <span className="text-md font-bold text-green-1">{formatBigNum(commission, 4, true)}</span>
                        <AssetLogo assetId={22} size={13} />
                    </div>
                </BorderCard>

                <BorderCard outsideDotClassName="after:bg-divider" insideDotClassName="bg-divider" className="border-divider bg-background-2 flex-col h-full">
                    <div className="flex items-center gap-1">
                        <h3 className="font-bold uppercase text-sm">total tip</h3>
                        <BaseTooltip
                            id="t-tooltip-total-stars"
                            content="Telegram Stars you earned from others tipping your calls"
                            contentClassName="max-w-56"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-md font-bold text-green-1">{formatBigNum(star, 4, true)}</span>
                        <StarIcon className="size-4 text-yellow-1" />
                    </div>
                </BorderCard>
            </div>

            <CallList />
        </section>
    );
};

export default memo(Call);
