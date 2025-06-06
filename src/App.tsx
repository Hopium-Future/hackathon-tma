import React, { useEffect, useLayoutEffect } from 'react';
import AppRoutes from './routing/AppRoutes';
import { GA_MEASUREMENT_ID } from './config/app.config';
import WebApp from '@twa-dev/sdk';
import Toast from './components/common/toast';
import ReactGA from 'react-ga4';
import useFuturesConfig from './stores/futures.store';
import { FULLSCREEN_PLATFORMS } from './config/fullscreen.config';

const App = () => {
    useLayoutEffect(() => {
        if (GA_MEASUREMENT_ID) {
            ReactGA.initialize(GA_MEASUREMENT_ID);
        }

        WebApp.ready();
        WebApp.expand();
        if (!WebApp.isFullscreen && FULLSCREEN_PLATFORMS.includes(WebApp.platform)) {
            WebApp.requestFullscreen();
        }
        // TODO: temp comment for development
        // if (IS_PROD) {
        //     document.addEventListener('contextmenu', function (e) {
        //         e.preventDefault();
        //     });
        // }
    }, []);

    useEffect(() => {
        const detectKeyboardHeight = () => {
            const viewportHeight = WebApp.viewportStableHeight;
            const currentHeight = window.innerHeight;
            useFuturesConfig.getState().setKeyboardHeight(currentHeight - viewportHeight);
        };
        WebApp.onEvent('viewportChanged', detectKeyboardHeight);
        return () => {
            WebApp.offEvent('viewportChanged', detectKeyboardHeight);
        };
    }, []);

    return (
        <React.StrictMode>
            <AppRoutes />
            <Toast />
        </React.StrictMode>
    );
};

export default App;
