import { formatNumber } from '@/helper';
import React from 'react';

interface INetworkInfo {
    assetDigit: number;
    assetCode: string;
    withdrawFee: number;
    receiveAmount: number;
    withdrawMin: number;
}

const NetworkInfo: React.FC<INetworkInfo> = ({ assetDigit, assetCode, withdrawMin, withdrawFee, receiveAmount }) => {
    return (
        <div className="mb-5 space-y-2 text-md">
            <div className="flex items-center justify-between">
                <div className="text-sub">Min withdraw</div>
                <div className="font-semibold">
                    {formatNumber(withdrawMin, assetDigit)} {assetCode}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-sub">Network fee</div>
                <div className="font-semibold">
                    {formatNumber(withdrawFee, assetDigit)} {assetCode}
                </div>
            </div>
            <div className="flex items-center justify-between space-x-2">
                <div className="text-sub">Receive amount</div>
                <div className="font-semibold line-clamp-1">
                    {formatNumber(receiveAmount < 0 ? 0 : receiveAmount, assetDigit)} {assetCode}
                </div>
            </div>
        </div>
    );
};

export default NetworkInfo;
