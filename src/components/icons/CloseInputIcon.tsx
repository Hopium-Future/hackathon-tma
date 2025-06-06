import { BaseIcon, IconProps } from '.';

const CloseInputIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 12 12" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.5 1.5h5v1h-5v-1zm-1 2v-1h1v1h-1zm0 5h-1v-5h1v5zm1 1h-1v-1h1v1zm5 0v1h-5v-1h5zm1-1v1h-1v-1h1zm0-5h1v5h-1v-5zm0 0v-1h-1v1h1zm-4 1h-1v1h1v1h-1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v1h-1v-1z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default CloseInputIcon;
