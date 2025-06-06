import { BaseIcon, IconProps } from '.';

const BellIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 12 14" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.33337 1.66683V0.333496H4.6667V1.66683H1.33349V3.00016H10.6668V1.66683H7.33337ZM10.6667 9.66684H1.33333V7.00018H0V9.66684V11.0002L3.33321 11.0002V13.6668H4.66654V11.0002H7.33327V12.3335H4.66671V13.6668H7.33327V13.6668H8.66661V11.0002L12 11.0002V9.66684L12 7.00018H10.6667V3.00016H9.3334V8.3335H10.6667V9.66684ZM1.33349 3.00016V8.3335H2.66683V3.00016H1.33349Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default BellIcon;
