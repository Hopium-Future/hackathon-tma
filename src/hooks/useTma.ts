import { useEffect, useState } from 'react';
import useWindowFocus from './useWindowFocus';
import WebApp from '@twa-dev/sdk';

const useTma = () => {
    const [isTma, setIsTma] = useState(true);
    const focus = useWindowFocus();

    useEffect(() => {
        const handleViewportChange = (data: {
            isStateStable: boolean;
        }) => {
            setIsTma(data.isStateStable);
        };

        const handleThemeChange = () => setIsTma(true);

        // on hide tab on telegram
        WebApp.onEvent("viewportChanged", handleViewportChange);

        // on relaunch app 
        WebApp.onEvent("themeChanged", handleThemeChange);

        return () => {
            // off hide tab on telegram
            WebApp.offEvent("viewportChanged", handleViewportChange);

            // off relaunch app 
            WebApp.offEvent("themeChanged", handleThemeChange);
        };
    }, []);

    useEffect(() => {
        setIsTma(focus);
    }, [focus]);

    return isTma;
};

export default useTma;