import NotificationIcon from '@/components/icons/NotificationIcon';
import styled from 'styled-components';

const BannerAlerts = () => {
    return (
        <div className="flex justify-center">
            <BackgroundCard className="flex items-center justify-center relative w-full">
                <div className="absolute inset-0 flex flex-col items-center pt-[37px] -z-[1]">
                    <div className="flex items-center space-x-2">
                        <NotificationIcon />
                        <h1 className="text-3xl font-bold">PRICE ALERTS</h1>
                        <NotificationIcon />
                    </div>
                    {/* <Text variant="secondary" className="text-sm max-w-[208px] text-center mt-1">
                        Create Alerts to Optimize Profits and Catch Opportunities
                    </Text> */}
                </div>
            </BackgroundCard>
        </div>
    );
};

const BackgroundCard = styled.div`
    background-image: url('/images/alerts/banner_alerts.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 114px;
    @media screen and (max-width: 640px) {
        background-size: cover;
    }
`;

export default BannerAlerts;
