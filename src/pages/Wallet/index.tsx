import { lazy, useMemo, useState } from 'react';

import { formatBalance } from '@/helper';

import { useNavigate } from 'react-router-dom';

import InfoIcon from '@/components/icons/Info';

import TransactionButton from './components/Button/Transaction';
import AssetTable from './components/Table';

import Modal from '@/components/common/modal';

import useWalletStore from '@/stores/wallet.store';
import { AssetData } from '@/type/wallet.type';
import { ASSET_ID_USDT, QUOTE_ASSET_USDT, ASSET_ID_C_USDT } from './constants';
import useUserStore from '@/stores/user.store';
import TextCopyable from '@/components/common/text-copyable';

const AssetListModal = lazy(() => import('@/components/shared-ui/AssetListModal'));
const Loans = lazy(() => import('@/pages/Wallet/components/Loans'));
const Search = lazy(() => import('@/pages/Wallet/components/Search'));

interface BalanceInfoProps {
    label: string;
    value?: string | any;
    tooltip?: boolean;
    highlight?: boolean;
    type?: TypeProps;
}

type TypeProps = 'available' | 'locked';
type TransactionType = 'deposit' | 'withdraw' | '';
interface InitStateType {
    modalState: {
        isVisible: boolean;
        type: string;
    };
    modalTransactionType: TransactionType;
}
const CONTENT: Record<TypeProps, { title_tooltip: string; title: string; content?: string[] }> = {
    available: {
        title_tooltip: 'AVAILABLE',
        title: 'This represents the total amount of your usable USDT',
        content: ['Personal', 'Borrowable', 'C-USDT']
    },
    locked: {
        title_tooltip: 'LOCKED',
        title: 'This represents total amount of your locked USDT',
        content: ['Personal', 'Borrowed', 'Borrowable', 'C-USDT']
    }
};

const INIT_STATE: InitStateType = {
    modalState: {
        isVisible: false,
        type: ''
    },
    modalTransactionType: ''
};

const PERCENT = 100;
const USDT_DECIMAL_PLACES = 2;

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();

    const { balance, dataWallet, liquidation, amountBorrowed, borrowable, maxLoan } = useWalletStore((state) => ({
        balance: state.balance,
        available: state.available,
        dataWallet: state.dataWallet,
        liquidation: state.liquidation,
        amountBorrowed: state.amountBorrowed,
        borrowable: state.borrowable,
        maxLoan: state.maxLoan
    }));

    const [modalState, setModalState] = useState(INIT_STATE.modalState);
    const [modalTransactionType, setModalTransactionType] = useState<TransactionType>(INIT_STATE.modalTransactionType);

    const toggleModal = () => setModalState(INIT_STATE.modalState);

    const toggleModalTransactionType = (type: TransactionType) => {
        setModalTransactionType(modalTransactionType.length > 0 ? INIT_STATE.modalTransactionType : type);
    };

    const isTransactionDeposit = modalTransactionType === 'deposit';
    const isTransactionWithdraw = modalTransactionType === 'withdraw';

    const totalBalance = formatBalance(Math.max(balance, 0), USDT_DECIMAL_PLACES);

    const handleModal = (modal: { type: TypeProps }) => {
        setModalState((prev) => ({ isVisible: !prev?.isVisible, type: modal.type }));
    };

    const contentModal = modalState?.isVisible && CONTENT?.[modalState?.type as keyof typeof CONTENT];

    const BalanceDivider = () => <p className="border-[0.5px] w-[1px] border-divider" />;

    const usdtWallet = useMemo(() => {
        return dataWallet?.find((f: AssetData) => f.assetId === ASSET_ID_USDT);
    }, [dataWallet]);

    const C_USDTValue = useMemo(() => {
        return dataWallet?.find((f: AssetData) => f.assetId === ASSET_ID_C_USDT) || 0;
    }, [dataWallet]);

    const calculators = useMemo(() => {
        const totalImmediateBalance = (usdtWallet?.value || 0) - (usdtWallet?.lockedValue || 0);
        // const borrowableAmount = immediateBalance - amountBorrowed;
        const lockedValue = usdtWallet?.lockedValue || 0;
        const value = usdtWallet?.value || 0;
        const ownAmount = Math.max(Math.min(lockedValue, value), 0);

        const marginLock = ownAmount + amountBorrowed + Math.max(borrowable, 0);

        const usdtAvailable = Math.min(marginLock, Math.max(usdtWallet?.value, 0));
        const usdtBorrowedAmount = Math.min(maxLoan, lockedValue - usdtAvailable);
        const C_USDTTotal = Math.min(marginLock - usdtAvailable - usdtBorrowedAmount, Math.max(C_USDTValue.value - C_USDTValue.lockedValue, 0));

        const usdtValue = Math.min(lockedValue, Math.max(usdtWallet?.value || 0, 0));
        const remainingLoan = +maxLoan - Math.min(maxLoan, lockedValue - usdtValue);

        const C_USDTAvailable = Math.max((C_USDTValue?.value || 0) - (C_USDTValue?.lockedValue || 0) - (C_USDTTotal || 0), 0);
        const borrowedLoan = Math.max(lockedValue - usdtWallet?.value - (C_USDTValue?.value - C_USDTValue.lockedValue), 0);

        return {
            available: [Math.max(totalImmediateBalance, 0), Math.max(remainingLoan, 0), C_USDTAvailable], // lUSDTAvailable = 0
            locked: [ownAmount, usdtBorrowedAmount, Math.max(borrowable, 0), C_USDTTotal],
            borrowedLoan: borrowedLoan
        };
    }, [usdtWallet, amountBorrowed, borrowable, maxLoan, C_USDTValue.value, C_USDTValue.lockedValue]);

    const ltvRatio = useMemo(() => {
        const borrowedLoan = calculators?.borrowedLoan || 0;
        if (borrowedLoan === 0) return PERCENT;

        return (+liquidation > 0 ? (liquidation - borrowedLoan) / borrowedLoan : 0) * PERCENT;
    }, [calculators.borrowedLoan, liquidation]);

    const renderContent = (value: string) => {
        return <p className="text-white text-md font-bold whitespace-nowrap">{value}</p>;
    };

    const BalanceHeader = () => (
        <>
            <section className="flex justify-between items-center">
                <h1 className="text-sm text-sub">Estimated Balance</h1>
                <div className="text-sm text-sub flex cursor-pointer gap-x-1 items-center">
                    <p>UID:</p>
                    <TextCopyable className="text-white" text={user?._id} iconClassName={'text-green-1'} iconSize="size-3" />
                </div>
            </section>
            <p className="mt-1 text-green-1 text-2xl font-bold">
                {totalBalance} {QUOTE_ASSET_USDT}
            </p>
            <div className="border-[0.5px] border-divider my-4" />
        </>
    );
    const BalanceInfo = ({ label, value, tooltip = false, type }: BalanceInfoProps) => (
        <div className="flex justify-between" key={type}>
            <section className="flex flex-col gap-y-1 w-full">
                <section
                    className="text-sub text-sm flex gap-x-1 items-center cursor-pointer"
                    onClick={() => {
                        if (type) {
                            handleModal({ type });
                        }
                    }}
                >
                    <p>{label}</p>
                    {tooltip && <InfoIcon size="xs" />}
                </section>

                {renderContent(value)}
            </section>
            {label !== 'Loans' && <BalanceDivider />}
        </div>
    );

    const BalanceDetails = () => (
        <>
            <section className="grid grid-cols-3 gap-x-2">
                {BalanceInfo({
                    label: 'Available',
                    value: `${formatBalance(Math.max(calculators.available[0] + calculators.available[1] + calculators.available[2], 0), USDT_DECIMAL_PLACES)} ${QUOTE_ASSET_USDT}`,
                    tooltip: true,
                    type: 'available'
                })}
                {BalanceInfo({
                    label: 'Locked',
                    value: `${formatBalance(Math.max(calculators.locked[0] + calculators.locked[1] + calculators.locked[2] + calculators.locked[3], 0), USDT_DECIMAL_PLACES)} ${QUOTE_ASSET_USDT}`,
                    tooltip: true,
                    type: 'locked'
                })}
                <Loans formatDecimals={USDT_DECIMAL_PLACES} />
            </section>
            {ltvRatio < 20 && <section className="text-red-1 text-sm mt-3">Your assets are soon to be liquidated</section>}
        </>
    );

    const renderAvailable = () => (
        <section className="p-3 bg-background-2 rounded ring-0.5 ring-divider">
            {BalanceHeader()}
            {BalanceDetails()}
        </section>
    );

    const renderTransaction = () => {
        return (
            <section className="mt-4 flex gap-x-1">
                <TransactionButton type="Deposit" onClick={() => toggleModalTransactionType('deposit')}>
                    DEPOSIT
                </TransactionButton>
                <TransactionButton type="Withdraw" onClick={() => toggleModalTransactionType('withdraw')}>
                    WITHDRAW
                </TransactionButton>
                {/* <TransactionButton type="Withdraw" onClick={() => navigate('/history')}>
                    HISTORY
                </TransactionButton> */}
            </section>
        );
    };

    const renderCardInfo = () => {
        if (!contentModal || !contentModal.content) return null;
        const calculator = calculators[modalState.type as keyof typeof calculators];
        if (!calculator) return null;

        return (
            <section className="mt-4 rounded border-[0.5px] border-divider bg-background-4 ">
                {contentModal?.content.map((item: string, key: number) => {
                    return (
                        <section key={item} className="flex justify-between m-3">
                            <p className="text-sub text-md">{item}</p>
                            <p className="text-main font-bold">
                                {Array.isArray(calculator) && formatBalance(calculator?.[key], USDT_DECIMAL_PLACES)} {QUOTE_ASSET_USDT}
                            </p>
                        </section>
                    );
                })}
            </section>
        );
    };

    const renderModalContent = () => {
        if (!modalState.isVisible || !contentModal) return null;

        return (
            <>
                <h1 className="text-md">{contentModal.title}</h1>
                {renderCardInfo()}
            </>
        );
    };

    const renderFilter = () => {
        return (
            <section className="mt-8 flex justify-between">
                <h1 className="text-main text-md leading-[22px] font-bold">ASSET LIST</h1>
                <Search />
            </section>
        );
    };

    return (
        <>
            <section className="m-4">
                {renderAvailable()}
                {renderTransaction()}
                {renderFilter()}
                <AssetTable wallet={dataWallet} />
            </section>
            {modalState.isVisible && contentModal && (
                <Modal title={contentModal?.title_tooltip} visible={modalState.isVisible} onClose={toggleModal}>
                    {renderModalContent()}
                </Modal>
            )}
            {isTransactionDeposit && (
                <AssetListModal
                    visible={isTransactionDeposit}
                    onClose={() => {
                        toggleModalTransactionType('deposit');
                    }}
                    onSelectAsset={(assetId) => {
                        navigate(`/deposit?assetId=${assetId}`);
                    }}
                />
                // <DepositTypesModal
                //     visible={isTransactionDeposit}
                //     onClose={() => {
                //         toggleModalTransactionType('deposit');
                //     }}
                //     onSelectAsset={(assetId) => {
                //         navigate(`/deposit?assetId=${assetId}`);
                //     }}
                // />
            )}
            {isTransactionWithdraw && (
                <AssetListModal
                    visible={isTransactionWithdraw}
                    onClose={() => {
                        toggleModalTransactionType('withdraw');
                    }}
                    onSelectAsset={(assetId) => {
                        navigate(`/withdraw?assetId=${assetId}`);
                    }}
                />
            )}
        </>
    );
};

export default ProfilePage;
