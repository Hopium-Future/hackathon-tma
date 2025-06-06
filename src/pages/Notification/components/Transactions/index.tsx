import React from 'react';

import AssetLogo from '@/components/common/AssetLogo';
import ArrowTransactionIcon from '@/components/icons/ArrowTransactionIcon';

import FailIcon from '@/components/icons/FailIcon';

import { cn, formatNumber2 } from '@/helper';

import useFuturesConfig from '@/stores/futures.store';

import { format } from 'date-fns';
import { statusVariants, SUCCESSFUL_TRANSACTION_TYPES, Transaction, TransactionType } from './types';
import { Divider } from '../..';

type TransactionsTabProps = {
    data: Transaction;
    onDetail?: (data: any) => void;
};

const TransactionsTab: React.FC<TransactionsTabProps> = ({ data, onDetail }) => {
    const assetConfig = useFuturesConfig((state) => state.assetsConfig);

    // const asset = assetConfig.find((asset) => asset?.id === data?.assetId);
    const asset = assetConfig.find((asset) => asset?.assetCode === data?.context?.currency);

    const status = data?.type as TransactionType;
    const isDeposit = data?.context?.side === 'deposit';

    const symbol = data?.context?.amount > 0 && isDeposit ? '+' : '-';

    const transactionResult =
        SUCCESSFUL_TRANSACTION_TYPES.includes(status) && asset
            ? `${symbol}${formatNumber2(data?.context?.amount, asset.assetDigit)} ${asset.assetCode}`
            : 'Try again plz';

    return (
        <>
            <section
                className="flex justify-between"
                onClick={(e) => {
                    e.preventDefault();
                    onDetail?.({ data, category: 'transaction', open: true });
                }}
            >
                <section className="flex gap-x-2">
                    <section className="w-8 h-8 flex items-center justify-center">
                        {!SUCCESSFUL_TRANSACTION_TYPES.includes(status) ? (
                            <FailIcon size="notification" />
                        ) : (
                            <ArrowTransactionIcon className={cn('transform', { 'rotate-180': !isDeposit })} />
                        )}
                    </section>
                    <section className="flex gap-x-2">
                        <section className="w-8 h-8">
                            <AssetLogo assetId={asset?.id as any} className="w-8 h-8" />
                        </section>
                        <section className="flex flex-col justify-between">
                            <p className={cn('text-md  font-bold', statusVariants?.[status])}>{data?.title}</p>
                            <p className="text-sm text-sub">{data?.context?.time ? format(data?.context?.time, 'HH:mm:ss dd/MM/yyyy') : '--'}</p>
                        </section>
                    </section>
                </section>
                <section
                    className={cn('text-md font-bold', statusVariants?.[status], {
                        'underline underline-offset-[2px] decoration-[0.5px]': !SUCCESSFUL_TRANSACTION_TYPES.includes(status)
                    })}
                >
                    {transactionResult}
                </section>
            </section>
            <Divider />
        </>
    );
};

export default TransactionsTab;
