import { BaseIcon, IconProps } from ".";

const LogoIcon = ({ logoColor = "", ...props }: IconProps & { logoColor?: string; }) => {
    return (
        <BaseIcon {...props} viewBox="0 0 55 55" fill="none">

            <rect width="55" height="55" rx="27.5" fill="currentColor" />
            <rect x="15.2778" y="30.5562" width="6.11111" height="12.2222" fill={logoColor || "#575757"} />
            <rect x="15.2778" y="12.2227" width="6.11111" height="12.2222" fill={logoColor || "#575757"} />
            <rect x="21.3887" y="24.4443" width="12.2222" height="6.11111" fill={logoColor || "#575757"} />
            <rect x="33.6113" y="12.2227" width="6.11111" height="12.2222" fill={logoColor || "#575757"} />
            <rect x="33.6113" y="30.5562" width="6.11111" height="12.2222" fill={logoColor || "#575757"} />
            {/* <rect x="33.6113" y="30.5562" width="6.11111" height="12.2222" fill="#575757" /> */}
        </BaseIcon>
    );
};

export default LogoIcon;
