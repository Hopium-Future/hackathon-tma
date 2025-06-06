import Card from '@/components/common/card';
import ArrowIcon from '@/components/icons/ArrowIcon';
import FileAltIcon from '@/components/icons/FileAltIcon';
import SyncIcon from '@/components/icons/SyncIcon';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAssetConfig, { assetConfigIdMapping } from '@/stores/payment.store';
import AssetListModal from '@/components/shared-ui/AssetListModal';
import NetworkListModal from '@/components/shared-ui/NetworkListModal';
import { ASSET } from '@/helper/constant';
import Button from '@/components/common/Button';
import AmountInput from './components/AmountInput';
import NetworkInfo from './components/NetworkInfo';
import { cn as classNames, countDecimals, eToNumber, formatNumber, getPreviousSymbol } from '@/helper';
import WithdrawSuccessModal from './components/WithdrawSuccessModal';
import { Network } from '@/type/payment-config';
import BaseInput from './components/BaseInput';
import useFuturesConfig from '@/stores/futures.store';
import { ROUTES } from '@/routing/router';
import useWalletStore from '@/stores/wallet.store';
import LoadingIcon from '@/components/icons/LoadingIcon';
import { WalletData } from '@/type/wallet.type';
import useWithdraw from './hooks/useWithdraw';
import useOrderCount from './hooks/useOrderCount';
import WarningIcon from '@/components/icons/WarningIcon';
import useMaxDepositUsd from './hooks/useMaxDepositUsd';

type State = {
    selectNetwork: null | Network;
    isShowNetworkModal: boolean;
    isShowAssetModal: boolean;
    isShowSuccessModal: boolean;
    amount: string;
    address: string;
    memo: string;
};

const initState = {
    selectNetwork: null,
    isShowNetworkModal: false,
    isShowAssetModal: false,
    isShowSuccessModal: false,
    amount: '',
    address: '',
    memo: ''
};

const isReggexTestValid = (reg: RegExp | string, value: string) => {
    const regExp = new RegExp(reg);
    if (!regExp) return false;
    return regExp.test(value);
};

const Withdraw = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const assetId = searchParams.get('assetId') || 0;
    const wallet = useWalletStore<WalletData[]>((state) => state.dataWallet);
    const paymentConfigs = useAssetConfig((state) => state.paymentConfigs);
    const assetConfig = useFuturesConfig((state) => assetConfigIdMapping(state.assetsConfig));

    const [state, set] = useState<State>(initState);
    const setState = (_state: Partial<State>) => set((prev) => ({ ...prev, ..._state }));

    const { isWithdrawing, onWithdraw } = useWithdraw();
    const { isLoading: isLoadingOrderCount, orderCount } = useOrderCount();
    const { maxDeposit, isLoading: isLoadingMaxDeposit } = useMaxDepositUsd(assetId);

    const paymentConfig = useMemo(() => paymentConfigs[assetId], [paymentConfigs, assetId]);

    useEffect(() => {
        if (!assetId) {
            navigate(`/withdraw?assetId=${ASSET.USDT}`, {
                replace: true
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetId]);

    useEffect(() => {
        if (assetId && paymentConfig) {
            const networks = paymentConfig.networkList;
            const defaultNetwork = networks.find((network) => network?.isDefault);
            setState({ selectNetwork: defaultNetwork || null });
        }
    }, [assetId, paymentConfig]);

    const assetBalance = useMemo(() => {
        if (!wallet) return 0;
        const assetWallet = wallet?.find((w) => +(w?.assetId || 0) === +assetId);
        if (!assetWallet) return 0;
        const balance = assetWallet?.value - assetWallet?.lockedValue || 0;
        return balance < 0 ? 0 : balance;
    }, [wallet, assetId]);

    const isNetworkNeedMemo = state.selectNetwork?.memoRegex;

    const assetCode = assetConfig[+assetId]?.assetCode;
    const assetDigit = assetConfig[+assetId]?.assetDigit;
    const withdrawMin = +(state.selectNetwork?.withdrawMin || 0);
    const withdrawMax = +(state.selectNetwork?.withdrawMax || 0);
    const withdrawFee = +(state.selectNetwork?.withdrawFee || 0);

    const isAddressValid = useMemo(() => {
        return isReggexTestValid(state.selectNetwork?.addressRegex || '', state.address);
    }, [state.address, state.selectNetwork]);

    const isMemoValid = useMemo(() => {
        return isReggexTestValid(state.selectNetwork?.memoRegex || '', state.memo);
    }, [state.memo, state.selectNetwork]);

    const amountValidator = useMemo(() => {
        let isValid = true,
            msg = '';

        const decimalLimit = countDecimals(+eToNumber(+(state.selectNetwork?.withdrawIntegerMultiple || 0)));

        if (!state.amount) {
            return {
                isValid: false,
                msg: ''
            };
        }

        if (+state.amount > assetBalance) {
            return { isValid: false, msg: 'Insufficient Balance' };
        }

        if (+state.amount < +withdrawMin) {
            isValid = false;
            msg = `Min: ${formatNumber(withdrawMin, assetDigit)} ${assetCode}`;
        }

        if (+state.amount > +withdrawMax) {
            isValid = false;
            msg = `Max: ${formatNumber(withdrawMax, assetDigit)} ${assetCode}`;
        }

        if (decimalLimit && countDecimals(+state.amount) > decimalLimit) {
            isValid = false;
            msg = `Please enter amount with no more than ${decimalLimit} decimal places`;
        }

        return {
            isValid,
            msg
        };
    }, [state.amount, state.selectNetwork, assetCode, assetDigit, assetBalance, withdrawMin, withdrawMax]);

    const receiveAmount = +state.amount - withdrawFee;

    const isHasOrderCount = !isLoadingOrderCount && orderCount > 0;

    const isWithdrawEnable = state.selectNetwork?.withdrawEnable;

    const isDisabled =
        (+assetId === ASSET.USDT && (isLoadingMaxDeposit || !maxDeposit?.canWithdraw)) ||
        isLoadingOrderCount ||
        isHasOrderCount ||
        !state.selectNetwork ||
        !amountValidator.isValid ||
        !isAddressValid ||
        !isMemoValid ||
        !receiveAmount ||
        receiveAmount < 0 ||
        !isWithdrawEnable;

    const onWithdrawHandler = async () => {
        if (!state.selectNetwork) return;
        await onWithdraw({
            assetId: +assetId,
            amount: +state.amount,
            network: state.selectNetwork?.network,
            address: state.address,
            memo: state.memo || undefined,
            successCb: () => setState({ isShowSuccessModal: true })
        });
    };

    const warningsCount = useMemo(() => {
        let count = 0;
        if (!maxDeposit.canWithdraw) {
            count++;
        }
        if (isHasOrderCount) {
            count++;
        }
        if (state.selectNetwork && !isWithdrawEnable) {
            count++;
        }
        return count;
    }, [maxDeposit, isHasOrderCount, state.selectNetwork, isWithdrawEnable]);

    return (
        <section className="flex flex-col justify-between h-full px-4">
            <div className="overflow-y-auto ">
                <div className="sticky top-0 z-10 flex items-center justify-between py-4 bg-background-1 ">
                    <ArrowIcon className="cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-2xl font-semibold uppercase">WITHDRAW</h1>
                    <Link to={ROUTES.PAYMENT_HISTORY + '?tab=withdraw'} className="text-green-1">
                        <FileAltIcon />
                    </Link>
                </div>
                <section className="space-y-5">
                    <AmountInput
                        amount={state.amount}
                        assetCode={assetCode}
                        assetBalance={assetBalance}
                        assetDigit={assetDigit}
                        assetId={+assetId}
                        setAmount={(amount) => setState({ amount: amount })}
                        networkInfo={state.selectNetwork}
                        amountValidator={amountValidator}
                        showAssetListModal={() => setState({ isShowAssetModal: true })}
                    />

                    {/* Address input */}
                    <BaseInput
                        label="Recipient's address"
                        errorMsg=" Invalid withdrawal wallet address"
                        inputPlaceholder="Enter the Recipient's address"
                        isValid={isAddressValid}
                        onChange={(address: string) => setState({ address })}
                        value={state.address}
                    />

                    {/* Memo input */}
                    {isNetworkNeedMemo && (
                        <BaseInput
                            label="MEMO"
                            errorMsg=" Invalid memo"
                            inputPlaceholder="Enter the Recipient's MEMO"
                            isValid={isMemoValid}
                            onChange={(memo: string) => setState({ memo })}
                            value={state.memo}
                        />
                    )}

                    <div>
                        <Card
                            className={classNames('justify-between py-3 space-x-3 cursor-pointer', {
                                // 'border border-red-1 ': state.selectNetwork && !isWithdrawEnable
                            })}
                            onClick={() => setState({ isShowNetworkModal: !state.isShowNetworkModal })}
                        >
                            <div className="space-y-2">
                                <div className="text-md text-sub">Network</div>
                                <div className="font-medium text-md">{state.selectNetwork?.name}</div>
                            </div>
                            <SyncIcon />
                        </Card>
                    </div>
                    {warningsCount ? (
                        <Card className="block py-3 mt-6 space-y-2 bg-yellow-2 border-0.5 border-yellow-1 text-md">
                            <div className="flex items-center space-x-2 text-base font-semibold text-yellow-1">
                                <WarningIcon size="xs" />
                                <span>WARNING</span>
                            </div>
                            <ul
                                className={classNames('space-y-2  text-sub', {
                                    'pl-4 list-disc': warningsCount >= 2
                                })}
                            >
                                {state.selectNetwork && !isWithdrawEnable && (
                                    <li>
                                        Withdraw
                                        of {state.selectNetwork?.coin} on {state.selectNetwork?.network} network is
                                        currently not supported.
                                    </li>
                                )}

                                {!maxDeposit.canWithdraw && maxDeposit.maxDepositUsdToWithdraw && (
                                    <li className="space-x-1">
                                        You need to deposit at least
                                        ${formatNumber(maxDeposit.maxDepositUsdToWithdraw, 2)} to be able to withdraw
                                        this asset.
                                    </li>
                                )}

                                {isHasOrderCount && (
                                    <li className="space-x-1">
                                        <span>You need to close all positions before withdrawing assets.</span>
                                        <Link to={`/futures/${getPreviousSymbol()}?tab=position`}
                                              className="font-semibold text-yellow-1">
                                            Go to Position
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </Card>
                    ) : null}
                </section>
            </div>

            <div className="sticky top-0 mt-8 mb-5 tall:mb-6 ">
                <NetworkInfo assetCode={assetCode} assetDigit={assetDigit} receiveAmount={receiveAmount}
                             withdrawMin={withdrawMin} withdrawFee={withdrawFee} />
                <Button onClick={onWithdrawHandler} disabled={isDisabled || isWithdrawing}
                        className="py-2 font-semibold uppercase h-11" variant={'primary'}>
                    <div className="flex items-center justify-center space-x-2">
                        <span>Withdraw</span>
                        {isWithdrawing && <LoadingIcon />}
                    </div>
                </Button>
            </div>

            <AssetListModal
                onSelectAsset={(assetId) => {
                    setState({ isShowAssetModal: false, amount: '', address: '', memo: '' });
                    setTimeout(
                        () =>
                            navigate(`/withdraw?assetId=${assetId}`, {
                                replace: true
                            }),
                        100
                    );
                }}
                currentAsset={+assetId}
                visible={state.isShowAssetModal}
                onClose={() => setState({ isShowAssetModal: false })}
            />

            <NetworkListModal
                networkList={paymentConfig?.networkList || []}
                visible={state.isShowNetworkModal}
                onClose={() => setState({ isShowNetworkModal: false })}
                selectNetwork={state.selectNetwork}
                onSelectNetwork={(selectNetwork) => setState({
                    selectNetwork,
                    address: '',
                    memo: '',
                    isShowNetworkModal: false
                })}
            />

            <WithdrawSuccessModal onClose={() => setState({ isShowSuccessModal: false })}
                                  visible={state.isShowSuccessModal} />
        </section>
    );
};

export default Withdraw;
