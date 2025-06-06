import N3ErrorIcon from '@/components/icons/N3ErrorIcon';
import N3SuccessIcon from '@/components/icons/N3SuccessIcon';
import { ToastContainer } from 'react-toastify';
import WebApp from '@twa-dev/sdk';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

const Toast = () => {
    const [safeAreaInset, setSafeAreaInset] = useState(WebApp.safeAreaInset || { top: 0, bottom: 0 });

    useEffect(() => {
        const handleSafeAreaChange = () => {
            setSafeAreaInset({ ...WebApp.safeAreaInset });
        };
        WebApp.onEvent('contentSafeAreaChanged', handleSafeAreaChange);

        return () => {
            WebApp.offEvent('contentSafeAreaChanged', handleSafeAreaChange);
        };
    }, []);

    return (
        <ToastContainer
            closeButton={false}
            closeOnClick
            style={{
                top: safeAreaInset.top > 0 ? safeAreaInset.top + 52 : 8
            }}
            autoClose={3000}
            stacked
            hideProgressBar
            position="top-center"
            icon={({ type }) => {
                if (type === 'success') return <N3SuccessIcon width={14} />;
                if (type === 'error') return <N3ErrorIcon width={14} />;
                else return '';
            }}
        />
    );
};

export default Toast;
