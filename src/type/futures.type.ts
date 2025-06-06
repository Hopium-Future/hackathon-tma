import { Telegram } from '@twa-dev/types';

declare global {
    interface Window {
        Telegram: Telegram;
    }
}

export enum FilterType {
    PRICE_FILTER = 'PRICE_FILTER',
    LOT_SIZE = 'LOT_SIZE',
    MARKET_LOT_SIZE = 'MARKET_LOT_SIZE',
    MAX_NUM_ORDERS = 'MAX_NUM_ORDERS',
    MAX_NUM_ALGO_ORDERS = 'MAX_NUM_ALGO_ORDERS',
    MIN_NOTIONAL = 'MIN_NOTIONAL',
    MAX_TOTAL_VOLUME = 'MAX_TOTAL_VOLUME',
    PERCENT_PRICE = 'PERCENT_PRICE'
}
export type PairFilter =
    | {
          minPrice: number;
          maxPrice: number;
          filterType: FilterType.PRICE_FILTER;
          tickSize: number;
      }
    | {
          stepSize: string;
          filterType: FilterType.LOT_SIZE;
          maxQty: number;
          minQty: string;
          maxQuoteQty: number;
      }
    | {
          stepSize: string;
          filterType: FilterType.MARKET_LOT_SIZE;
          maxQty: number;
          minQty: string;
          maxQuoteQty: number;
      }
    | {
          limit: number;
          filterType: FilterType.MAX_NUM_ORDERS | FilterType.MAX_NUM_ALGO_ORDERS;
      }
    | {
          notional: number;
          filterType: FilterType.MIN_NOTIONAL | FilterType.MAX_TOTAL_VOLUME;
      }
    | {
          multiplierDown: number;
          multiplierUp: number;
          multiplierDecimal: string;
          minDifferenceRatio: number;
          filterType: FilterType.PERCENT_PRICE;
      };

type LeverageConfig = {
    max: number;
    min: number;
    default: number;
};

export enum PairConfigTags {
    NEW_LISTING = 'New_Listing',
    AI = 'AI',
    MEGACAP = 'Megacap',
    MEME = 'Meme',
    TON = 'TON'
}

export type PairConfig = {
    pair: string;
    baseAsset: string;
    baseAssetId: number;
    baseAssetPrecision: number;
    contractType: string;
    createdAt: string;
    deliveryDate: number;
    filters: PairFilter[];
    leverageConfig: LeverageConfig;
    liquidationFee: number;
    liquidityBroker: string;
    maintMarginPercent: number;
    marginAsset: string;
    marginAssetId: number;
    marketTakeBound: number;
    onboardDate: number;
    orderTypes: string[];
    pricePrecision: number;
    quantityPrecision: number;
    quoteAsset: string;
    quoteAssetId: number;
    quotePrecision: number;
    requiredMarginPercent: number;
    settlePlan: number;
    status: string;
    symbol: string;
    timeInForce: string[];
    triggerProtect: number;
    underlyingSubType: string[];
    underlyingType: string;
    updatedAt: string;
    tags: PairConfigTags[];
};

export type AssetConfigType = {
    assetCode: string;
    assetDigit: number;
    assetName: string;
    createdAt: string;
    id: number;
    status: boolean;
    tags: string[];
    updatedAt: string;
    walletTypes: {
        MAIN?: boolean;
        SPOT?: boolean;
    };
    usdValueDigit: number;
};

export type Ticker = {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    baseAssetVolume: number;
    quoteAssetVolume: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    lastPrice: number;
    priceChange: number;
    priceChangePercent: number;
    lastQuantity: number;
    firstTradeId: number;
    lastTradeId: number;
    eventType: string;
    eventTime: number;
    totalNumberOfTrades: number;
    statisticsOpenTime: number;
    statisticsCloseTime: number;
    weightedAveragePrice: number;
    ask: number;
    bid: number;
    fundingRate: number;
    fundingTime: number;
    sellFundingRate: number;
    sellVolumeRate: number;
    buyFundingRate: number;
    buyVolumeRate: number;
    view: string;
    volume24h: number;
};

export type DecimalsFuturesType = {
    price?: number;
    symbol?: number;
    qty?: number;
};

export type SvgIconType = React.SVGProps<SVGSVGElement> & {
    size?: number;
};

export enum TYPE_FUTURES {
    MARKET = 'Market',
    LIMIT = 'Limit',
    STOP = 'Stop'
}

export enum SIDE_FUTURES {
    BUY = 'Buy',
    SELL = 'Sell'
}

export enum STATUS_FUTURES {
    PENDING = 0,
    ACTIVE = 1,
    CLOSED = 2,
    REQUESTING = 3
}

export enum REASON_CLOSE_CODE {
    NORMAL = 0,
    HIT_SL = 1,
    HIT_TP = 2,
    LIQUIDATE = 3
}

export type OrderFutures = {
    liquidity_broker: string;
    displaying_id: number;
    user_id: number;
    status: STATUS_FUTURES;
    side: SIDE_FUTURES.BUY | SIDE_FUTURES.SELL;
    type: 'Market' | 'Limit';
    symbol: string;
    quantity: number;
    leverage: number;
    sl: number | null;
    tp: number | null;
    price: number;
    transfer_quantity: number;
    hold_quantity: number;
    open_price: number;
    close_price: number;
    opened_at: string;
    closed_at: string;
    fee: number;
    fee_currency: number;
    margin: number;
    maintenance_margin?: number;
    margin_currency: number;
    order_value: number;
    origin_order_value: number;
    order_value_currency: number;
    fee_metadata: {
        place_order: {
            value: number;
            currency: number;
        };
        close_order: {
            value: number;
            currency: number;
        };
    };
    fee_data: {
        place_order: {
            [key: string]: number;
        };
        close_order: {
            [key: string]: number;
        };
    };
    volume_data: {
        place_order: {
            [key: number]: number;
        };
    };
    request_id: {
        place: string;
    };
    _b: boolean;
    use_copy_trade_wallet: boolean;
    user_category: number;
    promotion_category: number;
    swap: number;
    created_at: string;
    updated_at: string;
    metadata: any;
    open_platform: string;
    profit: number;
    reason_close_code?: REASON_CLOSE_CODE;
    partner_type: number;
    user_metadata: {
        photo_url: string;
        username: string;
    };
    raw_profit?: number;
    _id: string;
};

type OpenCloseFee = {
    [key in FeeType]: { [key: string]: { usdt: number } };
};

export enum FeeType {
    MAKER = 'MAKER',
    TAKER = 'TAKER'
}

export type FeeConfigType = {
    open: OpenCloseFee;
    close: OpenCloseFee;
};
