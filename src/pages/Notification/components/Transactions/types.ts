export type TransactionType = 'DEPOSIT_NOTI_SUCCESS' | 'DEPOSIT_NOTI_FAILED' | 'WITHDRAW_NOTI_SUCCESS' | 'WITHDRAW_NOTI_FAILED';
export const SUCCESSFUL_TRANSACTION_TYPES: TransactionType[] = ['DEPOSIT_NOTI_SUCCESS', 'WITHDRAW_NOTI_SUCCESS'];

export type TransactionCategory = 'DEPOSIT_WITHDRAW';

export type TransactionSide = 'deposit' | 'withdraw';

export const statusVariants: Record<TransactionType, string> = {
    DEPOSIT_NOTI_SUCCESS: 'text-main',
    DEPOSIT_NOTI_FAILED: 'text-red-1',
    WITHDRAW_NOTI_SUCCESS: 'text-main',
    WITHDRAW_NOTI_FAILED: 'text-red-1'
};

export const statusDetailVariants: Record<TransactionType, string> = {
    DEPOSIT_NOTI_SUCCESS: 'text-green-1',
    DEPOSIT_NOTI_FAILED: 'text-red-1',
    WITHDRAW_NOTI_SUCCESS: 'text-green-1',
    WITHDRAW_NOTI_FAILED: 'text-red-1'
};

export interface TransactionContext {
    side: TransactionSide;
    amount: number;
    currency: string;
    time: string;
    orderID: string;
    from: string;
    to: string;
    network: string;
}

export interface Transaction {
    title: string;
    type: TransactionType;
    categoryName: TransactionCategory;
    createdAt: string;
    context: TransactionContext;
}
