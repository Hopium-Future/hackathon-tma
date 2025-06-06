import React, { useMemo } from 'react';

import Modal from '@/components/common/modal';

import useFuturesConfig from '@/stores/futures.store';

import useAssetConfig, { assetConfigIdMapping } from '@/stores/payment.store';
import Search, { useAssetSearchStore } from '@/components/shared-ui/AssetListModal/Search';

import CheckIcon from '@/components/icons/CheckIcon';
import AssetLogo from '@/components/common/AssetLogo';
import EmptyIcon from '@/components/icons/EmptyIcon';

interface IAssetListModal {
    visible?: boolean;
    onClose?: () => void;
    currentAsset?: number;
    onSelectAsset?: (assetId: number) => void;
}

const AssetListModal: React.FC<IAssetListModal> = ({ visible, onSelectAsset, currentAsset, onClose }) => {
    const paymentConfigs = useAssetConfig((state) => state.paymentConfigs);
    const assetConfig = useFuturesConfig((state) => assetConfigIdMapping(state.assetsConfig));

    const { setQuery } = useAssetSearchStore();
    const debouncedQuery = useAssetSearchStore((state) => state.debouncedQuery);

    const assetPayment = useMemo(() => {
        return Object.keys(paymentConfigs).map((key) => ({ ...paymentConfigs[key], assetCode: assetConfig[paymentConfigs?.[key]?.assetId]?.assetCode }));
    }, [paymentConfigs]);

    const filteredResult = useMemo(() => {
        const normalizedQuery = debouncedQuery?.replace(/\s+/g, '').toLowerCase();
        return normalizedQuery ? assetPayment.filter((item) => item?.assetCode?.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery)) : assetPayment;
    }, [debouncedQuery, assetPayment]);

    const handleResetValue = () => {
        setQuery('');
    };

    const renderSearch = () => {
        return (
            <section className="mb-6">
                <Search />
            </section>
        );
    };

    const renderList = () => {
        return filteredResult.map((asset, index) => {
            const assetId = asset?.assetId;
            const isActive = assetId === currentAsset;
            return (
                <div
                    onClick={() => {
                        onSelectAsset?.(assetId);
                        handleResetValue();
                    }}
                    className="cursor-pointer first:pt-0"
                    key={index}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 font-medium">
                            <AssetLogo assetId={assetId} size={28} />
                            <span>{asset?.assetCode}</span>
                        </div>
                        {isActive && <CheckIcon className="text-green-1" />}
                    </div>
                </div>
            );
        });
    };

    const renderEmpty = () => {
        return (
            <section className="mt-[calc(100px-24px)] text-center">
                <EmptyIcon className="w-[100px] h-[100px]" />
                <p className="mt-1 text-sub text-md">Oops, no data</p>
            </section>
        );
    };
    return (
        <Modal
            type="asset_list"
            headerClassName="!pt-9"
            containerClassName="flex flex-col max-h-[698px] !pb-6 !rounded-none h-[calc(80vh-24px)]"
            title="TOKEN"
            visible={visible}
            onClose={() => {
                onClose?.();
                handleResetValue();
            }}
        >
            {renderSearch()}
            <div className="h-full overflow-auto flex gap-y-5 flex-col">{!filteredResult.length ? renderEmpty() : renderList()}</div>
        </Modal>
    );
};

export default AssetListModal;
