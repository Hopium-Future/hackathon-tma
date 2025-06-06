import { cn } from '@/helper';
import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';

interface PublicLayoutProps {
    children: React.ReactNode;
}

const PubicLayout = ({ children }: PublicLayoutProps) => {
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
        <div
            className={cn('h-full overflow-y-scroll w-full max-w-[390px] tall:max-w-lg mx-auto')}
            style={{
                paddingBottom: 44,
                paddingTop: safeAreaInset.top > 0 ? safeAreaInset.top + 52 : 0
            }}
        >
            {children}
        </div>
    );
};

export default PubicLayout;
