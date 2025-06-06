export const TON_DECIMALS = 9;

export enum SOCKET_TOPIC {
    WALLET_UPDATED = 'user:update_balance:MAIN',
    PRICE_UPDATED = 'price.updated',
    PVP_ENDED = 'pvp.ended',
    SPOT_TRADE = 'spot:trade',
    ORDER_CREATED = 'orderCreated'
}

export const MISSION_TYPE = {
    DAILY_CHECK_IN: 'DAILY_CHECK_IN',
    OUTBOND_MISSION: 'OUTBOND_MISSION',
    PARTNERSHIP: 'PARTNERSHIP',
    TRADE2AIRDROP: 'TRADE2AIRDROP'
};

export enum APP_STEP {
    SPLASH = 1,
    INTRODUCTION = 2,
    INVITE = 3
}

export enum GAME_RESULT {
    WIN = 'WIN',
    LOSS = 'LOSS',
    REJECTED = 'Rejected',
    BLESSED = 'Blessed'
}

export const RANKING_TAB = {
    FRIENDS: 'friends',
    GLOBAL: 'global',
    PVP: 'pvp'
};

export const TASK_TAB = {
    HOPIUM: 'HOPIUM',
    LUCKY: 'LUCKY'
};

export const PVP_TAB = {
    CREATE_POSITION: 'CREATE_POSITION',
    POSITION_LIST: 'POSITION_LIST'
};

export const KEY_ICON_TASK = {
    CALENDAR_CHECK_ICON: 'CALENDAR_CHECK_ICON',
    USER_PLUS_ICON: 'USER_PLUS_ICON',
    TELEGRAM_ICON: 'TELEGRAM_ICON',
    BOOKMARK_ICON: 'BOOKMARK_ICON',
    TWITTER_ICON: 'TWITTER_ICON',
    TON_ICON: 'TON_ICON',
    PVP_ICON: 'PVP_ICON',

    // Partner
    KAIA_ICON: 'KAIA_ICON',
    LION_GOAL_ICON: 'LION_GOAL_ICON',
    MEME_TOWN_ICON: 'MEME_TOWN_ICON',
    CAT_PLANETS_ICON: 'CAT_PLANETS_ICON',
    HABIT_NETWORK_ICON: 'HABIT_NETWORK_ICON',
    AAO_ICON: 'AAO_ICON',
    MONKEY_PAW_ICON: 'MONKEY_PAW_ICON',
    GHOSTDRIVE_ICON: 'GHOSTDRIVE_ICON',
    HAMSTER_REPUBLIC_ICON: 'HAMSTER_REPUBLIC_ICON',
    UNIQUID_ICON: 'UNIQUID_ICON',
    NANOZAP_ICON: 'NANOZAP_ICON',
    BULLS_ICON: 'BULLS_ICON',
    HYBIRD_ICON: 'HYBIRD_ICON',
    BEEVERSE_ICON: 'BEEVERSE_ICON',
    BITHOVEN_ICON: 'BITHOVEN_ICON',
    YULIGO_ICON: 'YULIGO_ICON',
    CAT_THE_CHICK_ICON: 'CAT_THE_CHICK_ICON',
    TON_FLASH_ICON: 'TON_FLASH_ICON',
    P4L_ICON: 'P4L_ICON',
    AKEFISH_ICON: 'AKEFISH_ICON',
    AIGOTRADE_ICON: 'AIGOTRADE_ICON',
    COIN_FLIP_ICON: 'COIN_FLIP_ICON'
};
export const SYMBOL = 'BTCUSDT';

export const TASK_TYPE = {
    ALL: 'ALL',
    DAILY: 'DAILY',
    FIXED: 'FIXED',
    ONE_TIME: 'ONE_TIME',
    PARTNER: 'PARTNER'
};

export const STATUS_TASK = {
    LOCKED: 'LOCKED',
    UNCOMPLETED: 'UNCOMPLETED',

    AVAILABLE: 'AVAILABLE',
    CLAIMABLE: 'CLAIMABLE',
    COMPLETED: 'COMPLETED'
};

export const CONDITION_TASK = {
    DAILY_CHECK_IN: 'DAILY_CHECK_IN',
    INVITE_FRIEND: 'INVITE_FRIEND',
    JOIN_TELEGRAM_GROUP: 'JOIN_TELEGRAM_GROUP',
    SUBSCRIBE_TELEGRAM_CHANNEL: 'SUBSCRIBE_TELEGRAM_CHANNEL',
    SUBSCRIBE_TWITTER: 'SUBSCRIBE_TWITTER',
    MAKE_A_TRADE: 'MAKE_A_TRADE',
    MAKE_A_DEPOSIT: 'MAKE_A_DEPOSIT'
};

export const SIDE = {
    PUMP: 'PUMP',
    DUMP: 'DUMP'
};

export const HISTORY_TABS = {
    HOPIUM: 'hopium',
    PVP: 'pvp'
};

export const PRIZE_ICON = {
    HOPIUM_ICON: 'HOPIUM_ICON',
    DOGS_ICON: 'DOGS_ICON',
    LOTTERY_TICKET: 'LOTTERY_TICKET',
    TON_ICON: 'TON_ICON',
    CATI_ICON: 'CATI_ICON'
};

export enum PRIZE_TYPE {
    HOPIUM = 'HOPIUM',
    DOGS = 'DOGS',
    TICKET = 'TICKET',
    TON = 'TON',
    CATI = 'CATI'
}

export enum TOKEN {
    HOPIUM = 'hopium',
    DOGS = 'dogs',
    TICKET = 'ticket',
    TON = 'ton',
    CATI = 'cati',
    USDT = 'usdt'
}

export enum ASSET {
    HOPIUM = 33,
    GOATS = 603,
    TICKET = 2,
    USDT = 22,
    TON = 564,
    DOGS = 567,
    CATI = 574,
    HMSTR = 576
}

export const PARTNER_TYPE = {
    NEWBIE: 0,
    AMBASSADOR: 1,
    ROOKIE: 2,
    DEGEN: 3,
    PRO: 4,
    ELITE: 5,
    LEGEND: 6
};

export const EARN_TAB = {
    MISSION: 'MISSION',
    CALL: 'CALL',
    FRIENDS: 'FRIENDS',
    CAMPAIGN: 'CAMPAIGN'
};

export const MISSION_TAB = {
    TRADE2AIRDROP: 'TRADE2AIRDROP',
    SOCIAL: 'SOCIAL',
    PARTNERSHIP: 'PARTNERSHIP'
};

export const FEED_TAB = {
    ALL: 'ALL',
    FOLLOWING: 'FOLLOWING'
};

export const PROFILE_FOLLOW_TAB = {
    FOLLOWING: 'following',
    FOLLOWER: 'follower'
};

export const PROFILE_CALL_LIST_TYPE = {
    PENDING: 'pending',
    POSITION: 'position',
    CLOSED: 'closed'
};

export const FEED_PAGE_LIMIT = 20;

export const TRADE_TYPE = {
    copy: 'copy',
    counter: 'counter'
};

export const POST_STATUS = {
    CLOSED: 0,
    ACTIVE: 1,
    CANCELLED: 2,
    PENDING: 3
};

export const POST_REACTIONS = {
    LIKE: 'like',
    DISLIKE: 'dislike'
};

export const POST_SOCKET_EVENTS = {
    updatePost: 'updatePost'
};

export const HALL_LEADERBOARD_TAB = {
    PROFIT: 'profit',
    LOSS: 'loss',
    VOLUME: 'volume',
    COPY_COUNTER: 'copyCounter'
};

export const HALL_LEADERBOARD_TYPE = {
    PNL: 'pnl',
    VOLUME: 'volume',
    COPY_COUNTER: 'copyCounter'
};

export const CHECKIN_STATUS = {
    UNCLAIMABLE: 'UNCLAIMABLE',
    CLAIMABLE: 'CLAIMABLE',
    CLAIMED: 'CLAIMED'
};

export const LOCAL_STORAGE_KEY = {
    SYMBOLS_MARKET: 'SYMBOLS_MARKET',
    SYMBOLS_ACTIVE: 'SYMBOLS_ACTIVE',
    ORDERS_SHARED: 'ORDERS_SHARED',
    SYMBOL_PREVIOUS: 'SYMBOL_PREVIOUS'
};

export const PublicSocketEvent = {
    SUB_TICKER_UPDATE: 'subscribe:futures:ticker',
    UNSUB_TICKER_UPDATE: 'unsubscribe:futures:ticker',

    FUTURES_TICKER_UPDATE: 'futures:ticker:update'
};

export const NA3_FEE_FUTURE = {
    OPEN: 0.0003,
    CLOSE: 0.0006
};

export const WithdrawalStatus = {
    PROCESSING: 1,
    COMPLETED: 2,
    FAILED: 3,
    WAITING_FOR_CONFIRMATIONS: 4,
    WAITING_FOR_BALANCE: 5
};

export const WithdrawalStatusContent = {
    1: 'PROCESSING',
    2: 'COMPLETED',
    3: 'FAILED',
    4: 'WAITING_FOR_CONFIRMATIONS',
    5: 'WAITING_FOR_BALANCE'
};

export const TRANSACTION_STATUS_COLOR = {
    [WithdrawalStatus.COMPLETED]: 'text-green-1',
    [WithdrawalStatus.FAILED]: 'text-red-1',
    [WithdrawalStatus.WAITING_FOR_BALANCE]: 'text-blue-1',
    [WithdrawalStatus.WAITING_FOR_CONFIRMATIONS]: 'text-blue-1',
    [WithdrawalStatus.PROCESSING]: 'text-yellow-1'
};

export const WITHDRAW_RESULT = {
    INVALID_ADDRESS: 'invalid_address',
    INVALID_AMOUNT: 'invalid_amount',
    INVALID_CURRENCY: 'invalid_currency',
    INSUFFICIENT: 'insufficient',
    NOT_REACHED_MIN_WITHDRAW_IN_USD: 'not_reached_min_withdraw_in_usd',
    NOT_ENOUGH_FEE: 'not_enough_fee',
    MEMO_TOO_LONG: 'memo_too_long',
    AMOUNT_EXCEEDED: 'invalid_max_amount',
    TOO_MUCH_REQUEST: 'TOO_MUCH_REQUEST',
    SECRET_INVALID: 'SECRET_INVALID',
    // invalid_smart_otp: 'invalid_smart_otp',
    HAVE_OPEN_POSITION: 'have_open_position',
    INVALID_KYC_STATUS: 'invalid_kyc_status',
    InvalidUser: 'invalid_user',
    InvalidAsset: 'invalid_asset',
    WithdrawDisabled: 'withdraw_disabled',
    UnsupportedAddress: 'unsupported_address',
    InvalidAddress: 'invalid_address',
    AmountTooSmall: 'amount_too_small',
    AmountExceeded: 'amount_exceeded',
    NotEnoughBalance: 'not_enough_balance',
    MissingOtp: 'missing_otp',
    InvalidOtp: 'invalid_otp',
    SOTP_INVALID: 'SOTP_INVALID',
    Unknown: 'unknown_error',
    EXCEEDED_SMART_OTP: 'SOTP_INVALID_EXCEED_TIME',
    PIN_INVALID_EXCEED_TIME: 'PIN_INVALID_EXCEED_TIME',
    INVALID_SMART_OTP_KEY: 'invalid_smart_otp_key',
    DEPOSIT_NOT_ENOUGH_TO_WITHDRAW: 'deposit_not_enough_to_withdraw'
};

export const CAMPAIGN_TABS = {
    UPCOMING: 0,
    LIVE: 1,
    ENDED: 2
};

export const CAMPAIGN_DETAIL_TABS = {
    RULES: 'RULES',
    LEADERBOARD: 'LEADERBOARD'
};

export const BOX_STATUS = {
    IN_PROGRESS: 'IN_PROGRESS',
    UPCOMING: 'UPCOMING',
    ENDED: 'ENDED'
};

export const TASK_CONDITION = {
    COMPLETE_CHILD_MISSION: 'COMPLETE_CHILD_MISSION'
};

export enum ALERT_TYPE {
    REACHES = 'REACH_PRICE',
    RISES_ABOVE = 'PRICE_RISES_ABOVE',
    DROPS_TO = 'PRICE_DROPS_TO'
}

export enum ALERT_FREQUENCY {
    ONLY_ONCE = 'ONLY_ONCE',
    ONCE_A_DAY = 'ONCE_A_DAY'
}

export const MMRConfig = {
    25: 0.4 / 100,
    50: 0.3 / 100,
    75: 0.2 / 100,
    100: 0.1 / 100,
    125: 0.1 / 100
};

export const AVATAR_BORDER_STYLE = {
    [PARTNER_TYPE.NEWBIE]: 'border-sub',
    [PARTNER_TYPE.AMBASSADOR]: 'border-gradient',
    [PARTNER_TYPE.ROOKIE]: 'border-[#36A3B9]',
    [PARTNER_TYPE.DEGEN]: 'border-green-1',
    [PARTNER_TYPE.PRO]: 'border-[#BF7FFF]',
    [PARTNER_TYPE.ELITE]: 'border-[#E5A607]',
    [PARTNER_TYPE.LEGEND]: 'border-[#FF2B00]'
};

export const SORT_LIST_TYPE = {
    DESC: 'desc',
    ASC: 'asc',
    UNSET: ''
};
