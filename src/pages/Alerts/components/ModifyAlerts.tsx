import Card from '@/components/common/card';
import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import useFuturesConfig from '@/stores/futures.store';
import { PairConfig } from '@/type/futures.type';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import TickerField from '../../Futures/components/TickerField';
import { cn, formatNumber2, getDecimalPrice, isIOS } from '@/helper';
import { getAssetConfig } from '@/selectors';
import InputNumber from '@/components/common/input/InputNumber';
import Button from '@/components/common/Button';
import Chip from '@/components/common/chip';
import TokensAlerts from './TokensAlerts';
import { alertFrequencies, AlertType, alertTypes, DEFAULT_ALERT_TOKEN, MAX_ALERTS_PAIR } from '../constants';
import styled, { css } from 'styled-components';
import colors from '@/config/colors';
import { ALERT_FREQUENCY, ALERT_TYPE, PublicSocketEvent } from '@/helper/constant';
import { getLastPrice } from '@/helper/futures';
import usePriceSocket from '@/stores/priceSocket.store';
import { isEqual, some } from 'lodash';
import { useLocation } from 'react-router-dom';

interface IModifyAlertsProps {
    visible: boolean;
    onClose: VoidFunction;
    rowData?: AlertType | null;
    groupedDataSource?: { [key: string]: AlertType[] };
    onConfirm: (e: AlertType) => void;
}

const initialParams = {
    value: '',
    alertType: ALERT_TYPE.REACHES,
    frequency: ALERT_FREQUENCY.ONLY_ONCE,
    lang: 'en'
};
const ModifyAlerts = ({ visible, onClose, rowData, groupedDataSource, onConfirm }: IModifyAlertsProps) => {
    const queryParams = useLocation();
    const priceSocket = usePriceSocket((state) => state.socket);
    const pairsConfig = useFuturesConfig((state) => state.pairsConfig);
    const [selectedPair, setSelectedPair] = useState<PairConfig | null>(null);
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, selectedPair?.quoteAssetId));
    const [params, setParams] = useState<AlertType>(initialParams);
    const isModify = !!rowData;
    const activePrice = useFuturesConfig((state) => (selectedPair ? state.tickers[selectedPair?.symbol] : null))?.lastPrice || 0;
    const initSymbol = new URLSearchParams(queryParams.search).get('symbol') || DEFAULT_ALERT_TOKEN;

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(selectedPair || undefined),
            symbol: assetConfig?.assetDigit
        };
    }, [selectedPair]);

    useEffect(() => {
        if (!selectedPair || !priceSocket || !visible || isModify) return;
        const newSymbol = groupedDataSource?.[selectedPair?.symbol];
        if (!newSymbol) {
            if (visible) priceSocket.emit(PublicSocketEvent.SUB_TICKER_UPDATE, selectedPair.symbol);
            return () => {
                priceSocket.emit(PublicSocketEvent.UNSUB_TICKER_UPDATE, selectedPair.symbol);
            };
        }
    }, [selectedPair, visible]);

    useEffect(() => {
        if (!pairsConfig || !visible) return;
        const pair = pairsConfig.find((item) => item.baseAsset === (rowData?.baseAsset || initSymbol)) || pairsConfig[0];
        const lastPrice = getLastPrice(pair.symbol);
        setSelectedPair(pair);
        setParams({ ...initialParams, value: lastPrice, ...rowData });
    }, [pairsConfig, visible]);

    const onHandleChange = (field: string, value: any) => {
        switch (field) {
            case 'pairCofig': {
                const lastPrice = getLastPrice(value?.symbol);
                setSelectedPair(value);
                if (!isModify) setParams(initialParams);
                setParams((prev) => ({ ...prev, value: lastPrice || '' }));
                break;
            }
            case 'alertType': {
                setParams((prev) => ({ ...prev, [field]: value, value: '' }));
                break;
            }
            default: {
                setParams((prev) => ({ ...prev, [field]: value }));
                break;
            }
        }
    };

    const types = useMemo(() => {
        return alertTypes.filter((item) => item.value !== null);
    }, []);

    const frequencies = useMemo(() => {
        return alertFrequencies.filter((item) => item.value !== null);
    }, []);

    const maximumPair = useMemo(() => {
        if (!groupedDataSource || Object.keys(groupedDataSource).length <= 0 || isModify || !selectedPair) return false;
        if (!groupedDataSource?.[selectedPair?.symbol]) return false;
        return Object.keys(groupedDataSource?.[selectedPair?.symbol])?.length >= MAX_ALERTS_PAIR;
    }, [groupedDataSource, selectedPair, isModify]);

    const handleConfirm = () => {
        onConfirm({ ...params, baseAsset: selectedPair?.baseAsset || null });
        onClose();
    };

    const inputValidator = useCallback(() => {
        let isError = false;
        let msg: string | null = '';

        const value = +params.value;

        if (!selectedPair || !String(params.value)) return { isError, msg };
        const calculateBounds = () => {
            if (params.alertType === ALERT_TYPE.DROPS_TO) {
                return {
                    min: 0,
                    max: activePrice
                };
            }
            if (params.alertType === ALERT_TYPE.RISES_ABOVE) {
                return {
                    min: activePrice,
                    max: 0
                };
            }
            return {
                min: 0,
                max: 0
            };
        };
        const bound = calculateBounds();
        const checkBounds = (min: number, max: number, value: number) => {
            if (min && value < min) {
                isError = true;
                msg = `Minimum price ${formatNumber2(min, decimals.price)}`;
            } else if (max && value > max) {
                isError = true;
                msg = `Maximum price ${formatNumber2(max, decimals.price)}`;
            }
        };
        checkBounds(bound.min, bound.max, value);
        return { isError, msg };
    }, [selectedPair, activePrice, params.value, params.alertType]);

    const isError = inputValidator();

    const disabled = useMemo(() => {
        const hasChanges = rowData
            ? some({ value: params.value, frequency: params.frequency }, (value, key) => !isEqual(String(value), String(rowData[key as keyof AlertType])))
            : true;
        return maximumPair || isError.isError || !+params.value || !hasChanges;
    }, [maximumPair, isError.isError, params, rowData, visible]);

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

    if (!selectedPair) return null;

    return (
        <Modal title={isModify ? 'MODIFY ALERT' : 'ADD ALERT'} visible={visible} onClose={onClose}>
            <div id="input_modal" className="flex flex-col space-y-5">
                <div className="flex space-x-2">
                    <TokensAlerts selectedPair={selectedPair} setSelectedPair={(e: any) => onHandleChange('pairCofig', e)} disabled={!!rowData} />
                    <Card className="bg-background-3 flex-1 justify-center space-x-[10px]">
                        <TickerField field="lastPrice" symbol={selectedPair?.symbol} decimal={decimals.price} className="font-bold !text-main" />
                        <TickerField field="priceChangePercent" symbol={selectedPair?.symbol} decimal={decimals.price} className="font-bold" />
                    </Card>
                </div>
                <div className="flex flex-col space-y-2">
                    <Text className="text-md font-medium">Price</Text>
                    <InputNumber
                        value={params.value}
                        handleChange={(e) => onHandleChange('value', e.value)}
                        className="bg-background-3 h-10"
                        inputClassName="text-left"
                        placeholder="Enter Price"
                        error={isError.isError}
                        helperText={isError.msg}
                        decimal={decimals.price}
                        onFocus={() => onFocusInput()}
                        onBlur={() => onBlurInput()}
                        allowLeadingZeros={false}
                        allowNegative={false}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Text className="text-md font-medium">Alert Type</Text>
                    <div className="flex items-center space-x-1">
                        {types.map((item) => (
                            <ChipType
                                onClick={() => params.alertType !== item.value && onHandleChange('alertType', item.value)}
                                key={item.value}
                                active={params.alertType === item.value}
                                className={cn('flex-1 flex items-center justify-center space-x-1 h-7', { 'bg-background-3': params.alertType === item.value })}
                                disabled={isModify && params.alertType !== item.value}
                            >
                                <span>{item.label}</span>
                                {item.icon}
                            </ChipType>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Text className="text-md font-medium">Frequency</Text>
                    <div className="flex items-center space-x-1">
                        {frequencies.map((item) => (
                            <Chip
                                onClick={() => onHandleChange('frequency', item.value)}
                                key={item.value}
                                active={params.frequency === item.value}
                                className={cn('flex-1 flex items-center justify-center space-x-1 h-7', { 'bg-background-3': params.frequency === item.value })}
                            >
                                <span>{item.label}</span>
                            </Chip>
                        ))}
                    </div>
                </div>
                <div className="!mt-6">
                    <Button disabled={disabled} variant="primary" className="h-11" onClick={handleConfirm}>
                        {maximumPair ? 'You have created 10 alerts' : 'Confirm'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const ChipType = styled(Chip)<{ disabled?: boolean }>`
    ${({ disabled }) =>
        disabled &&
        css`
            svg {
                color: ${colors.disable};
            }
        `}
`;

export default memo(ModifyAlerts, (prev, next) => prev.visible === next.visible);
