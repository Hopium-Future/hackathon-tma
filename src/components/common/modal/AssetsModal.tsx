import AssetLogo from '@/components/common/AssetLogo';
import InputSearch from '@/components/common/input/InputSearch';
import Modal from '@/components/common/modal';
import Nodata from '@/components/common/nodata';
import Text from '@/components/common/text';
import CheckedIcon from '@/components/icons/CheckedIcon';
import useFuturesConfig from '@/stores/futures.store';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

interface IProps {
    value: string | null;
    onChange: (e: string | null) => void;
    isAll?: boolean;
    disabled?: boolean;
    open: boolean;
    onClose: () => void;
}

const AssetsModal = ({ value, onChange, isAll, open, onClose }: IProps) => {
    const pairsConfig = useFuturesConfig((state) => state.pairsConfig);
    const [strSearch, setStrSearch] = useState('');

    useEffect(() => {
        setStrSearch('');
    }, [open]);

    const onHandleChange = (pair: string | null) => {
        onChange(pair);
        onClose();
    };

    const dataFilter = useMemo(() => {
        if (!pairsConfig.length) return [];
        const dataSource = [...pairsConfig].sort((a, b) => a.baseAsset.localeCompare(b.baseAsset));
        if (!strSearch) return dataSource;
        return dataSource.filter((pair) => pair.baseAsset.toLowerCase().includes(strSearch.toLowerCase()));
    }, [pairsConfig, strSearch]);

    return (
        <Modal title="Asset" visible={open} onClose={onClose} containerClassName="h-[80vh] max-h-[698px]">
            <InputSearch value={strSearch} onValueChange={debounce(setStrSearch)} placeholder="Search asset" />
            <div id="input_modal" className="mt-6 flex flex-col space-y-5 overflow-auto h-[calc(80vh-180px)] max-h-[calc(698px-180px)]">
                {isAll && (
                    <div onClick={() => onHandleChange(null)} className="flex items-center justify-between space-x-2">
                        <Text>All</Text>
                        {!value && <CheckedIcon />}
                    </div>
                )}
                {dataFilter.length <= 0 ? (
                    <Nodata className="mt-[88px]" />
                ) : (
                    dataFilter.map((pair) => (
                        <div onClick={() => onHandleChange(pair.baseAsset)} className="flex items-center justify-between space-x-2" key={pair.symbol}>
                            <div className="flex items-center space-x-2">
                                <AssetLogo assetId={pair.baseAssetId} size={28} />
                                <Text>{pair.baseAsset}</Text>
                            </div>
                            {value === pair.baseAsset && <CheckedIcon />}
                        </div>
                    ))
                )}
            </div>
        </Modal>
    );
};

export default AssetsModal;
