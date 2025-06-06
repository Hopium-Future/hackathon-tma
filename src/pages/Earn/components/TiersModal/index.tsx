import { memo, ReactElement, useEffect, useState } from 'react';

import Modal from '@/components/common/modal';
import Button from '@/components/common/Button';
import BorderCard from '@/components/common/BorderCard';
import UserRole from '@/components/common/UserRole';
import Nodata from '@/components/common/nodata';
import AssetLogo from '@/components/common/AssetLogo';
import BaseTooltip from '@/components/common/BaseTooltip';
import { getEarnTiersApi } from '@/apis/earn.api';
import { PARTNER_TYPE } from '@/helper/constant';
import { cn, formatBigNum } from '@/helper';
import { ITiers } from '@/type/earn.type';

interface IProps {
    visible: boolean;
    onClose: () => void;
}
interface ITierHeading {
    title: string;
    className?: string;
    tooltip?: {
        content: string | ReactElement;
        className?: string;
    };
}

const TiersModal = ({ visible, onClose }: IProps) => {
    const [tiersData, setTiersData] = useState<{currentVolume: number
        data: ITiers[],}>({currentVolume: 0, data: []});

    const tierHeadings: ITierHeading[] = [
        { title: 'Tier', className: 'min-w-[72px] border-r border-divider' },
        { title: 'Volume', className: 'min-w-20' },
        {
            title: 'L-USDT',
            className: 'min-w-20',
            tooltip: {
                content: 'L-USDT covers your trading fees on Hopium.',
                className: 'max-w-[195px]'
            }
        },
        {
            title: 'C-USDT',
            className: 'min-w-20',
            tooltip: {
                content: (
                    <>
                        C-USDT is your <span className="font-bold text-main">trading credit</span> on Hopium, acting as a risk-free trading fund in your
                        balance.
                    </>
                ),
                className: 'max-w-[209px]'
            }
        },
        { title: 'Fee Taker/Maker', className: 'min-w-[94px]' }
    ];

    const fetchData = async () => {
        try {
            const { data } = await getEarnTiersApi();
            if (Array.isArray(data.data) && data.data.length) {
                const displayData = data.data.filter((item) => item._id !== PARTNER_TYPE.AMBASSADOR);
                setTiersData({data: displayData, currentVolume: data.currentVolume});
            } else {
                console.log('Invalid tiers response!!');
            }
        } catch (error) {
            console.log('Can not get tiers data!: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Modal title="tiers" headerClassName="justify-center pb-6 pt-9 [&>h1]:text-xl" visible={visible} closeIcon={false} onClose={onClose}>
            <BorderCard
                outsideDotClassName="bg-background-2 after:bg-green-1"
                insideDotClassName="bg-green-1"
                className="border-green-1 h-14 bg-linear--dark-green-2"
            >
                <div className="flex flex-col justify-center items-center text-sm">
                    <span>
                        Current month's volume <span className="text-green-1 font-bold">{formatBigNum(tiersData.currentVolume, 4, true)} USDT</span>
                    </span>
                    <span>Tiers are gained based on monthly volume.</span>
                    <span>Refreshes every month.</span>
                </div>
            </BorderCard>

            <div className="overflow-x-auto mt-3 thin-scroll-bar thumb-bg-sub rounded-lg border border-divider bg-background-3">
                <table>
                    <thead>
                        <tr className="border-b border-divider text-sub">
                            {tierHeadings.map(({ title, className, tooltip }, idx) => (
                                <th key={idx} className={cn('p-3 text-sm', className)}>
                                    <div className="flex items-center gap-[2px]">
                                        <span className="shrink-0 font-normal">{title}</span>
                                        {tooltip && <BaseTooltip id={`t-tooltip-${idx}`} content={tooltip.content} contentClassName={tooltip.className} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {tiersData.data.length ?
                            tiersData.data.map(({ _id, name, metadata }) => (
                                <tr key={_id} className="text-md text-main font-bold">
                                    <td className="p-3 border-r border-divider">{<UserRole partnerType={_id} partnerName={name} />}</td>

                                    <td className="p-3">
                                        <div className="flex items-center gap-1">
                                            <AssetLogo assetId={22} size={12} />
                                            <span>{formatBigNum(metadata?.accumulatedVolume || 0, 4, true)}</span>
                                        </div>
                                    </td>
                                    {metadata && (
                                        <>
                                            {metadata.rewards.map(({ assetId, assetQuantity }, idx) => (
                                                <td key={idx} className="p-3">
                                                    <div key={assetId} className="flex items-center gap-1">
                                                        <AssetLogo assetId={assetId} size={12} />
                                                        <span>{formatBigNum(assetQuantity, 2, true)}</span>
                                                    </div>
                                                </td>
                                            ))}
                                            <td className="p-3">
                                                {metadata.fee.taker}%/{metadata.fee.maker}%
                                            </td>
                                        </>
                                    )}
                                </tr>
                            )) : null}
                    </tbody>
                </table>
                {!tiersData.data.length && <Nodata className="py-10" />}
            </div>

            <Button variant="secondary" onClick={onClose} className="h-11 mt-6 gap-1 text-main py-[10px] px-[60px]">
                close
            </Button>
        </Modal>
    );
};

export default memo(TiersModal);
