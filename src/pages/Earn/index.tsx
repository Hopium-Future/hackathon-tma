import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Campaign from '../Campaign';
import AssetLogo from '@/components/common/AssetLogo';
import UserRole from '@/components/common/UserRole';
import ScriptTextIcon from '@/components/icons/ScriptTextIcon';
import ArrowRightPixelIcon from '@/components/icons/ArrowRightPixelIcon';
import BaseTooltip from '@/components/common/BaseTooltip';
import BorderCard from '@/components/common/BorderCard';
import Call from './components/Call';
import Friends from './components/Friends';
import TiersModal from './components/TiersModal';
import useUserStore from '@/stores/user.store';
import { cn, formatBigNum, truncateText } from '@/helper';
import { AVATAR_BORDER_STYLE, EARN_TAB, PARTNER_TYPE } from '@/helper/constant';
import '@/styles/earn.css';

const Earn = () => {
    const user = useUserStore((state) => state.user);
    const userInfo = useUserStore((state) => state.userInfo);
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [tab, setTab] = useState(searchParams.get('tab') || EARN_TAB.CALL);
    const [showTiersModal, setShowTiersModal] = useState(false);
    const displayname = user?.username || `${user?.firstName} ${user?.lastName}`;
    const totalCommission = (userInfo?.totalCommission || 0) + (userInfo?.totalCallCommission || 0);

    const tabs = useMemo(() => {
        return [
            {
                _id: 1,
                title: 'call',
                value: EARN_TAB.CALL
            },
            {
                _id: 2,
                title: 'referral',
                value: EARN_TAB.FRIENDS
            },
            {
                _id: 3,
                title: 'campaign',
                value: EARN_TAB.CAMPAIGN
            }
        ];
    }, []);

    const handleChangeTab = (tab: string) => {
        navigate(`${pathname}?tab=${tab}`, { replace: true });
        setTab(tab);
    };

    return (
        <section className="h-full pt-4 px-3 flex flex-col">
            <BorderCard outsideDotClassName="after:bg-divider" insideDotClassName="bg-divider" className="border-divider bg-background-2 flex-col">
                <div className="p-3 flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <LazyLoadImage
                            src={user?.photoUrl || '/images/avatar.png'}
                            alt="user avatar"
                            className={cn('size-10 rounded-full border', AVATAR_BORDER_STYLE[user?.partnerType || 0])}
                        />
                        <div className="flex flex-col gap-1">
                            <UserRole isLoading={!userInfo} partnerName={userInfo?.partnerName} partnerType={userInfo?.partnerType} />
                            <p className="font-bold text-white text-md line-clamp-1 break-words">{truncateText(displayname, 10)}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                            <p className="text-sm text-sub font-bold">Total Earning</p>
                            <BaseTooltip
                                id="t-tooltip-total-earning"
                                content="Total earning from Call and Referral commission"
                                contentClassName="max-w-[166px]"
                            />
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <p className="text-white text-md font-bold">{formatBigNum(totalCommission, 4, true)}</p>
                            <AssetLogo className="size-4 text-pure-white" assetId={22} />
                        </div>
                    </div>
                </div>

                {userInfo && userInfo.partnerType !== PARTNER_TYPE.AMBASSADOR && (
                    <button
                        onClick={() => setShowTiersModal(true)}
                        className="p-3 w-full flex items-center justify-between text-green-1 border-t border-divider"
                    >
                        <span className="flex items-center gap-2">
                            <ScriptTextIcon className="size-4" />
                            <span className="text-sm font-bold">Tiers</span>
                        </span>
                        <ArrowRightPixelIcon className="size-[15px]" />
                    </button>
                )}
            </BorderCard>

            <section className="mt-4">
                <div className="border-[0.5px] rounded border-divider flex items-center w-full justify-between px-6">
                    {tabs.map((item) => {
                        return (
                            <button
                                onClick={() => handleChangeTab(item.value)}
                                key={item._id}
                                className={cn('uppercase font-medium flex-1 py-[11px] text-md relative', item.value === tab ? 'text-main' : 'text-disable')}
                            >
                                {item.title}
                                {item.value === tab && <hr className="h-[1px] w-full bg-white shadow-tab absolute -bottom-[0.5px]" />}
                            </button>
                        );
                    })}
                </div>
            </section>

            {tab === EARN_TAB.CALL && <Call commission={userInfo?.totalCallCommission || 0} star={userInfo?.totalStar || 0} />}
            {tab === EARN_TAB.FRIENDS && <Friends />}
            {tab === EARN_TAB.CAMPAIGN && <Campaign />}

            <TiersModal visible={showTiersModal} onClose={() => setShowTiersModal(false)} />
        </section>
    );
};

export default Earn;
