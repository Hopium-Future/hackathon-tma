import baseAxios from './base.api';

export const getTasksApi = async (group?: string) => {
    const res = await baseAxios.get('/tasks', {
        params: {
            group
        }
    });
    return res;
};

export const clickTaskApi = async (id: number) => {
    const res = await baseAxios.put(`tasks/click/${id}`);
    return res;
};

export const claimTaskApi = async (id: number | string) => {
    const res = await baseAxios.put(`/tasks/claim/${id}`);
    return res;
};

export const fetchTask = async (method: 'get' | 'post' | 'put', url: string, option?: any) => {
    const res = await baseAxios[method](url, option);
    return res;
};
