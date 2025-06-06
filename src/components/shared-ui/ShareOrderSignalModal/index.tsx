import Modal from '@/components/common/modal';
import { memo } from 'react';
import ShareOrderSignalContent, { IShareOrderSignalContentProps } from '../ShareOrderSignalContent';

interface IProps extends IShareOrderSignalContentProps {
    modalTitle?: string;
    visible: boolean;
    onClose: () => void;
}

const ShareOrderSignalModal = ({ modalTitle, visible, onClose, ...props }: IProps) => {
    return (
        <Modal title={modalTitle ?? 'make the call'} visible={visible} onClose={onClose}>
            <ShareOrderSignalContent {...props} />
        </Modal>
    );
};

export default memo(ShareOrderSignalModal);
