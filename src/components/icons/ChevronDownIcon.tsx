import { SvgIconType } from '@/type/futures.type';

const ChevronDownIcon = ({ color = '#F6F6F6', size = 12, ...props }: SvgIconType) => {
    return (
        <svg style={{ minWidth: size }} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 12 12" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 5L2 4L10 4L10 5L9 5L9 6L7.5 6L7.5 7L6.5 7L6.5 8L5.5 8L5.5 7L4.5 7L4.5 6L3 6L3 5L2 5Z"
                fill={color}
            />
        </svg>
    );
};

export default ChevronDownIcon;
