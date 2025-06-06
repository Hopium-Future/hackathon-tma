import { BaseIcon, IconProps } from '.';

const RepeatIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 14 18" fill="none">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.25 0.75H4.75V2.25H6.25V3.75H1.75V5.25H0.25V12.75H1.75V5.25H6.25V6.75L4.75 6.75V8.25H6.25V6.75H7.75V5.25H9.25V3.75H7.75V2.25L6.25 2.25V0.75ZM12.25 3.75H10.75V5.25H12.25V3.75ZM3.25 12.75H1.75V14.25H3.25V12.75ZM7.75 12.75H12.25V14.25H7.75V15.75H6.25V14.25H4.75V12.75H6.25V11.25H7.75V12.75ZM12.25 12.75V5.25H13.75V12.75H12.25ZM9.25 9.75H7.75V11.25H9.25V9.75ZM7.75 15.75H9.25V17.25H7.75V15.75Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default RepeatIcon;
