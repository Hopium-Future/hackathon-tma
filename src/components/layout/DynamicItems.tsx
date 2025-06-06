import { memo } from 'react';
import NotEnoughFundModal from '../shared-ui/NotEnoughFundModal';
import useUserStore from '@/stores/user.store';

const DynamicItems = () => {
    const isShowNotEnoughFundModal = useUserStore((state) => state.isShowNotEnoughFundModal);
    const setShowNotEnoughFundModal = useUserStore((state) => state.setShowNotEnoughFundModal);
    return (
        <>
            <NotEnoughFundModal visible={isShowNotEnoughFundModal} onClose={() => setShowNotEnoughFundModal(false)} />
        </>
    );
};

export default memo(DynamicItems);
