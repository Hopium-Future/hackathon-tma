import { BaseIcon, IconProps } from ".";

const LockIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 20 20" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3346 2.5H6.66797V4.16667H13.334V7.5L5.00065 7.5H5H3.33398V17.5H5V17.5002H15V17.5H16.6667V7.5L15.0007 7.5V4.16667H13.3346V2.5ZM5 4.1665H6.66667V7.49984H5V4.1665ZM15 15.8335V9.16667H5.00065V15.8335H15ZM10.8346 10.8335H9.16797V14.1668H10.8346V10.8335Z" fill="currentColor" />
        </BaseIcon>
    );
};

export default LockIcon;
