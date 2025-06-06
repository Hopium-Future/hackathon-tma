import { SvgIconType } from '@/type/futures.type';

const ArrowUpIcon = (props: SvgIconType) => {
    const size = props.width || 24;
    return (
        <svg style={{ minWidth: size }} {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 24" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.5 18.8037H13.5V4.00771H11.5V5.99991H9.5V7.99991H11.5V18.8037ZM9.5 7.99991L7.5 7.99991V9.99991H9.5L9.5 7.99991ZM13.5 7.99991H15.5V5.99991H13.5V7.99991ZM15.5 7.99991L15.5 9.99991H17.5V7.99991L15.5 7.99991ZM17.5 11.9999H19.5V9.99992H17.5V11.9999ZM5.5 11.9999H7.5V9.99992H5.5V11.9999Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default ArrowUpIcon;
