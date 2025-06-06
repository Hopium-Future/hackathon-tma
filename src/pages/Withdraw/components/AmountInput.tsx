import AssetLogo from '@/components/common/AssetLogo';
import FormInputNumber from '@/components/common/input';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import { formatNumber } from '@/helper';
import React from 'react';

interface IAmountInput {
    assetCode: string;
    assetDigit: number;
    assetId: number;
    assetBalance: number;
    setAmount: (amount: string) => void;
    showAssetListModal: () => void;
    amount: string;
    networkInfo: any;
    amountValidator: {
        isValid: boolean;
        msg: string;
    };
}

const AmountInput: React.FC<IAmountInput> = ({ assetCode, assetBalance, assetDigit, assetId, setAmount, amount, amountValidator, showAssetListModal }) => {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <div className="font-medium text-md">Amount</div>
                <div className="text-sm space-x-0.5">
                    <span className="text-sub">Available:</span>
                    <span className="font-semibold">
                        {formatNumber(assetBalance, assetDigit)} {assetCode}
                    </span>
                </div>
            </div>
            <FormInputNumber
                errorMessage={amount && amountValidator?.msg}
                onChange={({ value }) => setAmount(value)}
                value={amount}
                prefix={
                    <div onClick={showAssetListModal} className="flex items-center space-x-2 cursor-pointer">
                        <AssetLogo assetId={+assetId} />
                        <div className="flex items-center space-x-1">
                            <div className="font-semibold text-md">{assetCode}</div>
                            <ChevronDownIcon />
                        </div>
                    </div>
                }
                decimal={assetDigit}
                placeholder="Enter amount"
                className="flex-1 ml-2 text-right truncate"
                size="md"
                wrapperClassInput="bg-background-2 rounded border-[0.5px] border-divider h-10 "
            />
        </div>
    );
};

export default AmountInput;
