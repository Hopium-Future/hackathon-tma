import { BaseIcon, IconProps } from '.';

const ChevronRightIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 3 6" fill="none">
            <path d="M.5 0H0v6h.5v-.545H1v-.546h.5v-.545H2v-.546h.5v-.545H3v-.546h-.5v-.545H2v-.546h-.5v-.545H1V.545H.5V0z" fill="#2B2B37" />
        </BaseIcon>
    );
};

export default ChevronRightIcon;
