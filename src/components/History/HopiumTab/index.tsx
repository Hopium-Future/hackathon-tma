import { getGameStatsApi, getGameTurnApi } from "@/apis/history.api";
import { LoadingScreen } from "@/components/Loading/LoadingScreen";
import { formatNumber } from "@/helper";
import { HistoryData, StatsData } from "@/type/history.type";
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CardHistory from "./CardHistory";

const HistoryTabHopium = () => {
    const [dataHistory, setDataHistory] = useState<{ data: HistoryData[], hasMore: boolean; } | null>(null);
    const [dataStats, setDataStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);

    const fetchHistoryHopium = useCallback(async () => {
        try {
            const resHistory =  await getGameTurnApi({ state: "CLOSED", limit: 10, offset: offset })
            if (resHistory?.data) {
                setDataHistory(prevState => {
                    if (!prevState) return { ...resHistory.data, data: resHistory.data.data };
                    return { ...resHistory.data, data: [...prevState.data, ...resHistory.data.data] };
                });
                setLoading(false);
                setOffset(pre => pre + 10);
            }
        } catch (error) {
            console.log(error);
        }
    }, [offset]);

    useEffect(() => {
        const fetchStatsInformation = async () => {
            try {
                const resStats = await getGameStatsApi();
                setDataStats(resStats.data);
            } catch (error) {
                console.error("Get stats error: ", error)
            }
        };

        fetchStatsInformation()
        fetchHistoryHopium();
    }, []);

    if (loading) return <div className="h-[465px]"><LoadingScreen /></div>;

    return (

        <div id="hopiumScrollableDiv" className="relative tall:max-h-[555px] tall:min-h-[555px] max-h-[465px] min-h-[465px] overflow-y-scroll">
            <div className="sticky -top-0 z-50 pt-4 bg-background-2">
                <div className="flex items-center justify-between gap-x-2">
                    <div className="bg-predict-winrate flex items-center gap-x-1 justify-center w-[178px] h-[38px]">
                        <div className="space-x-1">
                            <span className="text-sub">📌 Predictions:</span>
                            {dataStats?.total && <span className="font-bold">{dataStats.total}</span>}
                        </div>
                    </div>
                    <div className="bg-predict-winrate flex items-center gap-x-1 justify-center w-[178px] h-[38px]">
                        <div className="space-x-1">
                            <span className="text-sub">🎉 Win rate:</span>
                            {dataStats?.win && dataStats?.total && <span className="font-bold">{formatNumber(dataStats?.win / dataStats?.total * 100, 2)}%</span>}
                        </div>
                    </div>
                </div>
            </div>

            <InfiniteScroll
                dataLength={dataHistory?.data.length || 0}
                next={fetchHistoryHopium}
                height={465}
                hasMore={dataHistory?.hasMore || false}
                loader={<h4 className="text-base">...</h4>}
                scrollableTarget="hopiumScrollableDiv"
            >

                {dataHistory && dataHistory?.data.length > 0 && dataHistory.data.map((item) => {
                    return (
                        <CardHistory
                            key={item._id}
                            guess={item.side}
                            result={item.result}
                            pnl={item.profit}
                            streak={item.winStreak}
                            closeTime={item.closeTime}
                        />
                    );
                })}
            </InfiniteScroll>


        </div>
    );
};

export default HistoryTabHopium;