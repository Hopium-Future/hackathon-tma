import { LazyLoadImage } from 'react-lazy-load-image-component';

const Success = () => {
    return (
        <>
            <p className="text-3xl mt-10 font-bold">
                You are amazing!
            </p>
            <p className="mt-3">
                Here is your $HOPIUM reward
            </p>
            <LazyLoadImage
                className="mt-12"
                alt="Hopium ticket"
                height={200}
                // effect="blur"
                src="/images/bg_hopium.gif"
                width={249}
            />
            <p className="text-4xl text-center mt-8">
                {/* {formatNumber(userInfo.hopium)} */}
            </p>
            <p className="mt-3">
                Thanks for your time on Telegram
            </p>
        </>
    );
};

export default Success;