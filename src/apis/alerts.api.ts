import baseAxios from './base.api';

export const fetchAlerts = async (method?: 'get' | 'post' | 'delete' | 'put', params?: any) => {
    const res = await baseAxios[method || 'get']('/v3/alert-price', params);
    return res.data;
};

export const fetchSettingsAlert = async (method: 'get' | 'put', params?: any) => {
    const res = await baseAxios[method || 'get']('/v3/alert-price/setting', params);
    return res.data;
};
