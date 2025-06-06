import InputSearch from '@/components/common/input/InputSearch';
import BannerAlerts from './components/BannerAlerts';
import Card from '@/components/common/card';
import Button from '@/components/common/Button';
import ModifyAlerts from './components/ModifyAlerts';
import SettingAlerts from './components/SettingAlerts';
import { useEffect, useMemo, useRef, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { useNavigate } from 'react-router-dom';
import FilterAlerts from './components/FilterAlerts';
import AssetLogo from '@/components/common/AssetLogo';
import useFuturesConfig from '@/stores/futures.store';
import { getPairConfig } from '@/selectors';
import Text from '@/components/common/text';
import TickerField from '../Futures/components/TickerField';
import { cn, formatNumber2, getDecimalPrice, getPreviousSymbol } from '@/helper';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import usePriceSocket from '@/stores/priceSocket.store';
import { PublicSocketEvent } from '@/helper/constant';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { alertTypes, alertFrequencies, AlertType, MAX_ALERTS_ALL } from './constants';
import Nodata from '@/components/common/nodata';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { fetchAlerts } from '@/apis/alerts.api';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import RulesAlerts from './components/RulesAlerts';
import useSocketStore from '@/stores/socket.store';
import PubicLayout from '@/components/layout/PubicLayout';

const Alerts = () => {
    const navigate = useNavigate();
    const userSocket = useSocketStore((state) => state.socket2);
    const priceSocket = usePriceSocket((state) => state.socket);
    const [showSetting, setShowSetting] = useState(false);
    const [showModify, setShowModify] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [strSearch, setStrSearch] = useState('');
    const [filter, setFilter] = useState({
        baseAsset: null,
        alertType: null,
        frequency: null
    });
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState<AlertType[]>([]);

    const getAlerts = async () => {
        try {
            const alerts = await fetchAlerts();
            setDataSource(alerts?.data?.results.slice(0, MAX_ALERTS_ALL));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAlerts();
    }, []);

    useEffect(() => {
        if (!userSocket) return;
        userSocket.emit('subscribe', 'alert_price');
        userSocket.on('delete_alert', onRemove);
        return () => {
            userSocket.emit('unsubscribe', 'alert_price');
            userSocket.off('delete_alert', onRemove);
        };
    }, [userSocket]);

    const groupedDataSource = useMemo(() => {
        const sortedData = [...dataSource].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
        return sortedData.reduce((acc, item) => {
            const symbol = `${item.baseAsset}${item.quoteAsset}`;
            if (!acc[symbol]) acc[symbol] = [];
            acc[symbol].push(item);
            return acc;
        }, {} as Record<string, AlertType[]>);
    }, [dataSource]);

    const dataFilter = useMemo(() => {
        if (!strSearch && !filter.baseAsset && !filter.alertType && !filter.frequency) return groupedDataSource;
        const filtered = Object.keys(groupedDataSource).reduce((acc, symbol) => {
            const baseSymbol = symbol.replace('USDT', '');
            if (strSearch && !baseSymbol.toLowerCase().includes(strSearch.toLowerCase())) return acc;
            if (filter.baseAsset && !symbol.includes(filter.baseAsset)) return acc;
            const filteredAlerts = groupedDataSource[symbol].filter((item) => {
                if (filter.alertType && item.alertType !== filter.alertType) return false;
                if (filter.frequency && item.frequency !== filter.frequency) return false;
                return true;
            });
            if (filteredAlerts.length > 0) {
                acc[symbol] = filteredAlerts;
            }
            return acc;
        }, {} as Record<string, AlertType[]>);
        return filtered;
    }, [filter, groupedDataSource, strSearch]);

    useEffect(() => {
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(() => {
            navigate(`/futures/${getPreviousSymbol()}`);
            WebApp.BackButton.hide();
        });
    }, []);

    useEffect(() => {
        const symbols = [...new Set([...dataSource.map((item) => `${item.baseAsset}${item.quoteAsset}`)])];
        if (!priceSocket || !symbols.length) return;
        priceSocket.emit(PublicSocketEvent.SUB_TICKER_UPDATE, symbols);
        return () => {
            priceSocket.emit(PublicSocketEvent.UNSUB_TICKER_UPDATE, symbols);
        };
    }, [dataSource, priceSocket]);

    const toggleModify = () => {
        setShowModify((prev) => !prev);
    };

    const toggleSetting = () => {
        setShowSetting((prev) => !prev);
    };

    const toggleFilter = () => {
        setShowFilter((prev) => !prev);
    };

    const onRemove = (alert: AlertType) => {
        setDataSource((prev) => prev.filter((item) => item.alertId !== alert.alertId));
    };

    const onDelete = async (item: AlertType) => {
        try {
            const data = await fetchAlerts('delete', { params: { alertId: item.alertId } });
            if (data.status === 'ok') {
                onRemove(item);
                toast.success('Alert cleared');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const onEdit = async (item: AlertType) => {
        try {
            const data = await fetchAlerts('put', { ...item });
            if (data.status === 'ok') {
                const _dataSource = [...dataSource];
                const index = _dataSource.findIndex((i) => i.alertId === item.alertId);
                _dataSource[index] = { ..._dataSource[index], ...item };
                setDataSource(_dataSource);
                toast.success('Alert edited');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const onAdd = async (item: AlertType) => {
        try {
            const data = await fetchAlerts('post', { ...item });
            if (data?.data) {
                setDataSource([data.data, ...dataSource]);
                toast.success('Alert created successfully');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const maximumPairs = dataSource.length >= MAX_ALERTS_ALL;

    return (
        <PubicLayout>
            <ModifyAlerts visible={showModify} onClose={toggleModify} groupedDataSource={groupedDataSource} onConfirm={onAdd} />
            <SettingAlerts visible={showSetting} onClose={toggleSetting} />
            <FilterAlerts visible={showFilter} onClose={toggleFilter} onConfirm={setFilter} filter={filter} />
            <div className="flex flex-col h-full">
                <BannerAlerts />
                <div className="pt-[0.5px] -mt-3 px-3 flex-1 overflow-hidden z-0">
                    <div className="flex items-center space-x-[10px]">
                        <InputSearch value={strSearch} onValueChange={debounce(setStrSearch)} className="bg-background-2 w-full" placeholder="Search Token" />
                        <RulesAlerts />
                        {/* <Card className="h-10 min-w-10 relative cursor-pointer" onClick={toggleFilter}>
                            <FilterIcon className="absolute-center" />
                        </Card> */}
                    </div>
                    <div className="overflow-auto mt-3 max-h-[calc(100%-56px)] p-[1px] space-y-3 pb-4 mask-shadow">
                        {loading ? (
                            <LoadingScreen className="mt-[88px]" />
                        ) : Object.keys(dataFilter).length <= 0 ? (
                            <Nodata className="mt-[88px]" />
                        ) : (
                            Object.keys(dataFilter).map((symbol) => (
                                <Item key={symbol} data={dataFilter[symbol]} symbol={symbol} onDelete={onDelete} onEdit={onEdit} />
                            ))
                        )}
                    </div>
                </div>
                <div className="px-3">
                    <Button disabled={maximumPairs || loading} variant="primary" className="h-11" onClick={toggleModify}>
                        {maximumPairs ? 'You have created 50 alerts' : 'ADD ALERT'}
                    </Button>
                </div>
            </div>
        </PubicLayout>
    );
};

const Item = ({ data, symbol, onDelete, onEdit }: { data: AlertType[]; symbol: string; onDelete: (e: AlertType) => void; onEdit: (e: AlertType) => void }) => {
    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, symbol));
    const [showModify, setShowModify] = useState(false);
    const [open, setOpen] = useState(false);
    const rowData = useRef<AlertType>();

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig)
        };
    }, [pairConfig]);

    const toggleOpen = () => {
        setOpen((prev) => !prev);
    };

    const toggleModify = () => {
        setShowModify((prev) => !prev);
    };

    if (!pairConfig) return null;

    return (
        <>
            <ModifyAlerts visible={showModify} onClose={toggleModify} rowData={rowData.current} onConfirm={onEdit} />
            <Card className="flex flex-col px-0">
                <div className="flex items-center w-full">
                    <div className="flex items-center space-x-2 w-[130px] px-3">
                        <AssetLogo assetId={pairConfig?.baseAssetId} />
                        <Text>{pairConfig.baseAsset}</Text>
                    </div>
                    <div className="w-[1px] h-6 bg-divider mx-1" />
                    <div className="flex items-center justify-center space-x-2 px-3 flex-1">
                        <TickerField field="lastPrice" symbol={symbol} decimal={decimals.price} className="font-bold !text-main" />
                        <TickerField field="priceChangePercent" symbol={symbol} className="font-bold" />
                    </div>
                    <div className="w-[1px] h-6 bg-divider mx-1" />
                    <div className="flex items-center justify-center w-10 px-3 cursor-pointer" onClick={toggleOpen}>
                        <ChevronDownIcon className={cn('transition-all', { 'text-green-1 rotate-180': open })} color="currentColor" />
                    </div>
                </div>
                <div
                    className={cn('transition-all duration-500 w-full overflow-hidden px-3', {
                        'h-0 opacity-0 ease-in-out duration-200': !open,
                        'mt-2 max-h-max ease-out': open
                    })}
                >
                    <div className="h-[1px] bg-divider w-full" />
                    <div className="mt-3 mb-1 flex flex-col space-y-4">
                        {data.map((item) => {
                            const alertType = alertTypes.find((t) => t.value === item.alertType);
                            const frequency = alertFrequencies.find((f) => f.value === item.frequency)?.label;
                            return (
                                <div key={item.alertId} className="flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        {alertType?.icon}
                                        <div className="flex flex-col space-y-1">
                                            <Text className="text-md flex items-center space-x-2">
                                                <span>{alertType?.label}:</span>
                                                <span>{formatNumber2(item.value, decimals.price)}</span>
                                            </Text>
                                            <Text variant="secondary" className="text-sm">
                                                {frequency}
                                            </Text>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <EditIcon
                                            className="cursor-pointer"
                                            onClick={() => {
                                                rowData.current = item;
                                                toggleModify();
                                            }}
                                        />
                                        <DeleteIcon className="cursor-pointer" onClick={() => onDelete(item)} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </>
    );
};

export default Alerts;
