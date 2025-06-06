import { BaseIcon, IconProps } from "."

const UserPlusIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 24 25" fill="none">
            <g id="user-plus">
                <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M18 2.5H12V4.49995H10.0002V10.4999H12.0002V4.5H18V2.5ZM18 10.5H12V12.5H18V10.5ZM18.0002 4.49995H20.0002V10.4999H18.0002V4.49995ZM7 16.4999H9V14.5H21V16.5H9V20.5H21.0002V16.4999H23.0002V22.4999H23V22.5H7V22.4999V20.5V16.4999ZM3 8.5H5V10.5H7V12.5H5V14.5H3V12.5H1V10.5H3V8.5Z" fill="currentColor" />
            </g>
        </BaseIcon>
    );
};

export default UserPlusIcon;