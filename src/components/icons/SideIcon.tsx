import { BaseIcon, IconProps } from ".";

const SideIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 10 11" fill="none">
            <path d="M10 4.87495L10 6.30352L8.57143 6.30352L8.57143 7.73209L7.14286 7.73209L7.14286 9.16066L5.71429 9.16066L5.71429 10.5892L4.28571 10.5892L4.28571 9.16066L2.85714 9.16066L2.85714 7.73209L1.42857 7.73209L1.42857 6.30352L5.11066e-08 6.30352L6.81422e-08 4.87495L2.85714 4.87495L2.85714 0.410664L7.14286 0.410664L7.14286 4.87495L10 4.87495Z" fill="currentColor" />
        </BaseIcon>
    );
};

export default SideIcon;
