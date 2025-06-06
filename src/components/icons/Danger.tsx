import { BaseIcon, IconProps } from '.';

const DangerIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 10 10" fill="none">
            <path d="M8 1H1v1H0v6h1v1h7V8h1V2H8V1z" fill="#100F14" />
            <path fillRule="evenodd" clipRule="evenodd" d="M8 0H2v1H1v1H0v6h1v1h1v1h6V9h1V8h1V2H9V1H8V0zm0 1v1h1v6H8v1H2V8H1V2h1V1h6z" fill="#FF2B42" />
            <path fillRule="evenodd" clipRule="evenodd" d="M4.5 6h1V3.715h-1V6zm1-2.286h-1V2h1v1.714z" fill="#FF2B42" />
            <path transform="rotate(-180 5.5 8)" fill="#FF2B42" d="M5.5 8H6.5V9H5.5z" />
        </BaseIcon>
    );
};

export default DangerIcon;
