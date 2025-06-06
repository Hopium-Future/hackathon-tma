import Button from '@/components/common/Button';
import Modal from '@/components/common/modal';
import Text from '@/components/common/text';
import N3ErrorIcon from '@/components/icons/N3ErrorIcon';
import N3SuccessIcon from '@/components/icons/N3SuccessIcon';

interface AlertModalProps {
    visible: boolean;
    onClose: () => void;
    variant?: 'success' | 'error';
    title: string;
    message: string;
}
const AlertModal = ({ visible, onClose, title, message, variant }: AlertModalProps) => {
    const renderIcon = () => {
        if (variant === 'success') {
            return <N3SuccessIcon />;
        }
        return <N3ErrorIcon />;
    };
    return (
        <Modal visible={visible} onClose={onClose}>
            <div className="flex items-center justify-center">{renderIcon()}</div>
            <h2 className="mt-6 mb-2 text-xl font-bold text-center">{title}</h2>
            <Text variant="secondary" className="text-center">
                {message}
            </Text>
            <Button variant="secondary" className="font-bold h-11 mt-6 uppercase" onClick={onClose}>
                Close
            </Button>
        </Modal>
    );
};

export default AlertModal;
