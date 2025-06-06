import { BaseIcon, IconProps } from "."

const CalenderCheckIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 25" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M15 2.5H17V4.5L19 4.5H21V8.5V10.5V22.5H19H5H3V10.5V8.5V4.5H5L7 4.5V2.5H9V4.5H15V2.5ZM19 8.5L19 6.5H5V8.5H19ZM19 10.5H5V20.5H19L19 10.5ZM16 12.5V14.5H14V12.5H16ZM12 16.5L12 14.5L14 14.5L14 16.5L12 16.5ZM10 16.5L12 16.5V18.5H10L10 16.5ZM10 16.5H8V14.5H10V16.5Z" fill="currentColor" />
        </BaseIcon>

    );
};

export default CalenderCheckIcon;