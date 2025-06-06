import { SvgIconType } from '@/type/futures.type';

const ArrowTransactionIcon = ({ size = 20, ...props }: SvgIconType) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
            <g filter="url(#filter0_d_7522_123720)" clipPath="url(#clip0_7522_123720)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.82 4.175H9.153v9.001h-1.66v1.667h1.66v1.662h1.667v-1.66h1.666V13.18H10.82V4.175zM5.813 11.51H7.48v1.667H5.813V11.51zm.007-1.667H4.153v1.666H5.82V9.844zm6.66 1.667h1.666v1.667H12.48V11.51zm3.346-1.665H14.16v1.667h1.667V9.846z"
                    fill="#fff"
                />
            </g>
            <defs>
                <filter
                    id="filter0_d_7522_123720"
                    x={0.153321}
                    y={0.174805}
                    width={19.6729}
                    height={20.3301}
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation={2} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_7522_123720" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_7522_123720" result="shape" />
                </filter>
                <clipPath id="clip0_7522_123720">
                    <path fill="#fff" d="M0 0H20V20H0z" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default ArrowTransactionIcon;
