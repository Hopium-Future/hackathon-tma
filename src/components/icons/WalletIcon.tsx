import { BaseIcon, IconProps } from ".";

const WalletIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 20 21" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.5003 3H3.83366V4.66667H2.16699V16.3333L3.83366 16.3333V18H15.5003V16.3333H17.167L17.167 14.6667V13H18.8337V8H17.167V6.33333L17.167 4.66667H15.5003V3ZM10.5003 8V6.33333H15.5003V4.66667H3.83366V16.3333H15.5003V14.6667H10.5003V13H15.5003H17.167V8H15.5003H10.5003ZM10.5003 8V13H8.83366V8H10.5003ZM13.8337 9.66667H12.167V11.3333H13.8337V9.66667Z" fill="currentColor" />
        </BaseIcon>
    );
};

export default WalletIcon;