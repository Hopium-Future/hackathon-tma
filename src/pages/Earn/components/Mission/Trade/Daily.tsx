import { getTasksApi } from '@/apis/task.api';
import { cn } from '@/helper';
import { CHECKIN_STATUS, MISSION_TYPE } from '@/helper/constant';
import useModalStore from '@/stores/success.modal.store';
import { Daily as DailyType } from '@/type/auth.type';
import { FC, Fragment, memo, useCallback, useEffect, useState } from 'react';
import DailyItem from './DailyItem';
import DailyItemSeven from './DailyItemSeven';
import DoubleArrowIcon from './DoubleArrowIcon';

const Daily: FC = () => {
    const { handleClose } = useModalStore();
    const [dailys, setDailys] = useState([
        {
            _id: 1,
            title: '1 Day',
            value: 100,
            active: false,
            text: false,
            buttonText: '',
            status: CHECKIN_STATUS.CLAIMABLE
        },
        {
            _id: 2,
            title: '2 Days',
            value: 220,
            active: false,
            text: false,
            buttonText: '',
            status: CHECKIN_STATUS.CLAIMABLE
        },
        {
            _id: 3,
            title: '3 Days',
            value: 345,
            active: false,
            text: false,
            buttonText: '',
            status: CHECKIN_STATUS.CLAIMABLE
        },
        {
            _id: 4,
            title: '4 Days',
            value: 1080,
            active: false,
            text: false,
            buttonText: '',
            status: CHECKIN_STATUS.CLAIMABLE
        },
        {
            _id: 5,
            title: '5 Days',
            value: 750,
            active: false,
            text: false,
            buttonText: '',
            status: CHECKIN_STATUS.CLAIMABLE
        },
        {
            _id: 6,
            title: '6 Days',
            value: 500,
            active: false,
            text: false,
            buttonText: '',
            status: CHECKIN_STATUS.CLAIMABLE
        }
    ]);
    const [reload, setReload] = useState(false);
    const handleReload = useCallback(() => {
        setReload((pre) => !pre);
    }, []);

    const [seven, setSeven] = useState({
        _id: 7,
        title: '7 Days',
        value: 1300,
        active: false,
        text: false,
        buttonText: '',
        status: CHECKIN_STATUS.UNCLAIMABLE
    });

    useEffect(() => {
        const getDailyData = async () => {
            // setLoading(true);
            try {
                const response = await getTasksApi(MISSION_TYPE.DAILY_CHECK_IN);
                if (response.data) {
                    const active = (response.data as DailyType[]).find((item) => item.active);
                    const data = [...dailys];
                    for (let index = 0; index < response.data.length; index++) {
                        if (index === 6) {
                            const theLast = { ...seven };
                            // if (theLast._id === active?._id) {
                            //     theLast.active = true;
                            // } else {
                            //     theLast.active = false;
                            // }
                            theLast.value = (response.data as DailyType[])[index].rewardQuantity;
                            theLast.status = (response.data as DailyType[])[index].status;
                            theLast.active = (response.data as DailyType[])[index].active;
                            setSeven(theLast);
                        } else {
                            // if (data[index]._id === active?._id) {
                            //     data[index].active = true;
                            // } else {
                            //     data[index].active = false;
                            // }
                            data[index].value = (response.data as DailyType[])[index].rewardQuantity;
                            data[index].status = (response.data as DailyType[])[index].status;
                            data[index].active = (response.data as DailyType[])[index].active;
                            if (active && data[index]._id >= active?._id) {
                                data[index].text = true;
                            } else {
                                data[index].text = false;
                            }
                        }
                    }
                    setDailys(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                // setLoading(false);
            }
        };

        getDailyData();
    }, [reload]);

    return (
        <>
            <section className={cn('w-full pb-[30px]')}>
                <div className="flex items-center justify-between w-full">
                    {dailys
                        .filter((_, index) => index < 3)
                        .map((item, index) => {
                            return (
                                <Fragment key={`${item._id} - ${item.status} - ${item.active}`}>
                                    <DailyItem item={item} toggleModal={handleClose} handleReload={handleReload} />
                                    {index < 2 && dailys[index + 1].active && (
                                        <div className="flex-1 flex justify-center items-center">
                                            <DoubleArrowIcon active />
                                        </div>
                                    )}
                                    {index < 2 && !dailys[index + 1].active && (
                                        <div className="flex-1 flex justify-center items-center">
                                            <DoubleArrowIcon />
                                        </div>
                                    )}
                                </Fragment>
                            );
                        })}
                </div>
                <div className="h-[18px] flex items-center justify-end">
                    <div className="w-[110px] flex items-center justify-center">
                        {dailys[4].active && <DoubleArrowIcon active align="down" />}
                        {!dailys[4].active && <DoubleArrowIcon align="down" />}
                    </div>
                </div>
                <div className="flex items-center justify-between w-full">
                    {dailys
                        .filter((_, index) => index > 2)
                        .reverse()
                        .map((item, index) => {
                            return (
                                <Fragment key={`${item._id} - ${item.status} - ${item.active}`}>
                                    <DailyItem item={item} toggleModal={handleClose} handleReload={handleReload} />

                                    {index < 2 && dailys[item._id]?.active && (
                                        <div className="flex-1 flex justify-center items-center">
                                            <DoubleArrowIcon active align="left" />
                                        </div>
                                    )}
                                    {index < 2 && !dailys[item._id]?.active && (
                                        <div className="flex-1 flex justify-center items-center">
                                            <DoubleArrowIcon align="left" />
                                        </div>
                                    )}
                                </Fragment>
                            );
                        })}
                </div>
                <div className="h-[18px] flex items-center justify-start">
                    <div className="w-[110px] flex items-center justify-center">
                        {seven.active && <DoubleArrowIcon active align="down" />}
                        {!seven.active && <DoubleArrowIcon align="down" />}
                    </div>
                </div>
                <div className="flex items-center">
                    <DailyItemSeven seven={seven} toggleModal={handleClose} handleReload={handleReload} />
                </div>
            </section>
        </>
    );
};

export default memo(Daily);
