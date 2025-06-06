import { cn, formatBalance, formatTime } from '@/helper';
import { useNavigate } from 'react-router-dom';
import AssetLogo from '@/components/common/AssetLogo';
import { assetConfigIdMapping } from '@/stores/payment.store';
import useFuturesConfig from '@/stores/futures.store';
import { useMemo } from 'react';
import { Category } from '@/type/payment-config';

type Type = 'deposit' | 'withdraw' | 'commission' | 'exchange';

type Props = {
    warperClassName?: string;
    type: Type | any;
    walletType: number;
    createdAt: string;
    amount: number;
    id: number;
    item: any;
    categoryConfigs: Category[];
};

const TYPE: Record<Type | any, string | { [key: number | string]: string }> = {
    deposit: 'Deposit On-Chain',
    withdraw: 'Withdraw On-Chain',
    reward: 'Commission',
    exchange: {
        0: 'Spot',
        2: 'Nami Futures',
        8: 'Commission',
        9: 'NAO Futures',
        10: 'Insurance',
        11: 'Earn',
        12: 'Copy Trade - Nami Futures',
        13: 'Copy Trade - NAO Futures',
        NFT: 'WNFT/Voucher'
    }
};

export default function CardHistory({ warperClassName, type, walletType, createdAt, amount, id, item, categoryConfigs }: Props) {
    const navigate = useNavigate();

    const assetConfigMapping = useFuturesConfig((state) => assetConfigIdMapping(state.assetsConfig));

    const assetConfig = assetConfigMapping[item?.currency];

    const category = useMemo(() => {
        if (!item || !item?.category || !categoryConfigs.length) return null;

        return categoryConfigs.find((cate) => cate.category_id === item?.category) || null;
    }, [categoryConfigs, item]);

    const handleNavigate = ({ id }: { id: number }) => {
        navigate(`/history/detail/${id}`, {
            state: {
                type: 'transaction',
                data: {
                    _id: id,
                    assetId: item?.currency,
                    amount,
                    category: item?.category,
                    createdAt: item?.created_at,
                    metadata: { symbol: `${item?.metadata?.baseAsset}/${item?.metadata?.quoteAsset}` },
                    fee: item?.metadata?.fee || null
                }
            }
        });
    };
    const renderType = () => {
        if (type === 'exchange') {
            return TYPE['exchange']?.[walletType] as string;
        }
        return category?.content?.en || (TYPE?.[type] as string);
    };

    const renderAmount = () => {
        const total = formatBalance(amount, assetConfig?.assetDigit && 0);
        const formatTotal = +amount > 0 ? `+${total}` : total;
        return `${formatTotal} ${assetConfig?.assetCode}`;
    };

    return (
        <section
            className={cn('last:border-0 border-b border-solid border-divider flex justify-between items-center', warperClassName)}
            onClick={() => handleNavigate({ id })}
        >
            <section className="flex gap-x-2">
                <AssetLogo size={28} assetId={item?.currency} />
                <section>
                    <p className="text-md text-white">{renderType()}</p>
                    <p className="text-sm text-sub">{formatTime(createdAt, 'HH:mm:ss dd/MM/yyyy')}</p>
                </section>
            </section>
            <p className="text-md">{renderAmount()}</p>
        </section>
    );
}
