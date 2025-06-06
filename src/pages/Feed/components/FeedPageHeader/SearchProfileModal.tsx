import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

import Modal from '@/components/common/modal';
import InputSearch from '@/components/common/input/InputSearch';
import FollowerItem from '@/pages/Onboarding/components/FollowerItem';
import Nodata from '@/components/common/nodata';
import useUserStore from '@/stores/user.store';
import { TDataFollowOnboard } from '@/type/onboard.type';
import { followUser, getUserRecommendedList, searchUser, unFollowUser } from '@/apis/feed.api';
import { LoadingScreen } from '@/components/Loading/LoadingScreen';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

const SearchProfileModal = ({ visible, onClose }: IProps) => {
    // --------------- STATES ---------------
    const recommendedListRef = useRef<TDataFollowOnboard[]>([]);
    const [dataList, setDataList] = useState<TDataFollowOnboard[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [searchKey, setSearchKey] = useState('');
    const [isError, setError] = useState(false);
    const setShowProfileModal = useUserStore((state) => state.setShowProfileModal);
    const resultText = isLoading ? '' : searchKey.trim().length ? `${dataList.length} ${dataList.length > 1 ? 'results' : 'result'}` : 'recommended traders';
    // --------------------------------------

    const fetchRecommendedList = useCallback(async () => {
        try {
            const data = await getUserRecommendedList();
            if (Array.isArray(data)) {
                setDataList(data);
                recommendedListRef.current = data;
            }
        } catch (error) {
            console.log('Fetch recommended list failed: ', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSearchedList = useCallback(async (key: string) => {
        setLoading(true);
        try {
            const { data } = await searchUser(key);
            setDataList(Array.isArray(data) ? data : []);
        } catch (error) {
            setDataList([]);
            console.log('Fetch trader list failed: ', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFollow = useCallback(async (follower: TDataFollowOnboard) => {
        const { isFollowing, _id: followerId } = follower;
        const res = isFollowing ? await unFollowUser(followerId) : await followUser(followerId);

        if (res?.data?.success) {
            setDataList((prev) => {
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
    }, []);

    const handleOpenProfile = (userId: number) => {
        setShowProfileModal(true, userId);
        // onClose();
    };

    const validateSearchKey = useCallback((key: string) => {
        if (key.length < 3) return false;

        const reg = /^[A-Za-z0-9\s_]+$/;
        return reg.test(key);
    }, []);

    useEffect(() => {
        if (!visible) return;
        fetchRecommendedList();
        return () => {
            setSearchKey('');
        };
    }, [visible, fetchRecommendedList]);

    useEffect(() => {
        if (!visible) return;

        const key = searchKey.trim();
        if (key.length) {
            const isValid = validateSearchKey(key);
            setError(!isValid);
            if (isValid) {
                fetchSearchedList(key);
            } else {
                setDataList([]);
            }
        } else {
            setError(false);
            setDataList(recommendedListRef.current);
        }
    }, [visible, searchKey, fetchSearchedList, validateSearchKey]);

    return (
        <Modal title="search trader" visible={visible} onClose={onClose} containerClassName="h-[calc(100vh-80px)] flex flex-col">
            <InputSearch placeholder="Type username or UID" value={searchKey} onValueChange={debounce((val) => setSearchKey(val.trim()))} />
            {isError && <p className="text-sm text-red-1 mt-3">Please enter at least 3 characters, no specials.</p>}
            <h2 className="text-md text-sub uppercase pt-6 pb-4">{resultText}</h2>

            <ul className="flex-grow flex flex-col gap-y-4 overflow-y-auto">
                {isLoading ? (
                    <LoadingScreen className="mt-[30px] h-auto" />
                ) : dataList.length ? (
                    dataList.map((item) => {
                        return (
                            <li key={item._id}>
                                <FollowerItem data={item} handleFollow={handleFollow} onClick={() => handleOpenProfile(item._id)} />
                            </li>
                        );
                    })
                ) : (
                    <Nodata className="mt-[30px]" />
                )}
            </ul>
        </Modal>
    );
};

export default memo(SearchProfileModal);
