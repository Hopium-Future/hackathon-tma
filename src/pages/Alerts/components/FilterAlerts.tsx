import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import useFuturesConfig from '@/stores/futures.store';
import { PairConfig } from '@/type/futures.type';
import { useEffect, useState } from 'react';
import { cn } from '@/helper';
import Button from '@/components/common/Button';
import { ALERT_FREQUENCY, ALERT_TYPE } from '@/helper/constant';
import Chip from '@/components/common/chip';
import TokensAlerts from './TokensAlerts';
import { alertTypes, alertFrequencies } from '../constants';

interface IFilter {
    baseAsset: string | null;
    alertType: ALERT_TYPE | null;
    frequency: ALERT_FREQUENCY | null;
}

interface IFilterAlertsProps {
    visible: boolean;
    onClose: VoidFunction;
    onConfirm: (e: any) => void;
    filter: IFilter;
}
const FilterAlerts = ({ visible, onClose, onConfirm, filter }: IFilterAlertsProps) => {
    const pairsConfig = useFuturesConfig((state) => state.pairsConfig);
    const [selectedPair, setSelectedPair] = useState<PairConfig | null>(null);
    const [params, setParams] = useState<IFilter>({
        baseAsset: null,
        alertType: null,
        frequency: null
    });

    useEffect(() => {
        if (!pairsConfig || !visible) return;
        const pair = pairsConfig.find((item) => item.baseAsset === filter.baseAsset);
        setSelectedPair(pair || null);
        setParams(filter);
    }, [pairsConfig, visible]);

    const onHandleChange = (field: string, value: string | null) => {
        setParams((prev) => ({ ...prev, [field]: value }));
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm({ ...params, baseAsset: selectedPair?.baseAsset || null });
        onClose();
    };

    return (
        <Modal title="ALERT FILTER" visible={visible} onClose={onClose}>
            <div className="flex flex-col space-y-5">
                <div className="flex space-x-2">
                    <TokensAlerts selectedPair={selectedPair} setSelectedPair={setSelectedPair} className="w-full" isAll />
                </div>
                <div className="flex flex-col space-y-2">
                    <Text className="text-md font-medium">Alert Type</Text>
                    <div className="grid grid-cols-2 gap-x-1 gap-y-2">
                        {alertTypes.map((item) => (
                            <Chip
                                onClick={() => onHandleChange('alertType', item.value)}
                                key={item.value}
                                active={params.alertType === item.value}
                                className={cn('flex-1 flex items-center justify-center space-x-1 h-7', { 'bg-background-3': params.alertType === item.value })}
                            >
                                <span>{item.label}</span>
                                {item.icon}
                            </Chip>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Text className="text-md font-medium">Frequency</Text>
                    <div className="flex items-center space-x-1">
                        {alertFrequencies.map((item) => (
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
                    <Button variant="primary" className="h-11" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default FilterAlerts;
