import { BaseIcon, IconProps } from '.';

const TradeIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 16 16" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.5 0.5H2.16667H13.8333H15.5V15.5H13.8333H2.16667H0.5V0.5ZM13.8333 2.16667H2.16667V13.8333H13.8333V2.16667ZM3.83333 8H5.5V12.1667H3.83333V8ZM12.1667 3.83333H10.5V12.1667H12.1667V3.83333ZM7.16667 6.33333H8.83333V8H7.16667V6.33333ZM8.83333 9.66667H7.16667V12.1667H8.83333V9.66667Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default TradeIcon;
