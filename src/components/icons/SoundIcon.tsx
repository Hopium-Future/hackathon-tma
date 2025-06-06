import { BaseIcon, IconProps } from ".";

const SoundIconOff = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M13 2H11V4H9V6H7V8H5H3V10V14V16H5H7V18H9V20H11V22H13V2ZM9 18V16H7V14H5V10H7V8H9V6H11V18H9ZM19 11.2227H17V9.22266H15V11.2227H17V13.2227L15 13.2227V15.2227H17V13.2227H19L19 15.2227H21V13.2227L19 13.2227V11.2227ZM19 11.2227H21V9.22266H19L19 11.2227Z" fill="#F6F6F6" />
        </BaseIcon>

    );
};

const SoundIconOn = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11 2H13V22H11V20H9V18H11V6H9V4H11V2ZM7 8V6H9V8H7ZM7 16H5H3V14V10V8H5H7V10H5V14H7V16ZM7 16V18H9V16H7ZM17 10H15V14H17V10ZM19 8H21V16H19V8ZM19 16V18H15V16H19ZM19 6V8H15V6H19Z" fill="#F6F6F6" />
        </BaseIcon>

    );
};

export default { SoundIconOn, SoundIconOff };
