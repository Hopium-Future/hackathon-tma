import { BaseIcon, IconProps } from "."

const UserIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 28 28" fill="none">
            <g clipPath="url(#clip0_82_6163)">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.8333 2.33337H5.83333V4.66671L3.50028 4.66671V11.6667L5.83333 11.6667V14H12.8333V11.6667L5.83362 11.6667V4.66671L12.8333 4.66671V2.33337ZM12.8336 4.66671H15.167V11.6667H12.8336V4.66671ZM0 18.6667H2.33333V23.3334H16.3333V25.6667H2.33333H0V18.6667ZM2.33333 18.6667H16.3333V16.3334H2.33333V18.6667ZM18.667 18.6667H16.3336V25.6667H18.667V18.6667ZM17.5 2.33337H22.1667V4.66671H17.5V2.33337ZM22.1667 11.6667H17.5V14H22.1667V11.6667ZM22.167 4.66671H24.5003V11.6667H22.167V4.66671ZM28.0003 18.6667H25.667V23.3334H21V25.6667H28V23.3334H28.0003V18.6667ZM21 16.3334H25.6667V18.6667H21V16.3334Z" fill="currentColor" />
            </g>
            <defs>
                <clipPath id="clip0_82_6163">
                    <rect width="28" height="28" fill="white" />
                </clipPath>
            </defs>
        </BaseIcon>
    );
};

export default UserIcon;