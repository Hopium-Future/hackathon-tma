import { memo, useCallback, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Nodata from '@/components/common/nodata';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import AssetLogo from '@/components/common/AssetLogo';
import BorderCard from '@/components/common/BorderCard';
import MedalItem from '@/components/common/MedalItem';
import TrophyItem from './TrophyItem';
import MedalSkeletonList from './MedalSkeletonList';
import useUserStore from '@/stores/user.store';
import { getHallLeaderboardApi, IGetHallLeaderboardResponse } from '@/apis/hall.api';
import { cn, formatBigNum, truncateText } from '@/helper';
import { HALL_LEADERBOARD_TAB } from '@/helper/constant';
import { User } from '@/type/auth.type';
import { IHallLeaderboard, IHallLeaderboardTab } from '@/type/hall.type';

interface IProps {
    tab: IHallLeaderboardTab;
}
interface IHeading {
    title: string;
    className?: string;
}
interface IRenderMedalItemParas {
    idx: number | undefined;
    id: string;
    user: User;
    value: number;
}

const HallLeaderBoard = ({ tab }: IProps) => {
    const userLoggedIn = useUserStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [leaderboardData, setLeaderboardData] = useState<IGetHallLeaderboardResponse | null>(null);
    const trophiesList: IHallLeaderboard[] = leaderboardData?.data.length ? leaderboardData.data.slice(0, 3) : [];
    const medalList: IHallLeaderboard[] = leaderboardData?.data.length ? leaderboardData.data.slice(3) : [];

    const headingByTab = {
        [HALL_LEADERBOARD_TAB.PROFIT]: 'pnl',
        [HALL_LEADERBOARD_TAB.LOSS]: 'pnl',
        [HALL_LEADERBOARD_TAB.VOLUME]: 'volume',
        [HALL_LEADERBOARD_TAB.COPY_COUNTER]: 'total'
    };

    const tableHeadings: IHeading[] = [
        {
            title: 'rank',
            className: 'text-left w-10'
        },
        {
            title: 'name',
            className: 'text-left'
        },
        {
            title: headingByTab[tab],
            className: 'text-right'
        }
    ];

    const renderTableValueByTab = useCallback((tab: IHallLeaderboardTab, value: number) => {
        switch (tab) {
            case HALL_LEADERBOARD_TAB.COPY_COUNTER:
                return value;
            case HALL_LEADERBOARD_TAB.VOLUME:
                return formatBigNum(value, 2, true);
            default:
                return `${value > 0 ? '+' : ''}${formatBigNum(value, 2, true)}`;
        }
    }, []);

    const renderDisplayName = useCallback(
        (user: User) => (user._id === userLoggedIn?._id ? 'Me' : user?.username || `${user?.firstName} ${user?.lastName}`),
        [userLoggedIn]
    );

    const renderMedalItem = useCallback(
        ({ idx, id, user, value }: IRenderMedalItemParas) => {
            return (
                // `position: relative` for `tr` tag not working on old IOS version => Use `sticky` instead
                <tr key={id} className="text-md font-bold text-main sticky">
                    <td>{idx !== undefined ? <MedalItem rank={idx + 4} /> : <span className="pl-2">-</span>}</td>
                    <td>
                        <div className="flex items-center gap-2">
                            <LazyLoadImage src={user?.photoUrl || '/images/avatar.png'} alt="user avatar" className="size-6 rounded-full" />
                            <span>{truncateText(renderDisplayName(user), 12)}</span>
                        </div>
                    </td>
                    <td>
                        <div className="flex items-center gap-1 justify-end">
                            <span> {renderTableValueByTab(tab, value)}</span>
                            {tab !== HALL_LEADERBOARD_TAB.COPY_COUNTER && <AssetLogo assetId={22} size={16} />}
                        </div>
                    </td>
                    {userLoggedIn?._id === user._id && (
                        <td className="absolute left-1/2 -top-1 -translate-x-1/2 w-[calc(100%+8px)] -z-10">
                            <BorderCard className="h-8" />
                        </td>
                    )}
                </tr>
            );
        },
        [userLoggedIn, tab, renderTableValueByTab, renderDisplayName]
    );

    const renderItemOutOfMedalList = () => {
        const isCurrentUserInsideList = leaderboardData?.data.find((item) => item.userId === userLoggedIn?._id);
        return isCurrentUserInsideList
            ? null
            : leaderboardData?.me &&
                  renderMedalItem({
                      idx: undefined,
                      id: leaderboardData.me._id,
                      user: leaderboardData.me.user as User,
                      value: leaderboardData.me.value
                  });
    };

    const fetchData = useCallback(async (tab: IHallLeaderboardTab) => {
        try {
            setLoading(true);
            const res = await getHallLeaderboardApi(tab);
            if (res.data) {
                setLeaderboardData(res.data);
            } else {
                console.log('Invalid get-hall-leaderboard response !!');
            }
        } catch (error) {
            console.log('Get earn leaderboard failed!: ', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLeaderboardData(null);
        fetchData(tab);
    }, [tab, fetchData]);

    return (
        <section className="pt-6">
            {/* <start>-------------------- TROPHIES LIST -------------------- */}
            {loading ? (
                <LoadingScreen className="h-[147px]" />
            ) : (
                <div className="flex items-end justify-center gap-[15px] flex-wrap">
                    {trophiesList.map((item, idx) => {
                        const props = {
                            type: tab,
                            value: item.value,
                            ranking: idx,
                            username: renderDisplayName(item.user as User),
                            userPhotoUrl: item.user?.photoUrl,
                            className: idx === 0 ? 'basis-full mb-0 xxs:mb-3 xxs:basis-auto xxs:order-2' : idx === 1 ? 'xxs:order-1' : 'xxs:order-3'
                        };
                        return <TrophyItem key={idx} {...props} />;
                    })}
                </div>
            )}
            {/* <end>---------------------- TROPHIES LIST -------------------- */}

            {/* <start>-------------------- MEDAL LIST ----------------------- */}
            <table className="w-full border-separate border-spacing-y-4">
                <thead>
                    <tr>
                        {tableHeadings.map(({ title, className }) => (
                            <th key={title} className={cn('uppercase text-sm font-normal text-sub py-0', className)}>
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <MedalSkeletonList />
                    ) : (
                        <>
                            {renderItemOutOfMedalList()}
                            {medalList.length
                                ? medalList.map(({ _id, user, value }, idx) =>
                                      renderMedalItem({
                                          idx,
                                          value,
                                          id: _id,
                                          user: user as User
                                      })
                                  )
                                : null}
                        </>
                    )}
                </tbody>
            </table>
            {/* <end>---------------------- MEDAL LIST ----------------------- */}

            {!loading && !medalList.length && <Nodata className="mt-32" />}
        </section>
    );
};

export default memo(HallLeaderBoard);
