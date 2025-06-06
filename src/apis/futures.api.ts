import baseAxios from './base.api';

export const getPairsConfig = async () => {
    const data = await baseAxios.get('/v3/futures/config');
    return data.data?.data;
};

export const getAssetsConfig = async () => {
    const data = await baseAxios.get('/v3/futures/asset/config');
    return data.data?.data;
};

export const getTickers = async () => {
    const data = await baseAxios.get('/v3/futures/ticker');
    return data.data?.data;
};

export const getFuturesLeverage = async (symbol: string) => {
    const rs = await baseAxios.get(`/v3/futures/leverage`, { params: { symbol } });
    return rs.data.data?.[symbol];
};

export const setFuturesLeverage = async (symbol: string, leverage: number) => {
    const rs = await baseAxios.post(`/v3/futures/leverage`, { symbol, leverage });
    return rs.data.data?.[symbol];
};

export const fetchFavorite = async (method = 'get', tradingMode = 2, pairKey: string | null) => {
    try {
        const api = `/v3/futures/symbols/favorite`;
        let result: any = {};

        if (method === 'get' && tradingMode) {
            result = await baseAxios.get(api, { params: { tradingMode } });
        }

        if (method === 'put' && pairKey && tradingMode) {
            result = await baseAxios.put(api, { pairKey, tradingMode });
        }

        if (method === 'delete' && pairKey && tradingMode) {
            result = await baseAxios.delete(api, { data: { pairKey, tradingMode } });
        }

        return result?.data?.data;
    } catch (e) {
        console.log('Cant execute action');
    }
};

export const getOrders = async () => {
    const res = await baseAxios.get('/v3/futures/vndc/order', { params: { status: 0 } });
    return res.data.data;
};

export const getOrderDetail = async (orderId: string | number) => {
    const res = await baseAxios.get('/v3/futures/vndc/closed-order-detail', { params: { orderId } });
    return res.data.data;
};

export const fetchOrderFutures = async (method: 'get' | 'post' | 'put' | 'delete', params: any) => {
    const config = ['post', 'put'].includes(method) ? { ...params } : method === 'delete' ? { data: { ...params } } : { params: { ...params } };
    const res = await baseAxios[method]('/v3/futures/vndc/order', config);
    return res.data;
};

export const getOrdersHistory = async (params: {
    page: number;
    pageSize: number;
    side: string | null;
    range: string | null;
    reasonCloseCode: string | number | null;
}) => {
    const res = await baseAxios.get('/v3/futures/vndc/history_order', { params: { status: 1, ...params } });
    return res.data.data;
};

export const getFeesConfig = async () => {
    const res = await baseAxios.get('/v3/futures/fee-config', { params: { feeType: 'ALL' } });
    return res.data?.data || {};
};

export const updateSymbolView = async (symbol: string) => {
    await baseAxios.get('/v3/futures/view', { params: { symbol } });
};

export const getRecentTrades = async (limit: number) => {
    const res = await baseAxios.get('/v3/futures/recent-trade', { params: { limit } });
    return res.data.data;
};

export const getTrendingTokens = async () => {
    const res = await baseAxios.get('/v3/futures/trending/tokens');
    return res.data.data;
};

export const dcaOrder = async (params: any) => {
    const res = await baseAxios.put('/v3/futures/dca-order', { ...params });
    return res.data;
};

export const getFundingHistory = async (params: any) => {
    const res = await baseAxios.get('/v3/futures/funding-history', { params });
    return res.data.data;
};

export const getFundingLoanDetail = async (params: any) => {
    const res = await baseAxios.get('/v3/futures/funding-loan-detail', { params });
    return res.data.data;
};
