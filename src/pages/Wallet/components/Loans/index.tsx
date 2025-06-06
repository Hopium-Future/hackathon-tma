import { useMemo, useState, FC } from 'react';

import DangerIcon from '@/components/icons/Danger';
import StartIcon from '@/components/icons/StartIcon';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';

import useWalletStore from '@/stores/wallet.store';
import { AssetData } from '@/type/wallet.type';

import InfoIcon from '@/components/icons/Info';
import Modal from '@/components/common/modal';

import { ASSET_ID_C_USDT, ASSET_ID_USDT, QUOTE_ASSET_USDT } from '../../constants';

import { formatBalance } from '@/helper';

import classNames from 'classnames';

const PERCENT = 100;

const CONTENT = {
    title_tooltip: 'LOANS',
    title: 'Borrowed exceeds liquidation threshold triggering liquidation of your collateral',
    content: ['Borrowed', 'Liquidation threshold']
};

const getLtvIndicator = (ltvRatio: number) => {
    if (ltvRatio === PERCENT) return { type: 'DEFAULT', color: 'bg-background-2' };
    if (ltvRatio >= 50) return { type: 'BLUE', color: 'bg-green-1' };
    if (ltvRatio >= 20) return { type: 'YELLOW', color: 'bg-yellow-1' };
    if (ltvRatio < 20) return { type: 'RED', color: 'bg-red-1' };
};

interface LoansProps {
    formatDecimals?: number;
    title?: boolean;
}
const Loans: FC<LoansProps> = ({ formatDecimals = 4, title = true }) => {
    const { liquidation, dataWallet } = useWalletStore((state) => ({
        liquidation: state.liquidation,
        dataWallet: state.dataWallet
    }));

    const [isVisible, setIsVisible] = useState(false);

    const toggleModal = () => setIsVisible((prev) => !prev);

    const usdtWallet = useMemo(() => {
        return dataWallet?.find((f: AssetData) => f.assetId === ASSET_ID_USDT);
    }, [dataWallet]);

    const C_USDTValue = useMemo(() => {
        return dataWallet?.find((f: AssetData) => f.assetId === ASSET_ID_C_USDT) || 0;
    }, [dataWallet]);

    const lockedValue = usdtWallet?.lockedValue || 0;
    const borrowedLoan = Math.max(lockedValue - usdtWallet?.value - (C_USDTValue?.value - C_USDTValue.lockedValue), 0);

    const ltvRatio = useMemo(() => {
        if (borrowedLoan === 0 || liquidation === 0) return PERCENT;
        if (!liquidation || liquidation <= 0) return 0;

        return (+liquidation > 0 ? (liquidation - borrowedLoan) / borrowedLoan : 0) * PERCENT;
    }, [borrowedLoan, liquidation]);

    const iconContentMap = getLtvIndicator(ltvRatio);
    const step = PERCENT - Math.min(ltvRatio, 100);

    const total = [borrowedLoan, Math.max(liquidation, 0)];
    const isDefaultOrBlueType = ['DEFAULT', 'BLUE'].includes(iconContentMap?.type as any);

    return (
        <>
            <section className="flex flex-col gap-y-1 w-full" onClick={toggleModal}>
                {title && (
                    <section className="text-sub text-sm flex gap-x-1 items-center cursor-pointer mb-1">
                        <p>Loans</p>
                        <InfoIcon size="xs" />
                    </section>
                )}
                <section className={classNames('flex items-center w-full h-[6px]', { '!w-[calc(100%-3px)]': isDefaultOrBlueType })}>
                    <div className="h-[6px] flex ">
                        <StartIcon size="size_6" type={iconContentMap?.type} className="relative left-[1px]" />
                    </div>
                    <div className="h-[6px] max-h-[6px] bg-divider w-full relative">
                        <div className={`${iconContentMap?.color} h-[6px] `} style={{ width: `${Math.min(step, PERCENT)}%` }}></div>
                        {isDefaultOrBlueType && <ChevronRightIcon className="absolute -right-[3px] -top-[0] !w-[3px] !h-[6px]" />}
                    </div>

                    {ltvRatio < 50 && (
                        <div className="max-w-[10px] max-h-[10px] flex">
                            <DangerIcon size="size_10" />
                        </div>
                    )}
                </section>
            </section>
            {isVisible && (
                <Modal title={CONTENT?.title_tooltip} visible={isVisible} onClose={toggleModal}>
                    <h1 className="text-md">{CONTENT.title}</h1>
                    <section className="mt-4 rounded border-[0.5px] border-divider bg-background-4 ">
                        {CONTENT?.content.map((item: string, key: number) => {
                            return (
                                <section key={item} className="flex justify-between m-3">
                                    <p className="text-sub text-md">{item}</p>
                                    <p className="text-main font-bold">
                                        {formatBalance(total?.[key], formatDecimals)} {QUOTE_ASSET_USDT}
                                    </p>
                                </section>
                            );
                        })}
                    </section>
                </Modal>
            )}
        </>
    );
};

export default Loans;
