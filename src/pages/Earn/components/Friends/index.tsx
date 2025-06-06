import { memo } from 'react';

import CopyButton from './CopyButton';
import Referrals from './Referrals';
import Button from '@/components/common/Button';
import GiftIcon from '@/components/icons/GiftIcon';
import BorderCard from '@/components/common/BorderCard';
import AssetLogo from '@/components/common/AssetLogo';
import BaseTooltip from '@/components/common/BaseTooltip';
import useUserStore from '@/stores/user.store';
import { formatBigNum, openShareLink } from '@/helper';
import { PARTNER_TYPE } from '@/helper/constant';
import '@/styles/earn.css';

const Friends = () => {
    const user = useUserStore((state) => state.user);
    const userInfo = useUserStore((state) => state.userInfo);
    const tradingFeeCanEarned = userInfo?.partnerType === PARTNER_TYPE.AMBASSADOR ? '35%' : '10%';

    const shareLink = () => {
        if (!user) return;

        openShareLink(user.referralCode);
    };

    const handleOnIntroduction = () => {
        if (user?.referralCode) {
            shareLink();
        }
    };

    return (
        <section className="flex-grow pt-3 flex flex-col">
            <BorderCard className="h-8 bg-linear--dark-green-1">
                <div className="flex items-center gap-[10px]">
                    <GiftIcon className="size-[18px] text-green-1" />
                    <p className="text-sm text-main">
                        Earn <span className="text-green-1 font-bold">{tradingFeeCanEarned} trading fee</span> from Referral
                    </p>
                </div>
            </BorderCard>

            <BorderCard
                outsideDotClassName="after:bg-divider"
                insideDotClassName="bg-divider"
                className="border-divider bg-background-2 flex-col mt-2 mb-6 h-[47px]"
            >
                <div className="flex items-center gap-1">
                    <h3 className="font-bold uppercase text-sm">total commission</h3>
                    <BaseTooltip
                        id="t-tooltip-total-ref-commission"
                        content="Total trading fee commission from friends"
                        place="bottom"
                        contentClassName="max-w-52"
                    />
                </div>
                <div className="flex items-center gap-[5.5px]">
                    <span className="text-md font-bold text-green-1">{formatBigNum(userInfo?.totalCommission || 0, 4, true)}</span>
                    <AssetLogo assetId={22} size={13} />
                </div>
            </BorderCard>

            <Referrals />

            <div className="fixed left-1/2 -translate-x-1/2 px-3 pt-2 pb-8 bottom-16 inline-flex flex-shrink-0 items-center gap-2 w-full bg-pure-black">
                <Button
                    variant="primary"
                    className="text-pure-black whitespace-nowrap uppercase h-[44px] font-bold"
                    title="Invite Friends"
                    onClick={handleOnIntroduction}
                >
                    Invite Friends
                </Button>
                <CopyButton />
            </div>
        </section>
    );
};

export default memo(Friends);
