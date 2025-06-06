import { getFundingHistory, getFundingLoanDetail } from '@/apis/futures.api';
import AssetLogo from '@/components/common/AssetLogo';
import Card from '@/components/common/card';
import Chip from '@/components/common/chip';
import Modal from '@/components/common/modal';
import AssetsModal from '@/components/common/modal/AssetsModal';
import SelectModal from '@/components/common/modal/SelectModal';
import Nodata from '@/components/common/nodata';
import Skeleton from '@/components/common/skeleton/Skeleton';
import Text from '@/components/common/text';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import { cn, formatNumber2, formatTime } from '@/helper';
import { getAssetConfig, getPairConfig } from '@/selectors';
import useFuturesConfig from '@/stores/futures.store';
import { AssetConfigType, TYPE_FUTURES } from '@/type/futures.type';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const timeOptions = [
    {
        title: 'All',
        value: null
    },
    {
        title: '1 day',
        value: '1'
    },
    {
        title: '7 days',
        value: '7'
    },
    {
        title: '30 days',
        value: '30'
    }
];

type Funding = {
    _id: string;
    userId: number;
    displayingId: number;
    symbol: string;
    baseAsset: string;
    type: 'Market';
    leverage: number;
    useLoan: false;
    fohId: string;
    fundingCurrency: number;
    funding: {
        total: number;
        balance: number;
        margin: number;
        origin: number;
        loan: number;
    };
    timeFunding: number;
    createdAt: string;
    updatedAt: string;
};

type FundingDetail = {
    baseAssetId: number;
    quoteAssetId: number;
    price: number;
    baseQty: number;
    quoteQty: number;
    time: number;
};

const FundingTab = ({ tab }: { tab: string }) => {
    const [dataSource, setDataSource] = useState<Funding[]>([]);
    const [loading, setLoading] = useState(true);
    const hasNext = useRef(false);
    const [paging, setPaging] = useState({
        page: 0,
        pageSize: 12
    });
    const [filter, setFilter] = useState({
        baseAsset: null,
        range: null
    });
    const [height, setHeight] = useState(0);
    const infinityRef = useRef<InfiniteScroll>(null);
    const [showAssetModal, setShowAssetModal] = useState(false);

    const fetchFundingFee = async (page?: number) => {
        try {
            const data = await getFundingHistory({ ...filter, ...paging, page: page ?? paging.page });
            if (!data) return;
            hasNext.current = data?.hasNext;
            const histories = !page ? data?.histories : [...dataSource].concat(data?.histories);
            setDataSource(histories);
            setPaging((prev) => ({ ...prev, page: page || 0 }));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 'FUNDING') fetchFundingFee(0);
        return () => {
            if (infinityRef.current && (infinityRef.current as any)?.el) (infinityRef.current as any).el.scrollTop = 0;
        };
    }, [filter, tab]);

    useEffect(() => {
        const el = document.querySelector('#trade-history');
        if (el) setHeight(el?.clientHeight - 110);
    }, []);

    const onChangeFilter = (key: string, value: string | number | null) => {
        setLoading(true);
        setPaging((prev) => ({ ...prev, page: 0 }));
        setFilter((prev) => ({ ...prev, [key]: value }));
    };

    const toggleAssetModal = () => {
        setShowAssetModal((prev) => !prev);
    };

    return (
        <div className="flex flex-col px-[0.5px]">
            <AssetsModal value={filter.baseAsset} isAll onChange={(e) => onChangeFilter('baseAsset', e)} open={showAssetModal} onClose={toggleAssetModal} />
            <div className="flex items-center space-x-1 sticky top-14 z-10 py-3 bg-background-1">
                <Chip active className="flex items-center space-x-1 px-3 py-[6px] text-sm font-bold" onClick={toggleAssetModal}>
                    <span>Asset:</span>
                    <span>{filter.baseAsset || 'All'}</span>
                </Chip>
                <SelectModal title="Time" value={filter.range} cols={2} options={timeOptions} onChange={(e) => onChangeFilter('range', e)} />
            </div>
            {loading || !height ? (
                <LoadingScreen className="pt-10" />
            ) : (
                <InfiniteScroll
                    dataLength={dataSource.length || 0}
                    next={() => {
                        fetchFundingFee(paging.page + 1);
                    }}
                    height={height}
                    hasMore={hasNext.current}
                    loader={<h4 className="text-center">...</h4>}
                    scrollableTarget="trade-history"
                    className="divide-y-[0.5px] divide-divider"
                    ref={infinityRef}
                >
                    {dataSource.length > 0 ? dataSource.map((item) => <FundingHistory key={item._id} history={item} />) : <Nodata className="mt-[120px]" />}
                </InfiniteScroll>
            )}
        </div>
    );
};

const FundingHistory = ({ history }: { history: Funding }) => {
    const [open, setOpen] = useState(false);
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, history.fundingCurrency));
    const amount = history.funding.total;

    const toggleModal = () => {
        setOpen((prev) => !prev);
    };

    return (
        <>
            <FundingDetailModal history={history} open={open} onClose={toggleModal} assetConfig={assetConfig} />
            <div onClick={toggleModal} className="py-4 first:pt-0 after:pb-0 flex items-center justify-between px-[0.5px]">
                <div className="flex items-center space-x-2 flex-1">
                    <div className="flex flex-col space-y-0.5">
                        <div className="flex items-center space-x-1">
                            <div className="font-bold">{history.baseAsset || '-'}</div>
                            <Text variant="secondary" className="text-md">
                                -
                            </Text>
                            <Text variant="secondary" className="text-md">
                                {history.type === TYPE_FUTURES.MARKET ? 'Market' : 'Limit'}
                            </Text>
                            <span className="py-0.5 px-[6px] rounded-sm bg-background-2 text-green-1 font-medium text-xs ring-0.5 ring-divider">
                                {history.leverage}x
                            </span>
                        </div>
                        <Text variant="secondary" className="text-sm">
                            ID: {history.displayingId}
                        </Text>
                    </div>
                </div>
                <div className="flex flex-col space-y-0.5 text-right">
                    <div className={classNames('font-bold', { 'text-green-1': amount > 0, 'text-red-1': amount < 0 })}>
                        {amount > 0 ? '+' : ''}
                        {formatNumber2(amount, 6)} {assetConfig?.assetCode || '-'}
                    </div>
                    <Text variant="secondary" className="text-sm">
                        {formatTime(history.createdAt)}
                    </Text>
                </div>
            </div>
        </>
    );
};

const FundingDetailModal = ({
    open,
    onClose,
    history,
    assetConfig
}: {
    open: boolean;
    onClose: () => void;
    history: Funding;
    assetConfig: AssetConfigType | undefined;
}) => {
    const pairConfig = useFuturesConfig((state) => getPairConfig(state.pairsConfig, history.symbol));
    const [liqDetail, setLiqDetail] = useState<FundingDetail[]>([]);
    const [loading, setLoading] = useState(history.useLoan);

    const getFundingLoan = async () => {
        try {
            const data = await getFundingLoanDetail({ fohId: history.fohId });
            if (!data) return;
            setLiqDetail(data?.liquidationDetail || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(history.useLoan);
        if (open && history.useLoan) getFundingLoan();
    }, [open]);

    if (!pairConfig) return null;

    const sign = history.funding.total > 0 ? '+' : '';

    return (
        <Modal title="FUNDING DETAILS" visible={open} onClose={onClose}>
            <div className="text-md flex flex-col space-y-2">
                <div className="grid grid-cols-2 gap-2 font-bold">
                    <Card className="flex items-center justify-center space-x-1">
                        <AssetLogo assetId={pairConfig?.baseAssetId} size={14} />
                        <span>{history.baseAsset}</span>
                        <span className="text-green-1">{history.leverage}x</span>
                    </Card>
                    <Card className="flex items-center justify-center space-x-1">
                        <span className={cn('', { 'text-green-1': history.funding.total > 0, 'text-red-1': history.funding.total < 0 })}>
                            {`${sign}${formatNumber2(history.funding.total, 6)} ${assetConfig?.assetCode}`}
                        </span>
                    </Card>
                </div>
                <Skeleton loading={loading}>
                    <Card className="p-3 flex flex-col space-y-4">
                        {Math.abs(history.funding.origin) > 0 && (
                            <div className="flex items-center justify-between w-full">
                                <Text variant="secondary">USDT</Text>
                                <Text className="flex items-center space-x-1">
                                    <span>{formatNumber2(history.funding.origin, 6)}</span>
                                    <AssetLogo assetId={history.fundingCurrency} size={12} />
                                </Text>
                            </div>
                        )}
                        {liqDetail.map((detail) => (
                            <LiqDetail key={detail.baseAssetId} detail={detail} />
                        ))}
                    </Card>
                </Skeleton>
            </div>
        </Modal>
    );
};

const LiqDetail = ({ detail }: { detail: FundingDetail }) => {
    const assetConfig = useFuturesConfig((state) => getAssetConfig(state.assetsConfig, detail.baseAssetId));
    if (!assetConfig) return null;
    return (
        <div className="flex items-center justify-between w-full">
            <Text variant="secondary">{assetConfig?.assetCode}</Text>
            <Text className="flex items-center space-x-1">
                <span>-{formatNumber2(Math.abs(detail.baseQty), 8)}</span>
                <AssetLogo assetId={assetConfig?.id} size={12} />
            </Text>
        </div>
    );
};

export default FundingTab;
