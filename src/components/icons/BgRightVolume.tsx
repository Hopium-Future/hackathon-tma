import { BaseIcon, IconProps } from ".";

const BgRightVolume = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 18 64" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 15L9 13H12V19H9L9 21H6L6 23H3V25H0V19H3V17L6 17V15L9 15Z" fill="#113F21" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 26L9 24H12V30H9L9 32H6L6 34H3V36H0V30H3V28L6 28V26L9 26Z" fill="#101E18" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 37L9 35H12V41H9L9 43H6L6 45H3V47H0V41H3V39L6 39V37L9 37Z" fill="#113F21" />
            <rect x="17" y="4" width="1" height="1" fill="#113F21" />
            <rect x="17" width="1" height="1" fill="#113F21" />
            <rect width="2" height="36" transform="matrix(-1 0 0 1 18 11)" fill="#113F21" />
            <rect width="1" height="52" transform="matrix(-1 0 0 1 18 7)" fill="#113F21" />
            <rect x="17" y="60" width="1" height="1" fill="#113F21" />
            <rect x="17" y="63" width="1" height="1" fill="#113F21" />
        </BaseIcon>
    );
};

export default BgRightVolume;
