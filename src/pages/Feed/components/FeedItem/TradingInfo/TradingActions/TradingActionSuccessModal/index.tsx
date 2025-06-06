import Button from '@/components/common/Button';
import Card from '@/components/common/card';
import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import N3GiftIcon from '@/components/icons/N3GiftIcon';
import N3SuccessIcon from '@/components/icons/N3SuccessIcon';
import { formatNumber2 } from '@/helper';
import useFuturesConfig from '@/stores/futures.store';
import { ITradingData } from '@/type/feed.type';
import { DecimalsFuturesType, PairConfig, SIDE_FUTURES } from '@/type/futures.type';

interface OrderSuccessProps {
    visible: boolean;
    order?: ITradingData;
    pairConfig: PairConfig;
    decimals: DecimalsFuturesType;
    onClose: () => void;
    onShare: () => void;
}
const TradingActionSuccessModal = ({ visible, pairConfig, decimals, order, onClose, onShare }: OrderSuccessProps) => {
    const volume = order ? order.leverage * order.margin : 0;
    const newOrderId = useFuturesConfig((state) => state.newOrderCreatedId);

    return (
        <Modal visible={visible} onClose={onClose} closeIcon={false}>
            <div className="flex items-center justify-center">
                <N3SuccessIcon />
            </div>
            <div className="pt-3 text-center mb-6">
                <Text variant="secondary" className="text-md capitalize">
                    order placed
                </Text>
                <Text className="!text-2xl font-bold pt-1 uppercase">
                    {pairConfig.baseAsset} {order?.side === SIDE_FUTURES.BUY ? 'Long' : 'Short'}
                </Text>
            </div>

            <Card className="p-4 text-md flex-col space-y-3">
                <div className="flex items-center justify-between w-full">
                    <Text variant="secondary">Volume</Text>
                    <Text>
                        {formatNumber2(volume, decimals.symbol)} {pairConfig.quoteAsset}
                    </Text>
                </div>
                <div className="flex items-center justify-between w-full">
                    <Text variant="secondary">Leverage</Text>
                    <Text>{order?.leverage}x</Text>
                </div>
                <div className="flex items-center justify-between w-full">
                    <Text variant="secondary">Margin</Text>
                    <Text>{formatNumber2(order?.margin, decimals.symbol)}</Text>
                </div>
            </Card>
            <div className="mt-3 mb-6 ring-0.5 ring-green-1 bg-green-2 rounded p-3 flex gap-2 items-center justify-center">
                <N3GiftIcon />
                <Text className="!text-green-1 text-md">Earn 5% from Copy/Counter profit</Text>
            </div>
            <Button variant="primary" className="font-bold h-11" onClick={newOrderId ? onShare : undefined}>
                {newOrderId ? 'share this call' : 'Loading...'}
            </Button>
        </Modal>
    );
};

export default TradingActionSuccessModal;
