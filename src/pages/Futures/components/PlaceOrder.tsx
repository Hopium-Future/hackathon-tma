import { useSearchParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import InputNumber from '@/components/common/input/InputNumber';
import { cn, formatNumber2, getDeviceId, getSignature, isIOS } from '@/helper';
import { DecimalsFuturesType, FeeType, FilterType, OrderFutures, PairConfig, SIDE_FUTURES, STATUS_FUTURES, TYPE_FUTURES } from '@/type/futures.type';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import LeverageSetting from './LeverageSetting';
import { fetchOrderFutures, getFuturesLeverage } from '@/apis/futures.api';
import usePriceSocket from '@/stores/priceSocket.store';
import { LOCAL_STORAGE_KEY, PublicSocketEvent } from '@/helper/constant';
import OrderSuccessModal from './TradeHistory/Order/OrderSuccessModal';
import { toast } from 'react-toastify';
import useWalletStore from '@/stores/wallet.store';
import { find } from 'lodash';
import useFeeConfig from '@/hooks/useFeeConfig';
import useUserStore from '@/stores/user.store';
import Card from '@/components/common/card';
import Select from '@/components/common/select';
import OrderSide from './OrderSide';
import Text from '@/components/common/text';
import N3AddCircleIcon from '@/components/icons/N3AddCircleIcon';
import TickerField from './TickerField';
import OrderEditSLTPModal from './TradeHistory/Order/OrderEditSLTPModal';
import useFuturesConfig from '@/stores/futures.store';
import ShareOrderSignalModal from '@/components/shared-ui/ShareOrderSignalModal';
import { IPost } from '@/type/feed.type';
import VolumeSlider from '@/components/common/slider/VolumeSlider';
import { calLiqPrice } from '@/helper/futures';

interface PlaceOrderProps {
    pairConfig?: PairConfig;
    decimals: DecimalsFuturesType;
}
const PlaceOrder = ({ pairConfig, decimals }: PlaceOrderProps) => {
    const [searchParams] = useSearchParams();
    const initialSide = searchParams.get('side') || SIDE_FUTURES.BUY;

    const placeIdRef = useRef('');
    const priceSocket = usePriceSocket((state) => state.socket);
    const quoteAsset = pairConfig?.quoteAsset;
    const [leverage, setLeverage] = useState(1);
    const [volume, setVolume] = useState('');
    const [type, setType] = useState(TYPE_FUTURES.MARKET);
    const [side, setSide] = useState(initialSide as SIDE_FUTURES);
    const [price, setPrice] = useState('');
    const [orderSlTp, setOrderSlTp] = useState({ sl: 0, tp: 0, ratioSl: 0, ratioTp: 0 });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showShareSignalModal, setShowShareSignalModal] = useState(false);
    const [showEditSlTP, setShowEditSLTP] = useState(false);
    const order = useRef<OrderFutures | any>();
    const [loading, setLoading] = useState(false);
    const available = useWalletStore((state) => state.available);
    const { feeConfig } = useFeeConfig(FeeType.TAKER);
    const newOrderCreatedId = useFuturesConfig((state) => state.newOrderCreatedId);
    const inputRef = useRef(null);
    const user = useUserStore((state) => state.user);
    const ticker = useFuturesConfig((state) => (pairConfig ? state.tickers[pairConfig?.symbol] : null));
    const activePrice = ticker?.lastPrice || 0;
    const setNewPost = useFuturesConfig((state) => state.setNewPost);
    const setShowShareOrderSignalSuccessModal = useFuturesConfig((state) => state.setShowShareOrderSignalSuccessModal);
    const setNewOrderCreatedId = useFuturesConfig((state) => state.setNewOrderCreatedId);

    const getLeverage = async (symbol: string) => {
        const data = await getFuturesLeverage(symbol);
        setLeverage(data);
    };

    useEffect(() => {
        setOrderSlTp({ sl: 0, tp: 0, ratioSl: 0, ratioTp: 0 });
    }, [side]);

    useEffect(() => {
        if (!pairConfig?.symbol || !priceSocket) return;
        getLeverage(pairConfig?.symbol);
        setVolume('');
        setPrice('');
        setType(TYPE_FUTURES.MARKET);
        setOrderSlTp({ sl: 0, tp: 0, ratioSl: 0, ratioTp: 0 });
        localStorage.setItem(LOCAL_STORAGE_KEY.SYMBOL_PREVIOUS, pairConfig?.symbol);
        priceSocket.emit(PublicSocketEvent.SUB_TICKER_UPDATE, pairConfig?.symbol);
        return () => {
            priceSocket.emit(PublicSocketEvent.UNSUB_TICKER_UPDATE, pairConfig?.symbol);
        };
    }, [pairConfig?.symbol, priceSocket]);

    const toggleSuccessModal = () => {
        setShowSuccessModal(!showSuccessModal);
    };

    const getFilter = (filterType: string, config: PairConfig) => {
        return find(config?.filters, { filterType }) as any;
    };

    /**
     * Calculates the maximum volume that can be ordered based on the available balance,
     * estimated fee, and leverage. The result is rounded down to the nearest multiple of 5.
     *
     * @param {number} maxAvailable - The maximum available balance for placing the order.
     * @param {number} estFee - The estimated fee for placing the order.
     * @param {number} leverage - The leverage factor to be applied.
     * @returns {number} The maximum volume that can be ordered, rounded down to the nearest multiple of 5.
     */
    const volumeConfig = useMemo(() => {
        const maxAvailable = available * 0.99;
        const estFee = maxAvailable * leverage * feeConfig.open;
        const maxVol = Math.floor(((maxAvailable - estFee) * leverage) / 5) * 5;
        const maxConfig = pairConfig ? getFilter('MARKET_LOT_SIZE', pairConfig)?.maxQuoteQty : maxAvailable;
        return {
            min: pairConfig ? getFilter('MIN_NOTIONAL', pairConfig)?.notional : 5,
            max: Math.min(maxConfig, maxVol)
        };
    }, [pairConfig, available, leverage, volume, feeConfig]);

    const activeType = useMemo(() => {
        return type;
        // if (type === TYPE_FUTURES.MARKET || !pairConfig) return TYPE_FUTURES.MARKET;
        // return getFuturesType({ order: { side, open_price: +price }, pairConfig, lastPrice: activePrice });
    }, [pairConfig, type, price, side, activePrice]);

    const onConfirm = async (side: SIDE_FUTURES) => {
        if (!pairConfig) return;
        toast.dismiss();
        if (!volume || !available) {
            const message = !volume ? 'Please enter volume' : 'Insufficient balance';
            toast.error(message);
        }
        if (loading || !volume || !available) return;
        try {
            setLoading(true);
            const diviceId = getDeviceId();
            const now = Date.now();
            const requestId = Math.floor(now / 2000) + '_' + diviceId;
            const signature = getSignature(String(user?._id), now);
            const _order = await fetchOrderFutures('post', {
                leverage,
                quoteQty: +volume,
                margin: +volume / leverage,
                price: +price,
                side,
                type: activeType,
                symbol: pairConfig?.symbol,
                useQuoteQty: true,
                requestId,
                signature,
                sl: orderSlTp.sl,
                tp: orderSlTp.tp
            });
            if (_order?.status === 'ok') {
                order.current = {
                    leverage,
                    order_value: +volume,
                    margin: +volume / leverage,
                    side,
                    status: activeType === TYPE_FUTURES.MARKET ? STATUS_FUTURES.ACTIVE : STATUS_FUTURES.PENDING
                };
                placeIdRef.current = _order.data.displaying_id; // If you put displaying_id to order.current, current flow will be affected (OrderEditSLTPModal not reusable)
                toggleSuccessModal();
            } else {
                toast.error(_order?.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const onFocusInput = () => {
        if (!isIOS) return;
        const el = document.getElementById('view-positions');
        if (el) el.style.paddingBottom = '158px';
    };

    const onBlurInput = () => {
        if (!isIOS) return;
        setTimeout(() => {
            const el = document.getElementById('view-positions');
            if (el) el.style.paddingBottom = '32px';
        }, 100);
    };

    const onHandleChange = (key: string, value: any) => {
        switch (key) {
            case 'price':
                setPrice(value);
                break;
            case 'volume':
                setVolume(value);
                break;
            case 'type':
                setType(value);
                setPrice('');
                setOrderSlTp({ sl: 0, tp: 0, ratioSl: 0, ratioTp: 0 });
                break;
            default:
                break;
        }
    };

    const options = [
        { text: 'Limit', value: TYPE_FUTURES.LIMIT },
        { text: 'Market', value: TYPE_FUTURES.MARKET }
    ];

    const onShowEditSlTp = () => {
        if (!pairConfig) return;
        const { ask, bid } = useFuturesConfig.getState().tickers[pairConfig.symbol];
        const openPrice = +(type === TYPE_FUTURES.MARKET ? (side === SIDE_FUTURES.BUY ? ask : bid) : price);
        order.current = {
            fee: 0,
            side: side,
            quantity: +volume / openPrice,
            margin: +volume / leverage,
            order_value: +volume,
            status: 0,
            price: openPrice,
            quoteAsset: pairConfig.quoteAsset,
            leverage: leverage,
            symbol: pairConfig.symbol,
            type,
            ...orderSlTp
        };
        setShowEditSLTP(true);
    };

    const infomation = useMemo(() => {
        const ask = ticker?.ask || 0;
        const bid = ticker?.bid || 0;
        const isMarket = type === TYPE_FUTURES.MARKET;
        const openPrice = +(isMarket ? (side === SIDE_FUTURES.BUY ? ask : bid) : price);
        const margin = +volume / leverage;
        const quantity = +volume / openPrice;
        return {
            margin: margin,
            liqPrice: calLiqPrice({ side, quantity, open_price: openPrice, margin, order_value: +volume } as OrderFutures, pairConfig as PairConfig)
        };
    }, [pairConfig, volume, leverage, ticker?.bid, ticker?.ask, type, price, side, feeConfig]);

    const priceValidator = useCallback(
        (price: number) => {
            const isError = false;
            const msg: string | null = '';

            if (!pairConfig || !price) return { isError, msg };

            const { maxPrice: _maxPrice, minPrice: _minPrice } = (getFilter(FilterType.PRICE_FILTER, pairConfig) || {}) as any;
            const { multiplierDown, multiplierUp, minDifferenceRatio } = (getFilter(FilterType.PERCENT_PRICE, pairConfig) || {}) as any;

            const calculateBounds = (isLower: boolean) => ({
                min: Math.max(isLower ? _minPrice : activePrice, activePrice * (isLower ? multiplierDown : 1 + minDifferenceRatio)),
                max: Math.min(isLower ? activePrice : _maxPrice, activePrice * (isLower ? 1 - minDifferenceRatio : multiplierUp))
            });

            const lowerBound = calculateBounds(true);
            const upperBound = calculateBounds(false);

            const isBuy = side === SIDE_FUTURES.BUY;
            const isLimit = activeType === TYPE_FUTURES.LIMIT;
            const isStop = activeType === TYPE_FUTURES.STOP;

            const validatePrice = (price: number, min: number, max: number) => {
                if (price < min) return { isError: true, msg: `Min: ${formatNumber2(min, decimals.price)}` };
                if (price > max) return { isError: true, msg: `Max: ${formatNumber2(max, decimals.price)}` };
                return { isError: false, msg: '' };
            };

            if (isBuy) {
                if (isLimit) return validatePrice(price, lowerBound.min, lowerBound.max);
                if (isStop) return validatePrice(price, upperBound.min, upperBound.max);
            } else {
                if (isLimit) return validatePrice(price, upperBound.min, upperBound.max);
                if (isStop) return validatePrice(price, lowerBound.min, lowerBound.max);
            }
            return { isError, msg };
        },
        [price, pairConfig, side, activeType]
    );

    const priceValid = priceValidator(+price);

    const inValidPrice = type !== TYPE_FUTURES.MARKET && !+price;
    const disabled = !volume || inValidPrice || priceValid.isError || loading;

    const onShareSignalFinished = (isSuccess: boolean, data: IPost) => {
        setNewOrderCreatedId(null);
        setShowShareSignalModal(false);
        if (isSuccess) {
            setNewPost(data);
            setShowShareOrderSignalSuccessModal(true);
        }
    };

    const onShareSignal = () => {
        setShowSuccessModal(false);
        setShowShareSignalModal(true);
    };

    if (!pairConfig) return null;
    return (
        <>
            <OrderSuccessModal
                visible={showSuccessModal}
                onClose={toggleSuccessModal}
                pairConfig={pairConfig}
                decimals={decimals}
                order={{ ...order.current, placeId: placeIdRef.current }}
                onShare={onShareSignal}
            />
            {newOrderCreatedId && (
                <ShareOrderSignalModal
                    visible={showShareSignalModal}
                    onClose={() => setShowShareSignalModal(false)}
                    orderId={newOrderCreatedId}
                    onFinished={onShareSignalFinished}
                    useDebounce
                />
            )}
            <OrderEditSLTPModal
                order={order.current}
                visible={showEditSlTP}
                onClose={() => setShowEditSLTP(false)}
                decimals={decimals}
                pairConfig={pairConfig}
                onConfirm={(e) => {
                    setOrderSlTp(e);
                    setShowEditSLTP(false);
                }}
                liqPrice={infomation.liqPrice}
            />
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2 flex-1">
                        <Card id="futures_types" className="bg-background-4 text-md flex-1 relative">
                            <Select
                                options={options}
                                value={type}
                                onChange={(e: any) => onHandleChange('type', e)}
                                labelClassName="text-md"
                                container="#futures_types"
                            />
                        </Card>
                        <LeverageSetting leverage={leverage} setLeverage={setLeverage} pairConfig={pairConfig} />
                    </div>
                    <OrderSide side={side} setSide={setSide} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col space-y-2 flex-1">
                        <InputNumber
                            onFocus={onFocusInput}
                            onBlur={onBlurInput}
                            getInputRef={inputRef}
                            value={price}
                            disabled={type === TYPE_FUTURES.MARKET}
                            handleChange={(e) => onHandleChange('price', e.value)}
                            decimal={decimals.price}
                            renderPrefix={
                                <span className={cn('text-md text-sub font-normal', { 'text-disable': type === TYPE_FUTURES.MARKET })}>
                                    {type === TYPE_FUTURES.MARKET ? 'Market' : ''} Price
                                </span>
                            }
                            renderSuffix={<span className={cn('text-md')}>{quoteAsset}</span>}
                            className="font-bold"
                            errorTooltip={priceValid.isError}
                            helperText={priceValid.msg}
                            helperTextClassName="transition-none text-center"
                        />
                        <Card className="flex items-center justify-between">
                            <Text variant="secondary" className="text-md">
                                TP/SL
                            </Text>
                            {orderSlTp.sl || orderSlTp.tp ? (
                                <span onClick={onShowEditSlTp} className="text-md font-medium">
                                    <span className="text-red-1">{orderSlTp.ratioSl ? `${orderSlTp.ratioSl}%` : '-'}</span>
                                    <span className="text-sub">/</span>
                                    <span className="text-green-1">{orderSlTp.ratioTp ? `+${orderSlTp.ratioTp}%` : '-'}</span>
                                </span>
                            ) : (
                                +volume > 0 && !inValidPrice && <N3AddCircleIcon size={16} onClick={onShowEditSlTp} />
                            )}
                        </Card>
                    </div>
                    <Card className="p-0">
                        <div className="w-full bg-background-2 flex flex-col px-2">
                            <InputNumber
                                onFocus={onFocusInput}
                                onBlur={onBlurInput}
                                getInputRef={inputRef}
                                value={volume}
                                handleChange={(e) => onHandleChange('volume', e.value)}
                                className="ring-0 px-0 flex-1 font-bold"
                                decimal={decimals.symbol}
                                max={volumeConfig.max}
                                renderPrefix={<span className="text-md text-sub font-normal">Volume</span>}
                                renderSuffix={<span className="text-md">{quoteAsset}</span>}
                            />
                            <div className="h-[0.5px] w-full bg-divider" />
                            <VolumeSlider volume={volume} volumeConfig={volumeConfig} onChange={(e) => onHandleChange('volume', e)} />
                        </div>
                    </Card>
                </div>
                <div className="grid grid-cols-2 gap-2 text-pure-black text-md">
                    <div className="flex flex-col justify-center space-y-2 text-sm">
                        <div className="flex items-center justify-between space-x-1">
                            <Text variant="secondary">Margin required</Text>
                            <Text className="text-right break-all">{formatNumber2(infomation.margin, decimals.symbol)}</Text>
                        </div>
                        <div className="flex items-center justify-between space-x-1">
                            <Text variant="secondary">Liq. Price</Text>
                            <Text className="text-right break-all">{formatNumber2(infomation.liqPrice, decimals.price)}</Text>
                        </div>
                    </div>
                    <Button
                        className={cn('flex flex-col space-y-1 items-center justify-center font-bold', {
                            'bg-green-1 active:bg-green-1/80': side === SIDE_FUTURES.BUY,
                            'bg-red-1 active:bg-red-1/80': side === SIDE_FUTURES.SELL,
                            'bg-background-4 text-disable': disabled
                        })}
                        onClick={() => onConfirm(side)}
                        disabled={disabled}
                    >
                        <span className="">{side === SIDE_FUTURES.BUY ? 'Long' : 'Short'}</span>
                        {type === TYPE_FUTURES.MARKET ? (
                            <TickerField
                                className="!text-current font-bold"
                                field={side === SIDE_FUTURES.BUY ? 'ask' : 'bid'}
                                decimal={decimals.price}
                                symbol={pairConfig.symbol}
                            />
                        ) : (
                            <span>{price ? formatNumber2(price, decimals.price) : '--'}</span>
                        )}
                    </Button>
                </div>
                <div id="view-positions" className="flex items-center justify-center space-x-2 mt-4 text-sm pb-8">
                    <span className="text-sub">Swipe to view positions</span>
                    <ArrowIcon />
                </div>
            </div>
        </>
    );
};

const ArrowIcon = () => {
    return (
        <ArrowWrapper className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none" className="arrow animate-slide-up delay-0">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.33333 5.66602H2.66666V4.33268H1.33333V5.66602ZM9.33333 5.66602H10.6667V4.33268H9.33333V5.66602ZM9.33332 4.33268H7.99999V2.99935L6.66666 2.99935V1.66601H8L7.99999 2.99935H9.33332V4.33268ZM5.33333 2.33268H6.66666V0.33268H5.33333V1.66601H4V2.99935H5.33333V2.33268ZM4 2.99935H2.66666V4.33268H4L4 2.99935Z"
                    fill="#9D9D9D"
                />
                <rect width="1.33333" height="1.33333" transform="matrix(1 0 0 -1 10.6667 7)" fill="#9D9D9D" />
                <rect x="1.33334" y="7" width="1.33333" height="1.33333" transform="rotate(180 1.33334 7)" fill="#9D9D9D" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none" className="arrow animate-slide-up delay-1">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.333328 5.66602H1.66666V4.33268H0.333328V5.66602ZM8.33333 5.66602H9.66667V4.33268H8.33333V5.66602ZM8.33332 4.33268H6.99999V2.99935H8.33332V4.33268ZM5.66666 2.99935H7V1.66601H5.66666V2.99935ZM4.33333 2.33268H5.66666V0.33268H4.33333V1.66601H3V2.99935H4.33333V2.33268ZM3 4.33268H1.66666V2.99935H3V4.33268Z"
                    fill="#575757"
                />
            </svg>
        </ArrowWrapper>
    );
};

const ArrowWrapper = styled.div`
    margin-bottom: 4px;
    .arrow {
        transform: translateY(10px);
        animation: slide-up 1s ease-in-out infinite;
    }

    .arrow:nth-child(1) {
        animation-delay: 0s;
    }

    .arrow:nth-child(2) {
        animation-delay: 0.05s;
    }

    @keyframes slide-up {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(5px);
        }
        100% {
            transform: translateY(0);
        }
    }
`;
export default PlaceOrder;
