import baseAxios from './base.api';

export const getNotifications = async ({ type, lastId }: { type: string; lastId?: string }) => {
    const res = await baseAxios.get('/chatbot/notifications', {
        params: {
            type: type === 'all' ? 0 : type,
            ...(lastId && { lastId }),
            limit: 20
        }
    });
    return res?.data;
};

export const getMarkAsReadNotifications = async () => {
    const res = await baseAxios.post('/chatbot/all-read?type[]=ALL');
    return res?.data;
};

export const addUserToGroupTelegram = async ({ chatId }: { chatId: number | string }) => {
    const res = await baseAxios.post('/chatbot/telebot/add-user-to-group', {
        chatId: -Math.abs(Number(chatId))
    });
    return res?.data;
};

export const getOrderDetail = async ({ orderId }: { orderId?: number }) => {
    const res = await baseAxios.get('v3/futures/vndc/order-detail', {
        params: {
            orderId
        }
    });
    return res?.data;
};
