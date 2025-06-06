import { BaseIcon, IconProps } from '.';

const ArrowIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 24" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 11L20 13L8 13L8 15L6 15L6 13L4 13L4 11L6 11L6 9L8 9L8 11L20 11ZM10 7L8 7L8 9L10 9L10 7ZM10 7L12 7L12 5L10 5L10 7ZM10 17L8 17L8 15L10 15L10 17ZM10 17L12 17L12 19L10 19L10 17Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default ArrowIcon;
