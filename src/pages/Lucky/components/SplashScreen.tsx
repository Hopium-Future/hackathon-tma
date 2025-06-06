import { drawLotteryApi } from '@/apis/lottery.api';
import NoteMultiple from '@/components/icons/NoteMultipleIcon';
import { cn } from '@/helper';
import { LotteryResponse } from '@/type/lottery.type';
import { FC, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';

type SplashScreenProps = {
    isOpen: boolean;
    handleClose: () => void;
    handleLotteryData: (data: LotteryResponse) => void;
    handleOpenResult: () => void;
};

const SplashScreen: FC<SplashScreenProps> = ({ isOpen, handleLotteryData, handleClose, handleOpenResult }) => {
    const [out, setOut] = useState<boolean>(false);
    const [url, setUrl] = useState("");

    const reloadGif = () => {

        setTimeout(() => {
            setUrl("/images/lucky/lucky_box.gif");
        }, 0);
    };

    const handleFetchDraw = async () => {
        try {
            const result = await drawLotteryApi();

            if (result.data) {
                handleLotteryData(result.data);
            }

            setTimeout(() => {
                setOut(true);
                handleClose();
                handleOpenResult();
            }, 6000);
        } catch (error) {
            const err = error as Error;
            toast.error(
                <div className="text-sub flex gap-2 items-center bg-primary-2">
                    <NoteMultiple className='text-primary-1' /> {err.message}
                </div>,
                {
                    autoClose: 1000,
                    className: "p-0 border shadow-copy !bg-primary-2 !border-primary-1 !max-w-[calc(100dvw-32px)] mx-auto",
                    icon: false,
                    hideProgressBar: true,
                    closeButton: false,
                }
            );

            setOut(true);
            handleClose();
        }
    };

    useEffect(() => {

        if (isOpen) {
            reloadGif();
            handleFetchDraw();
        }

        return () => {
            setOut(false);
            setUrl('');
        };
    }, [isOpen]);

    return (
        <div id="lucky-modal-container" className={cn(isOpen && "two", out && "out")}>
            <div className="modal-background">
                <section className="flex flex-col items-center h-full">
                    <LazyLoadImage
                        className="object-cover mt-[42px]"
                        alt="box"
                        height={429}
                        src={url}
                        width={323}
                    />
                </section>
            </div>
        </div>
    );
};

export default (SplashScreen);