import { Ticker } from '@/type/futures.type';

type PairKey = {
    baseAsset: string;
    quoteAsset: string;
};

function getPairKey(symbol: string): PairKey | undefined {
    if (!symbol) return undefined;

    const quoteAsset = symbol.includes('VNDC') ? 'VNDC' : symbol.includes('USDT') ? 'USDT' : '';
    const baseAsset = symbol.replace(quoteAsset, '');

    return { baseAsset, quoteAsset };
}

class FuturesMarketWatch {
    constructor(options: Ticker) {
        Object.assign(this, options);
    }

    static create(source: any): FuturesMarketWatch {
        const pairKey = getPairKey(source?.s) || { baseAsset: '', quoteAsset: '' };
        return new FuturesMarketWatch({
            symbol: source?.s || '',
            baseAsset: pairKey.baseAsset,
            quoteAsset: pairKey.quoteAsset,
            baseAssetVolume: +source?.vb || 0,
            quoteAssetVolume: +source?.qb || 0,
            openPrice: +source?.o || 0,
            highPrice: +source?.h || 0,
            lowPrice: +source?.l || 0,
            lastPrice: +source?.p || 0,
            priceChange: +source?.ld || 0,
            priceChangePercent: +source?.lcp || 0,
            lastQuantity: +source?.Q || 0,
            firstTradeId: source?.F || 0,
            lastTradeId: source?.L || 0,
            eventType: source?.e || '',
            eventTime: source?.E || 0,
            totalNumberOfTrades: source?.n || 0,
            statisticsOpenTime: source?.O || 0,
            statisticsCloseTime: source?.C || 0,
            weightedAveragePrice: +source?.w || 0,
            ask: +source?.ap || 0,
            bid: +source?.bp || 0,
            fundingRate: +source?.r || 0,
            fundingTime: +source?.ft || 0,
            sellFundingRate: +source?.sr || 0,
            sellVolumeRate: +source?.svr || 0,
            buyFundingRate: +source?.br || 0,
            buyVolumeRate: +source?.bvr || 0,
            view: source?.vc || '',
            volume24h: +source?.vq || 0
        });
    }
}

export default FuturesMarketWatch;
