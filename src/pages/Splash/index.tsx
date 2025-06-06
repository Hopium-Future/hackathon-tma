import { getUserInfoApi } from '@/apis/auth.api';
import Button from '@/components/common/Button';
import { cn } from '@/helper';
import useUserStore from '@/stores/user.store';
import { FC, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

export const SPLASH_BASE_ROUTE = '/splash';
export const SPLASH_ROUTE = {
    BASE: SPLASH_BASE_ROUTE,
};

const Splash: FC = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useUserStore();
    useEffect(() => {
        const getDataUserInfo = async () => {
            const userInfo = await getUserInfoApi();
            setUserInfo(userInfo.data);
        };

        getDataUserInfo();
    }, []);

    const handleOnIntroduction = () => {
        navigate("/introduction");
    };
    return (
        <div className="h-full bg-background-1 px-4 relative flex flex-col">
            <section className={
                cn(
                    "flex flex-col items-center flex-1 justify-center",

                )
            }>
                <section className="flex flex-col items-center">
                    <LazyLoadImage
                        alt="Hopium ticket"
                        height={250}
                        src="/images/gift.png"
                        width={250}
                    />
                    <p className="mt-6 text-pure-white">
                        It's time to get rewarded!
                    </p>
                </section>
            </section>


            <section className="h-fit pb-6">
                <Button variant='primary' onClick={handleOnIntroduction} className="h-[44px]">
                    <span className="text-base font-bold text-pure-black uppercase">
                        Wow, open now
                    </span>
                </Button>
            </section>
        </div>
    );
};

export default Splash;