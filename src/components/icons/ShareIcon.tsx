import { SvgIconType } from '@/type/futures.type';

const ShareIcon = ({ color = 'currentColor', ...props }: SvgIconType) => {
    const size = props.width || 16;
    return (
        <svg style={{ minWidth: size }} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 7.33333L14 3.33333L14 2H12.6667H8.66667V3.33333H11.3333V4.66667H12.6667V7.33333H14ZM7.33333 3.33333H3.33333H2V4.66667V12.6667V14H3.33333L11.3333 14H12.6667V8.66667H11.3333V12.6667H3.33333V4.66667H7.33333V3.33333ZM6 8.66667H7.33333V10H6V8.66667ZM8.66666 7.33333H7.33333V8.66666H8.66666V7.33333ZM8.66667 6H10V7.33333H8.66667V6ZM11.3333 4.66667H10V6H11.3333V4.66667Z"
                fill={color}
            />
        </svg>
    );
};

export default ShareIcon;
