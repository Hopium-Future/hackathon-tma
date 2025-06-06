import Chip from '@/components/common/chip';
import InputSearch from '@/components/common/input/InputSearch';
import N3SortIcon from '@/components/icons/N3SortIcon';
import { cn, getDecimalPrice, scrollHorizontal } from '@/helper';
import useFuturesConfig from '@/stores/futures.store';
import { PairConfig, PairConfigTags } from '@/type/futures.type';
import { debounce, orderBy } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createSelector } from 'reselect';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Nodata from '@/components/common/nodata';
import { LOCAL_STORAGE_KEY, PublicSocketEvent } from '@/helper/constant';
import usePriceSocket from '@/stores/priceSocket.store';
import { useNavigate } from 'react-router-dom';
import N3FavoriteIcon from '@/components/icons/N3FavoriteIcon';
import { fetchFavorite } from '@/apis/futures.api';
import TickerField from '../TickerField';
import AssetLogo from '@/components/common/AssetLogo';

interface MarketProps {
    symbol: string;
    quoteAsset?: string;
    onClose: VoidFunction;
}
enum MarketTabs {
    ALL = 'All',
    FAVOURITES = 'Favorites'
}

enum MarketSort {
    TRENDING = 'Trending',
    GAINERS = 'Gainers',
    LOSERS = 'Losers'
}
const TABS = { ...MarketTabs, ...PairConfigTags, ...MarketSort };
type TabType = (typeof TABS)[keyof typeof TABS];

const getPairsConfig = createSelector([(state) => state, (_, quoteAsset) => quoteAsset], (pairsConfig: PairConfig[], quoteAsset) => {
    return pairsConfig?.filter((rs) => rs.quoteAsset === quoteAsset && rs.status === 'TRADING');
});
const Market = ({ quoteAsset, symbol, onClose }: MarketProps) => {
    const currentPair = symbol;
    const pairConfigs = useFuturesConfig((state) => getPairsConfig(state.pairsConfig, quoteAsset));
    const favoritePairs = useFuturesConfig((state) => state.favoritePairs);
    const priceSocket = usePriceSocket((state) => state.socket);
    const [tab, setTab] = useState<TabType>(TABS.ALL);
    const [strSearch, setStrSearch] = useState('');
    const refTabsMarkets = useRef(null);
    const [dataSource, setDataSource] = useState<PairConfig[]>([]);
    const [sort, setSort] = useState({
        fieldFilter: '',
        fieldSort: 'volume24h',
        direction: 'desc'
    });

    const tabs = useMemo(
        () =>
            Object.entries(TABS).map(([, value]) => ({
                title: value,
                value
            })),
        []
    );

    useEffect(() => {
        if (!pairConfigs) return;
        const tickers = useFuturesConfig.getState().tickers;
        const dataSource = pairConfigs.map((item) => {
            const ticker = tickers?.[item.symbol];
            return {
                ...item,
                view: ticker?.view ?? 0,
                lastPrice: ticker?.lastPrice || 0,
                volume24h: ticker?.volume24h || 0,
                priceChangePercent: ticker?.priceChangePercent || 0
            };
        });
        setDataSource(dataSource);
    }, [pairConfigs]);

    useEffect(() => {
        if (!priceSocket) return;
        return () => {
            const storage = localStorage.getItem(LOCAL_STORAGE_KEY.SYMBOLS_MARKET);
            const symbols = storage ? JSON.parse(storage) : [];

            const storageActive = localStorage.getItem(LOCAL_STORAGE_KEY.SYMBOLS_ACTIVE);
            const symbolsActive = storageActive ? JSON.parse(storageActive) : [];

            const filteredSymbols = symbols.filter((symbol: any) => !symbolsActive.includes(symbol));

            if (!filteredSymbols.length) return;
            priceSocket.emit(PublicSocketEvent.UNSUB_TICKER_UPDATE, filteredSymbols);
            localStorage.removeItem(LOCAL_STORAGE_KEY.SYMBOLS_MARKET);
        };
    }, [priceSocket]);

    const onChangeTab = (key: TabType) => {
        let sorter: any = {};
        switch (key) {
            case TABS.TRENDING:
                sorter = { fieldFilter: 'view', direction: 'desc' };
                break;
            case TABS.GAINERS:
                sorter = { fieldFilter: 'priceChangePercent', fieldSort: 'priceChangePercent', direction: 'desc' };
                break;
            case TABS.LOSERS:
                sorter = { fieldFilter: 'priceChangePercent', fieldSort: 'priceChangePercent', direction: 'asc' };
                break;
            case TABS.ALL:
                sorter = { fieldFilter: '', fieldSort: 'volume24h', direction: 'desc' };
                break;
            default:
                sorter = { fieldFilter: '', direction: '' };
                break;
        }
        setSort(sorter);
        setTab(key);
    };

    const dataFilter = useMemo(() => {
        let filteredData = dataSource;

        if (strSearch) {
            filteredData = filteredData.filter((rs) => rs.baseAsset.toLowerCase().includes(strSearch.toLowerCase()));
        }

        if (tab === TABS.FAVOURITES) {
            filteredData = filteredData.filter((item) => favoritePairs.includes(`${item.baseAsset}_${item.quoteAsset}`));
        } else if (Object.values(PairConfigTags).includes(tab as PairConfigTags)) {
            filteredData = filteredData.filter((item) => item.tags.includes(tab.toUpperCase() as PairConfigTags));
            filteredData = orderBy(filteredData, ['createdAt'], ['desc']);
            if (tab === TABS.NEW_LISTING) filteredData = filteredData.slice(0, 10);
        }
        if (sort.fieldFilter) {
            filteredData = orderBy(filteredData, [sort.fieldFilter], [sort.direction as any]);
        }

        if (sort.fieldSort) {
            filteredData = orderBy(filteredData, [sort.fieldSort], [sort.direction as any]);
        }

        return filteredData;
    }, [dataSource, strSearch, favoritePairs, tab, sort]);

    const changeSort = (fieldSort: string) => {
        if (fieldSort !== sort.fieldSort) {
            setSort((prev) => ({ ...prev, fieldSort, direction: 'asc' }));
        } else {
            switch (sort.direction) {
                case 'asc':
                    setSort((prev) => ({ ...prev, direction: 'desc' }));
                    break;
                case 'desc':
                    setSort((prev) => ({ ...prev, fieldSort: '', direction: '' }));
                    break;
                default:
                    setSort((prev) => ({ ...prev, direction: 'asc' }));
                    break;
            }
        }
    };

    const formatCategory = (category: TabType) => {
        if (category === TABS.NEW_LISTING) return 'New listing';
        return category;
    };

    if (!currentPair) return null;

    return (
        <div className="h-full flex flex-col">
            <InputSearch placeholder="Search token" value={strSearch} onValueChange={setStrSearch} />
            <div ref={refTabsMarkets} className="mt-3 flex items-center space-x-[6px] no-scrollbar overflow-auto p-[0.5px]">
                {tabs.map((item) => (
                    <Chip
                        onClick={(e) => {
                            onChangeTab(item.value as TabType);
                            scrollHorizontal(e.target as HTMLElement, refTabsMarkets.current);
                        }}
                        active={item.value === tab}
                        key={item.value}
                        className="capitalize whitespace-nowrap"
                        background="2"
                    >
                        {formatCategory(item.value)}
                    </Chip>
                ))}
            </div>
            <div className="mt-6 flex-1">
                <div className="flex items-center text-md text-sub space-x-8">
                    <MarketHead onClick={() => changeSort('symbol')} direction={sort.fieldSort === 'symbol' && sort.direction}>
                        TOKEN
                    </MarketHead>
                    <MarketHead onClick={() => changeSort('lastPrice')} direction={sort.fieldSort === 'lastPrice' && sort.direction} className="justify-end">
                        PRICE
                    </MarketHead>
                    <MarketHead
                        onClick={() => changeSort('priceChangePercent')}
                        direction={sort.fieldSort === 'priceChangePercent' && sort.direction}
                        className="justify-end w-[60px] flex-none"
                    >
                        CHANGE
                    </MarketHead>
                </div>
                {dataFilter.length > 0 ? (
                    <AutoSizer>
                        {({ height, width }) => (
                            <List className="mt-5" height={height - 40} width={width} itemCount={dataFilter.length} itemSize={52}>
                                {({ index, ...props }) => (
                                    <ListItem key={index} pairConfig={dataFilter[index]} {...props} currentPair={currentPair} onClose={onClose} />
                                )}
                            </List>
                        )}
                    </AutoSizer>
                ) : (
                    <Nodata className="pt-[120px]" />
                )}
            </div>
        </div>
    );
};

interface ListItemProps {
    pairConfig: PairConfig;
    style: any;
    currentPair: string;
    onClose: VoidFunction;
}

const ListItem = ({ pairConfig, style, currentPair, onClose }: ListItemProps) => {
    const priceSocket = usePriceSocket((state) => state.socket);
    const { favoritePairs, setFavoritePairs } = useFuturesConfig();
    const navigate = useNavigate();
    const pair = pairConfig?.symbol;
    const baseAsset = pairConfig?.baseAsset;
    const favoritePair = `${baseAsset}_${pairConfig?.quoteAsset}`;

    useEffect(() => {
        if (!priceSocket || currentPair === pair) return;
        const storage = localStorage.getItem(LOCAL_STORAGE_KEY.SYMBOLS_MARKET);
        const symbols = storage ? JSON.parse(storage) : [];
        if (symbols.includes(pair)) return;
        symbols.push(pair);
        localStorage.setItem(LOCAL_STORAGE_KEY.SYMBOLS_MARKET, JSON.stringify(symbols));
        priceSocket.emit(PublicSocketEvent.SUB_TICKER_UPDATE, pair);
    }, [baseAsset, priceSocket, currentPair]);

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig)
        };
    }, [pairConfig]);

    const addFavorite = debounce(async () => {
        try {
            const mode = favoritePairs.includes(favoritePair) ? 'delete' : 'put';
            const data = await fetchFavorite(mode, 2, favoritePair);
            if (data) {
                setFavoritePairs(data);
            }
        } catch (error) {
            console.log(error);
        }
    }, 300);

    const onRedirect = () => {
        const storageActive = localStorage.getItem(LOCAL_STORAGE_KEY.SYMBOLS_ACTIVE);
        const symbolsActive = storageActive ? JSON.parse(storageActive) : [];
        if (!symbolsActive.includes(pair)) {
            symbolsActive.push(pair);
            localStorage.setItem(LOCAL_STORAGE_KEY.SYMBOLS_ACTIVE, JSON.stringify(symbolsActive));
        }
        navigate(`/futures/${pair}`);
        if (onClose) onClose();
    };

    const isFavorite = useMemo(() => {
        return favoritePairs.includes(favoritePair);
    }, [favoritePairs, favoritePair]);

    return (
        <div onClick={onRedirect} style={{ ...style, height: 32 }} key={baseAsset} className="flex items-center font-bold space-x-8">
            <div className="flex-1 flex items-center space-x-2">
                <N3FavoriteIcon
                    className={isFavorite ? 'text-yellow-1' : 'text-disable'}
                    onClick={(e) => {
                        addFavorite();
                        e.stopPropagation();
                    }}
                />
                <div className="font-bold flex items-center space-x-2">
                    <AssetLogo assetId={pairConfig?.baseAssetId} size={28} />
                    <span>{baseAsset}</span>
                    <span className="text-xs font-medium px-[6px] py-0.5 ring-0.5 ring-divider text-green-1 rounded-sm">{pairConfig.leverageConfig.max}x</span>
                </div>
            </div>
            <div className="flex-1 text-right">
                <TickerField symbol={pair} field={'lastPrice'} decimal={decimals.price} className="justify-end" />
            </div>
            <div className="w-[60px] text-right">
                <TickerField symbol={pair} field={'priceChangePercent'} decimal={2} className="!font-bold" />
            </div>
        </div>
    );
};

interface MarketHeadProps {
    children: React.ReactNode;
    className?: string;
    onClick: VoidFunction;
    direction: string | boolean;
}
const MarketHead = ({ children, className, onClick, direction }: MarketHeadProps) => {
    return (
        <div onClick={onClick} className={cn('flex-1 flex items-center space-x-1', className)}>
            <span>{children}</span>
            <N3SortIcon direction={direction} />
        </div>
    );
};
export default Market;
