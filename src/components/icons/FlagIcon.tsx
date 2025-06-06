import { BaseIcon, IconProps } from '.';

const FlagIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 20 20" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.5 1.6665H10.8333V3.33317H17.5V14.9998H9.16667V13.3332H4.16667V18.3332H2.5V1.6665ZM4.16667 11.6665H9.16667V13.3332H10.8333H15.8333V4.99984H10.8333V3.33317H9.16667H4.16667V11.6665Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default FlagIcon;
