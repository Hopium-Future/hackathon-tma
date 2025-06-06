import { memo } from 'react';
import UserInfo from './UserInfo';
import TradingInfo from './TradingInfo';
import PostInfo from './PostInfo';
import { IPost } from '@/type/feed.type';
import { cn } from '@/helper';
interface IProps {
    post: IPost;
    hasUserInfo?: boolean;
    className?: string;
    onFollow?: (isFollowing: boolean, id: number) => void;
}
const FeedItem = ({ post, onFollow, hasUserInfo = true, className }: IProps) => {
    return (
        <div className={cn('p-2 border border-divider rounded-2xl bg-grey-2 shadow-feed', className)}>
            {hasUserInfo && post.user && onFollow && <UserInfo user={post.user} onFollow={onFollow} />}
            <TradingInfo post={post} />
            <PostInfo post={post} />
        </div>
    );
};

export default memo(FeedItem);
