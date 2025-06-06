import { BaseIcon, IconProps } from '.';

const GiftIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 18 18" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.25 3.75V2.25H8.25V3.75H9.75V2.25H12.75V3.75H14.25V5.25H16.5V9.75H15V15.75H3V9.75H1.5V5.25H3.75V3.75H5.25ZM5.25 5.25H8.25V3.75H5.25V5.25ZM9.75 3.75V5.25H12.75V3.75H9.75ZM8.25 6.75H3V8.25H8.25V6.75ZM9.75 8.25V6.75H15V8.25H9.75ZM8.25 9.75H4.5V14.25H8.25V9.75ZM9.75 14.25V9.75H13.5V14.25H9.75Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default GiftIcon;
