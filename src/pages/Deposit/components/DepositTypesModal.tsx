import Card from '@/components/common/card';
import Modal from '@/components/common/modal';
import TextCopyable from '@/components/common/text-copyable';
import ArrowIcon from '@/components/icons/ArrowIcon';
import useUserStore from '@/stores/user.store';
import React, { useState } from 'react';

import { lazy } from 'react';
const AssetListModal = lazy(() => import('@/components/shared-ui/AssetListModal'));

interface IDepositTypesModal {
    visible?: boolean;
    onClose?: () => void;
    onSelectAsset?: (assetId: number) => void;
}

interface IDepositFromGoatModal {
    visible?: boolean;
    onClose?: () => void;
}

const DepositTypesModal: React.FC<IDepositTypesModal> = ({ visible, onClose, onSelectAsset }) => {
    const [isVisible, setIsVisible] = useState(visible);
    const [isShowDepositGoatModal, setShowDepositGoatModal] = useState(false);
    const [showAssetList, setShowAssetList] = useState(false);

    const onShowDepositGoatModal = () => {
        setIsVisible(false);
        setShowDepositGoatModal(true);
    };

    const onCloseDepositGoatModal = () => {
        setIsVisible(true);
        setShowDepositGoatModal(false);
    };

    return (
        <div>
            <Modal visible={isVisible} title="DEPOSIT" onClose={onClose}>
                <div className="space-y-2">
                    <Card onClick={onShowDepositGoatModal} className="cursor-pointer justify-between space-x-3 bg-background-4">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                                <div>From GOATS</div>
                                <img src="/images/deposit/goat.png" width={16} height={16} />
                            </div>
                            <div className="text-md text-sub">
                                Deposit $GOATS from Goats <span className="text-green-1">telegram mini-app </span>
                            </div>
                        </div>
                        <ArrowIcon className="-rotate-180" />
                    </Card>
                    <Card
                        onClick={() => {
                            setIsVisible(false);
                            setShowAssetList(true);
                        }}
                        className="justify-between cursor-pointer space-x-3 bg-background-4"
                    >
                        <div className="space-y-1">
                            <div>On Chain</div>
                            <div className="text-md text-sub">Deposit crypto via blockchain networks.</div>
                        </div>
                        <ArrowIcon className="-rotate-180" />
                    </Card>
                </div>
            </Modal>
            <AssetListModal
                visible={showAssetList}
                onClose={() => {
                    setIsVisible(true);
                    setShowAssetList(false);
                }}
                onSelectAsset={(assetId) => {
                    onSelectAsset?.(assetId);
                }}
            />

            <DepositFromGoatModal visible={isShowDepositGoatModal} onClose={onCloseDepositGoatModal} />
        </div>
    );
};

const DepositFromGoatModal: React.FC<IDepositFromGoatModal> = ({ visible, onClose }) => {
    const user = useUserStore((state) => state.user);
    return (
        <Modal visible={visible} title="Deposit From GOATS" onClose={onClose}>
            <div className="space-y-2.5">
                <Card className="justify-between py-3 space-x-3 bg-background-4">
                    <TextCopyable
                        text={user?._id || ''}
                        className="justify-between w-full"
                        iconClassName="size-5"
                        showingText={
                            <div className="flex space-x-1 text-md">
                                <span className="text-sub">UID:</span>
                                <span className="font-medium">{user?._id || ''}</span>
                            </div>
                        }
                    />
                </Card>
                <div className="text-md text-sub">Enter your UID into Goats Telegram mini-app to withdraw your $GOATS into Hopium Telegram mini-app</div>
            </div>
        </Modal>
    );
};

export default DepositTypesModal;
