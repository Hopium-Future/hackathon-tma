import { memo } from 'react';

import Card from '@/components/common/card';
import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import N3GiftIcon from '@/components/icons/N3GiftIcon';
import N3SuccessIcon from '@/components/icons/N3SuccessIcon';
import { calHopiumToken, formatNumber2, formatSide } from '@/helper';
import { DecimalsFuturesType, OrderFutures, PairConfig } from '@/type/futures.type';
import Button from '@/components/common/Button';
import useFuturesConfig from '@/stores/futures.store';
import OrderCreatedEventListener from '@/components/shared-ui/OrderCreatedEventListener';

interface OrderSuccessProps {
    visible: boolean;
    onClose: () => void;
    onShare: () => void;
    order?: OrderFutures & { placeId: string };
    pairConfig: PairConfig;
    decimals: DecimalsFuturesType;
}
const OrderSuccessModal = ({ visible, onClose, onShare, pairConfig, decimals, order }: OrderSuccessProps) => {
    const newOrderId = useFuturesConfig((state) => state.newOrderCreatedId);

    const handleShareShare = async () => {
        await onShare();
        onClose();
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            <OrderCreatedEventListener />
            <div className="flex items-center justify-center">
                <N3SuccessIcon />
            </div>
            <div className="pt-3 text-center">
                <Text variant="secondary" className="text-md">
                    Order Successfully
                </Text>
                <Text className="!text-2xl font-bold pt-1">
                    {pairConfig.baseAsset} {formatSide(order?.side)}
                </Text>
            </div>
            <div className="py-6 text-md">
                <Card className="p-3 flex-col space-y-3">
                    <div className="flex items-center justify-between w-full">
                        <Text variant="secondary">Volume</Text>
                        <Text>
                            {formatNumber2(order?.order_value, decimals.symbol)} {pairConfig.quoteAsset}
                        </Text>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Text variant="secondary">Margin</Text>
                        <Text>{formatNumber2(order?.margin, decimals.symbol)}</Text>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-1">
                            <Text variant="secondary">Bonus</Text>
                            <N3GiftIcon />
                        </div>
                        <Text className="!text-green-1">
                            <span>{formatNumber2(calHopiumToken(order?.order_value || 0), decimals.symbol)} HOPIUM</span>
                        </Text>
                    </div>
                </Card>
            </div>
            <Button variant="primary" disabled={!newOrderId} className="h-11 font-bold uppercase" onClick={newOrderId ? handleShareShare : undefined}>
                {!newOrderId ? <span className="animate-pulse">Loading...</span> : 'make the call'}
            </Button>
        </Modal>
    );
};

export default memo(OrderSuccessModal);
