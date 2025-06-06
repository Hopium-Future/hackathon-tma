import Button from '@/components/common/Button';
import Chip from '@/components/common/chip';
import InputNumber from '@/components/common/input/InputNumber';
import Modal from '@/components/common/modal';
import InfoIcon from '@/components/icons/InfoIcon';
import { cn, exponentialToDecimal, formatNumber2, getFilter, isIOS } from '@/helper';
import { DecimalsFuturesType, FilterType, OrderFutures, PairConfig, SIDE_FUTURES } from '@/type/futures.type';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import TickerField from '../../TickerField';
import { fetchOrderFutures } from '@/apis/futures.api';
import { toast } from 'react-toastify';
import AssetLogo from '@/components/common/AssetLogo';
import Text from '@/components/common/text';
import useFuturesConfig from '@/stores/futures.store';
import SwapIcon from '@/components/icons/SwapIcon';
import { calLiqPrice, getRatioSLTP, MODE_SLTP } from '@/helper/futures';
import { STATUS_FUTURES } from '../../../../../type/futures.type';

interface OrderEditSLTPModalProps {
    visible: boolean;
    onClose: VoidFunction;
    order: OrderFutures;
    decimals: DecimalsFuturesType;
    pairConfig?: PairConfig;
    onConfirm?: (e?: any) => void;
    liqPrice?: number;
    isNotice?: boolean;
}
const calculatePrice = ({ side, price, profitRatio }: { side: SIDE_FUTURES; price: number; profitRatio: number }) => {
    if (side === SIDE_FUTURES.BUY) {
        return price + profitRatio * price;
    } else {
        return price - profitRatio * price;
    }
};

const OrderEditSLTPModal = ({ visible, onClose, onConfirm, isNotice = false, ...props }: OrderEditSLTPModalProps) => {
    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <span>Modify TP/SL</span>
                    <InfoIcon />
                </div>
            }
            visible={visible}
            onClose={onClose}
        >
            <EditSLTP visible={visible} onClose={onClose} onConfirm={onConfirm} isNotice={isNotice} {...props} />
        </Modal>
    );
};

const EditSLTP = ({ onClose, decimals, pairConfig, onConfirm, order, liqPrice, isNotice = false }: OrderEditSLTPModalProps) => {
    const quoteAsset = pairConfig?.quoteAsset;
    const [price, setPrice] = useState({ sl: '', tp: '' });
    const [profit, setProfit] = useState({ sl: '', tp: '' });
    const [ratioProfit, setRatioProfit] = useState({ sl: '', tp: '' });
    const [loading, setLoading] = useState(false);
    const [isFocus, setIsFocus] = useState('');
    const [mode, setMode] = useState(MODE_SLTP.PRICE);
    const isPNL = mode === MODE_SLTP.PNL;
    const ticker = useFuturesConfig((state) => (pairConfig ? state.tickers[pairConfig?.symbol] : null));
    const activePrice = ticker?.lastPrice || 0;
    const openPrice = order.open_price || order.price;

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
            const profitSL = String(getProfitSLTP(order.sl || 0));
            const profitTP = String(getProfitSLTP(order.tp || 0));
            setProfit({ sl: profitSL, tp: profitTP });
            setRatioProfit({ sl: String(getRatioProfit(+profitSL) || ''), tp: String(getRatioProfit(+profitTP) || '') });
        }
    }, [order, mode]);

    const getProfitSLTP = (price: number) => {
        if (!price) return '';
        const { side, quantity } = order;
        const isBuy = side === SIDE_FUTURES.BUY;
        const profit = quantity * (isBuy ? +price - openPrice : openPrice - +price);
        return profit;
    };

    const getPriceFromProfit = (profit: number) => {
        if (!profit) return 0;
        const { side, quantity } = order;
        const isBuy = side === SIDE_FUTURES.BUY;
        const price = isBuy ? openPrice + profit / quantity : profit / quantity - openPrice;
        return +exponentialToDecimal(Math.abs(price), decimals.price);
    };

    const getRatioPrice = (price: number) => {
        return getRatioSLTP({ price, order });
    };

    const getRatioProfit = (profit: number) => {
        return +((profit / order.margin) * 100).toFixed(0);
    };

    const getSLTP = (type: 'sl' | 'tp', ratio: number) => {
        const { side } = order;
        const suggestPrice = +exponentialToDecimal(
            calculatePrice({
                side,
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
            const value = +exponentialToDecimal((ratio / 100) * order.margin, decimals.symbol);
            setProfit((prev) => ({ ...prev, [type]: value }));
            setPrice((prev) => ({ ...prev, [type]: getPriceFromProfit(value) }));
        } else {
            getSLTP(type, ratio);
        }
        setRatioProfit((prev) => ({ ...prev, [type]: ratio }));
    };

    const onChangeInput = (type: 'sl' | 'tp', e: string | number) => {
        const rawValue = String(e).replace(/[,|%]/g, '');
        const value = type === 'sl' && isPNL ? -Math.abs(+rawValue) : +rawValue;
        if (mode === MODE_SLTP.PRICE) {
            setPrice((prev) => ({ ...prev, [type]: value }));
            setProfit((prev) => ({ ...prev, [type]: getProfitSLTP(+value) }));
            setRatioProfit((prev) => ({ ...prev, [type]: getRatioPrice(+value) }));
        } else {
            const profit = +(value / 100) * order.margin;
            setRatioProfit((prev) => ({ ...prev, [type]: value }));
            const price = getPriceFromProfit(+profit);
            setPrice((prev) => ({ ...prev, [type]: price }));
            setProfit((prev) => ({ ...prev, [type]: profit }));
        }
    };

    const editSlTp = async () => {
        if (!order.displaying_id) {
            if (onConfirm) onConfirm({ ...price, ratioSl: getRatioPrice(+price.sl || 0), ratioTp: getRatioPrice(+price.tp || 0) });
            onClose();
            return;
        }
        try {
            setLoading(true);
            const data = await fetchOrderFutures('put', {
                displaying_id: order.displaying_id,
                sl: exponentialToDecimal(+price.sl, decimals.price),
                tp: exponentialToDecimal(+price.tp, decimals.price)
            });
            if (data?.status === 'ok') {
                toast.success('Edit TP/SL successfully');
                onClose();
                if (onConfirm) onConfirm();
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const onFocusInput = (type: 'sl' | 'tp') => {
        if (!isIOS) return;
        setIsFocus(type);
        const content = document.getElementById('sl_tp_modal_content');
        if (content) {
            content.style.paddingBottom = type === 'tp' ? '44px' : '164px';
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
            const content = document.getElementById('sl_tp_modal_content');
            if (content) {
                content.style.paddingBottom = '0px';
                content.classList.remove('scrolling-touch');
            }
        }, 100);
    };

    const renderModeInput = useCallback(() => {
        const _mode = isPNL ? MODE_SLTP.PRICE : MODE_SLTP.PNL;
        return (
            <div className="flex items-center space-x-3">
                <div className="text-md">{isPNL ? '%' : quoteAsset}</div>
                <div
                    onClick={() => setMode(_mode)}
                    style={{ minWidth: 86 }}
                    className="px-3 -my-2 h-10 flex items-center justify-center space-x-1 bg-background-4"
                >
                    <span className="text-md">{mode}</span>
                    <SwapIcon />
                </div>
            </div>
        );
    }, [mode]);

    const renderEPNL = (type: 'sl' | 'tp') => {
        const _profit = +(type === 'sl' ? profit.sl : profit.tp);
        return (
            <div className="text-sm">
                <span className="text-sub">{'ePNL'}:</span>
                <span
                    className={cn('', {
                        'text-green-1': _profit > 0,
                        'text-red-1': _profit < 0
                    })}
                >
                    {formatNumber2(_profit, decimals.symbol)} {quoteAsset}
                </span>
            </div>
        );
    };

    const decimal = useMemo(() => {
        return {
            input: isPNL ? 2 : decimals.price
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
                min: Math.max(isLower ? _minPrice : activePrice, activePrice * (isLower ? multiplierDown : 1 + minDifferenceRatio)),
                max: Math.min(isLower ? activePrice : _maxPrice, activePrice * (isLower ? 1 - minDifferenceRatio : multiplierUp))
            });

            const lowerBound = calculateBounds(true);
            const upperBound = calculateBounds(false);

            const isBuy = order?.side === SIDE_FUTURES.BUY;
            const bound = type === 'sl' ? (isBuy ? lowerBound : upperBound) : isBuy ? upperBound : lowerBound;
            const text = isPNL ? '%PnL' : 'price';
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
                checkBounds(getRatioProfit(min), getRatioProfit(max), getRatioProfit(value), text);
            } else {
                checkBounds(bound.min, bound.max, value, text);
            }
            return { isError, msg };
        },
        [price, pairConfig, decimal, mode, activePrice]
    );

    const isErrorSL = inputValidator('sl');
    const isErrorTP = inputValidator('tp');

    const disabled =
        loading || (Number(price.sl) === Number(order.sl || 0) && Number(price.tp) === Number(order.tp || 0)) || isErrorSL.isError || isErrorTP.isError;

    if (!pairConfig) return null;
    return (
        <div id="sl_tp_modal_content" className="flex flex-col space-y-6 relative">
            <div className="rounded border-0.5 border-divider p-3 flex flex-col space-y-2 text-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <AssetLogo assetId={pairConfig.baseAssetId} size={16} />
                        <Text>{pairConfig.baseAsset}</Text>
                        <Text variant="secondary" className="font-bold">
                            {order.leverage}x
                        </Text>
                    </div>
                    <TickerField field="lastPrice" symbol={pairConfig?.symbol} decimal={decimals.price} quoteAsset={quoteAsset} className="font-bold" />
                </div>
                <hr className="border-divider" />
                <div className="flex items-center justify-between">
                    <Text variant="secondary">Liq. Price</Text>
                    <Text className="font-medium">
                        {isNotice && order.type === 'Limit' && order.status === STATUS_FUTURES.CLOSED
                            ? '-'
                            : formatNumber2(liqPrice || calLiqPrice(order, pairConfig), decimals.price)}{' '}
                        {quoteAsset}
                    </Text>
                </div>
            </div>
            <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-md">Take Profit</span>
                    {renderEPNL('tp')}
                </div>
                <InputNumber
                    value={(mode === MODE_SLTP.PRICE ? price.tp : ratioProfit.tp) || ''}
                    onChange={(e) => onChangeInput('tp', e.target.value)}
                    placeholder={isPNL ? 'Enter PnL Percent' : 'Enter Price'}
                    decimal={decimal.input}
                    onFocus={() => onFocusInput('tp')}
                    onBlur={() => onBlurInput()}
                    disabled={isFocus === 'sl'}
                    inputClassName="pr-3 text-left"
                    className="bg-background-3 pr-0"
                    renderSuffix={renderModeInput()}
                    error={isErrorTP.isError}
                    helperText={isErrorTP.msg}
                />
                <div className="!mt-2 flex items-center space-x-1">
                    {tpRatio.map((r) => (
                        <Chip background="2" key={r} active={+ratioProfit.tp === r} className="flex-1" onClick={() => onChangeRatioProfit('tp', r)}>
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
                    value={(mode === MODE_SLTP.PRICE ? price.sl : ratioProfit.sl) || ''}
                    onChange={(e) => onChangeInput('sl', e.target.value)}
                    placeholder={isPNL ? 'Enter PnL Percent' : 'Enter Price'}
                    decimal={decimal.input}
                    onFocus={() => onFocusInput('sl')}
                    onBlur={() => onBlurInput()}
                    disabled={isFocus === 'tp'}
                    inputClassName="pr-3 text-left"
                    className="bg-background-3 pr-0"
                    renderSuffix={renderModeInput()}
                    error={isErrorSL.isError}
                    helperText={isErrorSL.msg}
                />
                <div className="!mt-2 flex items-center space-x-1 relative z-50">
                    {slRatio.map((r) => (
                        <Chip background="2" key={r} active={+ratioProfit.sl === r} className="flex-1" onClick={() => onChangeRatioProfit('sl', r)}>
                            {r}%
                        </Chip>
                    ))}
                </div>
            </div>

            <Button disabled={disabled} variant="primary" className="h-11 font-bold uppercase" onClick={editSlTp}>
                Confirm
            </Button>
        </div>
    );
};

export default memo(OrderEditSLTPModal, (prev, next) => prev.visible === next.visible && prev.liqPrice === next.liqPrice);
