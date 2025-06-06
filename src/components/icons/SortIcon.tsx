import React from 'react';
import { ISortListType } from '@/type/common.type';

interface SortIconProps extends React.SVGProps<SVGSVGElement> {
    sort?: ISortListType;
    color?: string;
    colorActive?: string;
    width?: number;
    height?: number;
}

const SortIcon: React.FC<SortIconProps> = ({ sort = '', color = '#9D9D9D', colorActive = '#3BD975', width = 6, height = 9 }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 6 9" fill="none">
            <path d="M3 0.5L5.59808 3.5H0.401924L3 0.5Z" fill={sort === 'asc' ? colorActive : color} />
            <path d="M3 8.5L0.401924 5.5L5.59808 5.5L3 8.5Z" fill={sort === 'desc' ? colorActive : color} />
        </svg>
    );
};

export default SortIcon;
