import { BaseIcon, IconProps } from "."

const CloseIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5 5H7V7H5V5ZM9 9H7L7 7L9 7V9ZM11 11H9V9H11V11ZM13 11H11V13H9V15L7 15L7 17H5V19H7V17L9 17L9 15H11V13H13V15H15L15 17L17 17V19H19V17H17L17 15L15 15V13H13V11ZM15 9L15 11H13L13 9H15ZM17 7V9H15V7H17ZM17 7L17 5H19V7L17 7Z" fill="currentColor" />
        </BaseIcon>
    );
};

export default CloseIcon;
