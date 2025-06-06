import { memo } from 'react';

import Button from '@/components/common/Button';
import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routing/router';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

const NotEnoughFundModal = ({ visible, onClose }: IProps) => {
    const navigate = useNavigate();

    const handleDeposit = () => {
        onClose();
        navigate(ROUTES.WALLET);
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            <div className="flex flex-col items-center">
                <img src="/images/not-enough-fund.png" className="w-[178px]" alt="alert icon" />
                <Text className="text-xl font-bold mt-3 mb-2 uppercase">UH OH...</Text>
                <Text variant="secondary" className="flex flex-col text-md text-center">
                    <span>You don't have enough fund.</span>
                    <span>Deposit to continue!</span>
                </Text>
                <Button variant="primary" onClick={handleDeposit} className="h-11 mt-6 gap-1">
                    deposit
                </Button>
            </div>
        </Modal>
    );
};

export default memo(NotEnoughFundModal);
