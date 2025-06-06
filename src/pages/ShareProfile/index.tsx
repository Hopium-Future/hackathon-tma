import { getQueryParam, getRefLink } from '@/helper';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import WebApp from '@twa-dev/sdk';
import Button from '@/components/common/Button';
import ShareProfileImage from '../Feed/components/Profile/ProfileUserInfo/ShareProfileImage';

const ShareOrder = () => {
    const orderRef = useRef<{ getFile: () => Promise<File | null | undefined> }>(null);
    const { user, earning, avatarExt } = useMemo(() => {
        const params = JSON.parse(decodeURIComponent(getQueryParam('params') || '') || '{}');
        return {
            user: params?.user,
            earning: params?.earning,
            avatarExt: params?.avatarExt
        };
    }, []);

    const [hiddenBtn, setHiddenBtn] = useState(false);

    const downloadFile = (file: File) => {
        try {
            const a = document.createElement('a');
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = `${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.log(error);
        }
    };
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const onShare = async () => {
        try {
            await orderRef.current?.getFile();
            const file = await orderRef.current?.getFile();
            if (!file) {
                return;
            }
            const data = {
                files: [file],
                text: `Scrolling & Trading on @hopium_trade, the 1st Social Perp ever on Telegram. \n\n😎 Join me on #HOPIUM:\n ${getRefLink(
                    user?.referralCode || ''
                )}`
            };
            if (navigator.share && navigator.canShare(data)) {
                navigator
                    .share(data)
                    .then(() => {
                        toast.success('Share Successfully!');
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error('Share Canceled');
                    })
                    .finally(() => {
                        WebApp.close();
                        window.close();
                    });
            } else {
                downloadFile(file);
            }
        } catch (error) {
            alert(error);
            onClose();
        }
    };
    const onClose = () => window.close();

    return (
        <div className="flex flex-col w-full h-full pt-5">
            <div className="sm:max-w-[390px] w-full h-full flex flex-col justify-between  m-auto bg-background-1 p-4">
                <ShareProfileImage userProfileStore={user} earningStore={earning} ref={orderRef} avatarExt={avatarExt} />
                {!hiddenBtn && (
                    <div className="h-20">
                        <Button
                            variant="primary"
                            ref={buttonRef}
                            className="mt-4 py-3"
                            onClick={() => {
                                setHiddenBtn(true);
                                onShare();
                            }}
                        >
                            Share now
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareOrder;
