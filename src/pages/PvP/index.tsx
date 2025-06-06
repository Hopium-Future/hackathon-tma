import TabCustom from "@/components/common/tabs";
import CircleQuestionIcon from "@/components/icons/CircleQuestionIcon";
import { PVP_TAB } from "@/helper/constant";
import { ListContent, ListTab } from "@/type/tab.type";
import { lazy, useMemo, useState } from "react";
import CreatePosition from "./components/CreatePosition";
import Positions from "./components/Positions";
import "@/styles/pvp.css";

const Drawer = lazy(() => import("@/components/Drawer"));
const Rule = lazy(() => import("./components/Rule"));

const PvP = () => {

    const [rules, setRules] = useState(false);
    const handleToggleRules = () => {
        setRules(pre => !pre);
    };

    const listTab: ListTab[] = useMemo(() => {
        return [{
            value: PVP_TAB.CREATE_POSITION,
            title: 'Create position'
        }, {
            value: PVP_TAB.POSITION_LIST,
            title: 'Position list'
        },];
    }, []);

    const listContent: ListContent[] = [
        {
            value: PVP_TAB.CREATE_POSITION,
            children: <CreatePosition
                type={PVP_TAB.CREATE_POSITION}
            />
        },
        {
            value: PVP_TAB.POSITION_LIST,
            children: <Positions
                type={PVP_TAB.POSITION_LIST}
            />
        },
    ];

    return (
        <div className="px-4 mt-6 pb-[100px]">
            <div className="flex items-center justify-between">
                <p className="font-determination text-determination-3xl">PvP Mode</p>
                <button className="flex items-center gap-x-2 text-primary-1" onClick={handleToggleRules}>
                    <p>Rules</p>
                    <CircleQuestionIcon className="size-4" />
                </button>
            </div>
            <TabCustom
                className="mt-4"
                defaultValue={PVP_TAB.CREATE_POSITION}
                listTab={listTab}
                listTabClassName="[&>button]:w-full"
                listContent={listContent}
            />

            <Drawer isOpen={rules} onClose={handleToggleRules}>
                {rules && <Rule />}
            </Drawer>
        </div>
    );
};

export default PvP;