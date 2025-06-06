import { getRankingFriendApi, getRankingGlobalApi, getRankingPvpApi } from "@/apis/ranking.api";
import TabCustom from "@/components/common/tabs";
import useUserStore from "@/stores/user.store";
import { useEffect, useState } from "react";
import { DataTab, ListContent, ListTab } from "../../type/tab.type";
import RankingTab from "./component/RankingTab";
import { RANKING_TAB } from "@/helper/constant";
import ArrowIcon from "@/components/icons/ArrowIcon";
import { useNavigate } from "react-router-dom";

export default function RankingPage() {
    const navigate = useNavigate();
    const [rankingFriend, setRakingFriend] = useState<{ data: DataTab[], hasMore: boolean, total: number; }>({ data: [], hasMore: false, total: 0 });
    const [rankingGlobal, setRakingGlobal] = useState<{ data: DataTab[], hasMore: boolean, total: number; }>({ data: [], hasMore: false, total: 0 });
    const [rankingPvp, setRankingPvp] = useState<{ data: DataTab[], hasMore: boolean, total: number; }>({ data: [], hasMore: false, total: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const user = useUserStore((state) => state.user);

    const listTab: ListTab[] = [{
        value: RANKING_TAB.FRIENDS,
        title: 'Friends'
    }, {
        value: RANKING_TAB.GLOBAL,
        title: 'Global'
    }, {
        value: RANKING_TAB.PVP,
        title: 'PvP'
    }];

    useEffect(() => {
        const fetch = async () => {
            try {
                const [resRankingFriends, resRankingGlobal, resRankingPvp] = await Promise.all([getRankingFriendApi(100), getRankingGlobalApi(100), getRankingPvpApi(100, 0)]);
                if (resRankingFriends.data && resRankingGlobal.data && resRankingPvp.data) {
                    setLoading(false);
                    setRakingFriend(resRankingFriends.data);
                    setRakingGlobal(resRankingGlobal.data);
                    setRankingPvp(resRankingPvp.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetch();
    }, []);

    const listContent: ListContent[] = [
        {
            value: RANKING_TAB.FRIENDS,
            children: <RankingTab
                type={RANKING_TAB.FRIENDS}
                listData={rankingFriend.data}
                totalPlayer={rankingFriend.total ?? rankingFriend.data?.length}
                loading={loading}
            />
        },
        {
            value: RANKING_TAB.GLOBAL,
            children: <RankingTab
                type={RANKING_TAB.GLOBAL}
                listData={rankingGlobal.data}
                totalPlayer={rankingGlobal.total ?? rankingFriend.data?.length}
                user={user ?? undefined}
                loading={loading}
            />
        },
        {
            value: RANKING_TAB.PVP,
            children: <RankingTab
                type={RANKING_TAB.PVP}
                listData={rankingPvp.data}
                totalPlayer={rankingPvp.total ?? rankingFriend.data?.length}
                user={user ?? undefined}
                loading={loading}
            />
        }
    ];

    const backward = () => {
        navigate("/profile");
    };

    return (
        <div className="px-4 pb-24">
            <button className="flex items-center gap-x-2 mt-6" onClick={backward}>
                <ArrowIcon className="size-6" />
                <p className="text-lg font-bold">Back</p>
            </button>
            <section className="mt-3">
                <h1 className=" text-determination-4xl font-determination text-start">Ranking</h1>
                <p className=" text-base  mt-3">Find your place and compete with the top-ranked players!</p>
            </section>
            <section className="mt-10">
                <TabCustom
                    defaultValue={RANKING_TAB.FRIENDS}
                    listTab={listTab}
                    listTabClassName="[&>button]:w-full"
                    listContent={listContent}
                />
            </section>
            <div className="fixed w-full h-24 bottom-0 left-0 bg-background-1" />
        </div>
    );
}