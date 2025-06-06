import AssetLogo from '@/components/common/AssetLogo';
import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import { DecimalsFuturesType, FeeType, FilterType, OrderFutures, PairConfig, SIDE_FUTURES, TYPE_FUTURES } from '@/type/futures.type';
import TickerField from '../TickerField';
import { cn, formatNumber2, getFilter, isIOS, roundDown, roundUp } from '@/helper';
import Button from '@/components/common/Button';
import InputNumber from '@/components/common/input/InputNumber';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import VolumeSlider from '@/components/common/slider/VolumeSlider';
import useWalletStore from '@/stores/wallet.store';
import useFeeConfig from '@/hooks/useFeeConfig';
import useFuturesConfig from '@/stores/futures.store';
import { dcaOrder } from '@/apis/futures.api';
import { toast } from 'react-toastify';
import { calLiqPrice, ERROR_MESSAGES_FUTURES } from '@/helper/futures';

interface AddVolumeModalProps {
    visible: boolean;
    onClose: () => void;
    decimals: DecimalsFuturesType;
    pairConfig?: PairConfig;
    order?: OrderFutures | null;
}
const AddVolumeModal = ({ visible, onClose, pairConfig, decimals, order }: AddVolumeModalProps) => {
    const available = useWalletStore((state) => state.available);
    const ticker = useFuturesConfig((state) => (pairConfig?.symbol ? state.tickers[String(pairConfig?.symbol)] : null));
    const { feeConfig } = useFeeConfig(FeeType.TAKER);
    const [volume, setVolume] = useState<number | string>(0);
    const [loading, setLoading] = useState(false);

    const quoteAsset = pairConfig?.quoteAsset;

    const volumeConfig = useMemo(() => {
        if (!order || !pairConfig) return { min: 5, max: 0 };
        const maxAvailable = available * 0.99;
        const estFee = maxAvailable * order?.leverage * feeConfig.open;
        const maxVol = Math.floor(((maxAvailable - estFee) * order?.leverage) / 5) * 5;
        const maxConfig = pairConfig ? getFilter(FilterType.MARKET_LOT_SIZE, pairConfig)?.maxQuoteQty : maxAvailable;
        return {
            min: pairConfig ? getFilter(FilterType.MIN_NOTIONAL, pairConfig)?.notional : 5,
            max: Math.min(maxConfig, maxVol)
        };
    }, [pairConfig, available, order?.leverage, volume, feeConfig]);

    useEffect(() => {
        if (visible) setVolume(volumeConfig.min);
    }, [visible]);

    const onChangeVolume = (value: string) => {
        setVolume(value);
    };

    const onHandleChangeVolume = (key: 'minus' | 'plus') => {
        const value = +volume;
        const newVolume = key === 'minus' ? value - volumeConfig.min : value + volumeConfig.min;
        if ((newVolume >= volumeConfig.min && key === 'minus') || (newVolume <= volumeConfig.max && key === 'plus')) {
            setVolume(newVolume);
        }
    };

    const infomation = useMemo(() => {
        if (!order || !pairConfig) return { AvePrice: 0, MarginRequired: 0, NewLiqPrice: 0, Available: available };
        const price = ticker?.lastPrice || 0;
        const open_price = order.open_price;
        const totalQty = +volume / price + order.quantity;
        const totalMargin = +volume / order.leverage + order.margin;
        const avePrice = (+volume + order.quantity * open_price) / totalQty;
        const roundFunction = order.side === SIDE_FUTURES.SELL ? roundDown : roundUp;
        const liqPrice = roundFunction(
            calLiqPrice({ ...order, open_price: avePrice, quantity: totalQty, margin: totalMargin }, pairConfig),
            decimals.price || 2
        );
        return {
            AvePrice: avePrice,
            MarginRequired: totalMargin,
            NewLiqPrice: liqPrice,
            Available: available
        };
    }, [volume, ticker?.lastPrice, available, order, pairConfig]);

    const onFocusInput = () => {
        if (!isIOS) return;
        const content = document.getElementById('input_modal');
        if (content) {
            content.style.paddingBottom = '44px';
            setTimeout(() => {
                content.classList.add('scrolling-touch');
                content.style.paddingBottom = useFuturesConfig.getState().keyboardHeight + 'px';
            }, 100);
        }
    };

    const onBlurInput = () => {
        if (!isIOS) return;
        setTimeout(() => {
            const content = document.getElementById('input_modal');
            if (content) {
                content.style.paddingBottom = '0px';
                content.classList.remove('scrolling-touch');
            }
        }, 100);
    };

    const onConfirm = async () => {
        try {
            setLoading(true);
            const params = {
                displaying_id: order?.displaying_id,
                type: TYPE_FUTURES.MARKET,
                useQuoteQty: true,
                quoteQty: +volume
            };
            const data = await dcaOrder(params);
            if (data.status === 'ok') {
                toast.success('Add successful trading volume');
                onClose();
            } else {
                let message = ERROR_MESSAGES_FUTURES?.[data.status as keyof typeof ERROR_MESSAGES_FUTURES] || data?.message || 'Add volume failed';
                if (data.status === 'MAX_TOTAL_VOLUME') {
                    message = ERROR_MESSAGES_FUTURES.MAX_TOTAL_VOLUME + ` ${formatNumber2(data?.max_notional, decimals.symbol)} ${pairConfig?.quoteAsset}`;
                }
                toast.error(message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const validator = useCallback(
        (volume: string) => {
            const isError = false;
            const msg: string | null = '';
            if (!volumeConfig.max || !volume) return { isError, msg };
            if (+volume < volumeConfig.min) {
                return { isError: true, msg: `Minimum Volume: ${volumeConfig.min}` };
            }
            if (+volume > volumeConfig.max) {
                return { isError: true, msg: `Maximum Volume: ${volumeConfig.max}` };
            }
            return { isError, msg };
        },
        [volume, volumeConfig]
    );

    const volumeValid = validator(String(volume));
    const disabled = (available && volumeValid.isError) || !+volume || loading;

    if (!pairConfig || !order) return null;
    return (
        <Modal visible={visible} onClose={onClose} title="ADD VOLUME">
            <div id="input_modal">
                <div className="rounded border-0.5 border-divider p-3 flex flex-col space-y-2 text-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <AssetLogo assetId={pairConfig.baseAssetId} size={16} />
                            <Text>{pairConfig.baseAsset}</Text>
                            <Text variant="secondary" className="font-bold">
                                {order.leverage}x
                            </Text>
                        </div>
                        <TickerField field="lastPrice" symbol={pairConfig?.symbol} decimal={decimals.price} className="font-bold" />
                    </div>
                    <hr className="border-divider" />
                    <div className="flex items-center justify-between">
                        <Text variant="secondary">Entry Price</Text>
                        <Text className="font-medium">{formatNumber2(order.open_price, decimals.price)}</Text>
                    </div>
                    <div className="flex items-center justify-between">
                        <Text variant="secondary">Current Volume</Text>
                        <Text className="font-medium">{formatNumber2(order.order_value, decimals.symbol)}</Text>
                    </div>
                </div>
                <div className="pt-4">
                    <Text className="mb-2">ADDED VOLUME</Text>
                    <InputNumber
                        value={volume}
                        className="bg-background-3 py-0 px-0"
                        inputClassName="text-center py-3"
                        handleChange={({ value }) => onChangeVolume(value)}
                        renderPrefix={<Icon onClick={() => onHandleChangeVolume('minus')}>-</Icon>}
                        renderSuffix={<Icon onClick={() => onHandleChangeVolume('plus')}>+</Icon>}
                        onFocus={onFocusInput}
                        onBlur={onBlurInput}
                        decimal={decimals.symbol}
                        error={volumeValid.isError}
                        helperText={volumeValid.msg}
                    />
                    <VolumeSlider volume={volume} onChange={onChangeVolume} volumeConfig={volumeConfig} className="h-10 text-sm" />
                </div>
                <div className="pt-5 flex flex-col space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <Text variant="secondary">Margin Required</Text>
                        <Text>
                            {formatNumber2(infomation.MarginRequired)} {quoteAsset}
                        </Text>
                    </div>
                    <div className="flex items-center justify-between">
                        <Text variant="secondary">Average Entry Price</Text>
                        <Text>
                            {formatNumber2(infomation.AvePrice, decimals.price)} {quoteAsset}
                        </Text>
                    </div>
                    <div className="flex items-center justify-between">
                        <Text variant="secondary">New Liq. Price</Text>
                        <Text>
                            {formatNumber2(infomation.NewLiqPrice, decimals.price)} {quoteAsset}
                        </Text>
                    </div>
                    {/* <div className="flex items-center justify-between">
                        <Text variant="secondary">Available</Text>
                        <Text>
                            {formatNumber2(infomation.Available, decimals.symbol)} {quoteAsset}
                        </Text>
                    </div> */}
                </div>
                <Button disabled={disabled} variant="primary" className="h-11 mt-6" onClick={onConfirm}>
                    Confirm
                </Button>
            </div>
        </Modal>
    );
};

const Icon = ({ onClick, children, className }: { onClick: VoidFunction; children: React.ReactNode; className?: string }) => {
    return (
        <button onClick={onClick} className={cn('text-lg w-10 h-10 flex items-center justify-center', className)}>
            {children}
        </button>
    );
};

export default memo(AddVolumeModal, (prev, next) => prev.visible === next.visible);
