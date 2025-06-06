export interface WalletProps {
    assetId: number;
    value: number;
    lockedValue: number;
    ltv: number;
    liquidationRate: number;
    price: number;
}

interface WalletTypes {
    MAIN: boolean;
}

export interface Asset {
    assetCode: string;
    assetDigit: number;
    assetName: string;
    id: number;
    status: boolean;
    usdValueDigit: number;
    walletTypes: WalletTypes | any;
}

export interface TableData {
    assetCode: string;
    assetDigit: number;
    assetName: string;
    id: number;
    status: boolean;
    usdValueDigit: number;
    walletTypes: WalletTypes;
    assetId: number;
    value: number;
    lockedValue: number;
    ltv: number;
    liquidationRate: number;
    price: number;
}
