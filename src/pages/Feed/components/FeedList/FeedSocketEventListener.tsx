import { memo, useCallback } from 'react';

import useEventSocket from '@/hooks/useEventSocket';
import { POST_SOCKET_EVENTS } from '@/helper/constant';
import { IPost, IPostStatus } from '@/type/feed.type';
import { STATUS_FUTURES } from '@/type/futures.type';

interface IUpdatedPostData {
    postId: string;
    sl: number | null;
    tp: number | null;
    profit: number;
    postStatus: IPostStatus;
    orderStatus: STATUS_FUTURES;
}

interface IProps {
    feedData: { list: IPost[] | []; hasMore: boolean };
    setFeedData: (data: { list: IPost[] | []; hasMore: boolean }) => void;
}

const FeedSocketEventListener = ({ feedData, setFeedData }: IProps) => {
    const handlePostUpdated = useCallback(
        (postData: IUpdatedPostData) => {
            const currentPost = feedData.list.find((item) => item.id === postData.postId);
            if (!currentPost) return;
            const { profit, sl, tp, postStatus, orderStatus } = postData;
            const updatedList = feedData.list.map((item) =>
                item.id === postData.postId ? { ...item, futureOrder: { ...item.futureOrder, sl, tp, status: orderStatus }, profit, status: postStatus } : item
            );
            setFeedData({ ...feedData, list: updatedList });
        },
        [feedData, setFeedData]
    );

    useEventSocket(POST_SOCKET_EVENTS.updatePost, handlePostUpdated);
    return <></>;
};

export default memo(FeedSocketEventListener);
