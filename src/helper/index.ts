import { BASE_BOT_DEV, BASE_S3_URL, TEST_INIT_DATA, TON_SCAN_URL, PROXY_URL } from '@/config/app.config';
import { FilterType, OrderFutures, PairConfig, SIDE_FUTURES, STATUS_FUTURES, Ticker } from '@/type/futures.type';
import WebApp from '@twa-dev/sdk';
import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { ASSET, LOCAL_STORAGE_KEY } from './constant';
import { find } from 'lodash';
import md5 from 'md5';

export const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
};

export const copyToClipboard = (text: string) => {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }

    navigator.clipboard
        .writeText(text)
        .then(() => console.log('Clipboard', text))
        .catch((error) => {
            console.log('Error copy to clipboard', error);
            fallbackCopyTextToClipboard(text);
        });
};

export const copyToClipboard2 = (text: string) => {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }

    navigator.clipboard.writeText(text).then(
        () => console.log('Clipboard copy success', text),
        (error) => {
            console.error('Clipboard API error', error);
            alert('Không thể tự động copy. Vui lòng bấm vào ô bên dưới để tự copy.');
            prompt('Sao chép đoạn văn bản sau:', text); // Hiển thị popup cho user tự copy
        }
    );
};

const truncateFractionAndFormat = (parts: Intl.NumberFormatPart[], digits: number) => {
    const value = parts
        .map(({ type, value }) => {
            if (type !== 'fraction' || !value || value.length < digits) {
                return value;
            }

            let retVal = '';
            for (let idx = 0, counter = 0; idx < value.length && counter < digits; idx++) {
                if (value[idx] !== '0') {
                    counter++;
                }
                retVal += value[idx];
            }
            return retVal;
        })
        .reduce((string, part) => string + part, '');
    return value;
};

export const formatNumber = (n?: number | string | bigint, digits = 2) => {
    if (!n) return '0';

    if (typeof n === 'string') n = Number(n);

    const formatter = Intl.NumberFormat('en-US', {
        maximumFractionDigits: digits,
        minimumFractionDigits: 0
    });
    return truncateFractionAndFormat(formatter.formatToParts(n), digits);
};

export const exponentialToDecimal = (number: number, digits = 4, fixed?: boolean) => {
    if (fixed) return number.toFixed(digits);
    if (!number) return 0;
    const str = number.toString();
    const dotIndex = str.indexOf('.');
    if (digits === 0) {
        return dotIndex === -1 ? str : str.substring(0, dotIndex);
    }
    if (dotIndex === -1 || str.length - dotIndex - 1 < digits) {
        return str;
    }
    return str.substring(0, dotIndex + digits + 1);
};

export const formatNumber2 = (number: number | string | undefined, digits = 4, fixed?: boolean) => {
    if (!number) return 0;
    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: digits,
        minimumFractionDigits: 0
    });
    return formatter.format(+exponentialToDecimal(+number, digits, fixed));
};

export const formatBalance = (balance?: number | string | bigint, digits = 2): string => {
    if (!balance) return '0';

    if (typeof balance === 'string') balance = Number(balance);

    if (typeof balance === 'bigint') balance = Number(balance);

    const factor = Math.pow(10, digits);
    const truncated = Math.floor(balance * factor) / factor;

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits
    });

    return formatter.format(truncated);
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getInitData = () => {
    // return 'testvipromax';
    if (WebApp.initData) return WebApp.initData;
    return TEST_INIT_DATA;
};

export const getRefLink = (referralCode: string) => {
    return `${BASE_BOT_DEV}?startapp=linkCode_${referralCode}`;
};

export const openShareLink = (referralCode: string, text = 'Trade with me & turn market moves into rewards. Let’s make every bit of dust count!') => {
    WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(getRefLink(referralCode))}&text=${encodeURIComponent(text)}`);
};

export function shortenHexString(hexString: string, prefixLength: number, suffixLength: number): string {
    if (hexString?.length < prefixLength + suffixLength) {
        return '';
    }

    const prefix = hexString?.slice(0, prefixLength);
    const suffix = hexString?.slice(-suffixLength);

    return `${prefix}...${suffix}`;
}

export function formatBigNum(num?: number, digits = 2, includesThousands = false): string {
    if (num == null || isNaN(num)) return '0';

    const validDigits = Number.isInteger(Math.abs(num)) ? 0 : digits;

    const lookup = [
        { value: 1e18, symbol: 'E' },
        { value: 1e15, symbol: 'P' },
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'B' },
        { value: 1e6, symbol: 'M' },
        { value: 1e3, symbol: 'K' },
        { value: 1, symbol: '' }
    ];

    // Filter lookup based on `includesThousands` flag
    const validLookup = includesThousands ? lookup : lookup.filter((item) => item.value >= 1e6);

    const item = validLookup.find((item) => num >= item.value);

    if (num < 1) return num.toFixed(validDigits);

    return item ? (num / item.value).toFixed(validDigits).replace(/\.0+$/, '') + item.symbol : num.toFixed(validDigits);
}

export const getTxhTonLink = (txHash: string) => {
    console.log('TON_SCAN_URL: ', TON_SCAN_URL);
    return TON_SCAN_URL + `/transaction/${txHash}`;
};

export const getAddressTonLink = (address: string) => {
    return TON_SCAN_URL + `/${address}`;
};

export function formatUnits(value: bigint, decimals: number) {
    let display = value.toString();

    const negative = display.startsWith('-');
    if (negative) display = display.slice(1);

    display = display.padStart(decimals, '0');

    // eslint-disable-next-line prefer-const
    let [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)];
    fraction = fraction.replace(/(0+)$/, '');
    return `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`;
}

export function parseUnits(value: string, decimals: number) {
    let [integer, fraction = '0'] = value.split('.');

    const negative = integer.startsWith('-');
    if (negative) integer = integer.slice(1);

    // trim leading zeros.
    fraction = fraction.replace(/(0+)$/, '');

    // round off if the fraction is larger than the number of decimals.
    if (decimals === 0) {
        if (Math.round(Number(`.${fraction}`)) === 1) integer = `${BigInt(integer) + 1n}`;
        fraction = '';
    } else if (fraction.length > decimals) {
        const [left, unit, right] = [fraction.slice(0, decimals - 1), fraction.slice(decimals - 1, decimals), fraction.slice(decimals)];

        const rounded = Math.round(Number(`${unit}.${right}`));
        if (rounded > 9) fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, '0');
        else fraction = `${left}${rounded}`;

        if (fraction.length > decimals) {
            fraction = fraction.slice(1);
            integer = `${BigInt(integer) + 1n}`;
        }

        fraction = fraction.slice(0, decimals);
    } else {
        fraction = fraction.padEnd(decimals, '0');
    }

    return BigInt(`${negative ? '-' : ''}${integer}${fraction}`);
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const getPathImageBuyAsset = (key: number) => {
    switch (key) {
        case ASSET.HOPIUM:
            return '/images/home/hopium.png';
        case ASSET.TON:
            return '/images/ton.png';
        case ASSET.DOGS:
            return '/images/dog.png';
        case ASSET.CATI:
            return '/images/lucky/cati.png';
        case ASSET.USDT:
            return '/images/usdt.png';

        default:
            break;
    }
};

export function getS3Url(url: string) {
    return BASE_S3_URL + url;
}

export function getProxyImageUrl(url: string) {
    return `${PROXY_URL}/image?url=${encodeURIComponent(url)}`;
}

export const countDecimals = (value: number): number => {
    if (Number.isInteger(value)) return 0;

    const str = value.toString();
    if (str.includes('-')) {
        return Number(str.split('-')[1]) || 0;
    }
    return str.split('.')[1]?.length || 0;
};

export const getDecimalPrice = (config?: PairConfig) => {
    if (!config) return 2;
    const decimalScalePrice = config?.filters?.find((rs) => rs.filterType === 'PRICE_FILTER');
    return +countDecimals(Number(decimalScalePrice?.tickSize) ?? 2);
};

export const getDecimalQty = (config?: PairConfig) => {
    if (!config) return 2;
    const decimal = config?.filters?.find((rs) => rs.filterType === 'LOT_SIZE');
    return +countDecimals(Number(decimal?.stepSize) ?? 2);
};

export function eToNumber(value: any) {
    let sign = '';

    (value += '').charAt(0) === '-' && ((value = value?.toString().substring(1)), (sign = '-'));
    const arr = value?.toString().split(/[e]/gi);
    if (arr.length < 2) return sign + value;
    const dot = (0.1).toLocaleString().substr(1, 1);
    let n = arr[0];
    const exp = +arr[1];
    let w = (n = n.replace(/^0+/, '')).replace(dot, '');
    const pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp;
    let L = pos - w.length;
    const s = '' + BigInt(w);
    w = exp >= 0 ? (L >= 0 ? s + '0'.repeat(L) : r()) : pos <= 0 ? '0' + dot + '0'.repeat(Math.abs(pos)) + s : r();
    L = w.split(dot);
    if ((typeof L === 'object' && L[0] === 0 && L[1] === 0) || (+w === 0 && +s === 0)) w = 0; //** added 9/10/2021
    return sign + w;

    function r() {
        return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`);
    }
}

export const formatTime = (value: Date | string, formatString = 'dd/MM/yyyy HH:mm:ss') => {
    try {
        const date = value instanceof Date ? value : new Date(value);
        return format(date, formatString).toString();
    } catch (error) {
        console.error('Error formatting time:', error);
        return value.toString();
    }
};

export const formatSide = (side?: SIDE_FUTURES) => {
    if (side === SIDE_FUTURES.BUY) return 'Long';
    return 'Short';
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const calHopiumToken = (vol: number) => {
    return Math.floor(vol) * 1;
};

export const futuresProfit = (order: OrderFutures, ticker: Ticker | null) => {
    const { status, quantity, open_price, side } = order || {};
    let profit = order.profit || 0;
    if (status === STATUS_FUTURES.CLOSED) {
        profit = order?.raw_profit ? order?.raw_profit : order.profit;
    } else {
        const closePrice = side === SIDE_FUTURES.BUY ? Number(ticker?.bid || 0) : Number(ticker?.ask || 0);
        const fee = 0;
        const unfeeProfit = quantity * (closePrice - open_price);
        profit = side === SIDE_FUTURES.BUY ? unfeeProfit - fee : -unfeeProfit - fee;
    }
    const ratio = profit / order.margin;
    const percent = formatNumber(ratio * 100, 2);
    return {
        profit,
        percent
    };
};

export const getQueryParam = (param?: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (!param) return urlParams.toString();
    return urlParams.get(param);
};

export const getPreviousSymbol = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEY.SYMBOL_PREVIOUS) || 'BTCUSDT';
};

export const scrollHorizontal = (el: HTMLElement | null, parentEl: HTMLElement | null) => {
    if (!parentEl || !el) return;

    const style = window.getComputedStyle(el);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

    const childRect = el.getBoundingClientRect();
    const parentRect = parentEl.getBoundingClientRect();
    const activeWidth = el.clientWidth / 2;
    let pos = childRect.left - parentRect.left + activeWidth;
    pos += parentEl.scrollLeft + margin + padding + border - parentEl.clientWidth / 2;

    parentEl.scrollTo({
        left: pos,
        behavior: 'smooth'
    });
};

export const isIOS = WebApp.platform === 'ios';

export const isBroswer = () => {
    // Detect Chrome
    const chromeAgent = navigator.userAgent.indexOf('Chrome') > -1;
    // Detect Internet Explorer
    const IExplorerAgent = navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('rv:') > -1;

    return chromeAgent || IExplorerAgent;
};
export const hexToRgba = (hex: string, opacity: number) => {
    if (hex === 'transparent') return 'transparent';
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((char) => char + char)
            .join('');
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getFilter = (filterType: FilterType, config: PairConfig) => {
    const filter = find(config?.filters, { filterType });
    return filter as any;
};

export const generateUUID = () => {
    // Generate a UUID (v4)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
        .toUpperCase();
};

export const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
};

export const getSignature = (userId: string, timestamp: number) => {
    return md5(userId.slice(0, 10) + timestamp);
};

export const getTimeDistance = (timeMark: Date | number | string) => {
    const timeMarkToSeconds = new Date(timeMark).getTime() / 1000;
    const currentTimeToSeconds = Date.now() / 1000;

    const diffSeconds = Math.abs(Math.floor(timeMarkToSeconds - currentTimeToSeconds));

    const units = [
        { value: 60 * 60 * 24, unit: 'd' }, // days
        { value: 60 * 60, unit: 'h' }, // hours
        { value: 60, unit: 'm' }, // minutes
        { value: 1, unit: 's' } // seconds
    ];

    for (const { value, unit } of units) {
        const interval = Math.floor(diffSeconds / value);
        if (interval >= 1) {
            return `${interval}${unit}`;
        }
    }
};

export const truncateText = (text: string, length = 20) => {
    const textTrim = `${text}`.trim();
    return textTrim.length > length ? `${textTrim.substring(0, length)}...` : textTrim;
};

export const roundDown = (value: number, decimal = 2) => {
    const factor = Math.pow(10, decimal);
    return Math.floor(value * factor) / factor;
};

export const roundUp = (value: number, decimal = 2) => {
    const factor = Math.pow(10, decimal);
    return Math.ceil(value * factor) / factor;
};

export const parseStartParam = (startParam: string) => {
    const arr = startParam.split('-');
    return arr.reduce<Record<string, any>>((acc, cur) => {
        const [key, value] = cur.split('_');
        acc[key] = value;
        return acc;
    }, {});
};
