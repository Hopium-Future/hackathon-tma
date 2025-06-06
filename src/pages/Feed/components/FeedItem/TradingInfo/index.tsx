import { memo } from 'react';

import TradingChart from './TradingChart';
import TradingActions from './TradingActions';
import { getDecimalPrice } from '@/helper';
import useFuturesConfig from '@/stores/futures.store';
import { getAssetConfig, getPairConfig } from '@/selectors';
import { IPost } from '@/type/feed.type';
import useUserStore from '@/stores/user.store';
import { STATUS_FUTURES } from '@/type/futures.type';

interface ITradingInfoProps {
    post: IPost;
}

const TradingInfo = ({ post }: ITradingInfoProps) => {
    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, post.symbol));
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, pairConfig?.quoteAssetId));
    const user = useUserStore((state) => state.user);
    const decimals = {
        price: getDecimalPrice(pairConfig),
        symbol: assetConfig?.assetDigit
    };
    const isActivePost = post.futureOrder.status !== STATUS_FUTURES.CLOSED;

    return (
        pairConfig && (
            <div className="mb-[10px]">
                <TradingChart post={post} pairConfig={pairConfig} decimals={decimals} />
                {user?._id !== post.userId && isActivePost && <TradingActions post={post} pairConfig={pairConfig} decimals={decimals} />}
            </div>
        )
    );
};

export default memo(TradingInfo);
