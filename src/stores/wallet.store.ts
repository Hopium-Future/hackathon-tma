import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import { getLoanConfig, getLoanPriceAll, getWalletBalance } from '@/apis/wallet.api';
import { WalletBalanceResponse } from '@/type/wallet.type';
import { ASSET_ID_USDT, PRICE_USDT, ASSET_ID_L_USDT, ASSET_ID_C_USDT } from '@/pages/Wallet/constants';

enableMapSet();

type PriceDataProps = {
    p: string;
    s: string;
    t: number;
};

type Store = {
    balance: number;
    available: number;
    avgLTV: number;
    tokenValue: number;
    immediateBalance: number;
    initData: () => void;
    loading: boolean;
    initPriceMap: Map<number, number> | any;
    dataWallet: WalletBalanceResponse | any;
    initLoanConfig: any;
    updatePriceFromSocket: (priceData: PriceDataProps) => void;
    calculateBalanceAndAvailable: () => void;
    calcAvg: () => void;
    setWalletData: (data: any) => void;
    liquidation: number;
    amountBorrowed: number;
    borrowable: number;
    maxLoan: number;
};

const useWalletStore = create<Store>()(
    immer((set, get) => ({
        balance: 0,
        available: 0,
        avgLTV: 0,
        tokenValue: 0,
        immediateBalance: 0,
        initPriceMap: null,
        dataWallet: null,
        initLoanConfig: null,
        loading: true,
        liquidation: 0,
        amountBorrowed: 0,
        borrowable: 0,
        maxLoan: 0,
        initData: async () => {
            if (!get().loading) return;

            const dataLoanConfig = await getLoanConfig();
            const dataLoanPriceAll = await getLoanPriceAll();
            const dataBalance = await getWalletBalance();

            const newDataWallet = Object.keys(dataBalance).reduce((acc: any, assetId) => {
                const assetData = dataLoanConfig.find((item: any) => item.baseAssetId == assetId || item.quoteAssetId == assetId);
                const formatAssetId = +assetId;
                const isUsdtRelatedAsset = [ASSET_ID_USDT].includes(formatAssetId);

                const value = dataBalance?.[formatAssetId]?.value || 0;
                const lockedValue = dataBalance?.[formatAssetId]?.lockedValue || 0;
                if (assetData) {
                    acc.push({
                        assetId: formatAssetId,
                        value: value >= 0.000000001 ? value : 0,
                        lockedValue: lockedValue >= 0.000000001 ? lockedValue : 0,
                        ltv: isUsdtRelatedAsset ? PRICE_USDT : assetData.ltv,
                        liquidationRate: isUsdtRelatedAsset ? PRICE_USDT : assetData.liquidationRate,
                        price: isUsdtRelatedAsset ? PRICE_USDT : dataLoanConfig?.[assetData.baseAssetId]?.price || 0
                    });
                } else {
                    acc.push({
                        assetId: formatAssetId,
                        value: dataBalance?.[formatAssetId]?.value || 0,
                        lockedValue: dataBalance?.[formatAssetId]?.lockedValue || 0,
                        ltv: 0,
                        liquidationRate: 0,
                        price: 0
                    });
                }

                return acc;
            }, []);

            set({ initPriceMap: dataLoanPriceAll, dataWallet: newDataWallet, initLoanConfig: dataLoanConfig });

            if (get().dataWallet?.length > 0) {
                get().calculateBalanceAndAvailable();
                get().calcAvg();
                set({ loading: false });
            }
        },
        // Tính toán balance và available
        calculateBalanceAndAvailable: () => {
            const { dataWallet, initPriceMap, balance, available } = get();
            if (!dataWallet || !initPriceMap) return;

            let totalBalance = 0;
            let totalAvailable = 0;

            dataWallet.forEach(({ assetId, value, ltv, lockedValue }: { lockedValue: number; assetId: string; value: number; ltv: number }) => {
                const isUSDT = [ASSET_ID_USDT, ASSET_ID_C_USDT].includes(+assetId);
                const isLUSDT = [ASSET_ID_L_USDT].includes(+assetId);

                const price = isUSDT ? PRICE_USDT : initPriceMap.get(+assetId) || 0;
                const _ltv = price * (isUSDT ? 1 : isLUSDT ? 0 : ltv);

                // Tính toán giá trị tổng hợp
                const adjustedValue = value * _ltv;
                const adjustedAvailable = (value - lockedValue) * _ltv;

                totalBalance += adjustedValue;
                totalAvailable += adjustedAvailable;
            });

            // Chỉ cập nhật trạng thái nếu giá trị thay đổi
            if (totalBalance !== balance || totalAvailable !== available) {
                set({
                    balance: totalBalance,
                    available: Math.max(totalAvailable, 0)
                });
            }
        },

        // Tính toán avg ltv
        calcAvg: () => {
            const { dataWallet, initPriceMap, liquidation, amountBorrowed } = get();

            if (!dataWallet || !initPriceMap) return;

            let totalLiquidation = 0; // Ngưỡng thanh lý
            let totalAmountBorrowed = 0; // Số lượng đã vay
            let totalImmediateBalance = 0; //
            let totalBorrowable = 0; // số lượng lock token vay
            let totalMaxLoan = 0;

            dataWallet.forEach(
                ({
                    assetId,
                    value,
                    liquidationRate,
                    ltv,
                    lockedValue
                }: {
                    lockedValue: number;
                    assetId: string;
                    value: number;
                    liquidationRate: number;
                    ltv: number;
                }) => {
                    // Lấy giá token
                    const price = initPriceMap.get(+assetId) || 0;

                    if (+assetId !== ASSET_ID_USDT || +assetId !== ASSET_ID_L_USDT) {
                        const available = value - lockedValue;
                        const tokenValue = available * price;
                        totalLiquidation += tokenValue * liquidationRate; // ngưỡng thanh lý
                        totalImmediateBalance += available * price * ltv; // Tổng giá trị ngay lập tức
                        totalBorrowable += lockedValue * price * ltv;
                        totalMaxLoan += value * price * ltv;
                    }
                    if (+assetId === ASSET_ID_USDT) {
                        totalAmountBorrowed = Math.max(lockedValue - value, 0); // Số tiền vay
                    }
                }
            );

            // Chỉ cập nhật trạng thái khi giá trị thay đổi
            if (liquidation !== totalLiquidation || amountBorrowed !== totalAmountBorrowed) {
                set({
                    liquidation: totalLiquidation,
                    amountBorrowed: totalAmountBorrowed,
                    immediateBalance: totalImmediateBalance,
                    borrowable: totalBorrowable,
                    maxLoan: totalMaxLoan
                });
            }
        },
        // Cập nhật giá từ socket và tính lại balance, available
        updatePriceFromSocket: (priceData) => {
            set((state) => {
                const { p, s } = priceData;

                if (!p || !s) return;

                const initLoanConfig = get().initLoanConfig || [];
                const newData = initLoanConfig.find((f: { symbol: string }) => f.symbol === s);

                if (!newData) return;

                const currentPrice = state.initPriceMap?.get(newData.baseAssetId);

                // Chỉ cập nhật trạng thái khi giá thay đổi
                if (currentPrice !== +p) {
                    state.initPriceMap.set(newData.baseAssetId, +p);
                }
            });

            get().calculateBalanceAndAvailable();
            get().calcAvg();
        },
        setWalletData: (data: any) => {
            try {
                const { dataWallet } = get();
                const updatedWallet = dataWallet?.map((item: any) => {
                    const updatedData = data[item.assetId];
                    if (updatedData) {
                        return {
                            ...item,
                            value: updatedData.value,
                            lockedValue: updatedData.lockedValue
                        };
                    }
                    return item;
                });
                set({ dataWallet: updatedWallet });
            } catch (error) {
                console.error(error);
            }
        }
    }))
);

export default useWalletStore;
