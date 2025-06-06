import { BaseIcon, IconProps } from ".";

const FileAltIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21 22H3V2H15V4H17V6H19V8H21V22ZM17 6H15V8H17V6ZM5 4V20H19V10H13V4H5ZM13 16H7V18H13V16ZM7 12H17V14H7V12ZM11 8H7V10H11V8Z" fill="currentColor"/>
        </BaseIcon>
    );
};

export default FileAltIcon;
