import { BaseIcon, IconProps } from '.';

const WarningIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.6 0.000488281H2.40047V1.20041H9.6V0.000488281ZM9.59918 10.7994H2.40047V11.9994H9.6V10.7996H10.7991V9.59966H9.59918V10.7994ZM10.7999 2.40051H11.9998V9.60004H10.7999V2.40051ZM2.3988 2.40064H1.19992V9.59966H2.3988V10.7996H1.19888V9.60004H0V2.40051H1.19888V1.20072H2.3988V2.40064ZM10.7991 1.20072H9.59918V2.40064H10.7991V1.20072Z"
                fill={props.color || 'currentColor'}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.39871 7.2002L6.59863 7.2002L6.59863 5.82914L6.59863 5.82886L6.59863 4.4578L5.39871 4.4578L5.39871 5.82886L5.39871 5.82914L5.39871 7.2002ZM6.59863 4.45719L5.39871 4.45719L5.39871 2.40018L6.59863 2.40018L6.59863 4.45719Z"
                fill={props.color || 'currentColor'}
            />
            <rect x="6.59961" y="9.59961" width="1.19992" height="1.19992" transform="rotate(-180 6.59961 9.59961)" fill={props.color || 'currentColor'} />
        </BaseIcon>
    );
};

export default WarningIcon;
