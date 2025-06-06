import Button from '@/components/common/Button';
import Modal from '@/components/common/modal';
import CheckIcon from '@/components/icons/CheckIcon';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IWithdrawSuccessModal {
    visible: boolean;
    onClose: () => void;
}
const WithdrawSuccessModal: React.FC<IWithdrawSuccessModal> = ({ visible, onClose }) => {
    const navigate = useNavigate();

    return (
        <Modal headerClassName="pb-3" closeIcon={false} visible={visible} onClose={onClose}>
            <div className="flex flex-col items-center justify-center space-y-6">
                <CheckIcon className="w-20 h-20 text-green-1" />
                <div className="space-y-2 text-center">
                    <div className="text-xl font-semibold">WITHDRAWING</div>
                    <div className=" text-sub text-md">
                        Your withdrawal request has been submitted. Our system is now processing your transaction. Please allow some time for the funds to be
                        transferred.
                    </div>
                </div>
                <div className="flex items-center w-full gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/wallet')}
                        className="w-full py-3 font-semibold uppercase h-11 border-[0.5px] border-divider"
                    >
                        Wallet
                    </Button>
                    <Button
                        onClick={() => navigate('/payment-history?tab=withdraw')}
                        className="w-full py-3 font-semibold uppercase border border-green-1"
                        variant="primary"
                    >
                        History
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default WithdrawSuccessModal;
