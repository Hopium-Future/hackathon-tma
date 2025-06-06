import { HISTORY_TABS } from "@/helper/constant";
import { ListContent, ListTab } from "@/type/tab.type";
import { lazy } from "react";
import TabCustom from "../common/tabs";
import HistoryTabHopium from "./HopiumTab";

const HistoryTabPvp = lazy(() => import("./PvpTab"));

export default function History() {
    const listTab: ListTab[] = [{
        value: HISTORY_TABS.HOPIUM,
        title: 'HOPIUM'
    }, {
        value: HISTORY_TABS.PVP,
        title: 'PvP'
    }];

    const listContent: ListContent[] = [
        {
            value: HISTORY_TABS.HOPIUM,
            children: <HistoryTabHopium />
        },
        {
            value: HISTORY_TABS.PVP,
            children: <HistoryTabPvp />
        }
    ];

    return (
        <>
            <p className="font-bold text-2xl">History</p>
            <TabCustom
                defaultValue={HISTORY_TABS.HOPIUM}
                listTab={listTab}
                listTabClassName="[&>button]:w-full"
                listContent={listContent}
                className="mt-3"
            />
        </>
    );
}
