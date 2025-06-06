import Button from '@/components/common/Button';
import FormInputNumber from '@/components/common/input';
import Drawer from '@/components/Drawer';
import ArrowIcon from '@/components/icons/ArrowIcon';
import DoubleCheckIcon from '@/components/icons/DoubleCheckIcon';
import ExternalLinkIcon from '@/components/icons/ExternalLinkIcon';
import FileAltIcon from '@/components/icons/FileAltIcon';
import LoadingIcon from '@/components/icons/LoadingIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import { cn, formatBalance, getAddressTonLink, getPathImageBuyAsset, getTxhTonLink, parseUnits, shortenHexString } from '@/helper';
import { ASSET } from '@/helper/constant';
import useJestonWalletData from '@/hooks/useJestonWallet';
import { useTonConnect } from '@/hooks/useTonConnect';
import usePaymentAssetStore from '@/stores/payment-asset.store';
import useUserStore from '@/stores/user.store';
import { JettonWallet } from '@/web3/ton/JettonWallet';
import { waitForTransaction } from '@/web3/ton/utils';
import { Cell, JettonMaster, Sender, toNano } from '@ton/ton';
// import useTonBalance from "@/hooks/useTonBalance";
import { SendTransactionResponse, UnknownAppError, UnknownError, UserRejectsError, useTonAddress } from '@tonconnect/ui-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type TransactionResult = {
    hash: string;
    amountIn?: number;
    amountOut?: number;
    timestamp?: number;
};

type ContentKey = 'success' | 'error' | 'loading';

export default function DepositPage() {
    const { assetPaymentResults, jettonConfig } = usePaymentAssetStore();
    const assetPaymentDeposit = assetPaymentResults.filter((item) => item.ableToDeposit);
    const defaultSymbol = assetPaymentDeposit?.length > 0 ? assetPaymentDeposit[0].symbol : 'usdt';
    const address = useTonAddress(true);
    const intervalRef = useRef<undefined | number>(undefined);
    const transactionRef = useRef<null | TransactionResult>(null);
    const errorMessageRef = useRef('');
    const { tonClient, walletAddress, sender } = useTonConnect();
    const [margin, setMargin] = useState<number | undefined>(undefined);
    const [contentKey, setContentKey] = useState<ContentKey | null>(null);
    const [asset, setAsset] = useState<string>(defaultSymbol);
    const [assetId, setAssetId] = useState<number>(assetPaymentDeposit[0].assetId || ASSET.USDT);
    const [isOpenAsset, setIsOpenAsset] = useState<boolean>(false);
    const { formattedBalance: balance, refetch: refetchBalance } = useJestonWalletData(asset);
    const { getBalance } = useUserStore();

    const assetPaymentActive = useMemo(() => {
        return assetPaymentDeposit.find((item) => item.assetId === assetId);
    }, [assetId, assetPaymentDeposit]);

    const decimal = assetPaymentActive?.decimals || 0;

    const navigate = useNavigate();

    const backward = () => {
        navigate('/wallet');
    };

    const handleNavigateHistory = () => {
        navigate('/history?filter=deposit');
    };

    const invalid = useMemo(() => {
        if (margin && Number(margin) > balance) {
            return 'The balance in the wallet is not enough.';
        }
        return '';
    }, [margin, balance]);

    const isDisable = useMemo(() => !margin || (margin && margin > balance), [margin, balance]);

    const handleOnChange = (value: number) => {
        setMargin(value);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleDeposit = async () => {
        if (!tonClient || !walletAddress || !margin) return;
        const config = jettonConfig[asset];
        const addressReceive = config.contractAddress;
        const amountIn = parseUnits(margin.toString(), config.decimals);

        try {
            let hash: string = '';
            const customSender: Sender = {
                send: async (args) => {
                    const result = (await sender.send(args)) as unknown as SendTransactionResponse;
                    hash = Cell.fromBase64(result.boc).hash().toString('base64');
                },
                address: walletAddress
            };
            const queryId = Date.now();
            const jettonMaster = tonClient.open(JettonMaster.create(config.address));
            const userJestonAddress = await jettonMaster.getWalletAddress(walletAddress);
            const jettonWallet = tonClient.open(JettonWallet.createFromAddress(userJestonAddress));

            await jettonWallet.sendTransfer(customSender, {
                fwdAmount: toNano('0.045'),
                queryId,
                jettonAmount: amountIn,
                toAddress: addressReceive,
                value: toNano('0.055')
            });

            setContentKey('loading');

            if (hash) {
                try {
                    const txn = await waitForTransaction(
                        {
                            walletAddress,
                            refetchLimit: 60 * 5,
                            queryId
                        },
                        tonClient
                    );

                    if (!txn) throw new Error('Transaction not found');
                    transactionRef.current = {
                        amountIn: margin,
                        hash: txn.hash().toString('hex')
                    };
                } catch (error) {
                    throw new Error('Transaction not found');
                }
            }

            setContentKey('success');
            refetchBalance();
            getBalance();
        } catch (error: any) {
            let reason = '';
            if (error instanceof UserRejectsError) {
                reason = 'Transfer request failed, please try again.';
            } else if (error.message === 'function_unavailable') {
                reason = 'function_unavailable';
            } else if (error instanceof UnknownError || error instanceof UnknownAppError) {
                reason = 'Something went wrong. Please try again later!';
            }

            setContentKey('error');
            errorMessageRef.current = reason ? reason : 'Something went wrong. Please try again later!';
        }
    };

    const handleOnCloseDrawer = () => {
        setContentKey(null);
    };

    const handleOnClose = () => {
        setIsOpenAsset(false);
    };

    const handleDepositMore = () => {
        setMargin(0);
        handleOnCloseDrawer();
    };

    const handleSelectAsset = (asset: string, assetId: number) => {
        setIsOpenAsset(false);
        setAsset(asset);
        setAssetId(assetId);
    };

    const Loading = useCallback(() => {
        return (
            <div className="mt-2 space-y-3 pb-5">
                <LoadingIcon className="size-20 duration-100" />
                <h1 className="text-2xl font-bold">Loading</h1>
                <p>Deposit request is being processed, please wait...</p>
            </div>
        );
    }, [contentKey]);

    const Success = useCallback(() => {
        return (
            <div className="flex flex-col items-center mt-2 pb-5">
                <img src="/images/deposit/check_circle.png" alt="check icon" className="w-20 h-20" />
                <h1 className="text-2xl font-semibold mt-3">Transaction Successful</h1>
                <div className="w-full space-y-2 mt-6 text-sm">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-sub">Address</span>
                        <div className="flex items-center gap-x-1">
                            <span className="font-bold">{`${shortenHexString(jettonConfig[asset].address.toString(), 4, 4)}`}</span>
                            <Link to={getAddressTonLink(jettonConfig[asset].address.toString())} target="_blank">
                                <ExternalLinkIcon className="size-4 text-primary-1" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <span className="text-sub">TxH</span>
                        <div className="flex items-center gap-x-1">
                            <span className="font-bold">{`${shortenHexString(transactionRef.current?.hash || '', 4, 4)}`}</span>
                            <Link to={(transactionRef.current?.hash && getTxhTonLink(transactionRef.current?.hash)) || '/'} target="_blank">
                                <ExternalLinkIcon className="size-4 text-primary-1" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 w-full flex items-center gap-x-2">
                    <Button variant="secondary" className="mt-4" onClick={backward}>
                        <div className="text-base font-medium text-nowrap inline-block">Wallet</div>
                    </Button>
                    <Button variant="primary" className="mt-4" onClick={handleDepositMore}>
                        <div className="text-base font-medium text-nowrap inline-block">Deposit more</div>
                    </Button>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleDepositMore, transactionRef.current]);

    const Errors = useCallback(() => {
        return (
            <div className="flex flex-col items-center mt-2 pb-5">
                <img src="/images/deposit/note-multiple.png" alt="check icon" className="w-20 h-20" />
                <h1 className="text-2xl font-semibold mt-3">Transaction error</h1>
                <p className="text-sm font-normal mt-3">{errorMessageRef.current}</p>
                <div className="mt-8 w-full ">
                    <Button variant="primary" className="mt-4" onClick={handleDepositMore}>
                        <div className="text-base font-medium text-nowrap inline-block">Try again</div>
                    </Button>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleDepositMore, errorMessageRef.current]);

    const Contents = useMemo(
        () => ({
            success: transactionRef.current ? <Success /> : null,
            error: errorMessageRef.current ? <Errors /> : null,
            loading: <Loading />
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }),
        [transactionRef.current, errorMessageRef.current]
    );

    const Suffix = () => {
        return (
            <button className="space-x-1" onClick={() => setIsOpenAsset(true)}>
                <span>{asset.toUpperCase()}</span>
                <PlayIcon className="size-3 text-sub" />
            </button>
        );
    };

    return (
        <section className="mt-6 px-4">
            <div className="flex items-center justify-between">
                <button onClick={backward}>
                    <ArrowIcon className="size-6" />
                </button>
                <span className="font-bold text-lg">Deposit</span>
                <button onClick={handleNavigateHistory}>
                    <FileAltIcon className="size-6" />
                </button>
            </div>
            <div className="mt-4">
                <span>Amount</span>
                <FormInputNumber
                    placeholder="Enter amount"
                    size={'md'}
                    className="caret-primary-1"
                    wrapperClassInput="bg-background-2"
                    suffix={<Suffix />}
                    suffixClassName="font-normal text-sub"
                    errorMessage={invalid}
                    value={margin}
                    onChange={(values) => handleOnChange(values.floatValue || 0)}
                    decimal={decimal}
                />
            </div>

            <div className="flex flex-col items-start p-3 mt-4 bg-background-2 font-normal">
                <span className="text-md text-sub">From your wallet</span>
                <div className="mt-1 text-sm break-all">{address}</div>
                <div className="mt-2 flex items-center gap-x-1">
                    <span className="text-sub text-md">Available:</span>
                    <div className="flex items-center gap-x-1">
                        <span className="text-md">{formatBalance(balance, decimal)}</span>
                        <img src={getPathImageBuyAsset(assetId)} alt="Logo USDT" className="w-3 h-3 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-transparent px-4">
                <Button variant={isDisable ? 'disable' : 'primary'} className="mt-4" onClick={handleDeposit} disabled={isDisable as boolean}>
                    <div className={cn('text-base font-medium text-nowrap inline-block', isDisable ? 'text-sub' : 'text-pure-white')}>Confirm Deposit</div>
                </Button>
            </div>
            <Drawer isOpen={isOpenAsset} onClose={handleOnClose} className="text-center">
                <div className="mt-3 pb-5 space-y-4 flex flex-col items-center -mx-4">
                    {assetPaymentDeposit.map((item) => (
                        <button
                            className="flex items-center justify-between w-full hover:bg-background-3 -mx-4 px-4"
                            onClick={() => handleSelectAsset(item.symbol, item.assetId)}
                        >
                            <div className="flex items-center gap-x-2">
                                <img className="size-7" src={getPathImageBuyAsset(item.assetId)} />
                                <span className="text-lg font-bold">{item.symbol.toUpperCase()}</span>
                            </div>
                            {asset === item.symbol && <DoubleCheckIcon className="size-5 text-primary-1" />}
                        </button>
                    ))}
                </div>
            </Drawer>
            <Drawer
                isOpen={contentKey === 'success' || contentKey === 'error' || contentKey === 'loading'}
                onClose={contentKey !== 'loading' ? () => handleOnCloseDrawer() : undefined}
                className="text-center"
            >
                {contentKey ? Contents[contentKey] : null}
            </Drawer>
        </section>
    );
}
