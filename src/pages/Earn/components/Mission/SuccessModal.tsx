import AssetLogo from '@/components/common/AssetLogo';
import Button from '@/components/common/Button';
import CloseIcon from '@/components/icons/CloseIcon';
import { cn, formatNumber2 } from '@/helper';
import useModalStore from '@/stores/success.modal.store';
import useUserStore from '@/stores/user.store';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';


const SuccessModal: FC = () => {
    
    const { isOpen, handleClose } = useModalStore();

    const [out, setOut] = useState<boolean>(false);
    const { taskClaimed } = useUserStore();
    const handleOut = () => {
        setOut(true);

        setTimeout(() => {
            handleClose();
        }, 500);
    };

    useEffect(() => {
        if (!isOpen) {

            setTimeout(() => {
                setOut(false);
            }, 500);

        }

        return () => setOut(false);
    }, [isOpen]);

    const navigate = useNavigate();
    const handleToEarn = () => {
        handleOut();

        setTimeout(() => {
            navigate(`/futures/BTCUSDT`);
        }, 0);
    };

    const asset = useMemo(() => {
        if (taskClaimed?.assetId === 33) return "HOPIUM";
        if (taskClaimed?.assetId === 564) return "TON";
    }, [taskClaimed]);

    return (
        <div id="success-modal-container" className={cn(isOpen && "two", out && "out")}>
            <div className="success-modal-background flex flex-col items-center justify-center">
                <section className="max-h-[400px] w-[340px] content p-4 border border-divider bg-background-4 rounded-lg relative">
                    <LazyLoadImage
                        className="absolute top-[20px] left-8 z-10 w-[263px] h-[296px]"
                        alt="flame"
                        height={263}
                        src={
                            "/images/flame.png"
                        }
                        width={296}

                    />
                    <div className="flex items-center justify-end textbox">
                        <button className="" onClick={handleOut}>
                            <CloseIcon className="text-pure-white" />
                        </button>
                    </div>
                    <div className="text-4xl font-bold uppercase text-center text-green-1 title">CONGRATS!</div>
                    <div
                        className="logo w-full flex flex-col justify-center items-center bg--seven__success-modal size-[234px] relative"
                    >
                        <AssetLogo assetId={taskClaimed?.assetId || 33} size={100}/>
                        <div className="mt-4 uppercase font-bold text-3xl absolute bottom-[22px] left-1/2 -translate-x-1/2 flex items-center w-full justify-center">+{formatNumber2(taskClaimed?.value)} {asset}</div>
                    </div>
                    <Button variant='primary' className="w-full h-[44px] p-0 button font-bold text-base mt-[18.2px] uppercase" onClick={handleToEarn}>
                        Trade more
                    </Button>

                </section>
            </div>
        </div>
    );
};

export default memo(SuccessModal);