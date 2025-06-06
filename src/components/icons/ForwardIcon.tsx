import { BaseIcon, IconProps } from '.';

const ForwardIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 19 18" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.50013 2H11.5001V3H12.5002V3.99941H13.5014V5H14.5002V6.00072H15.5041V7H16.5002V8.00013H17.5V10.0001H16.5002V11H15.5041V12.0007H14.5002V13H13.5014V13.9994H12.5002V15H11.5001V16H9.50013V12.0007H3.50408V10.0001H3.5V14.0001H1.5V8.00013H2.50016V7H3.50408V6.00072H9.50013V2ZM11.5014 12.0007V13H11.5001V12.0007H11.5014ZM11.5014 5H11.5001V6.00072H11.5014V5Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default ForwardIcon;
