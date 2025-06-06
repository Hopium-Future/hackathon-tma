import Button from '@/components/common/Button';
import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import N3SuccessIcon from '@/components/icons/N3SuccessIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import { memo } from 'react';

interface IProps {
    visible: boolean;
    onClose: () => void;
    onShareImage: () => void;
}

const ShareOrderSignalSuccessModal = ({ visible, onClose, onShareImage }: IProps) => {
    const handleShareImage = () => {
        onClose();
        onShareImage();
    };
    return (
        <Modal visible={visible} closeIcon={false} onClose={onClose}>
            <div className="flex flex-col items-center">
                <N3SuccessIcon className="size-4" />
                <Text className="text-xl font-bold mt-6 mb-2 uppercase">the call is live!</Text>
                <Text variant="secondary" className="text-md text-center">
                    Boom! Other degens can now copy and counter your call.
                </Text>
                <Button variant="secondary" onClick={handleShareImage} className="h-11 mt-6 gap-1">
                    <span>Share</span>
                    <ShareIcon />
                </Button>
            </div>
        </Modal>
    );
};

export default memo(ShareOrderSignalSuccessModal);
