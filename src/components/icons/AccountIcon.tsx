import { BaseIcon, IconProps } from ".";

const AccountIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 32 32" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M19.9997 2.66663H11.9997V5.33321H9.33333V13.3332H12V5.33329H19.9997V2.66663ZM19.9997 13.3333H11.9997V16H19.9997V13.3333ZM20 5.33321H22.6667V13.3332H20V5.33321ZM5.33301 21.3331H7.99967V18.6666H23.9997V21.3333H7.99967V26.6666H23.9999V21.3331H26.6666V29.3331H26.6663V29.3333H5.33301V29.3331V26.6666V21.3331Z" fill="currentColor" />
        </BaseIcon>
    );
};

export default AccountIcon;
