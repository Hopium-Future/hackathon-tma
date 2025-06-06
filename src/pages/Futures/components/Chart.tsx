import Card from '@/components/common/card';
import Select from '@/components/common/select';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import { DecimalsFuturesType, PairConfig } from '@/type/futures.type';
import { useMemo, useRef, useState } from 'react';
import TickerField from './TickerField';
import Modal from '@/components/common/modal';
import Market from './Market';
import TVChartContainer from '@/components/TVChartContainer';
import { chartTypes } from '@/components/TVChartContainer/constantsTrading';
import AssetLogo from '@/components/common/AssetLogo';
import AlertIcon from '@/components/icons/AlertIcon';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routing/router';
import InfoIcon from '@/components/icons/InfoIcon';
import Popover from '@/components/common/popover';
import Text from '@/components/common/text';
import N3FavoriteIcon from '@/components/icons/N3FavoriteIcon';
import useFuturesConfig from '@/stores/futures.store';
import { debounce } from 'lodash';
import { fetchFavorite } from '@/apis/futures.api';
import { getMMR } from '@/helper/futures';
import { formatNumber2 } from '@/helper';

interface ChartProps {
    pairConfig?: PairConfig;
    decimals: DecimalsFuturesType;
}
const Chart = ({ pairConfig, decimals }: ChartProps) => {
    const navigate = useNavigate();
    const chart = useRef<HTMLDivElement>(null);
    const symbol = pairConfig?.symbol;
    const [timeframe, setTimeframe] = useState('1');
    const [showModal, setShowModal] = useState(false);
    const options = [
        { text: '1m', value: '1' },
        { text: '5m', value: '5' },
        { text: '15m', value: '15' },
        { text: '30m', value: '30' },
        { text: '1h', value: '60' },
        { text: '4h', value: '240' }
        // { text: '1d', value: '1D' }
    ];

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // useEffect(() => {
    //     if (!pairConfig) return;
    //     const timer = setTimeout(() => {
    //         if (chart.current) chart.current.style.height = chart.current.clientHeight + 'px';
    //     }, 500);
    //     return () => clearTimeout(timer);
    // }, [pairConfig]);

    if (!symbol) return;
    return (
        <>
            <Modal title="TOKEN LIST" visible={showModal} onClose={toggleModal} containerClassName="h-[80vh]">
                <div className="h-[calc(100%-80px)]">
                    <Market symbol={symbol} quoteAsset={pairConfig.quoteAsset} onClose={toggleModal} />
                </div>
            </Modal>
            {/* <HotTokens /> */}
            <Card id="chart" ref={chart} className="!p-0 flex-1 items-start overflow-hidden relative transition-all duration-300">
                {/* <RecentTrade /> */}
                <div className="flex-1 flex flex-col h-full items-start p-2">
                    <div id="current_pair" className="flex items-center space-x-1 w-full transition-all duration-300">
                        <Card className="justify-between w-full bg-background-1 font-bold text-md py-[6px]">
                            <div className="flex items-center space-x-2" onClick={toggleModal}>
                                <div className="flex items-center space-x-1">
                                    <AssetLogo assetId={pairConfig?.baseAssetId} size={14} />
                                    <span>{pairConfig?.baseAsset}</span>
                                </div>
                                <ChevronDownIcon />
                            </div>
                            <span className="flex-1 flex items-center justify-end space-x-1">
                                <TickerField
                                    field="lastPrice"
                                    symbol={symbol}
                                    decimal={decimals.price}
                                    className="text-right justify-end"
                                    quoteAsset={<Funding symbol={symbol} pairConfig={pairConfig} />}
                                />
                            </span>
                        </Card>
                        <Card className="bg-background-1 px-2 py-[6px]">
                            <Select
                                options={options}
                                value={timeframe}
                                onChange={(e) => setTimeframe(e)}
                                contentClassName="!w-[120px]"
                                labelClassName="text-md"
                            />
                        </Card>
                        <Card className="bg-background-1 w-7 h-7 relative">
                            <Favorite pairConfig={pairConfig} />
                        </Card>
                        <Card className="bg-background-1 min-w-7 h-7 relative">
                            <AlertIcon onClick={() => navigate(`${ROUTES.ALERTS}?symbol=${pairConfig.baseAsset}`)} className="absolute-center" />
                        </Card>
                    </div>
                    <TVChartContainer
                        isMobile
                        type={chartTypes.Candle}
                        symbol={symbol}
                        timeframe={timeframe}
                        classNameChart={`h-full mt-1`}
                        // onLoaded={() => setLoading(false)}
                    />
                </div>
            </Card>
        </>
    );
};

const Favorite = ({ pairConfig }: { pairConfig: PairConfig }) => {
    const favoritePairs = useFuturesConfig((state) => state.favoritePairs);
    const favoritePair = `${pairConfig.baseAsset}_${pairConfig?.quoteAsset}`;
    const active = useMemo(() => favoritePairs.find((pair) => pair === favoritePair), [favoritePairs, favoritePair]);

    const editFavorite = debounce(async () => {
        try {
            const mode = favoritePairs.includes(favoritePair) ? 'delete' : 'put';
            const data = await fetchFavorite(mode, 2, favoritePair);
            if (data) useFuturesConfig.getState().setFavoritePairs(data);
        } catch (error) {
            console.log(error);
        }
    }, 300);

    return (
        <div className="relative w-7 h-7">
            <N3FavoriteIcon size={16} className={`${active ? 'text-yellow-1' : 'text-disable'} absolute-center`} onClick={editFavorite} />
        </div>
    );
};

const Funding = ({ symbol, pairConfig }: { symbol: string; pairConfig: PairConfig }) => {
    const MMR = getMMR(pairConfig.leverageConfig.max);

    return (
        <Popover trigger={<InfoIcon size={16} color="currentColor" />} contentClassName="w-[340px] text-md" alignOffset={-120} arrow>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                    <Text variant="secondary">Funding Rate</Text>
                    <div className="flex items-center space-x-2">
                        <TickerField field="fundingRate" decimal={4} symbol={symbol} className="text-right justify-end font-medium" />
                        <TickerField field="fundingTime" decimal={4} symbol={symbol} className="text-right justify-end text-sub" />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <Text variant="secondary">Long/Short Rate</Text>
                    <TickerField field="volumeRateLS" decimal={0} symbol={symbol} className="text-right justify-end font-medium" />
                </div>
                <div className="flex items-center justify-between">
                    <Text variant="secondary">% Price Range</Text>
                    <TickerField field="priceChangePercent" symbol={symbol} className="text-right justify-end font-medium" sign={false} />
                </div>
                <div className="flex items-center justify-between">
                    <Text variant="secondary">MMR</Text>
                    <div className="text-green-1 font-medium">{formatNumber2(MMR * 100, 2)}%</div>
                </div>
            </div>
        </Popover>
    );
};
export default Chart;
