import { getPvpHistoryApi } from "@/apis/history.api";
import { LoadingScreen } from "@/components/Loading/LoadingScreen";
import useUserStore from "@/stores/user.store";
import { HistoryPvpData } from "@/type/history.type";
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CardPvp from "./CardPvp";

const HistoryTabPvp = () => {
  const [dataHistory, setDataHistory] = useState<{ data: HistoryPvpData[], hasMore: boolean; } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const { user } = useUserStore();

  const fetchData = useCallback(async () => {
    try {
      const resHistory = await getPvpHistoryApi({ limit: 10, offset: offset });

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
    fetchData();
  }, []);

  if (loading) return <div className="h-[465px]"><LoadingScreen /></div>;

  return (

    <div id="pvpScrollableDiv" className="tall:max-h-[555px] tall:min-h-[555px] max-h-[465px] min-h-[465px] overflow-y-scroll">
      <InfiniteScroll
        dataLength={dataHistory?.data.length || 0}
        next={fetchData}
        height={465}
        hasMore={dataHistory?.hasMore || false}
        loader={<h4 className="text-base">...</h4>}
        scrollableTarget="pvpScrollableDiv"
      >

        {dataHistory && dataHistory?.data.length > 0 && dataHistory.data.map((item) => {
          const result = item.winnerId === user?._id;
          return (
            <CardPvp
              key={item?._id}
              guess={item.target}
              result={result}
              amount={item.amount}
              volumeWinning={item.volumeWinning}
              createdAt={item.createdAt}
            />
          );
        })}
      </InfiniteScroll>
    </div>

  );
};

export default HistoryTabPvp;