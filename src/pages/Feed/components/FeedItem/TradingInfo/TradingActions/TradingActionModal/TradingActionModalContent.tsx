import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { find } from 'lodash';

import Text from '@/components/common/text';
import Chip from '@/components/common/chip';
import Button from '@/components/common/Button';
import SwapIcon from '@/components/icons/SwapIcon';
import AssetLogo from '@/components/common/AssetLogo';
import InputNumber from '@/components/common/input/InputNumber';
import TickerField from '@/pages/Futures/components/TickerField';
import AssetStaticInfo from '@/components/common/AssetStaticInfo';

import useFeeConfig from '@/hooks/useFeeConfig';
import useFuturesConfig from '@/stores/futures.store';
import { fetchOrderFutures } from '@/apis/futures.api';
import { getRatioSLTP, MODE_SLTP } from '@/helper/futures';
import { cn, exponentialToDecimal, formatNumber2, getDeviceId, getSignature, isIOS } from '@/helper';
import Card from '@/components/common/card';
import SliderThumbIcon from '@/components/icons/SliderThumbIcon';
import { DecimalsFuturesType, FeeType, FilterType, OrderFutures, PairConfig, SIDE_FUTURES, STATUS_FUTURES, TYPE_FUTURES } from '@/type/futures.type';
import { ITradeType, ITradingData } from '@/type/feed.type';
import useWalletStore from '@/stores/wallet.store';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import useUserStore from '@/stores/user.store';
import { TRADE_TYPE } from '@/helper/constant';
import { Switch } from '@/components/common/Switch';

export interface ITradingActionModalContentProps {
    tradeType: ITradeType;
    order: OrderFutures;
    decimals: DecimalsFuturesType;
    pairConfig?: PairConfig;
    onClose: VoidFunction;
    onSuccess: (data: ITradingData) => void;
}

const getMaxVol = (maxAvailable: number, leverage: number, feeOpen: number) => {
    const estFee = maxAvailable * leverage * feeOpen;
    return Math.floor(((maxAvailable - estFee) * leverage) / 5) * 5;
};

const TradingActionModalContent = ({ onClose, onSuccess, decimals, pairConfig, order, tradeType }: ITradingActionModalContentProps) => {
    const available = useWalletStore((state) => state.available);
    const { feeConfig } = useFeeConfig(FeeType.TAKER, order.partner_type);
    const user = useUserStore((state) => state.user);
    const quoteAsset = pairConfig?.quoteAsset;
    const [price, setPrice] = useState({ sl: '', tp: '' });
    const [profit, setProfit] = useState({ sl: '', tp: '' });
    const [ratioProfit, setRatioProfit] = useState({ sl: '', tp: '' });
    const [volumeRatio, setVolumeRatio] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isFocus, setIsFocus] = useState('');
    const [mode, setMode] = useState(MODE_SLTP.PRICE);
    const [volume, setVolume] = useState(`${Math.min(order.margin * order.leverage, getMaxVol(available * 0.99, order.leverage, feeConfig.open))}`);
    const [isShowSLTP, setShowSLTP] = useState(false);
    const isPNL = mode === MODE_SLTP.PNL;
    const _activePrice = useFuturesConfig((state) => (pairConfig ? state.tickers[pairConfig?.symbol] : null))?.lastPrice || 0;
    const openPrice = order.open_price || order.price;
    const currentMargin = +volume / order.leverage;
    const currentQuantity = +volume / openPrice;
    const orderSide = tradeType === TRADE_TYPE.copy ? order.side : order.side === SIDE_FUTURES.BUY ? SIDE_FUTURES.SELL : SIDE_FUTURES.BUY;
    const isBuy = orderSide === SIDE_FUTURES.BUY;
    const getFilter = (filterType: string, config: PairConfig) => {
        return find(config?.filters, { filterType }) as any;
    };
    const isActiveOrder = order.status === STATUS_FUTURES.ACTIVE;

    const volumeConfig = useMemo(() => {
        const maxAvailable = available * 0.99;
        const maxVol = getMaxVol(maxAvailable, order.leverage, feeConfig.open);
        const maxConfig = pairConfig ? getFilter('MARKET_LOT_SIZE', pairConfig)?.maxQuoteQty : maxAvailable;
        return {
            min: pairConfig ? getFilter('MIN_NOTIONAL', pairConfig)?.notional : 5,
            max: Math.min(maxConfig, maxVol)
        };
    }, [pairConfig, available, order, feeConfig]);

    const calculatePrice = useCallback(({ side, price, profitRatio }: { side: SIDE_FUTURES; price: number; profitRatio: number }) => {
        if (side === SIDE_FUTURES.BUY) {
            return price + profitRatio * price;
        } else {
            return price - profitRatio * price;
        }
    }, []);

    const ratioGroup = useCallback((mode: MODE_SLTP) => {
        return {
            [MODE_SLTP.PNL]: {
                sl: [-25, -50, -75, -100],
                tp: [25, 50, 100, 300]
            },
            [MODE_SLTP.PRICE]: {
                sl: [-5, -10, -15, -20],
                tp: [5, 10, 15, 20]
            }
        }[mode];
    }, []);

    const slRatio = ratioGroup(mode).sl;
    const tpRatio = ratioGroup(mode).tp;

    useEffect(() => {
        if (mode === MODE_SLTP.PRICE) {
            onChangeInput('sl', order.sl || '');
            onChangeInput('tp', order.tp || '');
        } else {
            setPrice({ sl: String(order.sl || ''), tp: String(order.tp || '') });
            setProfit({ sl: String(getProfitSLTP(order.sl || 0)), tp: String(getProfitSLTP(order.tp || 0)) });
            setRatioProfit({ sl: String(getRatioPrice(order.sl || 0)), tp: String(getRatioPrice(order.tp || 0)) });
        }
    }, [order, mode]);

    useEffect(() => {
        const _ratio = volume && volumeConfig.max ? Math.floor((+volume / volumeConfig.max) * 100) : 0;
        setVolumeRatio(Math.min(_ratio, 100));
    }, [volumeConfig.max, volume]);

    const orderTradeType = useMemo(() => {
        let orderTradeType = order.type as string;
        if (isActiveOrder) {
            orderTradeType = TYPE_FUTURES.MARKET;
        } else if (tradeType === TRADE_TYPE.counter) {
            orderTradeType = order.type === TYPE_FUTURES.LIMIT ? TYPE_FUTURES.STOP : TYPE_FUTURES.LIMIT;
        }
        return orderTradeType;
    }, [order, tradeType, isActiveOrder]);

    const getProfitSLTP = (price: number) => {
        if (!price) return '';
        const total = currentQuantity * (isBuy ? +price - openPrice : openPrice - +price);
        const _fee = currentQuantity * (+price + openPrice) * feeConfig.close;
        const profit = total - _fee;
        return +exponentialToDecimal(profit, decimals.symbol);
    };

    const getPriceFromProfit = (profit: number) => {
        if (!profit) return 0;
        const total = +profit + currentQuantity * openPrice * feeConfig.close;
        const x = isBuy ? 1 : -1;
        const price = (isBuy ? openPrice + total / currentQuantity : total / currentQuantity - openPrice) / (x - feeConfig.close);
        return +exponentialToDecimal(Math.abs(price), decimals.price);
    };

    const getRatioPrice = (price: number) => {
        return getRatioSLTP({ price, order });
    };

    const getRatioProfit = (profit: number) => {
        return +((profit / currentMargin) * 100).toFixed(2);
    };

    const getSLTP = (type: 'sl' | 'tp', ratio: number) => {
        const suggestPrice = +exponentialToDecimal(
            calculatePrice({
                side: orderSide,
                price: openPrice,
                profitRatio: ratio / 100
            }),
            decimals.price
        );
        setPrice((prev) => ({ ...prev, [type]: suggestPrice }));
        setProfit((prev) => ({ ...prev, [type]: getProfitSLTP(suggestPrice) }));
    };

    const onChangeRatioProfit = (type: 'sl' | 'tp', ratio: number) => {
        if (isPNL) {
            const value = (ratio / 100) * currentMargin;
            setProfit((prev) => ({ ...prev, [type]: value }));
            setPrice((prev) => ({ ...prev, [type]: getPriceFromProfit(value) }));
        } else {
            getSLTP(type, ratio);
        }
        setRatioProfit((prev) => ({ ...prev, [type]: ratio }));
    };

    useEffect(() => {
        setPrice({ sl: '', tp: '' });
        setProfit({ sl: '', tp: '' });
        setRatioProfit({ sl: '', tp: '' });
    }, [currentMargin]);

    const onChangeInput = (type: 'sl' | 'tp', e: string | number) => {
        const rawValue = String(e).replace(/,/g, '');
        const value = type === 'sl' && isPNL ? -Math.abs(+rawValue) : +rawValue;
        if (mode === MODE_SLTP.PRICE) {
            setPrice((prev) => ({ ...prev, [type]: value }));
            setProfit((prev) => ({ ...prev, [type]: getProfitSLTP(+value) }));
            setRatioProfit((prev) => ({ ...prev, [type]: getRatioPrice(+value) }));
        } else {
            setProfit((prev) => ({ ...prev, [type]: value }));
            const price = getPriceFromProfit(+value);
            setPrice((prev) => ({ ...prev, [type]: price }));
            setRatioProfit((prev) => ({ ...prev, [type]: getRatioProfit(value) }));
        }
    };

    const onConfirmTrade = async () => {
        if (!order.displaying_id) {
            onClose();
            return;
        }
        try {
            setLoading(true);
            const diviceId = getDeviceId();
            const now = Date.now();
            const requestId = Math.floor(now / 2000) + '_' + diviceId;
            const signature = getSignature(String(user?._id), now);
            const response = await fetchOrderFutures('post', {
                leverage: order.leverage,
                quoteQty: +volume,
                margin: currentMargin,
                price: isActiveOrder ? 0 : openPrice,
                side: orderSide,
                type: orderTradeType,
                symbol: pairConfig?.symbol,
                useQuoteQty: true,
                requestId,
                signature,
                sl: isActiveOrder ? (isShowSLTP ? price.sl : '') : order.sl,
                tp: isActiveOrder ? (isShowSLTP ? price.tp : '') : order.tp,
                metadata: {
                    follow_order_id: order.displaying_id,
                    side: tradeType,
                    caller_user_id: order.user_id
                }
            });
            if (response?.status === 'ok') {
                onSuccess(response.data);
                onClose();
            } else {
                toast.error(response?.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const onFocusInput = (type: 'sl' | 'tp' | 'vol') => {
        if (!isIOS) return;
        setIsFocus(type);
        const content = document.getElementById('trading-action-modal');
        if (content) {
            content.style.paddingBottom = type === 'sl' ? '44px' : '164px';
            setTimeout(() => {
                content.classList.add('scrolling-touch');
                content.style.paddingBottom = useFuturesConfig.getState().keyboardHeight + 'px';
            }, 100);
        }
    };

    const onBlurInput = () => {
        if (!isIOS) return;
        setTimeout(() => {
            setIsFocus('');
            const content = document.getElementById('trading-action-modal');
            if (content) {
                content.style.paddingBottom = '0px';
                content.classList.remove('scrolling-touch');
            }
        }, 100);
    };

    const renderModeInput = useCallback(() => {
        const _mode = isPNL ? MODE_SLTP.PRICE : MODE_SLTP.PNL;
        return (
            <div onClick={() => setMode(_mode)} style={{ minWidth: 86 }} className="px-3 -my-2 h-10 flex items-center justify-center space-x-1 bg-background-4">
                <span className="text-md">{mode}</span>
                <SwapIcon />
            </div>
        );
    }, [mode]);

    const renderEPNL = (type: 'sl' | 'tp') => {
        const _profit = +(type === 'sl' ? profit.sl : profit.tp);
        const _price = +(type === 'sl' ? price.sl : price.tp);
        const _value = mode === MODE_SLTP.PRICE ? _profit : _price;

        return (
            <div className="text-sm">
                <span className="text-sub">{isPNL ? 'Price' : 'ePNL'}:</span>
                <span
                    className={cn('', {
                        'text-green-1': _profit > 0 && _price && mode === MODE_SLTP.PRICE,
                        'text-red-1': _profit < 0 && _price && mode === MODE_SLTP.PRICE
                    })}
                >
                    {formatNumber2(_value, decimal.text)} {quoteAsset}
                </span>
            </div>
        );
    };

    const decimal = useMemo(() => {
        return {
            input: isPNL ? decimals.symbol : decimals.price,
            text: isPNL ? decimals.price : decimals.symbol
        };
    }, [mode, decimals]);

    const inputValidator = useCallback(
        (type: 'sl' | 'tp') => {
            let isError = false;
            let msg: string | null = '';

            const value = isPNL ? +profit[type] : +price[type];
            if (!pairConfig || !value) return { isError, msg };

            const { maxPrice: _maxPrice, minPrice: _minPrice } = (getFilter(FilterType.PRICE_FILTER, pairConfig) || {}) as any;
            const { multiplierDown, multiplierUp, minDifferenceRatio } = (getFilter(FilterType.PERCENT_PRICE, pairConfig) || {}) as any;

            // Calculate bounds
            const calculateBounds = (isLower: boolean) => ({
                min: Math.max(isLower ? _minPrice : _activePrice, _activePrice * (isLower ? multiplierDown : 1 + minDifferenceRatio)),
                max: Math.min(isLower ? _activePrice : _maxPrice, _activePrice * (isLower ? 1 - minDifferenceRatio : multiplierUp))
            });

            const lowerBound = calculateBounds(true);
            const upperBound = calculateBounds(false);

            const bound = type === 'sl' ? (isBuy ? lowerBound : upperBound) : isBuy ? upperBound : lowerBound;
            const text = isPNL ? 'PnL' : 'price';
            const checkBounds = (min: number, max: number, value: number, text: string) => {
                if (value < min) {
                    isError = true;
                    msg = `Minimum ${text} ${formatNumber2(min, decimal.input)}`;
                } else if (value > max) {
                    isError = true;
                    msg = `Maximum ${text} ${formatNumber2(max, decimal.input)}`;
                }
            };
            if (isPNL) {
                const min = +getProfitSLTP(isBuy ? bound.min : bound.max);
                const max = +getProfitSLTP(isBuy ? bound.max : bound.min);
                checkBounds(min, max, value, text);
            } else {
                checkBounds(bound.min, bound.max, value, text);
            }
            return { isError, msg };
        },
        [price, pairConfig, decimal, mode, _activePrice]
    );

    const isErrorSL = inputValidator('sl');
    const isErrorTP = inputValidator('tp');
    const isErrorVolume = !+volume;

    const disabled = loading || isErrorVolume || (isActiveOrder && isShowSLTP && (isErrorSL.isError || isErrorTP.isError));

    if (!pairConfig) return null;
    return (
        <div id="trading-action-modal" className="relative">
            <div className="p-3 font-bold ring-0.5 ring-divider bg-background-3 rounded flex items-center justify-between">
                <div className="flex items-center space-x-1">
                    <AssetLogo assetId={pairConfig?.baseAssetId} size={20} />
                    <Text>{pairConfig?.baseAsset}</Text>
                    <span className="text-green-1">{order.leverage}x</span>
                </div>
                <div className="flex items-center space-x-1">
                    <TickerField field="lastPrice" symbol={pairConfig?.symbol} decimal={decimals.price} quoteAsset={quoteAsset} />
                </div>
            </div>
            <div className="flex items-center gap-2 h-11 my-2">
                <div className="h-full p-3 ring-0.5 ring-divider bg-background-3 rounded flex gap-1 items-center">
                    <ArrowUpIcon className={isBuy ? 'text-green-1' : 'text-red-1  rotate-180'} width={16} />
                    <span className="text-main text-md uppercase font-bold">{orderTradeType}</span>
                </div>
                <div className="h-full flex-grow text-sm ring-0.5 ring-divider bg-background-3 rounded flex items-center justify-between overflow-x-auto thin-scroll-bar">
                    <div className="h-full flex items-center justify-center gap-[6px] px-2 text-main">
                        <span className="py-[2px] px-1 bg-divider rounded">VOL</span>
                        <span>${formatNumber2(order.order_value)}</span>
                    </div>
                    <div className="h-full gap-2 flex items-center justify-between px-2">
                        <div className="flex items-center gap-[6px] text-green-1">
                            <span className="py-[2px] px-1 bg-green-1/20 rounded">TP</span>
                            <span>{order.tp ? `+${getRatioSLTP({ price: order.tp, order })}%` : '-'}</span>
                        </div>
                        <div className="flex items-center gap-[6px] text-red-1">
                            <span>{order.sl ? `${getRatioSLTP({ price: order.sl, order })}%` : '-'}</span>
                            <span className="py-[2px] px-1 bg-red-1/20 rounded">SL</span>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="bg-background-3 py-0">
                <div className="w-full flex flex-col">
                    <InputNumber
                        value={volume}
                        handleChange={(e) => setVolume(e.value)}
                        onFocus={() => onFocusInput('vol')}
                        onBlur={() => onBlurInput()}
                        className="ring-0 p-0 flex-1 font-bold bg-background-3"
                        inputClassName="h-10 text-left"
                        decimal={decimals.symbol}
                        max={volumeConfig.max}
                        renderSuffix={<span className="text-md">{quoteAsset}</span>}
                    />
                    <div className="h-[0.5px] w-full bg-divider" />
                    <div className="h-10 flex items-center justify-center text-xs uppercase space-x-2">
                        <span>MIN</span>
                        <div id="slider_volume" className="relative h-2 flex-1">
                            <input
                                type="range"
                                className="w-full"
                                min={volumeConfig.min}
                                max={volumeConfig.max}
                                value={volume || 0}
                                onChange={(e) => setVolume(e.target.value)}
                            />
                            <div className="slider_track w-full flex items-center">
                                <SliderThumbIcon active={volumeRatio > 0} />
                                <div className="relative h-[6px] flex justify-center items-center w-full bg-background-1 border-t border-b border-divider">
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center w-full bg-green-1 h-[6px]"
                                        style={{ width: `${volumeRatio}%`, maxWidth: 'calc(100%-4px)' }}
                                    ></div>
                                </div>
                                <SliderThumbIcon className="rotate-180" active={volumeRatio >= 100} />
                            </div>
                        </div>
                        <span>MAX</span>
                    </div>
                </div>
            </Card>

            {isActiveOrder && (
                <>
                    <div className="flex items-center gap-2 mt-6 mb-4">
                        <span className="text-main text-lg font-bold">TP/SL</span>
                        <Switch checked={isShowSLTP} onCheckedChange={() => setShowSLTP((prev) => !prev)} />
                    </div>

                    {isShowSLTP && (
                        <div className="flex flex-col gap-y-4">
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-md">Take Profit</span>
                                    {renderEPNL('tp')}
                                </div>
                                <InputNumber
                                    value={(mode === MODE_SLTP.PRICE ? price.tp : profit.tp) || ''}
                                    // handleChange={(e) => onChangeInput('tp', e.value)}
                                    onChange={(e) => onChangeInput('tp', e.target.value)}
                                    placeholder="Enter gain"
                                    decimal={decimal.input}
                                    renderPrefix={<AssetStaticInfo quoteAsset={pairConfig.quoteAsset} quoteAssetId={pairConfig.quoteAssetId} />}
                                    onFocus={() => onFocusInput('tp')}
                                    onBlur={() => onBlurInput()}
                                    disabled={!!isFocus && isFocus !== 'tp'}
                                    inputClassName="pr-3"
                                    className="bg-background-3 pr-0"
                                    renderSuffix={renderModeInput()}
                                    error={isErrorTP.isError}
                                    helperText={isErrorTP.msg}
                                />
                                <div className="!mt-2 flex items-center space-x-1">
                                    {tpRatio.map((r) => (
                                        <Chip
                                            background="2"
                                            key={r}
                                            active={+ratioProfit.tp === r}
                                            className="flex-1"
                                            onClick={() => onChangeRatioProfit('tp', r)}
                                        >
                                            {r}%
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-md">Stop Loss</span>
                                    {renderEPNL('sl')}
                                </div>
                                <InputNumber
                                    allowNegative={isPNL}
                                    value={(mode === MODE_SLTP.PRICE ? price.sl : profit.sl) || ''}
                                    // handleChange={(e) => onChangeInput('sl', e.value)}
                                    onChange={(e) => onChangeInput('sl', e.target.value)}
                                    placeholder="Enter loss"
                                    decimal={decimal.input}
                                    renderPrefix={<AssetStaticInfo quoteAsset={pairConfig.quoteAsset} quoteAssetId={pairConfig.quoteAssetId} />}
                                    onFocus={() => onFocusInput('sl')}
                                    onBlur={() => onBlurInput()}
                                    disabled={!!isFocus && isFocus !== 'sl'}
                                    inputClassName="pr-3"
                                    className="bg-background-3 pr-0"
                                    renderSuffix={renderModeInput()}
                                    error={isErrorSL.isError}
                                    helperText={isErrorSL.msg}
                                />
                                <div className="!mt-2 flex items-center space-x-1 relative z-50">
                                    {slRatio.map((r) => (
                                        <Chip
                                            background="2"
                                            key={r}
                                            active={+ratioProfit.sl === r}
                                            className="flex-1"
                                            onClick={() => onChangeRatioProfit('sl', r)}
                                        >
                                            {r}%
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <Button disabled={disabled} variant="primary" className="h-11 font-bold uppercase mt-6" onClick={onConfirmTrade}>
                Confirm
            </Button>
        </div>
    );
};

export default memo(TradingActionModalContent);
