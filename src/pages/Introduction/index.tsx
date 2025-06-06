import Button from '@/components/common/Button';
import LogoIcon from '@/components/icons/LogoIcon';
import colors from '@/config/colors';
import { cn, formatNumber2 } from '@/helper';
import { DEFAULT_ROUTE } from '@/routing/router';
import useWalletStore from '@/stores/wallet.store';
import { useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

export const INTRODUCTION_BASE_ROUTE = '/introduction';
export const INTRODUCTION_ROUTE = {
    BASE: INTRODUCTION_BASE_ROUTE
};

const Introduction = () => {
    const navigate = useNavigate();

    const { dataWallet } = useWalletStore();
    const hopium = useMemo(() => dataWallet?.find((item: any) => item.assetId === 33), [dataWallet]);
    // const lusdt = useMemo(() => dataWallet?.find((item: any) => item.assetId === 23), [dataWallet]);

    return (
        <div className="bg-background-1 px-4 relative flex flex-col h-full">
            <section className="flex flex-col items-center flex-1 mt-[72px]">
                <p className="text-3xl font-bold uppercase">you are amazing!</p>
                <p className="mt-3 font-medium">Here is your reward</p>

                <div className="relative mt-[44px] w-full flex justify-center items-center">
                    <LazyLoadImage
                        alt="Hopium ticket"
                        className="absolute -top-[27px] left-1/2 -translate-x-1/2 w-[277px]"
                        height={216}
                        src="/images/star.png"
                        width={277}
                    />
                    {/* <LazyLoadImage
                        alt="ob"
                        className="w-[254px]"
                        height={235}
                        src="/images/ob.png"
                        width={254}
                    /> */}
                    <LogoIcon className={cn('size-[200px]', 'text-pure-white')} logoColor={colors.pure.black} />
                </div>

                <p className="mt-10 text-3xl font-bold text-center">{formatNumber2(hopium?.value || 0, 2)} HOPIUM</p>
            </section>

            <section className="h-fit pb-6">
                <Button variant="primary" className="h-[44px]" onClick={() => navigate(DEFAULT_ROUTE)}>
                    <span className="text-base font-bold text-pure-black uppercase flex-1">explore now</span>
                </Button>
            </section>
        </div>
    );
};

export default Introduction;
