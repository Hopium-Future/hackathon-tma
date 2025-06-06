import { SvgIconType } from '@/type/futures.type';

const AlertIcon = ({ size = 16, ...props }: SvgIconType) => {
    return (
        <svg {...props} style={{ minWidth: size }} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.33334 2.66683V1.3335H6.66667V2.66683H3.33346V4.00016H10.0001V2.66683H9.33334ZM12.6666 10.6668H3.3333V8.00018H1.99997V10.6668V12.0002L5.33318 12.0002V14.6668H6.66651V12.0002H9.33324V13.3335H6.66668V14.6668H9.33324V14.6668H10.6666V12.0002L14 12.0002V10.6668H14V8.00018H12.6666V10.6668ZM3.33346 4.00016V9.3335H4.6668V4.00016H3.33346ZM12.6666 6.00016H11.3333V9.33349H12.6666V6.00016Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.3333 2.66683V1.3335H12V2.66683H10.6667V4.00016H12V5.3335H13.3333V4.00016H14.6667V2.66683H13.3333Z"
                fill="#FF2B42"
            />
        </svg>
    );
};

export default AlertIcon;
