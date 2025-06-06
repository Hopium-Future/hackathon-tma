import { BaseIcon, IconProps } from '.';

const DisLikeIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 18 18" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.5625 2H10.3125V2.875V10.75H9.4375V9.875H8.5625V9H7.6875V2.875H8.5625V2ZM5.9375 9V9.875H8.5625V10.75H9.4375V12.5H10.3125V11.625H11.1875V12.5H12.9375V11.625H13.8125V12.5H15.5625V14.25H14.6875V16H5.0625V14.25H4.1875V13.375H3.3125V11.625H2.4375V9H5.9375ZM5.9375 9V8.125H4.1875V7.25H5.0625V6.375H6.8125V9H5.9375ZM13.8125 11.625H15.5625V8.125H14.6875V7.25H13.8125V11.625ZM12.9375 11.625H11.1875V6.375H12.9375V11.625ZM6.8125 11.625H5.9375V12.5H6.8125V13.375H9.4375V12.5H6.8125V11.625Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default DisLikeIcon;
