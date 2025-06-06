import { OrderFutures } from '@/type/futures.type';
import { SOCIAL_TYPE } from './contanst';
export type TDataSocial = {
    id: string;
    type: keyof typeof SOCIAL_TYPE;
    context: {
        userId: number;
        userName: string;
        photoUrl: string | string[];
        order?: OrderFutures;
        symbol_name: string;
        volume?: number;
        percent_tp?: number;
        percent_sl?: number;
        pnl?: number;
        unPnl?: number;
        caller_description?: string;
        side?: string;
    };
    categoryName: string;
    title: string;
    content: string;
    createdAt: string;
};
