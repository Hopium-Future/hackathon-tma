import { BaseIcon, IconProps } from ".";

const BgLeftVolume = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 18 64" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 15L9 13H6V19H9L9 21H12L12 23H15V25H18V19H15V17L12 17V15L9 15Z" fill="#113F21" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 26L9 24H6V30H9L9 32H12L12 34H15V36H18V30H15V28L12 28V26L9 26Z" fill="#101E18" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 37L9 35H6V41H9L9 43H12L12 45H15V47H18V41H15V39L12 39V37L9 37Z" fill="#113F21" />
            <rect width="1" height="1" transform="matrix(-1 0 0 1 1 4)" fill="#113F21" />
            <rect width="1" height="1" transform="matrix(-1 0 0 1 1 0)" fill="#113F21" />
            <rect y="11" width="2" height="36" fill="#113F21" />
            <rect y="7" width="1" height="52" fill="#113F21" />
            <rect width="1" height="1" transform="matrix(-1 0 0 1 1 60)" fill="#113F21" />
            <rect width="1" height="1" transform="matrix(-1 0 0 1 1 63)" fill="#113F21" />
        </BaseIcon>
    );
};

export default BgLeftVolume;
