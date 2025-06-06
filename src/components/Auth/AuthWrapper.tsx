import { addReferralApi, loginApi } from '@/apis/auth.api';
import baseAxios from '@/apis/base.api';
import { getInitData, getQueryParam, parseStartParam } from '@/helper';
import useSubscribeToSpotTrade from '@/hooks/useSubscribeToSpotTrade';
import useUserSocket from '@/hooks/useUserSocket';
import useWalletSocket from '@/hooks/useWalletSocket';
import useFuturesConfig from '@/stores/futures.store';
import usePaymentConfig from '@/stores/payment.store';
import usePriceSocket from '@/stores/priceSocket.store';
import useUserStore from '@/stores/user.store';
import useWalletStore from '@/stores/wallet.store';
import { AlertSettings, User, UserBalance } from '@/type/auth.type';
import WebApp from '@twa-dev/sdk';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../Loading/LoadingScreen';
import { ROUTES, DEFAULT_ROUTE } from '@/routing/router';
import { fetchSettingsAlert } from '@/apis/alerts.api';
import { addUserToGroupTelegram } from '@/apis/notification.api';

const AuthWrapper: FC<PropsWithChildren> = ({ children }) => {
    const { initData: initDataWallet, setWalletData } = useWalletStore();

    const { user, setUser, setToken, setIsNew } = useUserStore();
    const [showSplashScreen, setShowSplashScreen] = useState(!user);
    const navigate = useNavigate();
    // Setup sub balance
    useUserSocket();
    const { initPriceSocket } = usePriceSocket();
    const { setHopiumBalance, setUserSettings, setShowProfileModal } = useUserStore();
    const { getPairsConfig, getAssetsConfig, getTickers, getFavoritePairs, getFeesConfig } = useFuturesConfig();
    const location = useLocation();
    const { getPaymentConfig, getCategoryConfig } = usePaymentConfig();

    // useEventSocket(SOCKET_TOPIC.PVP_ACCEPTED, setAccecpted);
    // useEventSocket(SOCKET_TOPIC.PVP_ENDED, setResult);
    useWalletSocket((data: { [x: number]: UserBalance }) => {
        if (Object.keys(data).includes('33') && data['33'].assetId === 33) {
            setHopiumBalance(data['33'].value);
        }
        setWalletData(data);
    });

    // useEventSocket(SOCKET_TOPIC.SPOT_TRADE, (data) => {
    //     console.log('daa', data);
    // });

    // useEventSocket(SOCKET_TOPIC.PRICE_UPDATED, (data: number) => {
    //     setPrice(data);
    // });

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = await loginApi(`${getInitData()}`);

                if (result) {
                    baseAxios.interceptors.request.use((config) => {
                        config.headers.Authorization = `Bearer ${result.data.token}`;
                        // config.headers.Authorization = `tma account1`;
                        return config;
                    });
                }

                const userData = result.data.user as User;

                setUser(userData);
                setToken(result.data.token);
                setIsNew(result.data.isNew);
                initDataWallet();


                const initRoute = location.pathname === '/' ? DEFAULT_ROUTE : `${location.pathname}?${getQueryParam()}`;
                userData.isOnboarding === true ? navigate(initRoute) : navigate(ROUTES.ONBOARDING);
                const tgWebApp = WebApp;
                const initData = tgWebApp.initDataUnsafe;
                const startParam = initData.start_param || getQueryParam('startapp') || '';
                const params = parseStartParam(startParam);
                console.log('startParam', startParam, params);
                if (params.linkCode) {
                    addReferralApi(params.linkCode);
                }

                if (params.group && isFinite(parseInt(params.group))) {
                    addUserToGroupTelegram({ chatId: params.group });
                }

                if (params.route) {
                    switch (params.route) {
                        case 'profile':
                            navigate(ROUTES.FEED);
                            setShowProfileModal(true, parseInt(params.userId));
                            break;
                        case 'trade':
                            navigate(`/futures/${params.pair}?side=${params.side}`);
                            break;
                        default:
                            break;
                    }
                }
            } catch (error) {
                WebApp.close();
            } finally {
                setShowSplashScreen(false);
            }
        };

        baseAxios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    WebApp.showAlert('Session expired. Please refresh your app.');
                    WebApp.close();
                }
                return Promise.reject(error);
            }
        );

        if (!user) fetch();
    }, []);

    const getAlertSettings = async () => {
        const settings = (await fetchSettingsAlert('get'))?.data as AlertSettings;
        setUserSettings({ alert: { ...settings, TELEGRAM: !!settings.TELEGRAM } });
    };

    useEffect(() => {
        if (!user) return;
        getPairsConfig();
        initPriceSocket();
        getAssetsConfig();
        getTickers();
        getFavoritePairs();
        getPaymentConfig();
        getCategoryConfig();
        getFeesConfig();
        getAlertSettings();
    }, [user]);

    useSubscribeToSpotTrade();

    return !user || showSplashScreen ? <LoadingScreen /> : <>{children}</>;
};

export default AuthWrapper;
