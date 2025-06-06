export type Task = {
    _id: number;
    title: string;
    buttonText: string;
    icon: string;
    link: string;
    rewardQuantity: number;
    status: string;
    active: boolean;
    condition?: string;
    metadata?: {
        progress: number,
        total: number;
    };

};