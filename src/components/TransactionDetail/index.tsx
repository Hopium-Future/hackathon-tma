import ArrowIcon from '../icons/ArrowIcon';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Card from '../common/card';
import TextCopyable from '../common/text-copyable';
import { cn, formatNumber, formatTime, shortenHexString } from '@/helper';
import { TRANSACTION_STATUS_COLOR, WithdrawalStatusContent } from '@/helper/constant';
import AssetLogo from '@/components/common/AssetLogo';
import { getTransactionDetail } from '@/apis/payment.api';
import { useEffect, useMemo, useState } from 'react';
import { Transaction } from '@/type/payment-config';
import useFuturesConfig from '@/stores/futures.store';
import usePaymentConfig, { assetConfigIdMapping } from '@/stores/payment.store';

const TransactionDetail = () => {
    const params = useParams();
    const location = useLocation();

    const transactionId = params?.id;
    const hasTransactionState = location.state?.type === 'transaction';

    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<null | Transaction>(null);
    const [loading, setLoading] = useState(true);
    const assetConfigMapping = useFuturesConfig((state) => assetConfigIdMapping(state.assetsConfig));
    const categoryConfigs = usePaymentConfig((state) => state.categoryConfigs);

    const category = useMemo(() => {
        if (!transaction || !transaction?.category || !categoryConfigs.length) return null;

        return categoryConfigs.find((cate) => cate.category_id === transaction?.category) || null;
    }, [categoryConfigs, transaction]);

    useEffect(() => {
        const getDetail = async () => {
            if (!transactionId) return;
            try {
                const res = await getTransactionDetail(transactionId);
                if (res.data?.status === 'ok') {
                    setTransaction(res?.data?.data as Transaction);
                }
            } catch (error) {
                console.log('error: getTransactionDetail', error);
            }
            setLoading(false);
        };
        if (hasTransactionState) {
            setTransaction(location.state?.data);
            setLoading(false);
        } else {
            getDetail();
        }
    }, [transactionId, navigate, hasTransactionState, location.state?.data]);

    const assetConfig = transaction ? assetConfigMapping[transaction.assetId] : null;

    const withdrawStatusContent = WithdrawalStatusContent[(transaction?.status as keyof typeof WithdrawalStatusContent) || 2];

    return (
        !loading &&
        transaction && (
            <div className="px-4 pt-4">
                <div className="flex items-center ">
                    <ArrowIcon onClick={() => navigate(-1)} />
                    <h1 className="mx-auto text-2xl font-semibold uppercase">DETAILS</h1>
                </div>

                <section className="mt-[60px]">
                    <div className="flex flex-col items-center ">
                        <div className="mb-3">
                            <AssetLogo size={60} assetId={transaction?.assetId} />
                        </div>
                        <div className={cn('font-medium mb-1 capitalize', TRANSACTION_STATUS_COLOR[transaction?.status || 2])}>
                            {transaction?.type === 2 ? 'Withdrawal' : transaction?.type === 1 ? 'Deposit' : category ? category?.content?.['en'] : ''}{' '}
                            {[1, 2].includes(transaction?.type) && withdrawStatusContent?.toLowerCase()}
                        </div>

                        <div className="text-3xl font-semibold">
                            {!hasTransactionState && (transaction?.type === 2 ? '-' : '+')}
                            {formatNumber(transaction?.amount, assetConfig?.assetDigit)} {assetConfig?.assetCode}
                        </div>
                    </div>
                    <Card className="p-4 mt-10">
                        <div className="w-full space-y-5">
                            <div className="flex items-center justify-between w-full">
                                <div className="text-sub">ID</div>
                                <div className="">
                                    <TextCopyable iconClassName="text-green-1" text={transaction._id} showingText={params.id} />
                                </div>
                            </div>

                            {/* {transaction?.transactionType === 'on-chain' && transaction?.from && transaction?.type === 2 && (
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-sub">From</div>
                                    <div className="">
                                        <TextCopyable iconClassName="text-green-1" showingText={shortenHexString(transaction?.from, 4,4)} text={transaction?.from} />
                                    </div>
                                </div>
                            )} */}
                            {transaction?.transactionType === 'on-chain' && (
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-sub">TxHash</div>
                                    <div className="flex items-center space-x-1">
                                        <TextCopyable
                                            iconClassName="text-green-1"
                                            showingText={shortenHexString(
                                                transaction?.txId || transaction?.metadata?.txhash || transaction?.transactionId,
                                                4,
                                                4
                                            )}
                                            text={transaction?.txId || transaction?.metadata?.txhash || transaction?.transactionId}
                                        />
                                        {/* <Link to="https://nami.exchange" target="_blank">
                                            <ExternalLinkIcon size="sm" className="text-green-1" />
                                        </Link> */}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between w-full">
                                <div className="text-sub">Time</div>
                                <div className="flex items-center space-x-1">{formatTime(transaction?.createdAt || transaction?.created_at ||  new Date(), 'hh:mm:ss dd/MM/yyyy')}</div>
                            </div>
                            {transaction?.fee && (
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-sub">Fee</div>
                                    <div className="flex items-center space-x-1">
                                        {formatNumber(transaction?.fee?.value || transaction?.fee, assetConfig?.assetDigit)} {assetConfig?.assetCode}
                                    </div>
                                </div>
                            )}
                            {transaction?.metadata?.symbol && (
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-sub">Pair</div>
                                    <div className="flex items-center space-x-1">{transaction?.metadata?.symbol}</div>
                                </div>
                            )}
                        </div>
                    </Card>
                </section>
            </div>
        )
    );
};

export default TransactionDetail;
