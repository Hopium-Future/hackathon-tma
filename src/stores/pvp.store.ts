import { getPvpPositionsApi } from "@/apis/pvp.api";
import { PvpPosition } from "@/type/pvp.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Result = {
    pvpId: string,
    winnerId: number,
    loserId: number,
};

type Accepted = {
    pvpKey: string;
    acceptorId: number;
};

type Store = {
    positions: PvpPosition[],
    getPositions: () => void,
    loading: boolean,
    error: string,

    results: Result[];
    setResult: (data: Result) => void;
    resetResults: () => void;

    accecpted: Accepted | null;
    setAccecpted: (data: Accepted | null) => void;
};

const usePvPStore = create<Store>()(
    immer(
        (set) => ({
            loading: false,
            error: "",
            positions: [],
            getPositions: async () => {
                set(state => {
                    state.loading = true;
                });
                try {
                    const res = await getPvpPositionsApi();
                    if (res.data) {
                        set(state => {
                            state.positions = res.data;
                        });
                    }
                } catch (error) {
                    const err = error as Error;
                    console.error(`Get positions is error: ${err.message}`);
                } finally {
                    set(state => {
                        state.loading = false;
                    });
                }
            },

            results: [],
            setResult(data) {
                set(state => {
                    state.results.push(data);
                });
            },
            resetResults() {
                set(state => {
                    state.results = [];
                });
            },

            accecpted: null,
            setAccecpted(data) {
                set(state => {
                    state.accecpted = data;
                });
            },
        })
    )
);

export default usePvPStore;