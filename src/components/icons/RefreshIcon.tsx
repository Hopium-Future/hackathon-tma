import { cn } from '@/helper';
import { BaseIcon, IconProps } from '.';

const RefreshIcon = ({ className, ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 16 16" fill="none" className={cn(className)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.66668 1.3335H8.00001V2.66683H6.66668L6.66668 4.00016H12V5.3335H13.3333V13.3335H12V14.6668H4.00001V13.3335H2.66668V8.00016H4.00001V13.3335H12V5.3335H6.66668V6.66683L8.00001 6.66683V8.00016H6.66668L6.66668 6.66683H5.33334V5.3335H4.00001V4.00016H5.33334V2.66683H6.66668V1.3335Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default RefreshIcon;
