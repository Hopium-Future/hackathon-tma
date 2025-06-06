import { ALERT_FREQUENCY, ALERT_TYPE } from '@/helper/constant';
import CirleArrow from '@/components/icons/CirleArrow';

export const MAX_ALERTS_ALL = 50;
export const MAX_ALERTS_PAIR = 10;

export type AlertType = {
    productType?: string;
    alertId?: string;
    frequency: string;
    baseAsset?: string | null;
    quoteAsset?: string;
    alertType: string;
    value: number | string;
    createdAt?: number;
    percentage_change?: number;
    status?: string;
    lang?: string;
};

export const alertTypes = [
    { value: null, label: 'All', icon: '' },
    { value: ALERT_TYPE.REACHES, label: 'Reaches', icon: <CirleArrow className="text-sub" color="currentColor" /> },
    { value: ALERT_TYPE.RISES_ABOVE, label: 'Rises above', icon: <CirleArrow className="text-green-1 -rotate-90" color="currentColor" /> },
    { value: ALERT_TYPE.DROPS_TO, label: 'Drops to', icon: <CirleArrow className="text-red-1 rotate-90" color="currentColor" /> }
];

export const alertFrequencies = [
    { value: null, label: 'All' },
    { value: ALERT_FREQUENCY.ONLY_ONCE, label: 'Only once' },
    { value: ALERT_FREQUENCY.ONCE_A_DAY, label: 'Once a day' }
];

export const DEFAULT_ALERT_TOKEN= 'BTC';