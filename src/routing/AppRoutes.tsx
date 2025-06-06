import AuthWrapper from '@/components/Auth/AuthWrapper';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';
import { SPLASH_ROUTE } from '@/pages/Splash';
import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { BASE_ALL_ROUTE, ROUTES } from './router';
const ShareOrder = lazy(() => import('@/pages/ShareOrder'));
const PrivateRoutes = lazy(() => import('./PrivateRoutes'));
const Alerts = lazy(() => import('@/pages/Alerts'));
const ShareProfile = lazy(() => import('@/pages/ShareProfile'));

const App = () => (
    <Suspense fallback={<LoadingScreen />}>
        <AuthWrapper>
            <Outlet />
        </AuthWrapper>
    </Suspense>
);

const AppRoutes: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.SHARE_ORDER} element={<ShareOrder />} />
                <Route path={ROUTES.SHARE_PROFILE} element={<ShareProfile />} />
                <Route element={<App />}>
                    <Route path={ROUTES.ALERTS} element={<Alerts />} />
                    <Route path={BASE_ALL_ROUTE} element={<PrivateRoutes />} />
                    <Route index element={<Navigate to={SPLASH_ROUTE.BASE} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
 
export default AppRoutes;
