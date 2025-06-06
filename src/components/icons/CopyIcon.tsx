import { BaseIcon, IconProps } from ".";

const CopyIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M21 6H7V22H15V20H17V18H15V16H21V6ZM9 20V8H19V14H13V20H9ZM3 18H5V4H17V2L5 2H3V4V18ZM19 18H17V16H19V18Z" fill="currentColor" />
        </BaseIcon>

    );
};

export default CopyIcon;
