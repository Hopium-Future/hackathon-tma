import { getCategories, getPaymentConfig } from '@/apis/payment.api';
import { AssetConfigType } from '@/type/futures.type';
import { Category, PaymentAssetConfig } from '@/type/payment-config';
import { createSelector } from 'reselect';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Store = {
    paymentConfigs: Record<string | number, PaymentAssetConfig>;
    categoryConfigs: Category[];
    getPaymentConfig: () => Promise<void>;
    getCategoryConfig: () => Promise<void>;
};

export const assetConfigIdMapping = createSelector(
    (assetConfig: AssetConfigType[]) => assetConfig,
    (assetConfig) => {
        return assetConfig?.reduce((object: Record<number | string, AssetConfigType>, asset) => ({ ...object, [asset?.id]: asset }), {});
    }
);

const usePaymentConfig = create<Store>()(
    immer((set) => ({
        paymentConfigs: {},
        categoryConfigs: [],

        getPaymentConfig: async () => {
            const data = await getPaymentConfig();
            if (data.data?.data) {
                set((state) => {
                    state.paymentConfigs = data.data.data;
                });
            }
        },
        getCategoryConfig: async () => {
            const data = await getCategories();
            if (data.data?.data) {
                set((state) => {
                    state.categoryConfigs = data.data.data;
                });
            }
        }
    }))
);

export default usePaymentConfig;
