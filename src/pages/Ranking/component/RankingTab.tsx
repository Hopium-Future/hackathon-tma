import { RankingNumberOneIcon, RankingNumberThreeIcon, RankingNumberTwoIcon } from "@/components/icons/RankingNumberIcon";
import { DataTab } from "../../../type/tab.type";
import { Table, TableBody, TableCell, TableRow } from "@/components/common/table";
import { User } from "@/type/auth.type";
import { ASSET, RANKING_TAB } from "@/helper/constant";
import { formatBigNum, formatNumber } from "@/helper";
import useUserStore from "@/stores/user.store";
import { LoadingScreen } from "@/components/Loading/LoadingScreen";
import { useEffect, useMemo, useState } from "react";
import { getRankingStatsApi } from "@/apis/ranking.api";
import { LazyLoadImage } from "react-lazy-load-image-component";

type Props = {
    listData: DataTab[];
    type: string;
    totalPlayer: number;
    user?: User;
    loading: boolean;
};

export default function RankingTab({ listData, type, totalPlayer, user, loading }: Props) {
    const [outRankVolume, setOutRankVolume] = useState(0);

    const hopium = useUserStore((state) => state.wallet[ASSET.HOPIUM].available || 0);

    const rankingMe = useMemo(() => (listData || []).find((item) => item.userId === user?._id), [listData, user]);
    const rankingMeIndex = useMemo(() => (listData || []).findIndex((item) => item.userId === user?._id), [listData, user]);

    const inRankData = useMemo(() => {
        if (type === RANKING_TAB.PVP) return formatBigNum(rankingMe?.totalVolume);
        return formatNumber(rankingMe?.point);
    }, [rankingMe, type]);

    const outRankData = useMemo(() => {
        if (type === RANKING_TAB.PVP) return formatBigNum(outRankVolume);
        return formatNumber(hopium);
    }, [type, outRankVolume, hopium]);

    const renderColumOne = (key: number) => {
        switch (key) {
            case 1:
                return <RankingNumberOneIcon />;
            case 2:
                return <RankingNumberTwoIcon />;
            case 3:
                return <RankingNumberThreeIcon />;
            default:
                return `#${key}`;
        }
    };
    const unit = useMemo(() => type === RANKING_TAB.PVP ?
        <LazyLoadImage className="size-3" src="/images/home/hopium.png" /> : "pts", [type]);

    useEffect(() => {

        const getUserVolume = async () => {
            try {
                const res = await getRankingStatsApi();
                setOutRankVolume(res.data.totalVolume);
            } catch (error) {
                const err = error as Error;
                console.log("Error get ranking stats", err.message);
            }
        };

        getUserVolume();
    }, []);

    if (loading) return <div className="h-[585px]"><LoadingScreen /></div>;

    return (

        <div className="min-h-[585px]">
            <div className="flex items-center justify-between text-sub text-sm mt-6">
                <div>
                    {
                        type !== RANKING_TAB.PVP ? `${formatNumber(totalPlayer)} Players` : "Players"
                    }
                </div>
                {
                    type !== RANKING_TAB.PVP ? <div>Score</div> : <div>Winning Volume</div>
                }
            </div>
            {type !== RANKING_TAB.FRIENDS && (
                <div className="flex items-center justify-between text-sm px-2 py-1 mt-3 border border-solid border-primary-1 bg-primary-2 shadow-sm">
                    <div className="flex items-center gap-4 font-bold">
                        <span>{rankingMeIndex !== undefined && rankingMeIndex >= 0 ? `${rankingMeIndex + 1 > 100 ? "+" : ""}${formatNumber(rankingMeIndex + 1)}` : '100+'}</span>
                        <span>Me</span>
                    </div>
                    <div className="font-bold flex items-center gap-x-1">{rankingMe ? inRankData : outRankData} {unit}</div>
                </div>
            )}
            <Table className="w-full">
                <TableBody>
                    {listData.map((data, index) => {
                        const displayName = [data.firstName, data.lastName].filter(Boolean).join(" ") || data.username || data.userId;
                        const point = type === RANKING_TAB.PVP ? formatBigNum(data.totalVolume) : formatNumber(data.point);

                        return (
                            <TableRow key={index} className="px-1">
                                <TableCell className="flex items-center justify-center font-medium">{renderColumOne(index + 1)}</TableCell>
                                <TableCell className="text-start pl-3 w-[50%] font-bold">{displayName}</TableCell>
                                {
                                    type === RANKING_TAB.PVP ?
                                        <TableCell className="text-end w-[50%] font-bold pr-2">
                                            <div className="flex items-center justify-end gap-x-1">
                                                {point}
                                                <LazyLoadImage className="size-3" src="/images/home/hopium.png" />
                                            </div>
                                        </TableCell>
                                        :
                                        <TableCell className="text-end w-[50%] font-bold pr-2">{point} pts</TableCell>
                                }
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}