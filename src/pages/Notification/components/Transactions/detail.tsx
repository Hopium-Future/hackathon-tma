import React from 'react';

import Modal from '@/components/common/modal';
import AssetLogo from '@/components/common/AssetLogo';
import TextCopyable from '@/components/common/text-copyable';
import Button from '@/components/common/Button';

import { shortenHash } from '../../utils';

import useFuturesConfig from '@/stores/futures.store';

import { cn, formatNumber2 } from '@/helper';

import { format } from 'date-fns';
import { statusDetailVariants, SUCCESSFUL_TRANSACTION_TYPES, Transaction, TransactionType } from './types';

type TransactionDetailProps = {
    data: Transaction | any;
    open: boolean;
    onClose: () => void;
};

const NULL_STRING = '--';

const ContentRight = ({ label }: { label: string }) => {
    return <p className="text-md text-sub">{label}</p>;
};
const TransactionDetail: React.FC<TransactionDetailProps> = ({ data, open, onClose }) => {
    const assetConfig = useFuturesConfig((state) => state.assetsConfig);

    const asset = assetConfig.find((asset) => asset?.assetCode === data?.context?.currency);

    const status = data?.type as TransactionType;
    const isDeposit = data?.context?.side === 'deposit';

    const symbol = (data?.context?.amount || 0) > 0 && isDeposit ? '+' : '-';

    const transactionResult = `${symbol}${formatNumber2(data?.context?.amount, asset?.assetDigit)} ${asset?.assetCode}`;

    const id = data?.context?.orderID;
    const idShortHash = id ? shortenHash(id, 8) : NULL_STRING;

    const to = data?.context?.to;
    const toShortHash = to ? shortenHash(to, 4) : NULL_STRING;

    const from = data?.context?.from;
    const fromShortHash = from ? shortenHash(from, 4) : NULL_STRING;

    const txH = data?.context?.txId;
    const txHShortHash = txH ? shortenHash(txH, 4) : NULL_STRING;

    const time = data?.context?.time;

    const renderSide = () => {
        if (!isDeposit) {
            return (
                <section className="flex justify-between">
                    <ContentRight label="To" />
                    <TextCopyable className="text-md" iconClassName="text-green-1" showingText={toShortHash} text={to} />
                </section>
            );
        }

        if (from)
            return (
                <section className="flex justify-between">
                    <ContentRight label="From" />
                    <TextCopyable className="text-md" iconClassName="text-green-1" showingText={fromShortHash} text={from} />
                </section>
            );
    };

    return (
        <Modal visible={open} onClose={() => onClose()} closeIcon={false} containerClassName="overflow-y-auto">
            <section className="flex flex-col items-center">
                <AssetLogo size={80} assetId={asset?.id as any} />
                <p className={cn('text-md mt-3', statusDetailVariants?.[status])}>{data.title}</p>
                <p className="text-2xl font-bold mt-1">{transactionResult}</p>
                <section className="flex gap-y-5 flex-col rounded p-4 border-[0.5px] border-divider bg-background-3 w-full mt-6">
                    <section className="flex justify-between">
                        <ContentRight label="Order ID" />
                        <TextCopyable className="text-md" iconClassName="text-green-1" showingText={idShortHash} text={id} />
                    </section>
                    {renderSide()}
                    <section className="flex justify-between">
                        <ContentRight label="TxH" />
                        {SUCCESSFUL_TRANSACTION_TYPES.includes(status) ? (
                            <TextCopyable className="text-md" iconClassName="text-green-1" showingText={txHShortHash} text={txH} />
                        ) : (
                            NULL_STRING
                        )}
                    </section>
                    <section className="flex justify-between">
                        <ContentRight label="Network" />
                        <p className="text-md font-bold uppercase">{data?.context?.network}</p>
                    </section>
                    <section className="flex justify-between">
                        <ContentRight label="Time" />
                        <p className="text-md font-bold">{time ? format(data?.context?.time, 'HH:mm:ss dd/MM/yyyy') : NULL_STRING}</p>
                    </section>
                </section>
                <Button className="mt-6 h-11" variant="secondary" onClick={onClose}>
                    CLOSE
                </Button>
            </section>
        </Modal>
    );
};
export default TransactionDetail;
