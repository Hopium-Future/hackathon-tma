import { WithdrawalStatus } from '@/helper/constant';

const TypeFilter = [
    {
        value: 'all',
        title: 'All'
    },
    {
        value: 'onchain',
        title: 'On Chain'
    },
    {
        value: 'goats',
        title: 'GOATS'
    }
];

const StatusFilter = [
    {
        value: 'all',
        title: 'All'
    },
    {
        value: WithdrawalStatus.COMPLETED,
        title: 'Completed'
    },
    {
        value: WithdrawalStatus.FAILED,
        title: 'Failed'
    },
    {
        value: WithdrawalStatus.PROCESSING,
        title: 'Processing'
    }
];

const DepositStatusValue = ['all', WithdrawalStatus.COMPLETED, WithdrawalStatus.FAILED];
const DepositStatusFilter = StatusFilter.filter((f) => DepositStatusValue.includes(f.value));

const TimeFilter = [
    {
        value: 'all',
        title: 'All'
    },
    {
        value: '1d',
        title: '1 Day'
    },
    {
        value: '7d',
        title: '7 Days'
    },
    {
        value: '30d',
        title: '30 Days'
    }
];

export { TypeFilter, StatusFilter, TimeFilter, DepositStatusFilter };
