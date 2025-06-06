import { BaseIcon, IconProps } from ".";

const ClockIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 16 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.6667 2H3.33333V3.33333H2V12.6667L3.33333 12.6667V14H12.6667V12.6667L14 12.6667V3.33333H12.6667V2ZM12.6667 3.33333V12.6667H3.33333V3.33333H12.6667ZM7.33333 4.66667H8.66667L8.66667 8.66667H11.3333V10L8.66667 10H7.33333V4.66667Z" fill="currentColor" />
        </BaseIcon>
    );
};

export default ClockIcon;

