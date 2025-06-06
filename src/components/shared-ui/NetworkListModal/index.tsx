import Modal from '@/components/common/modal';
import CheckIcon from '@/components/icons/CheckIcon';
import { cn } from '@/helper';
import { Network } from '@/type/payment-config';
import React from 'react';

interface INetworkListModal {
    onClose: () => void;
    visible: boolean;
    networkList: Network[];
    onSelectNetwork: (network: Network) => void;
    selectNetwork: Network | null;
}

const NetworkListModal: React.FC<INetworkListModal> = ({ onClose, visible, networkList, onSelectNetwork, selectNetwork }) => {
    return (
        <Modal containerClassName="max-h-[90vh] flex flex-col" title="NETWORK" onClose={onClose} visible={visible}>
            <div className="h-full space-y-3 overflow-auto">
                {networkList?.map((n) => (
                    <div onClick={() => onSelectNetwork(n)} key={n.network} className="flex items-center justify-between text-base cursor-pointer py-1.5">
                        <div>{n.name}</div>

                        <CheckIcon
                            className={cn('opacity-0 invisible w-5 h-5 text-green-1', {
                                'opacity-100 visible': n.network === selectNetwork?.network
                            })}
                        />
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default NetworkListModal;
