import { SvgIconType } from '@/type/futures.type';

const SwapIcon = ({ size = 12, color = 'currentColor' }: SvgIconType) => {
    return (
        <svg style={{ minWidth: size }} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 12 12" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.5 5L1.5 4L10.5 4L10.5 5L1.5 5ZM10.5 8L10.5 7L1.5 7L1.5 8L2.49922 8L2.49922 9L3.49922 9L3.49922 8L10.5 8ZM4.5 9L4.5 10L3.5 10L3.5 9L4.5 9ZM8.50078 3L8.50078 4L9.50078 4L9.50078 3L8.50078 3ZM7.5 3L7.5 2L8.5 2L8.5 3L7.5 3Z"
                fill={color}
            />
        </svg>
    );
};

export default SwapIcon;
