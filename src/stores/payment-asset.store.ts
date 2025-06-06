import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Result = {
    ableToDeposit: boolean,
    ableToWithdraw: boolean,
    active: boolean,
    address: string,
    contractAddress: string,
    createdAt: Date,
    decimals: number,
    feeWithdrawal: number,
    isTestnet: boolean,
    jettonWalletGoverned: string,
    minWithdrawal: number,
    symbol: string,
    updatedAt: Date,
    assetId: number,
    _id: string
};

export type JettonConfigType = {
    [key: string]: {
        address: any;
        decimals: number;
        contractAddress: any;
    };
};

type Store = {
    assetPaymentResults: Result[];
    setAssetPaymentResults: (data: Result[]) => void;
    jettonConfig: JettonConfigType
    setJettonConfig: (data: JettonConfigType) => void;
};

const usePaymentAssetStore = create<Store>()(
    immer(
        (set) => ({
            assetPaymentResults: [],
            jettonConfig: {},
            setAssetPaymentResults(data: Result[]) {
                set(state => {
                    state.assetPaymentResults = data;
                });
            },
            setJettonConfig(data: JettonConfigType) {
                set(state => {
                    state.jettonConfig = data;
                });
            }
        })
    )
);

export default usePaymentAssetStore;