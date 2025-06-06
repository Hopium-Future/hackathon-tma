import { getListFollowers, unFollowUser, updateOnboardingUser } from '@/apis/onboard.api';
import Button from '@/components/common/Button';
import { TDataFollowOnboard } from '@/type/onboard.type';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FollowerItem from './components/FollowerItem';
import { followUser } from '@/apis/onboard.api';
import { cn } from '@/helper';
import { useNavigate } from 'react-router';
import UpperIcon from '@/components/icons/UpperIcon';
import EnergyIcon from '@/components/icons/EnergyIcon';
import StarIcon from '@/components/icons/StarIcon';

const Onboarding = () => {
    const [step, setStep] = useState(0);
    const handleNextStep = (num: number) => {
        setStep(num);
    };
    const [data, setData] = useState<TDataFollowOnboard[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const handleGetListFollowers = async () => {
            try {
                const res = await getListFollowers();
                if (res?.data) {
                    const parseList = res.data.map((item) => ({ ...item, isFollowing: false, lastFollower: item.followers || 0 }));
                    setData(parseList);
                }
            } catch (err) {
                console.log(err);
            }
        };
        handleGetListFollowers();
    }, []);
    const handleFollow = useCallback(
        async (follower: TDataFollowOnboard) => {
            const { isFollowing, _id: followerId } = follower;
            const res = isFollowing ? await unFollowUser(followerId) : await followUser(followerId);

            if (res?.data?.success) {
                setData((prev) => {
                    const newList = prev.map((item) =>
                        item._id === followerId
                            ? {
                                  ...item,
                                  isFollowing: !item.isFollowing,
                                  followers: isFollowing ? item.followers - 1 : (item.followers || 0) + 1
                              }
                            : item
                    );
                    return newList;
                });
            }
        },
        [data]
    );
    const renderStep = useMemo(() => {
        switch (step) {
            case 0: {
                return (
                    <div className="relative">
                        <img src="/images/onboard/step-1.1.png" className="w-full max-h-[calc(100vh-80px)] object-fit max-w-[390px] mx-auto" />
                        <div className="text-[#000000] absolute bottom-[10%] w-full text-center">
                            <p className="text-lg font-bold uppercase mb-1">
                                Scroll to Trade Perp <UpperIcon width={22} height={14} />
                            </p>
                            <p className="text-md">Copy & Counter your favorite</p>
                            <p className="text-md">traders seamlessly</p>
                        </div>
                    </div>
                );
            }
            case 1: {
                return (
                    <div className="relative">
                        <img src="/images/onboard/step-2.png" className="w-full max-h-[calc(100vh-80px)] mx-auto object-fit max-w-[390px]" />
                        <div className="text-white absolute bottom-[10%] w-full text-center">
                            <p className="text-lg text-[#3BD975] font-bold uppercase mb-1">
                                Call <EnergyIcon width={8} height={22} />
                            </p>
                            <p className="text-md">Sharing trades made simple</p>
                        </div>
                    </div>
                );
            }
            case 2: {
                return (
                    <div className="relative">
                        <img src="/images/onboard/step-3.png" className="w-full max-h-[calc(100vh-80px)] object-fit mx-auto max-w-[390px]" />
                        <div className="text-white absolute bottom-[10%] w-full text-center">
                            <p className="text-lg text-[#FFB629] font-bold uppercase flex items-center justify-center gap-x-1 mb-1">
                                Tip with stars <StarIcon width={15} height={20} />
                            </p>
                            <p className="text-md">Tip your favorite calls with</p>
                            <p className="text-md">Telegram Stars</p>
                        </div>
                    </div>
                );
            }
            case 3: {
                return (
                    <div className="flex flex-col items-center gap-y-6 h-content max-h-[calc(100vh-120px)] overflow-y-hidden">
                        <div className="flex items-center flex-col gap-y-1">
                            <p className="uppercase text-3xl text-main font-bold">Follow Callers</p>
                            <p className="text-sm font-normal text-sub">Follow at least 3 callers to start!</p>
                        </div>
                        <div className="px-4 flex flex-col gap-y-4 max-h-[80vh] overflow-y-auto">
                            {data.map((item) => (
                                <FollowerItem data={item} handleFollow={handleFollow} key={item?._id} />
                            ))}
                        </div>
                    </div>
                );
            }
        }
    }, [step, data]);

    const countFollow = useMemo(() => {
        return data.filter((item) => item.isFollowing).length;
    }, [data]);
    const updateOnboardUser = async () => {
        return await updateOnboardingUser();
    };
    const onClick = () => {
        if (step < 3) {
            handleNextStep(step + 1);
        } else {
            if (countFollow >= 3) {
                navigate('/feed');
                updateOnboardUser();
            }
        }
    };
    return (
        <div className="flex flex-col gap-y-3 pt-2.5 max-w-screen h-screen relative">
            {renderStep}
            <div className={cn('w-full px-3 pb-6', { 'flex items-center left-0 bottom-0 justify-center fixed bg-background-1 h-[86px]': step === 3 })}>
                <Button
                    variant={step === 3 ? (countFollow >= 3 ? 'primary' : 'disable') : 'primary'}
                    onClick={onClick}
                    className={cn('py-[13px] uppercase max-w-[calc(100vw-32px)]  w-full mx-auto ', {
                        'bg-background-2 border-[0.5px] border-solid border-divider text-disable': step === 3 && countFollow < 3
                    })}
                >
                    Next {step === 3 ? <span className="ml-1">(Followed {countFollow}/3)</span> : null}
                </Button>
            </div>
        </div>
    );
};

export default Onboarding;
