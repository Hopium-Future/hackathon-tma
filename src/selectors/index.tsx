import { AssetConfigType, PairConfig } from '@/type/futures.type';
import { createSelector } from 'reselect';

export const getPairConfig = createSelector([(state) => state, (_, pair) => pair], (pairConfigs: PairConfig[], pair) => {
    return pairConfigs?.find((rs) => rs.pair === pair);
});

export const getAssetConfig = createSelector([(state) => state, (_, id) => id], (assetsConfig: AssetConfigType[], id) => {
    return assetsConfig?.find((rs) => rs.id === id);
});
