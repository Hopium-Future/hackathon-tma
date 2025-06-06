import { cn, getProxyImageUrl, getS3Url } from '@/helper';
import React, { ImgHTMLAttributes } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface IAssetLogo {
    size?: number;
    className?: string;
    assetId: number;
    useProxy?: boolean;
    isLazyLoading?: boolean
}

export type CrossOrigin = ImgHTMLAttributes<HTMLImageElement>['crossOrigin'];

const AssetLogo: React.FC<IAssetLogo> = ({ size = 24, className = '', assetId, useProxy = false, isLazyLoading = true }) => {
    const url = getS3Url(`/images/coins/${assetId}.png`);
    const crossOrigin: CrossOrigin | undefined = useProxy ? 'anonymous' : undefined;

    const option = {
        alt: `logo-${assetId}-${size}`,
        src: useProxy ? getProxyImageUrl(url) : url,
        width: size,
        height: size,
        crossOrigin,
        className: cn('rounded-full', className)
    };

    return (
        isLazyLoading ? (<LazyLoadImage
            {...option}
        />) : <img {...option} />
    );
};

export default AssetLogo;
