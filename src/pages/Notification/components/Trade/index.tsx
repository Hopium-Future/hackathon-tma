import React from 'react';
import AssetLogo from '@/components/common/AssetLogo';

import { Card, CardContent, CardHeader, CardIcon } from '../Card';
import TradeIcon from '@/components/icons/TradeIcon';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';

import { TradeData } from './types';
import useFuturesConfig from '@/stores/futures.store';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import getTimeDiff from '../../utils';
import { Divider } from '../..';

type TradeTabProps = {
    data: TradeData;
    onDetail: (data: any) => void;
};

const TradeTab: React.FC<TradeTabProps> = ({ data, onDetail }) => {
    const assetConfig = useFuturesConfig((state) => state.assetsConfig);

    const { baseAsset: assetCurrency } = data?.context || {};

    const asset = assetConfig.find((asset) => asset?.assetCode === assetCurrency);

    const getHighlightedContent = (content: string, currency: string, leverage: number) => {
        return content
            .replace(/\[assetCode\]/g, `<span class="font-bold uppercase">${currency}</span>`)
            .replace(/\[leverage\]/g, `<span class="opacity-50 font-bold">${leverage}x</span>`);
    };

    const TradeCard = (item: TradeData) => {
        const { leverage: tradeLeverage, orderId: orderId, side } = item?.context || {};

        const timeDiff = item?.createdAt ? getTimeDiff(item?.createdAt) : '--';
        const highlightedContent = item?.content ? getHighlightedContent(item?.content, assetCurrency, tradeLeverage) : '--';

        return (
            <Card
                key={`earn_card_${item?._id}`}
                onClick={(e) => {
                    e.preventDefault();
                    onDetail?.({ data: item?.context?.orderId, category: 'trade', open: true, type: data?.type });
                }}
            >
                <CardHeader justify="start">
                    <CardIcon>
                        <TradeIcon className="text-green-1" size="notification" />
                    </CardIcon>
                    <p className="text-center text-md font-bold opacity-50 text-white">{timeDiff}</p>
                </CardHeader>
                <section>
                    <div className="w-8 h-8">
                        <AssetLogo size={32} assetId={asset?.id as any} className="w-8 h-8" />
                    </div>
                    <CardContent>
                        <p className="text-white w-full">{`${item?.title} ${orderId}`}</p>
                        <section className="flex items-center mt-[6px]">
                            <section className="flex mr-[6px] w-4 h-4 rounded border-[0.5px] border-divider items-center justify-center">
                                {side?.toUpperCase() === 'BUY' ? <ArrowUpIcon width={12} className="text-green-1" /> : <ArrowDownIcon />}
                            </section>
                            <p className="text-white" dangerouslySetInnerHTML={{ __html: highlightedContent }} />
                        </section>
                    </CardContent>
                </section>
            </Card>
        );
    };

    return (
        <>
            {TradeCard(data)}
            <Divider />
        </>
    );
};
export default TradeTab;
