import { useEffect, useMemo, useState } from 'react';
import SyncIcon from '@/components/icons/SyncIcon';
import TextCopyable from '@/components/common/text-copyable';

import Card from '@/components/common/card';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAssetConfig, { assetConfigIdMapping } from '@/stores/payment.store';
import ArrowIcon from '@/components/icons/ArrowIcon';
import FileAltIcon from '@/components/icons/FileAltIcon';
import NetworkListModal from '@/components/shared-ui/NetworkListModal';
import AssetListModal from '@/components/shared-ui/AssetListModal';
import { ASSET } from '@/helper/constant';
import { getDespositAddress } from '@/apis/payment.api';
import { Address, Network } from '@/type/payment-config';
import LoadingIcon from '@/components/icons/LoadingIcon';
import Button from '@/components/common/Button';
import useFuturesConfig from '@/stores/futures.store';
import AssetLogo from '@/components/common/AssetLogo';
import { ROUTES } from '@/routing/router';

type State = {
    selectNetwork: null | Network;
    isShowNetworkModal: boolean;
    isShowAssetModal: boolean;
    address: null | Address;
    loadingAddress: boolean;
};

const initState = {
    selectNetwork: null,
    isShowNetworkModal: false,
    isShowAssetModal: false,
    address: null,
    loadingAddress: true
} as State;

const Deposit = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const assetId = searchParams.get('assetId') || 0;

    const [state, set] = useState(initState);
    const setState = (_state: Partial<State>) => set((prev) => ({ ...prev, ..._state }));

    const paymentConfigs = useAssetConfig((state) => state.paymentConfigs);
    const assetConfig = useFuturesConfig((state) => assetConfigIdMapping(state.assetsConfig));

    const paymentConfig = useMemo(() => paymentConfigs[assetId], [paymentConfigs, assetId]);

    useEffect(() => {
        if (!assetId) {
            navigate(`/deposit?assetId=${ASSET.USDT}`, {
                replace: true
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetId]);

    const onGetAddress = async ({ shouldCreate = true }: { shouldCreate?: boolean }) => {
        setState({ loadingAddress: true });
        let address = null;
        try {
            const res = await getDespositAddress({ assetId, network: state.selectNetwork?.network, shouldCreate });

            if (res?.data?.status === 'ok') {
                address = res.data?.data as Address;
            }
        } catch (error) {
            console.log('error:', error);
        }
        setState({ loadingAddress: false, address });
    };

    useEffect(() => {
        if (assetId && state.selectNetwork) {
            onGetAddress({ shouldCreate: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.selectNetwork, assetId]);

    useEffect(() => {
        if (assetId && paymentConfig) {
            const networks = paymentConfig.networkList;
            const defaultNetwork = networks.find((network) => network?.isDefault);
            setState({ selectNetwork: defaultNetwork || null });
        }
    }, [assetId, paymentConfig]);

    const renderAddressDeposit = useMemo(() => {
        if (!state.selectNetwork?.depositEnable) {
            return (
                <div className="font-medium text-txtSecondary dark:text-txtSecondary-dark">
                    Deposit of {state.selectNetwork?.coin} on {state.selectNetwork?.network} network is currently not supported.
                </div>
            );
        }

        return <TextCopyable text={state.address?.address || ''} className="flex items-center justify-between font-medium text-md" />;
    }, [state.selectNetwork, state.address]);

    const renderNotice = () => {
        return (
            <div className="mt-6 space-y-2 text-md">
                <div className="font-semibold">IMPORTANT NOTICE:</div>
                <div className="text-sub">These wallet addresses MAY CHANGE. Please do not use this address for other deposits. </div>
            </div>
        );
    };

    return (
        <section className="flex flex-col h-full px-4">
            <div className="mt-4">
                <div className="flex items-center justify-between ">
                    <ArrowIcon className="cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="text-2xl font-semibold uppercase">DEPOSIT</h1>
                    <Link to={ROUTES.PAYMENT_HISTORY + '?tab=deposit'} className="text-green-1">
                        <FileAltIcon />
                    </Link>
                </div>
                <section className="mt-4">
                    <div className="space-y-2">
                        <Card className="justify-between cursor-pointer" onClick={() => setState({ isShowAssetModal: !state.isShowAssetModal })}>
                            <div className="space-y-2">
                                <div className="text-sm text-sub">Token</div>
                                <div className="flex items-center space-x-2 text-lg">
                                    <AssetLogo assetId={+assetId} size={20} />

                                    <span>{assetConfig[+assetId]?.assetCode}</span>
                                </div>
                            </div>
                            <SyncIcon />
                        </Card>
                        <Card className="justify-between cursor-pointer" onClick={() => setState({ isShowNetworkModal: !state.isShowNetworkModal })}>
                            <div className="space-y-2">
                                <div className="text-sm text-sub">Network</div>
                                <div className="text-md">{state.selectNetwork?.name}</div>
                            </div>
                            <SyncIcon />
                        </Card>
                        {state.address?.address && state.address?.network === state.selectNetwork?.network && (
                            <Card className="block">
                                <div className="text-sm text-sub">Address</div>
                                <div className="w-full my-2 bg-divider h-[1px]" />
                                {renderAddressDeposit}
                            </Card>
                        )}

                        {state.selectNetwork?.memoRegex && state.address?.addressTag && (
                            <Card className="block">
                                <div className="text-sm text-sub">Memo</div>
                                <div className="w-full my-2 bg-divider h-[1px]" />
                                <TextCopyable text={state.address?.addressTag} className="flex items-center justify-between font-medium text-md" />
                            </Card>
                        )}
                    </div>

                    {renderNotice()}
                </section>
            </div>

            <AssetListModal
                onSelectAsset={(assetId) => {
                    setState({ isShowAssetModal: false });
                    setTimeout(
                        () =>
                            navigate(`/deposit?assetId=${assetId}`, {
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
                onSelectNetwork={(selectNetwork) => setState({ selectNetwork, isShowNetworkModal: false })}
            />

            {!state.address?.address && (
                <Button
                    onClick={() => onGetAddress({ shouldCreate: true })}
                    disabled={state.loadingAddress}
                    className="py-2 mt-auto mb-5 font-semibold uppercase tall:mb-6 h-11 "
                    variant="primary"
                >
                    <div className="flex items-center justify-center space-x-2">
                        <span>Reveal Address</span>
                        {state.loadingAddress && <LoadingIcon />}
                    </div>
                </Button>
            )}
        </section>
    );
};

export default Deposit;
