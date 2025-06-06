import { tonConnectApi, tonGeneratePayloadApi } from '@/apis/wallet.api';
import useDisconnectWallet from '@/hooks/useDisconnectWallet';
import useUserStore from '@/stores/user.store';
import { useIsConnectionRestored, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CloseIcon from '../icons/CloseIcon';

const payloadTTLMS = 1000 * 60 * 15;

const AuthTon = () => {
    const [tonConnectUI] = useTonConnectUI();
    const isConnectionRestored = useIsConnectionRestored();
    const tonWallet = useTonWallet();
    const interval = useRef<ReturnType<typeof setInterval> | undefined>();
    const disconnect = useDisconnectWallet();
    const { user, setUser } = useUserStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isConnectionRestored) {
            return;
        }

        if (user?.tonAddress) return;

        const main = async () => {
            clearInterval(interval.current);

            if (!tonWallet) {
                const refreshPayload = async () => {
                    tonConnectUI.setConnectRequestParameters({ state: 'loading' });

                    const value = await tonGeneratePayloadApi();
                    if (!value) {
                        tonConnectUI.setConnectRequestParameters(null);
                    } else {
                        tonConnectUI.setConnectRequestParameters({
                            state: 'ready',
                            value
                        });
                    }
                };

                // refreshPayload();
                interval.current = setInterval(refreshPayload, payloadTTLMS);
                return;
            }

            if (tonWallet.connectItems?.tonProof && !('error' in tonWallet.connectItems.tonProof)) {
                try {
                    const user = await tonConnectApi(tonWallet.connectItems.tonProof.proof, tonWallet.account);
                    setUser(user);
                } catch (error: any) {
                    disconnect();
                    navigate('/task');

                    toast.error(
                        <div className="text-sub flex gap-2 items-center bg-primary-2">
                            <CloseIcon className="text-primary-1" /> {error.message}
                        </div>,
                        {
                            autoClose: 1000,
                            className: 'p-0 border shadow-copy !bg-primary-2 !border-primary-1 !max-w-[calc(100dvw-32px)] mx-auto',
                            icon: false,

                            hideProgressBar: true,
                            closeButton: false
                        }
                    );
                }
            } else {
                disconnect();
                navigate('/task');
            }
        };

        main();
    }, [tonWallet, isConnectionRestored]);
    return null;
};

export default AuthTon;
