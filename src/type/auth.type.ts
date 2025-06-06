export type User = {
    _id: number;
    __v: number;
    createdAt: string;
    telegramId?: string;
    winStreak: number;
    addedToAttachmentMenu: boolean;
    allowsWriteToPm: boolean;
    firstName: string;
    isPremium: boolean;
    languageCode: string;
    lastName: string;
    updatedAt: string;
    username: string;
    parentId: number;
    tonAddress: string;
    referralCode: string;
    photoUrl: string;
    partnerType: number;
    isOnboarding: boolean;
};

export interface LoginResponse {
    isNew: boolean;
    user: User;
    token: string;
}

export type UserInfo = {
    username: string;
    totalFriend: number;
    totalCommission: number;
    partnerType: number;
    partnerName: string;
    hopium: number;
    totalCallCommission: number;
    totalStar: number;
};

export type Friend = {
    username: string;
    firstName: string;
    lastName: string;
    commission: number;
};

export type HopiumInfo = {
    total: number;
    volume: number;
    mission: number;
    referral: number;
    other: number;
};

export type Daily = {
    _id: number;
    code: string;
    title: string;
    condition: string;
    icon: string;
    isEnable: boolean;
    type: string;
    group: string;
    rewardId: number;
    rewardQuantity: number;
    link: string;
    status: string;
    active: boolean;
};

export type UserBalance = {
    userId: number;
    assetId: number;
    value: number;
    lockedValue: number;
    walletType: string;
};

export type AlertSettings = {
    TELEGRAM: boolean;
    lang: 'vi' | 'en';
};
export type UserSettings = {
    alert: AlertSettings;
};
