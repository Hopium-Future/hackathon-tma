import { ReactNode } from "react";

export type ListTab = {
    value: string;
    title: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
}

export type ListContent = {
    value: string;
    children: ReactNode
}

export type DataTab = {
    userId: number,
    username: string,
    point: number,
    firstName: string,
    lastName: string,
    isPremium: boolean
    totalVolume?: number
}