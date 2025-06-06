import AssetLogo from '@/components/common/AssetLogo';
import Card from '@/components/common/card';
import InputSearch from '@/components/common/input/InputSearch';
import Modal from '@/components/common/modal';
import Nodata from '@/components/common/nodata';
import Text from '@/components/common/text';
import CheckedIcon from '@/components/icons/CheckedIcon';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import { cn } from '@/helper';
import useFuturesConfig from '@/stores/futures.store';
import { PairConfig } from '@/type/futures.type';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

interface IProps {
    selectedPair: PairConfig | null;
    setSelectedPair: (e: PairConfig | null) => void;
    isAll?: boolean;
    className?: string;
    disabled?: boolean;
}

const TokensAlerts = ({ selectedPair, setSelectedPair, isAll, className, disabled }: IProps) => {
    const pairsConfig = useFuturesConfig((state) => state.pairsConfig);
    const [showModal, setShowModal] = useState(false);
    const [strSearch, setStrSearch] = useState('');

    useEffect(() => {
        setStrSearch('');
    }, [showModal]);

    const toggleModal = () => {
        if (disabled) return;
        setShowModal((prev) => !prev);
    };

    const onChange = (pair: PairConfig | null) => {
        setSelectedPair(pair);
        toggleModal();
    };

    const dataFilter = useMemo(() => {
        if (!pairsConfig.length) return [];
        const dataSource = [...pairsConfig].sort((a, b) => a.baseAsset.localeCompare(b.baseAsset));
        if (!strSearch) return dataSource;
        return dataSource.filter((pair) => pair.baseAsset.toLowerCase().includes(strSearch.toLowerCase()));
    }, [pairsConfig, strSearch]);

    return (
        <>
            <Card onClick={toggleModal} className={cn('bg-background-3 flex items-center justify-between space-x-2 h-10', className)}>
                <div className="flex items-center space-x-2">
                    {selectedPair?.baseAssetId && <AssetLogo assetId={selectedPair?.baseAssetId} size={24} />}
                    <Text>{selectedPair?.baseAsset || 'ALL TOKEN'}</Text>
                </div>
                {!disabled && <ChevronDownIcon />}
            </Card>
            <Modal title="TOKEN" visible={showModal} onClose={toggleModal} containerClassName="h-[80vh] max-h-[698px]">
                <InputSearch value={strSearch} onValueChange={debounce(setStrSearch)} placeholder="Search token" />
                <div id="input_modal" className="mt-6 flex flex-col space-y-5 overflow-auto h-[calc(80vh-180px)] max-h-[calc(698px-180px)]">
                    {isAll && (
                        <div onClick={() => onChange(null)} className="flex items-center justify-between space-x-2">
                            <Text>ALL TOKEN</Text>
                            {!selectedPair && <CheckedIcon />}
                        </div>
                    )}
                    {dataFilter.length <= 0 ? (
                        <Nodata className="mt-[88px]" />
                    ) : (
                        dataFilter.map((pair) => (
                            <div onClick={() => onChange(pair)} className="flex items-center justify-between space-x-2" key={pair.symbol}>
                                <div className="flex items-center space-x-2">
                                    <AssetLogo assetId={pair.baseAssetId} size={28} />
                                    <Text>{pair.baseAsset}</Text>
                                </div>
                                {selectedPair?.baseAsset === pair.baseAsset && <CheckedIcon />}
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </>
    );
};

export default TokensAlerts;
