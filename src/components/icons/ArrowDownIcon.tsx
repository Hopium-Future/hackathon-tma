import { SvgIconType } from '@/type/futures.type';

const ArrowDownIcon = (props: SvgIconType) => {
    const size = props.width || 12;
    return (
        <svg style={{ minWidth: size }} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 12 12" fill="none">
            <g id="Icon" clipPath="url(#clip0_9136_102611)">
                <g id="Union" filter="url(#filter0_d_9136_102611)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.49219 2.50488H5.49219L5.49219 7.9056H4.49609V8.9056H5.49219V9.90288H6.49219V8.90723H7.49219L7.49219 7.90723H6.49219V2.50488ZM3.48828 6.9069H4.48828V7.9069H3.48828V6.9069ZM3.49219 5.90625H2.49219L2.49219 6.90625H3.49219L3.49219 5.90625ZM7.48828 6.9069H8.48828V7.9069H7.48828V6.9069ZM9.49609 5.90755H8.49609V6.90755H9.49609V5.90755Z"
                        fill="#FF2B42"
                    />
                </g>
            </g>
            <defs>
                <filter
                    id="filter0_d_9136_102611"
                    x="-1.50781"
                    y="-1.49512"
                    width="15.0039"
                    height="15.3979"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.168627 0 0 0 0 0.258824 0 0 0 1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9136_102611" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9136_102611" result="shape" />
                </filter>
                <clipPath id="clip0_9136_102611">
                    <rect width="12" height="12" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default ArrowDownIcon;
