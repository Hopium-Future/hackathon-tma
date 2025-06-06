import colors from '@/config/colors';
// import { TonClientProvider } from '@/context/ton-client-context';
import { cn, getPreviousSymbol } from '@/helper';
import { ROUTES } from '@/routing/router';
import '@/styles/advertise.css';
import '@/styles/animation.css';
// import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import { lazy, ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
// import AuthTon from '../Auth/AuthTon';
import Portal from '../common/portal';
import HumanRunIcon from '../icons/HumanRunIcon';
import LogoIcon from '../icons/LogoIcon';
import FlagIcon from '../icons/FlagIcon';
import { getUserInfoApi } from '@/apis/auth.api';
import useUserStore from '@/stores/user.store';
import TradeIcon from '../icons/TradeIcon';
import WebApp from '@twa-dev/sdk';
import DynamicItems from './DynamicItems';
import useProfileFeedStore from '@/stores/profileFeed.store';

type NavigatorItem = {
    _id: number;
    key: string;
    label: string;
    icon: ReactNode;
    parts: string;
};

const EarnIcon = lazy(() => import('@/components/icons/EarnIcon'));
const WalletIcon = lazy(() => import('@/components/icons/WalletIcon'));
// const ResultScreen = lazy(() => import('@/pages/Home/components/ResultScreen'));

const hiddenPaths = [ROUTES.HISTORY, ROUTES.DEPOSIT, ROUTES.WITHDRAW, ROUTES.PAYMENT_HISTORY, ROUTES.ONBOARDING, ROUTES.NOTIFICATION];
const shouldComingSoon: string | string[] = [];
const comingSoonImages = {
    [ROUTES.EARN]: 'earn',
    '/futures/BTCUSDT': 'feature',
    [ROUTES.DEPOSIT]: 'asset',
    [ROUTES.WITHDRAW]: 'asset'
};
const navigations: NavigatorItem[] = [
    {
        _id: 1,
        key: `/earn`,
        label: 'earn',
        icon: <EarnIcon className="size-5" />,
        parts: 'earn'
    },
    {
        _id: 2,
        key: '/futures/BTCUSDT',
        label: 'trade',
        icon: <TradeIcon className="size-5" />,
        parts: 'futures'
    },
    {
        _id: 3,
        key: ROUTES.FEED,
        label: '',
        icon: '',
        parts: ROUTES.FEED
    },
    {
        _id: 4,
        key: ROUTES.HALL,
        label: 'hall',
        icon: <FlagIcon className="size-5" />,
        parts: ROUTES.HALL
    },
    {
        _id: 5,
        key: '/wallet',
        label: 'wallet',
        icon: <WalletIcon className="size-5" />,
        parts: 'wallet'
    }
];

export default function PrivateLayout() {
    const location = useLocation();
    const [safeAreaInset, setSafeAreaInset] = useState(WebApp.safeAreaInset || { top: 0, bottom: 0 });

    useEffect(() => {
        const handleSafeAreaChange = () => {
            setSafeAreaInset({ ...WebApp.safeAreaInset });
        };
        console.log('WebApp', WebApp.MainButton.isVisible);
        WebApp.onEvent('contentSafeAreaChanged', handleSafeAreaChange);

        return () => {
            WebApp.offEvent('contentSafeAreaChanged', handleSafeAreaChange);
        };
    }, []);

    // const { setAssetPaymentResults, setJettonConfig } = usePaymentAssetStore();

    // const handleOnFinishTimer = async () => {
    //     if (!result) {
    //         // Handle case dont have result after: TODO
    //         try {
    //             if (turn?._id) {
    //                 const result = await getResultByIdApi(turn?._id);

    //                 setResult(result.data);

    //                 toggleModal();

    //                 setTimeout(() => {
    //                     toggleModal();
    //                 }, 4000);
    //             }
    //         } catch (error) {
    //             console.log('GET TURN BY ID ERROR', error);
    //         }
    //     } else {
    //         toggleModal();

    //         setTimeout(() => {
    //             toggleModal();
    //         }, 4000);
    //     }
    // };

    // Comment for demand
    // const fetchPaymentAssets = async () => {
    //     try {
    //         const res = await getPaymentAssetDeposit();
    //         if (res.data) {
    //             setAssetPaymentResults(res.data);
    //             const jettonConfig: JettonConfigType = {};
    //             (res.data || []).forEach((item: any) => {
    //                 jettonConfig[item.symbol as string] = {
    //                     address: Address.parse(item.address),
    //                     decimals: item.decimals,
    //                     contractAddress: Address.parse(item.contractAddress)
    //                 };
    //             });
    //             setJettonConfig(jettonConfig);
    //         }
    //     } catch (error) {
    //         throw new Error("Payment deposit fetch error");
    //     }
    // };

    // useEffect(() => {
    //     fetchPaymentAssets();
    // }, []);

    // useTimer(GAME_DURATION, handleOnFinishTimer);

    const isHiddenPath = hiddenPaths.includes(location.pathname);

    const { setUserInfo } = useUserStore();
    const setIsReload = useProfileFeedStore((state) => state.setIsReload);

    const renderFeedButton = useCallback(() => {
        const Icon = (
            <LogoIcon
                className={cn('size-[55px]', !location.pathname.includes(ROUTES.FEED) ? 'text-background-3' : 'text-pure-white')}
                logoColor={!location.pathname.includes(ROUTES.FEED) ? colors.disable : colors.pure.black}
            />
        );
        const styles = 'absolute left-1/2 -translate-x-1/2 -top-[10px] z-20 border-[0.5px] border-divider rounded-full';

        const isFeedPage = location.pathname.startsWith(ROUTES.FEED);

        return isFeedPage ? (
            <button className={styles} onClick={() => setIsReload(true)}>
                {Icon}
            </button>
        ) : (
            <Link to={ROUTES.FEED} className={styles}>
                {Icon}
            </Link>
        );
        //eslint-disable-next-line
    }, [location.pathname]);

    useEffect(() => {
        const getAllInfo = async () => {
            try {
                const userInfo = await getUserInfoApi();
                setUserInfo(userInfo.data);
            } catch (error) {
                console.log('Error getting user info', error);
            }
        };

        getAllInfo();
    }, []);

    return (
        <>
            {/* <TonConnectUIProvider
                manifestUrl="https://hopium.dev/tonconnect-manifest.json"
                uiPreferences={{ theme: THEME.DARK }}
                actionsConfiguration={{
                    twaReturnUrl: 'https://t.me/hopium_official_bot/join'
                }}
            >
                <TonClientProvider> */}
            {/* <AuthTon /> */}
            {/* <Outlet /> */}
            <div
                className={cn('h-full overflow-y-scroll w-full max-w-[390px] tall:max-w-lg mx-auto', {
                    'max-h-[calc(100vh-72px)]': !isHiddenPath
                })}
                style={{
                    paddingBottom: safeAreaInset.bottom,
                    paddingTop: safeAreaInset.top > 0 ? safeAreaInset.top + 36 : 0
                }}
            >
                <Outlet />
            </div>
            {!isHiddenPath ? (
                <div className="fixed bottom-0 z-[10] w-full">
                    <div
                        className={cn(
                            'relative',
                            "after:contents-[''] after:absolute after:size-20 after:left-1/2 after:-translate-x-1/2 after:-top-[20px] after:bg-background-2 after:rounded-full",
                            'grid grid-cols-5 bg-background-2 w-full font-bold'
                        )}
                        style={{ paddingBottom: safeAreaInset.bottom || 16 }}
                    >
                        {renderFeedButton()}

                        {navigations.map((item) => {
                            const isActive = item.parts.includes(location.pathname.split('/')[1]);
                            const route = item.key.includes('/futures') ? `/futures/${getPreviousSymbol()}` : item.key;

                            return (
                                <Link
                                    to={route}
                                    key={item._id}
                                    className={cn(
                                        'flex flex-col items-center gap-y-0.5 justify-normal pt-[13px]',
                                        {
                                            'text-main': isActive && item._id !== 3,
                                            'text-disable': !isActive
                                        },
                                        item._id !== 3 ? 'pb-0' : 'pb-2.5'
                                    )}
                                >
                                    {item.icon}
                                    <p className="font-medium uppercase">{item.label}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ) : null}
            {/* </TonClientProvider> */}
            {/* Handle show result */}
            {/* </TonConnectUIProvider> */}
            {shouldComingSoon.includes(location.pathname) && (
                <Portal>
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9,
                            backgroundImage: `url(/images/comingSoon/${comingSoonImages?.[location.pathname]}.png)`
                        }}
                        className="backdrop-filter backdrop-blur-lg"
                    >
                        <section className="flex flex-col gap-y-4 items-center">
                            <HumanRunIcon className="text-sub" />
                            <p className="text-sub text-3xl font-medium">COMING SOON</p>
                        </section>
                    </div>
                </Portal>
            )}
            <DynamicItems />
        </>
    );
}
