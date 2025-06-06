// The charting api caches historical data its own. You dont need to do it yourself.

import { Socket } from 'socket.io-client';
import { LibrarySymbolInfo, PeriodParams, ResolutionString } from '../../../../public/library/tradingview/charting_library';
import historyProvider from './Provider';
import Stream from './Stream';
import { getInterval } from '../constantsTrading';

const supportedResolutions = ['1', '60', '1D'];

const config = {
    supported_resolutions: supportedResolutions
};
const LIMIT_BARS = 5000;

export default class {
    stream: any = null;

    mode: any = null;
    firstBarInfo: { symbol: string; interval: string; timeSecond: number } | null = null;

    constructor(mode: any) {
        this.stream = new Stream(mode);
        this.mode = mode;
    }

    onReady = (cb: any) => {
        setTimeout(() => cb(config), 0);
    };

    searchSymbols = () => {
        // console.log('====Search Symbols running');
    };

    resolveSymbol = async (symbolName: any, onSymbolResolvedCallback: (arg0: any) => void, onResolveErrorCallback: (arg0: string) => void) => {
        // expects a symbolInfo object in response
        try {
            const symbol_stub = await historyProvider.getSymbolInfo(symbolName);
            setTimeout(() => {
                onSymbolResolvedCallback(symbol_stub);
            }, 0);
        } catch (e) {
            onResolveErrorCallback('Not feeling it today');
        }
    };

    getBars = (
        symbolInfo: LibrarySymbolInfo,
        resolution: string,
        { from, to, firstDataRequest, countBack }: PeriodParams,
        onHistoryCallback: (arg0: string | any[], arg1: { noData: boolean }) => void,
        onErrorCallback: (arg0: any) => void
    ) => {
        const symbol = symbolInfo.symbol;
        const interval = getInterval(resolution);
        const minTo = this.firstBarInfo?.symbol === symbol && this.firstBarInfo?.interval === interval ? +this.firstBarInfo.timeSecond : 0;
        const _to = Math.max(minTo, to);
        let intervalTime = 60; // for 1m
        switch (interval) {
            case '1d': {
                intervalTime = 86400;
                break;
            }
            case '1h': {
                intervalTime = 3600;
                break;
            }
            case '1m': {
                intervalTime = 60;
                break;
            }
        }
        const minFrom = _to - intervalTime * LIMIT_BARS; // 5000 is the limit of BE response
        const _from = Math.max(minFrom, from);
        historyProvider
            .getBars(symbolInfo, resolution, <PeriodParams>{ from: _from, to: _to, firstDataRequest, countBack })
            .then((bars: string | any[]) => {
                if (bars.length) {
                    const firstBar = bars[0];
                    if (
                        !this.firstBarInfo ||
                        this.firstBarInfo.symbol !== symbol ||
                        this.firstBarInfo.interval !== interval ||
                        +this.firstBarInfo.timeSecond > firstBar.timeSecond
                    ) {
                        this.firstBarInfo = {
                            ...firstBar,
                            timeSecond: _from,
                            symbol,
                            interval
                        };
                    }
                    onHistoryCallback(bars, { noData: false });
                } else {
                    onHistoryCallback(bars, { noData: true });
                }
            })
            .catch((err: any) => {
                console.log({ 'error get bar': err });
                onErrorCallback(err);
            });
    };

    subscribeBars = (symbolInfo: any, resolution: any, onRealtimeCallback: any, subscriberUID: any, onResetCacheNeededCallback: any) => {
        this.stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback);
    };

    unsubscribeBars = (subscriberUID: any) => {
        this.stream.unsubscribeBars(subscriberUID);
    };

    calculateHistoryDepth = (resolution: ResolutionString) =>
        +resolution < 60
            ? {
                  resolutionBack: 'D',
                  intervalBack: '1'
              }
            : undefined;

    getMarks = () => {
        //
    };

    getTimeScaleMarks = () => {
        // optional
        // console.log('=====getTimeScaleMarks running');
    };

    getServerTime = () => {
        // console.log('=====getServerTime running');
    };

    reconnectSocket = (socket: Socket) => {
        this.stream?.reconnectSocket(socket);
    };
}
