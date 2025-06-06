import { memo, useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';
import {
    widget as Widget,
    ChartingLibraryWidgetOptions,
    IChartingLibraryWidget,
    ResolutionString,
    IBasicDataFeed,
    CustomTimezones,
    TimeFrameItem,
    Overrides,
    IPositionLineAdapter
} from '../../../public/library/tradingview/charting_library';
import { ChartStatus, chartTypes, TradingViewSupportTimezone } from './constantsTrading';
import JSAPI from '@/components/TVChartContainer/JSAPI/';
import { cn, sleep } from '@/helper';
import { find } from 'lodash';
import { LoadingScreen } from '../Loading/LoadingScreen';
import colors from '@/config/colors';
import usePriceSocket from '@/stores/priceSocket.store';
import { Socket } from 'socket.io-client';

export type TVChartProps = {
    symbol: string;
    timeframe: ResolutionString | string;
    clientId?: string | undefined;
    userId?: string | undefined;
    autosize?: boolean;
    mode?: string;
    chartMode?: string;
    classNameChart?: string;
    styleChart?: any;
    type?: number;
    isMobile?: boolean;
    onLoaded?: (e?: boolean) => void;
    bgColor?: string;
    staticLines?: TVChartLineOptions[];
    dynamicLines?: TVChartLineOptions[];
    staticOverrides?: Overrides;
    dynamicOverrides?: Overrides;
    disableFeatures?: string[];
};

export interface TVChartLineOptions {
    id: string;
    text: string;
    price: number;
    bodyTextColor: string;
    lineColor: string;
    lineStyle?: number;
    lineLength?: number;
    bodyFont?: string;
    bodyBorderColor?: string;
    bodyBackgroundColor?: string;
    quantity?: string;
}

type DataFeed = IBasicDataFeed & { reconnectSocket: (e: Socket) => void };
type IDynamicLine = { id: string; line: IPositionLineAdapter };
const TVChartContainer = memo((props: TVChartProps) => {
    const dynamicLinesCreatedRef = useRef<IDynamicLine[]>([]);
    const {
        symbol,
        bgColor = colors.background[2],
        timeframe = '3D',
        mode = 'trading_view',
        clientId = 'tradingview.com',
        userId = 'public_user_id',
        autosize = true,
        classNameChart = '',
        styleChart = {},
        staticLines = [],
        dynamicLines = [],
        type = chartTypes.Candle,
        staticOverrides = {},
        dynamicOverrides = {},
        disableFeatures = [],
        onLoaded
    } = props;
    const widget = useRef<IChartingLibraryWidget | null>(null);

    const container = useRef<any>(null);
    const [intervalChart, setIntervalChart] = useState(timeframe);
    const [chartStatus, setChartStatus] = useState(ChartStatus.NOT_LOADED);
    const datafeed = useRef<DataFeed | null>(null);
    const priceSocket = usePriceSocket((state) => state.socket);

    // const chartKey = useMemo(() => {
    //     return `na3-futures-${CHART_VERSION}`;
    // }, []);

    // const loadSavedChart = async () => {
    //     if (!widget.current || chartStatus !== ChartStatus.LOADED) return;
    //     let savedChart = localStorage.getItem(chartKey);
    //     if (savedChart) {
    //         try {
    //             const data = JSON.parse(savedChart);
    //             set(data, 'charts[0].panes[0].sources[0].state.symbol', symbol);
    //             widget.current.load(data);
    //             if (onLoaded) onLoaded();
    //         } catch (err) {
    //             localStorage.removeItem(chartKey);
    //             console.error('Load chart error', err);
    //         }
    //     }
    // };

    // const saveChart = async () => {
    //     try {
    //         if (widget.current) {
    //             widget.current.save((data) => {
    //                 let currentData = JSON.parse(localStorage.getItem(chartKey) || '{}');
    //                 const _store = JSON.stringify(Object.assign(currentData, data));
    //                 localStorage.setItem(chartKey, _store);
    //             });
    //         }
    //     } catch (err) {
    //         // console.error('Save chart error', err)
    //     }
    // };

    // useEffect(() => {
    //     if (widget.current && chartStatus === ChartStatus.LOADED) {
    //         loadSavedChart();
    //         widget.current?.subscribe('study_event', (id) => {
    //             const study = widget.current?.activeChart().getStudyById(id);
    //             if (study)
    //                 setTimeout(() => {
    //                     study?.applyOverrides({ showLabelsOnPriceScale: false });
    //                     saveChart();
    //                 }, 0);
    //         });
    //         if (intervalSaveChart.current) clearInterval(intervalSaveChart.current);
    //         intervalSaveChart.current = setInterval(saveChart, 3000);
    //         // return () => {
    //         //     widget.current?.unsubscribe('study_event', () => saveChart(true))
    //         // }
    //     }
    // }, [chartStatus]);

    useEffect(() => {
        if (!priceSocket) return;
        datafeed.current?.reconnectSocket(priceSocket);
        try {
            widget.current?.activeChart().resetData();
        } catch (error) {
            console.log(error);
        }
    }, [priceSocket]);

    const handleActiveTime = (value: ResolutionString) => {
        try {
            if (widget.current && symbol && value) {
                widget.current?.setSymbol(symbol, value, () => {
                    // saveChart();
                });
                if (setIntervalChart) setIntervalChart(value);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleActiveTime(timeframe as ResolutionString);
    }, [timeframe]);

    useEffect(() => {
        try {
            if (!widget.current) {
                setChartStatus(ChartStatus.NOT_LOADED);
                initWidgetRetry();
            } else if (chartStatus === ChartStatus.LOADED) {
                widget.current.activeChart().setSymbol(symbol, () => {
                    if (onLoaded) onLoaded();
                });
            }
        } catch (error) {
            console.log(error);
        }
    }, [symbol, mode]);

    // const overrides = () => {
    //     widget.current?.applyOverrides({
    //         'mainSeriesProperties.areaStyle.linecolor': colors.red[1],
    //         'mainSeriesProperties.areaStyle.linewidth': 1,
    //         'mainSeriesProperties.areaStyle.color1': colors.red[1],
    //         'mainSeriesProperties.areaStyle.color2': colors.red[1],
    //         'mainSeriesProperties.candleStyle.borderUpColor': colors.green[1],
    //         'mainSeriesProperties.candleStyle.borderDownColor': colors.red[1],
    //         'mainSeriesProperties.candleStyle.wickUpColor': colors.green[1],
    //         'mainSeriesProperties.candleStyle.wickDownColor': colors.red[1],

    //         'mainSeriesProperties.candleStyle.upColor': colors.green[1],
    //         'mainSeriesProperties.candleStyle.downColor': colors.red[1],

    //         'mainSeriesProperties.hollowCandleStyle.borderColor': colors.green[1],
    //         'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.red[1]
    //     });
    // };

    const createPositionLine = useCallback((line: TVChartLineOptions) => {
        return widget.current
            ?.activeChart()
            ?.createPositionLine()
            .setText(line.text)
            .setPrice(line.price)
            .setLineColor(line.lineColor)
            .setLineStyle(line.lineStyle ?? 1)
            .setLineLength(line.lineLength ?? 0.5)
            .setBodyTextColor(line.bodyTextColor)
            .setBodyFont(line.bodyFont ?? 'regular 8px "inherit", JetBrains Mono')
            .setBodyBorderColor(line.bodyBorderColor ?? 'transparent')
            .setBodyBackgroundColor(line.bodyBackgroundColor ?? colors.grey[3])
            .setQuantity(line.quantity ?? '');
    }, []);

    const initWidget = async () => {
        if (!symbol) return;
        const disabled_features: string[] = [
            // refer: supported list https://github.com/tradingview/charting_library/wiki/Featuresets
            'symbol_info',
            'header_widget_dom_node',
            'header_symbol_search',
            'symbol_search_hot_key',
            'main_series_scale_menu',
            'volume_force_overlay',
            'use_localstorage_for_settings',
            'compare_symbol',
            'display_market_status',
            'source_selection_markers',
            'popup_hints',
            'header_widget',
            'left_toolbar',
            'timeframes_toolbar',
            // 'axis_pressed_mouse_move_scale',
            'legend_widget',
            'show_chart_property_page',
            'control_bar',
            ...disableFeatures
        ];

        const enabled_features: string[] = ['hide_left_toolbar_by_default', 'move_logo_to_main_pane'];
        const _datafeed = new JSAPI('FUTURES') as DataFeed;
        datafeed.current = _datafeed;
        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: symbol,
            datafeed: _datafeed,
            container: container.current,
            locale: 'en',
            timezone: getTradingViewTimezone() as CustomTimezones,
            enabled_features: enabled_features as any,
            disabled_features: disabled_features as any,
            interval: intervalChart as ResolutionString,
            auto_save_delay: 10,
            library_path: '/library/tradingview/charting_library/',
            charts_storage_api_version: '1.1',
            client_id: clientId,
            user_id: userId,
            fullscreen: false,
            autosize: autosize,
            overrides: {
                'paneProperties.background': bgColor,
                'paneProperties.vertGridProperties.color': bgColor,
                'paneProperties.horzGridProperties.color': bgColor,
                'scalesProperties.lineColor': bgColor,
                'scalesProperties.textColor': colors.sub,
                'scalesProperties.fontSize': 10,

                'mainSeriesProperties.style': type,
                'mainSeriesProperties.priceAxisProperties.autoScale': true,
                'mainSeriesProperties.areaStyle.linecolor': colors.red[1],
                'mainSeriesProperties.areaStyle.linewidth': 1,
                'mainSeriesProperties.areaStyle.color1': colors.red[1],
                'mainSeriesProperties.areaStyle.color2': colors.red[1],
                'mainSeriesProperties.candleStyle.borderUpColor': colors.green[1],
                'mainSeriesProperties.candleStyle.borderDownColor': colors.red[1],
                'mainSeriesProperties.candleStyle.wickUpColor': colors.green[1],
                'mainSeriesProperties.candleStyle.wickDownColor': colors.red[1],

                'mainSeriesProperties.candleStyle.upColor': colors.green[1],
                'mainSeriesProperties.candleStyle.downColor': colors.red[1],

                'mainSeriesProperties.hollowCandleStyle.borderColor': colors.green[1],
                'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.red[1],
                ...staticOverrides

                // 'mainSeriesProperties.showPriceLine': false,
                // 'mainSeriesProperties.priceLineColor': colors.background[2]
            },
            loading_screen: { foregroundColor: 'white', backgroundColor: 'white' },
            time_frames: [] as TimeFrameItem[],
            custom_css_url: '/library/tradingview/custom_chart.css?version=1.1',
            custom_font_family: 'JetBrains Mono'
        };
        widget.current = new Widget(widgetOptions);
        widget.current.onChartReady(() => {
            // loadSavedChart()
            // overrides();
            widget.current?.subscribe('mouse_down', onBlurInputs);
            setChartStatus(ChartStatus.LOADED);

            if (Array.isArray(staticLines) && staticLines.length) {
                staticLines.map((line) => {
                    createPositionLine(line);
                });
            }
        });
    };

    const initWidgetRetry = async (retry = 10) => {
        try {
            await initWidget();
        } catch (error) {
            if (retry > 0) {
                await sleep(500);
                await initWidgetRetry(retry - 1);
                return;
            }
            throw error;
        }
    };

    const onBlurInputs = () => {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
            activeElement.blur();
        }
    };

    // useEffect(() => {
    //     return () => {
    //         widget.current?.unsubscribe('mouse_down', onBlurInputs);
    //     };
    // }, []);

    useEffect(() => {
        if (dynamicOverrides && chartStatus === ChartStatus.LOADED) {
            widget.current?.applyOverrides(dynamicOverrides);
        }
    }, [dynamicOverrides, chartStatus]);

    useEffect(() => {
        if (Array.isArray(dynamicLines) && dynamicLines.length && chartStatus === ChartStatus.LOADED) {
            dynamicLines.map((line) => {
                const currentLine = dynamicLinesCreatedRef.current.find((oldLine) => oldLine.id === line.id);
                if (currentLine) {
                    currentLine.line.setText(line.text).setPrice(line.price).setLineColor(line.lineColor).setBodyTextColor(line.bodyTextColor);
                } else {
                    const lineAdapter = createPositionLine(line);
                    lineAdapter && dynamicLinesCreatedRef.current.push({ id: line.id, line: lineAdapter });
                }
            });
        }
    }, [dynamicLines, chartStatus, createPositionLine]);

    return (
        <div className="relative chart-trading h-full w-full flex justify-center">
            {chartStatus === ChartStatus.NOT_LOADED && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <LoadingScreen />
                </div>
            )}
            <div
                ref={container}
                className={cn('w-full', { 'opacity-0 invisible': chartStatus === ChartStatus.NOT_LOADED }, classNameChart)}
                style={styleChart}
            />
        </div>
    );
});

export const getTradingViewTimezone = () => {
    const timezone = find(TradingViewSupportTimezone, {
        offset: -new Date().getTimezoneOffset()
    });
    return timezone ? timezone.timezone : 'America/New_York';
};

export default TVChartContainer;
