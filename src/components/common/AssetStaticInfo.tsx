import { memo } from 'react';
import AssetLogo from './AssetLogo';
import { cn } from '@/helper';

interface IProps {
    quoteAsset: string;
    quoteAssetId: number;
    className?: string;
    iconSize?: number;
}

const AssetStaticInfo = ({ quoteAsset, quoteAssetId, className, iconSize = 24 }: IProps) => {
    return (
        <div className={cn('flex items-center space-x-2 text-md', className)}>
            <AssetLogo assetId={quoteAssetId} size={iconSize} />
            <span>{quoteAsset}</span>
        </div>
    );
};

export default memo(AssetStaticInfo);
