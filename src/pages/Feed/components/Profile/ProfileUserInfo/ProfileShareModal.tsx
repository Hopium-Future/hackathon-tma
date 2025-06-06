import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import WebApp from '@twa-dev/sdk';

import ShareProfileImage from './ShareProfileImage';
import Modal from '@/components/common/modal';
import { ROUTES } from '@/routing/router';
import useUserStore from '@/stores/user.store';
import useProfileFeedStore from '@/stores/profileFeed.store';
import { cn, getProxyImageUrl, getRefLink } from '@/helper';

interface ProfileShareModalProps {
    open: boolean;
    onFinished: () => void;
    onCancel: () => void;
}

export interface ProfileShareModalRef {
    onShare: () => Promise<void>;
}

const ProfileShareModal = forwardRef<ProfileShareModalRef, ProfileShareModalProps>(({ open, onFinished, onCancel }, ref) => {
    const userStore = useUserStore.getState().user;
    const userProfileStore = useProfileFeedStore((state) => state.user);
    const earningStore = useProfileFeedStore((state) => state.earning);
    const imgRef = useRef<{ getFile: () => Promise<File | null | undefined> }>(null);
    const [avatarExt, setAvatarExt] = useState<string | null>(null);
    const goToBrowser = () => {
        const queryString = encodeURIComponent(
            JSON.stringify({
                user: {
                    username: userProfileStore?.username,
                    firstName: userProfileStore?.firstName,
                    lastName: userProfileStore?.lastName,
                    partnerType: userProfileStore?.partnerType,
                    following: userProfileStore?.following,
                    followers: userProfileStore?.followers || 0,
                    photoUrl: userProfileStore?.photoUrl,
                    referralCode: userStore?.referralCode || ''
                },
                earning: {
                    ...earningStore
                },
                avatarExt
            })
        );
        const baseUrl = `${document.location.origin}${ROUTES.SHARE_PROFILE}?params=${queryString}`;
        WebApp.openLink(baseUrl);
        onFinished();
    };

    const shareImage = async () => {
        if (!imgRef.current) return;
        try {
            const fileToShare = (await imgRef.current.getFile()) as File;
            const data = {
                files: [fileToShare],
                text: `Scrolling & Trading on @hopium_trade, the 1st Social Perp ever on Telegram.\n\n😎 Join me on #HOPIUM:\n ${getRefLink(
                    userStore?.referralCode || ''
                )}`
            };

            if (navigator.share && navigator.canShare(data)) {
                await navigator
                    .share(data)
                    .then(() => toast.success('Share Successfully!'))

                    .catch((err) => {
                        toast.error('Share Canceled');
                        console.log(err);
                    })
                    .finally(() => {
                        onFinished();
                    });
            } else {
                goToBrowser();
                onFinished();
            }
        } catch (error: any) {
            console.log(error);
            return;
        }
    };
    useImperativeHandle(ref, () => ({
        onShare: shareImage
    }));
    useEffect(() => {
        const fetchImageType = async () => {
            if (!userProfileStore?.photoUrl) return;
            try {
                const res = await fetch(getProxyImageUrl(userProfileStore.photoUrl));
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.startsWith('image')) return;
                let ext = contentType.split('/')[1] || userProfileStore.photoUrl.split('.').pop() || 'jpg';

                switch (ext) {
                    case 'svg+xml':
                        ext = 'svg';
                        break;
                    case 'jpeg':
                        ext = 'jpg';
                        break;
                    default:
                        break;
                }
                setAvatarExt(ext);
            } catch (error) {
                console.error(error);
            }
        };

        if (open) {
            fetchImageType();
        }
    }, [open, imgRef, onFinished, userProfileStore?.photoUrl]);

    return (
        <Modal visible={open} onClose={onCancel} isClose className={cn(open ? 'top-12' : '')} containerClassName="max-h-[calc(100vh-110px)] h-full">
            <ShareProfileImage ref={imgRef} avatarExt={avatarExt} earningStore={earningStore} userProfileStore={userProfileStore} />
        </Modal>
    );
});

export default ProfileShareModal;
