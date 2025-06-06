import { SvgIconType } from '@/type/futures.type';

const N3AddCircleIcon = ({ size = 16, ...props }: SvgIconType) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.79998 1.59961H11.2V3.19961H4.79998V1.59961ZM3.19998 4.79961V3.19961H4.79998L4.79998 4.79961L3.19998 4.79961ZM3.19998 11.1996H1.59998V4.79961H3.19998V11.1996ZM4.79998 12.7996L3.19998 12.7996V11.1996H4.79998L4.79998 12.7996ZM11.2 12.7996V14.3996H4.79998V12.7996H11.2ZM12.8 11.1996L12.8 12.7996L11.2 12.7996V11.1996H12.8ZM12.8 4.79961H14.4V11.1996H12.8V4.79961ZM12.8 4.79961L12.8 3.19961H11.2V4.79961L12.8 4.79961ZM7.19998 4.79961H8.79998V7.19961H11.2V8.79961H8.79998V11.1996H7.19998V8.79961H4.79998V7.19961H7.19998V4.79961Z"
                fill="#3BD975"
            />
        </svg>
    );
};

export default N3AddCircleIcon;
