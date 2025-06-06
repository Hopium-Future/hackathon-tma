import { memo } from 'react';

import Modal from '@/components/common/modal';
import TradingActionModalContent, { ITradingActionModalContentProps } from './TradingActionModalContent';
import { TRADE_TYPE } from '@/helper/constant';

interface ITradingActionModalProps extends ITradingActionModalContentProps {
    visible: boolean;
}

const TradingActionModal = ({ visible, onClose, ...props }: ITradingActionModalProps) => {
    const { tradeType } = props;
    const isCopy = tradeType === TRADE_TYPE.copy;
    const title = isCopy ? 'copy order' : 'counter order';
    return (
        <Modal title={title} visible={visible} onClose={onClose}>
            <TradingActionModalContent onClose={onClose} {...props} />
        </Modal>
    );
};

export default memo(TradingActionModal);
