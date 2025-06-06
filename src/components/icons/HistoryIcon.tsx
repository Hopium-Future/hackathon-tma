import { BaseIcon, IconProps } from "."

const HistoryIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M19 3H5V5H3V19H5V21H19V19H21V5H19V3ZM19 5V19H5V5H19ZM11 7H13V13H17V15L13 15H11V7Z" fill="currentColor" />
        </BaseIcon>
    );
};

export default HistoryIcon;
