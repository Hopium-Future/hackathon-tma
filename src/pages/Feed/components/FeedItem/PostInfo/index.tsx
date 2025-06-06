import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import WebApp from '@twa-dev/sdk';

import ClockIcon from '@/components/icons/ClockIcon';
import ForwardIcon from '@/components/icons/ForwardIcon';
import StarIcon from '@/components/icons/StarIcon';
import LoadingIcon from '@/components/icons/LoadingIcon';
import ShareOrderSignalImageModal from '@/components/shared-ui/ShareOrderSignalImageModal';
import PostInfoStarSelect from './PostInfoStarSelect';
import { cn, formatBigNum, getTimeDistance } from '@/helper';
import { IPost, IPostReaction } from '@/type/feed.type';
import { getPostStarInvoiceLink, reactPostApi, sharePostApi } from '@/apis/feed.api';
import useUserStore from '@/stores/user.store';
import { OrderShareModalRef } from '@/pages/Futures/components/TradeHistory/Order/OrderShareModal';
import { POST_REACTIONS } from '@/helper/constant';
import LikeIcon from '@/components/icons/LikeIcon';
import DisLikeIcon from '@/components/icons/DisLikeIcon';
import useVibration from '@/hooks/useVibration';

interface IProps {
    post: IPost;
}
type IUserReaction = IPostReaction | 'share';
interface IReaction {
    type: IUserReaction;
    textActive: string;
    bgActive: string;
    icon: React.ReactElement;
    isActive: boolean | undefined;
    reactionQuantity: number;
}

const PostInfo = ({ post }: IProps) => {
    const { engagement, userReact, reactions, createdAt, id: postId, userId } = post;
    const [isShared, setShared] = useState(userReact?.isShare);
    const [totalShares, setTotalShares] = useState(reactions?.share || 0);
    const [userReactList, setUserReactList] = useState<IUserReaction[]>([]);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [stars, setStars] = useState(engagement?.stars || 0);
    const [openStarSelect, setOpenStarSelect] = useState(false);
    const [isSendingStar, setIsSendingStar] = useState(false);
    const { user: currentUser } = useUserStore();
    const { vibrate } = useVibration();
    const triggerShareRef = useRef<OrderShareModalRef>(null);
    const buttonStyles = 'flex items-center justify-center gap-1 py-1 px-[6px] rounded-[40px] min-w-[62px] bg-divider text-sub';
    const userReactions: IReaction[] = useMemo(
        () => [
            {
                type: POST_REACTIONS.LIKE,
                textActive: 'text-green-1',
                bgActive: 'bg-green-2',
                icon: <LikeIcon className="size-4 text-green-1" />,
                isActive: userReact?.isLike,
                reactionQuantity: reactions?.like ?? 0
            },
            {
                type: POST_REACTIONS.DISLIKE,
                textActive: 'text-red-1',
                bgActive: 'bg-red-2',
                icon: <DisLikeIcon className="size-4 text-red-1" />,
                isActive: userReact?.isDislike,
                reactionQuantity: reactions?.dislike ?? 0
            }
        ],
        [post]
    );

    const onSelectStar = async (star: number) => {
        setOpenStarSelect(false);
        setIsSendingStar(true);

        const res = await getPostStarInvoiceLink(postId, star);
        const invoiceLink = res.data.invoiceLink as string;

        WebApp.openInvoice(invoiceLink, (status) => {
            if (status === 'paid') {
                setStars((prev) => prev + star);
            }
            setIsSendingStar(false);
        });
    };

    const handleShareImageSuccess = useCallback(async () => {
        if (isShared) return;

        setShared(true);
        setTotalShares((prev) => prev + 1);
        const response = await sharePostApi(post.id);
        if (response.status !== 201) {
            setShared(false);
            setTotalShares((prev) => prev - 1);
            toast.error('Update share data failed');
        }
    }, [post, isShared]);
    const onReact = useCallback(
        async (type: IUserReaction) => {
            vibrate();
            if (userReactList.find((item) => item === type)) return;
            setUserReactList((prev) => [...prev, type]);
            const response = await reactPostApi({ postId, reaction: type });

            if (response.status !== 201) {
                setUserReactList((prev) => prev.filter((item) => type !== item));
                toast.error('React failed');
            }
        },
        [postId]
    );
    const renderStarButton = useCallback(() => {
        const isActive = userReact?.isStar || stars > 0;
        return (
            <button className={cn(buttonStyles, { 'bg-yellow-6': isActive })} onClick={isSendingStar ? undefined : () => setOpenStarSelect(true)}>
                {isSendingStar ? (
                    <LoadingIcon className="size-5" />
                ) : (
                    <>
                        <StarIcon className="size-4 text-yellow-1" />
                        <span className={cn({ 'text-yellow-1': isActive })}>{formatBigNum(stars, 1, true)}</span>
                    </>
                )}
            </button>
        );
    }, [stars, userReact, isSendingStar]);

    const renderShareButton = useCallback(() => {
        return (
            <button
                className={cn(buttonStyles, { 'bg-blue-2': isShared })}
                onClick={() => {
                    setOpenShareModal(true);
                    vibrate();
                    setTimeout(() => {
                        triggerShareRef.current?.onShare();
                    }, 1500);
                }}
            >
                <ForwardIcon className="size-4 text-blue-1" />
                <span className={cn({ 'text-blue-1': isShared })}>{formatBigNum(totalShares, 1, true)}</span>
            </button>
        );
    }, [reactions, isShared]);

    return (
        <div className="flex justify-between text-md font-medium relative">
            <div className={cn('flex items-center gap-1', openStarSelect && ' opacity-0')}>
                {currentUser?._id && currentUser?._id !== userId && renderStarButton()}
                {userReactions.map((item, idx) => {
                    const prevItem = userReactList.find((prev) => prev === item.type);
                    const isActive = prevItem ? true : item.isActive;
                    const reactionQuantity = item.reactionQuantity + (prevItem ? 1 : 0);

                    return (
                        <button
                            key={idx}
                            className={cn(buttonStyles, {
                                [item.bgActive]: isActive
                            })}
                            onClick={!isActive ? () => onReact(item.type) : undefined}
                        >
                            {item.icon}
                            <span className={isActive ? item.textActive : ''}>{reactionQuantity ? formatBigNum(reactionQuantity, 1, true) : 0}</span>
                        </button>
                    );
                })}
                {renderShareButton()}
            </div>

            <div className={`flex gap-1 items-center text-sub${openStarSelect ? ' opacity-0' : ''}`}>
                <ClockIcon className="size-4" />
                <span>{getTimeDistance(createdAt)}</span>
            </div>
            <ShareOrderSignalImageModal
                ref={triggerShareRef}
                open={openShareModal}
                post={post}
                onSuccess={handleShareImageSuccess}
                onFinished={() => setOpenShareModal(false)}
                onCancel={() => setOpenShareModal(false)}
            />
            {openStarSelect ? <PostInfoStarSelect onSelect={onSelectStar} onCancel={() => setOpenStarSelect(false)} /> : null}
        </div>
    );
};

export default memo(PostInfo);
