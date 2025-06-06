import { SvgIconType } from '@/type/futures.type';

const FilterIcon = ({ size = 20, ...props }: SvgIconType) => {
    return (
        <svg style={{ minWidth: size }} {...props} width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_5433_95764)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.5 2.5H2.5V3.86364V6.59091H3.86364V7.95455H5.22727V9.31818H6.59091V7.95455H5.22727V6.59091H3.86364V3.86364H16.1364V6.59091H14.7727V7.95455H13.4091V9.31818H14.7727L14.7727 7.95455H16.1364V6.59091H17.5V3.86364V2.5ZM9.31818 14.7727V10.6818H7.95455L7.95455 9.31818H6.59091V10.6818H7.95455L7.95455 17.5H9.31818L9.31818 16.1364H10.6818V14.7727H9.31818ZM12.0455 10.6818V14.7727H10.6818V10.6818H12.0455ZM12.0455 10.6818L12.0455 9.31818H13.4091V10.6818H12.0455Z"
                    fill="#9D9D9D"
                />
            </g>
            <defs>
                <clipPath id="clip0_5433_95764">
                    <rect width="15" height="15" fill="white" transform="translate(2.5 2.5)" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default FilterIcon;
