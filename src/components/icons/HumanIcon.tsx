import { BaseIcon, IconProps } from '.';

const HumanIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 12 12" fill="none">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.83333 0.166504H7.16667V2.49984H4.83333V0.166504ZM3.08333 3.08317H8.91667V4.24984H3.08333V3.08317ZM7.75 8.33317V4.24984H4.25V8.33317V11.8332H5.41667V8.33317H6.58333V11.8332H7.75L7.75 8.33317ZM8.91667 1.9165H10.0833V3.08317H8.91667V1.9165ZM11.25 0.749837H10.0833V1.9165H11.25V0.749837ZM1.91667 1.9165H3.08333V3.08317H1.91667V1.9165ZM1.91667 0.749837H0.75V1.9165H1.91667V0.749837Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default HumanIcon;
