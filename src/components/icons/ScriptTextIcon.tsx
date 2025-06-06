import { BaseIcon, IconProps } from '.';

const ScriptTextIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 16 16" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.99999 2H13.3333V3.33333H14.6667V7.33333H13.3333L13.3333 12.6667H12V3.33333H3.99999V2ZM9.33333 11.3333H2.66666V12.6667H1.33333V11.3333V10H2.66666V3.33333H3.99999L3.99999 10H9.33333V11.3333ZM9.33333 11.3333V12.6667H2.66666V14H12V12.6667H10.6667V11.3333H9.33333ZM5.33333 4.66667H10.6667V6H5.33333V4.66667ZM10.6667 7.33333H5.33333V8.66667H10.6667V7.33333Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default ScriptTextIcon;
