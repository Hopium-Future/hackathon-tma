export type EarnType = 'TIP_STARS' | 'COMMISSION_REF' | 'COMMISSION_SHARE' | 'RANK_CHANGED' | 'TIP_STAR';

export type TDataEarn = {
    _id: string;
    category: number;
    categoryName: 'Earn';
    content: string;
    context: {
        amount: number;
        convertedAmount: number;
        createdAt: string;
        photoUrl: string | string[];
        postId: string;
        username: string;
        amountCUsdt: number;
        amountLUsdt: number;
        tierName: string;
        userType: number
    };
    createdAt: string;
    status: 1;
    title: string;
    type: EarnType;
    updatedAt: string;
};
