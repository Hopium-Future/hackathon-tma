export type TabValue = 'deposit' | 'withdraw';

export const TabValues = ['deposit', 'withdraw'];

export const Tabs: {
    value: TabValue;
    title: string;
}[] = [
    {
        value: 'deposit',
        title: 'DEPOSIT'
    },
    {
        value: 'withdraw',
        title: 'WITHDRAW'
    }
];
