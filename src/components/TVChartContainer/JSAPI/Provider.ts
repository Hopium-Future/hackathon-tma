import { BASE_PRICE_API_URL } from '@/config/app.config';
import { LibrarySymbolInfo, PeriodParams } from '../../../../public/library/tradingview/charting_library';
import { getInterval } from '../constantsTrading';
import baseAxios from '@/apis/base.api';

const historyData: any = {};

export default {
    historyData,
    async getBars(symbolInfo: LibrarySymbolInfo, resolution: string, { from, to, firstDataRequest }: PeriodParams) {
        const url = '/api/v1/chart/history';
        const { data } = await baseAxios.get(url, {
            params: {
                broker: symbolInfo.exchange,
                symbol: (symbolInfo as any)?.symbol,
                from,
                to,
                resolution: getInterval(resolution)
            },
            baseURL: BASE_PRICE_API_URL
        });
        if (data && data.length) {
            const bars = [];
            for (let i = 0; i < data.length; i += 1) {
                const [time, open, high, low, close, volume] = data[i];
                bars.push({
                    time: time * 1000,
                    timeSecond: time,
                    low,
                    high,
                    open,
                    close,
                    volume
                });
            }
            if (firstDataRequest) {
                const lastBar = bars[bars.length - 1];
                historyData[(symbolInfo as any)?.symbol] = { lastBar };
            }
            return bars;
        }
        return [];
    },
    async getSymbolInfo(symbol: any) {
        const url = `/api/v1/chart/symbol_info`;
        const { data } = await baseAxios.get(url, {
            baseURL: BASE_PRICE_API_URL,
            params: {
                broker: 'NAMI_FUTURES',
                symbol
            }
        });
        return data;
    }
};
