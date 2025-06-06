import Button from '@/components/common/Button';
import BotIcon from '@/components/icons/BotIcon';
import { useMemo, useState } from 'react';
import Countdown, { CountdownRenderProps, zeroPad } from 'react-countdown';

const timeout = 1000 * 8 * 60 * 60;
const Completionist = () => <span>Claim 500 HOPIUM</span>;

const renderer =
    ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {
            // Render a countdown
            return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
        }
    };


const Bot = () => {
    const [isClaiming, setIsClaiming] = useState(false);
    const count = useMemo(() => Date.now() + timeout, [isClaiming]);
    const handleToggleClaimed = () => {
        setIsClaiming(!isClaiming);
    };

    const handleClaim = () => {
        handleToggleClaimed();
    };

    return (
        <>
            <section className="flex flex-col justify-center items-center gap-3">
                <BotIcon className="size-20" />
                <p className="text-2xl font-bold text-main">Bot Auto</p>
                <p className="text-base text-main">Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.</p>
            </section>

            <Button variant={isClaiming ? "disable" : "primary"} className="mt-6 duration-300 ease-in-out" onClick={handleClaim}>
                <span className="text-base font-bold text-pure-white">
                    {
                        !isClaiming ? "Start" :
                            <div>
                                Claiming in <Countdown
                                    date={count}
                                    intervalDelay={0}
                                    precision={3}
                                    renderer={renderer}
                                />
                            </div>
                    }
                </span>
            </Button>
        </>
    );
};

export default Bot;