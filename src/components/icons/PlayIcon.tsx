import { BaseIcon, IconProps } from "."

const PlayIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 12 12" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 5L2 4L10 4L10 5L9 5L9 6L7.5 6L7.5 7L6.5 7L6.5 8L5.5 8L5.5 7L4.5 7L4.5 6L3 6L3 5L2 5Z" fill="currentColor"/>
        </BaseIcon>
    );
};

export default PlayIcon;
