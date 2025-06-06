import { createWithdrawPayment } from '@/apis/withdraw.api';
import Button from '@/components/common/Button';
import FormInputNumber from '@/components/common/input';
import Drawer from '@/components/Drawer';
import ArrowIcon from '@/components/icons/ArrowIcon';
import CheckIcon from '@/components/icons/CheckIcon';
import CopyIcon from '@/components/icons/CopyIcon';
import DoubleCheckIcon from '@/components/icons/DoubleCheckIcon';
import ExternalLinkIcon from '@/components/icons/ExternalLinkIcon';
import FileAltIcon from '@/components/icons/FileAltIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import { cn, copyToClipboard, formatBalance, getAddressTonLink, getPathImageBuyAsset, shortenHexString } from '@/helper';
import { ASSET } from '@/helper/constant';
import usePaymentAssetStore from '@/stores/payment-asset.store';
import useUserStore from '@/stores/user.store';
import { useTonAddress } from '@tonconnect/ui-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type ContentKey = 'success' | 'error';

export default function WithdrawPage() {
    const navigate = useNavigate();
    const { assetPaymentResults } = usePaymentAssetStore();
    const assetPaymentWithdraw = assetPaymentResults.filter((item) => item.ableToWithdraw);
    const [margin, setMargin] = useState<number | undefined>(undefined);
    const [asset, setAsset] = useState<string>(assetPaymentWithdraw?.length > 0 ? assetPaymentWithdraw[0].symbol : 'usdt');
    const [assetId, setAssetId] = useState<number>(assetPaymentWithdraw[0].assetId || ASSET.USDT);
    const [isOpenAsset, setIsOpenAsset] = useState<boolean>(false);
    const { wallet } = useUserStore();
    const walletWithdraw = wallet[ASSET[asset.toUpperCase() as keyof typeof ASSET]] || {};
    const available = walletWithdraw.available;
    const address = useTonAddress(true);
    const [contentKey, setContentKey] = useState<ContentKey | null>(null);
    const transactionRef = useRef<null | any>(null);
    const [isCopied, setIsCopied] = useState(false);

    const decimal = useMemo(() => {
        if (assetPaymentWithdraw?.length === 0) return 0;
        const assetPaymentActive = assetPaymentWithdraw.find((item) => item.assetId === assetId);
        return assetPaymentActive?.decimals;
    }, [assetPaymentWithdraw, assetId]);

    const minWithdraw = useMemo(() => {
        const assetPayment = assetPaymentResults.find((item) => {
            return item.symbol === asset;
        });
        const minWithdrawAmount = assetPayment?.minWithdrawal;
        const feeWithdraw = assetPayment?.feeWithdrawal;
        if (!assetPayment) return 0;
        return minWithdrawAmount && feeWithdraw && minWithdrawAmount + feeWithdraw;
    }, [asset, assetPaymentResults]);

    const invalid = useMemo(() => {
        if (margin && Number(margin) > available) {
            return 'The balance in the wallet is not enough.';
        }
        if (minWithdraw && margin && margin < minWithdraw) {
            return `Minimum withdraw is ${minWithdraw} ${asset.toUpperCase()}`;
        }
        return '';
    }, [margin, available, minWithdraw, asset]);

    const isDisable = useMemo(() => !margin || !minWithdraw || margin < minWithdraw || margin > available, [margin, minWithdraw, available]);

    const backward = () => {
        navigate('/wallet');
    };

    const handleNavigateHistory = () => {
        navigate('/history?filter=withdraw');
    };

    const handleOnChange = (value: number) => {
        setMargin(value);
    };

    const handleOnClose = () => {
        setIsOpenAsset(false);
    };

    const handleOnCloseDrawer = () => {
        setContentKey(null);
    };

    const handleWithdraw = async () => {
        if (!margin) return;
        try {
            const payload = {
                asset,
                amount: Number(margin)
            };
            const res = await createWithdrawPayment(payload);
            if (res.data) {
                transactionRef.current = res.data;
                setContentKey('success');
            }
        } catch (error) {
            setContentKey('error');
            console.log(error);
        }
    };

    const handleSelectAsset = (asset: string, assetId: number) => {
        setIsOpenAsset(false);
        setAsset(asset);
        setAssetId(assetId);
    };

    const handleWithdrawMore = () => {
        setMargin(0);
        setContentKey(null);
    };

    const handleCopy = () => {
        if (transactionRef.current) copyToClipboard(transactionRef.current._id);
        setIsCopied(true);

        toast.success(
            <div className="text-sub flex gap-2 items-center bg-primary-2">
                <CheckIcon className="text-primary-1" /> Copied
            </div>,
            {
                autoClose: 1000,
                className: 'p-0 border shadow-copy !bg-primary-2 !border-primary-1 !max-w-[calc(100dvw-32px)] mx-auto',
                icon: false,

                hideProgressBar: true,
                closeButton: false,
                onClose: () => setIsCopied(false)
            }
        );
    };

    const Success = useCallback(() => {
        return (
            <div className="flex flex-col items-center mt-2 pb-5">
                <img src="/images/deposit/check_circle.png" alt="check icon" className="w-20 h-20" />
                <h1 className="text-2xl font-semibold mt-3">Withdrawal Processing</h1>
                <div className="w-full space-y-2 mt-6 text-sm">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-sub">Address</span>
                        <div className="flex items-center gap-x-1">
                            <span className="font-bold">{`${shortenHexString(address, 4, 4)}`}</span>
                            <Link to={getAddressTonLink(address)} target="_blank">
                                <ExternalLinkIcon className="size-4 text-primary-1" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <span className="text-sub">ID</span>
                        <div className="flex items-center gap-x-1">
                            <span className="font-bold">{`${shortenHexString(transactionRef.current?._id || '', 4, 4)}`}</span>
                            <button onClick={handleCopy}>
                                {isCopied ? <DoubleCheckIcon className="size-4 text-primary-1" /> : <CopyIcon className="size-4 text-primary-1" />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 w-full flex items-center gap-x-2">
                    <Button variant="secondary" className="mt-4" onClick={backward}>
                        <div className="text-base font-medium text-nowrap inline-block">Wallet</div>
                    </Button>
                    <Button variant="primary" className="mt-4" onClick={handleNavigateHistory}>
                        <div className="text-base font-medium text-nowrap inline-block">History</div>
                    </Button>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleWithdrawMore, transactionRef.current, isCopied]);

    const Errors = useCallback(() => {
        return (
            <div className="flex flex-col items-center mt-2 pb-5">
                <img src="/images/deposit/note-multiple.png" alt="check icon" className="w-20 h-20" />
                <h1 className="text-2xl font-semibold mt-3">Transaction error</h1>
                {/* <p className="text-sm font-normal mt-3">{errorMessageRef.current}</p> */}
                <div className="mt-8 w-full ">
                    <Button variant="primary" className="mt-4" onClick={handleWithdrawMore}>
                        <div className="text-base font-medium text-nowrap inline-block">Try again</div>
                    </Button>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleWithdrawMore]);

    const Contents = useMemo(
        () => ({
            success: transactionRef.current ? <Success /> : null,
            error: <Errors />
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }),
        [transactionRef.current, isCopied]
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
                <span className="font-bold text-lg">Withdraw</span>
                <button onClick={handleNavigateHistory}>
                    <FileAltIcon className="size-6" />
                </button>
            </div>
            <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between">
                    <span className="font-bold">Amount</span>
                    <div className="flex items-center gap-x-1 text-sm">
                        <span className="text-sub">Available:</span>
                        <span>{formatBalance(available, decimal)}</span>
                        <img src={getPathImageBuyAsset(assetId)} alt="Logo USDT" className="size-4 rounded-full" />
                    </div>
                </div>
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
            <div className="mt-4 space-y-1 p-3 bg-background-2">
                <p className="text-sub text-md">To your wallet</p>
                <p className="text-sm break-all">{address}</p>
            </div>
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-transparent px-4">
                <Button variant={isDisable ? 'disable' : 'primary'} className="mt-4" onClick={handleWithdraw} disabled={isDisable}>
                    <div className={cn('text-base font-medium text-nowrap inline-block', isDisable ? 'text-sub' : 'text-pure-white')}>Confirm Withdraw</div>
                </Button>
            </div>
            <Drawer isOpen={isOpenAsset} onClose={handleOnClose} className="text-center">
                <div className="mt-3 pb-5 space-y-4 flex flex-col items-center -mx-4">
                    {assetPaymentWithdraw.map((item) => (
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
            <Drawer isOpen={contentKey === 'success' || contentKey === 'error'} onClose={handleOnCloseDrawer} className="text-center">
                {contentKey ? Contents[contentKey] : null}
            </Drawer>
        </section>
    );
}
