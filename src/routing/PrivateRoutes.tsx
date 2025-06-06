import { FC, lazy, ReactNode, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import SuspenseView from '@/components/Suspense/SuspenseView';
import { ROUTES } from './router';
import CampaignDetail from '@/pages/Campaign/detail';
import Onboarding from '@/pages/Onboarding';
const PrivateLayout = lazy(() => import('@/components/layout/PrivateLayout'));
// const Introduction = lazy(() => import('@/pages/Introduction'));
const Invite = lazy(() => import('@/pages/Invite'));
const Wallet = lazy(() => import('@/pages/Wallet'));
const Hall = lazy(() => import('@/pages/Hall'));
// const Splash = lazy(() => import('@/pages/Splash'));
const Home = lazy(() => import('@/pages/Home'));
const Earn = lazy(() => import('@/pages/Earn'));
const Ranking = lazy(() => import('@/pages/Ranking'));
const Lucky = lazy(() => import('@/pages/Lucky'));
const Task = lazy(() => import('@/pages/Task'));
const PvP = lazy(() => import('@/pages/PvP'));
const Deposit = lazy(() => import('@/pages/Deposit/deposit'));
const Withdraw = lazy(() => import('@/pages/Withdraw/withdraw'));
const History = lazy(() => import('@/pages/History'));
const TransactionDetail = lazy(() => import('@/components/TransactionDetail'));
const PaymentHistory = lazy(() => import('@/pages/PaymentHistory'));
const Futures = lazy(() => import('@/pages/Futures'));
const Feed = lazy(() => import('@/pages/Feed'));
// FOR TESTING Only, remove on production
const TestSocket = lazy(() => import('@/pages/TestSocket'));
const Notification = lazy(() => import('@/pages/Notification'));

const routeHasLayout: IRoute[] = [
    {
        path: ROUTES.HOME,
        page: <Home />,
        loading: true
    },
    {
        path: ROUTES.EARN,
        page: <Earn />,
        loading: true
    },
    {
        path: ROUTES.HALL,
        page: <Hall />,
        loading: true
    },
    {
        path: ROUTES.CAMPAIGN_DETAIL,
        page: <CampaignDetail />,
        loading: true
    },
    {
        path: ROUTES.FUTURES,
        page: <Futures />,
        loading: true
    },
    {
        path: ROUTES.RANKING,
        page: <Ranking />,
        loading: true
    },
    {
        path: ROUTES.LUCKY,
        page: <Lucky />,
        loading: true
    },
    {
        path: ROUTES.TASK,
        page: <Task />,
        loading: true
    },
    {
        path: ROUTES.INVITE,
        page: <Invite />,
        loading: true
    },
    {
        path: ROUTES.WALLET,
        page: <Wallet />,
        loading: true
    },
    {
        path: ROUTES.PVP,
        page: <PvP />,
        loading: true
    },
    {
        path: ROUTES.DEPOSIT,
        page: <Deposit />,
        loading: true
    },
    {
        path: ROUTES.WITHDRAW,
        page: <Withdraw />,
        loading: true
    },
    {
        path: ROUTES.HISTORY,
        page: <History />,
        loading: true
    },
    {
        path: ROUTES.PAYMENT_HISTORY,
        page: <PaymentHistory />,
        loading: true
    },
    {
        path: ROUTES.TRANSACTION_DETAIL,
        page: <TransactionDetail />,
        loading: true
    },
    {
        path: ROUTES.FEED,
        page: <Feed />,
        loading: true
    },

    // FOR TESTING Only, remove on production
    {
        path: ROUTES.TEST_SOCKET,
        page: <TestSocket />,
        loading: true
    },
    {
        path: ROUTES.ONBOARDING,
        page: <Onboarding />,
        loading: true
    },
    {
        path: ROUTES.NOTIFICATION,
        page: <Notification />,
        loading: true
    }
];

// const routes: IRoute[] = [
//     {
//         path: '/',
//         page: <Navigate to="/splash" />
//     },
//     {
//         path: '/splash',
//         page: <Splash />,
//         loading: true
//     },
//     {
//         path: '/introduction',
//         page: <Introduction />
//     },
//     {
//         path: 'onboarding',
//         page: <Onboarding />
//     }
// ];

export interface IRoute {
    path: string;
    page: ReactNode;
    loading?: boolean;
}

const renderRoutes = (routes: IRoute[]) =>
    routes.map(({ path, page, loading }) => {
        const element = loading ? <Suspense fallback={<SuspenseView />}>{page}</Suspense> : page;
        return <Route key={`${path}`} path={path} element={element} />;
    });

const PrivateRoutes: FC = () => {
    return (
        <Routes>
            <Route element={<PrivateLayout />}>{renderRoutes(routeHasLayout)}</Route>
            {/* {renderRoutes(routes)} */}
        </Routes>
    );
};

export default PrivateRoutes;
