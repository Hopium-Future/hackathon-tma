import { SvgIconType } from '@/type/futures.type';

const InfoIcon = ({ size = 20, ...props }: SvgIconType) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.1667 2.5H5.83333V4.16667H4.16667V5.83333H2.5V14.1667H4.16667V15.8333L5.83333 15.8333V17.5H14.1667V15.8333L15.8333 15.8333L15.8333 14.1667H17.5V5.83333H15.8333L15.8333 4.16667H14.1667V2.5ZM14.1667 4.16667V5.83333L15.8333 5.83333V14.1667H14.1667V15.8333H5.83333L5.83333 14.1667H4.16667V5.83333L5.83333 5.83333L5.83333 4.16667H14.1667Z"
                fill="currentColor"
            />
            <path fillRule="evenodd" clipRule="evenodd" d="M10.8334 8.33301H9.16675V9.99967V11.6663V14.1663H10.8334V11.6663V9.99967V8.33301Z" fill="currentColor" />
            <rect x="9.16675" y="5.83301" width="1.66667" height="1.66667" fill="currentColor" />
        </svg>
    );
};

export default InfoIcon;
