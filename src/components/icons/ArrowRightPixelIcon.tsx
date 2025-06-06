import { BaseIcon, IconProps } from '.';

const ArrowRightPixelIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 15 16" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.625 3.62695V4.87695L6.875 4.87695V3.62695L5.625 3.62695ZM5.625 11.126V12.376L6.875 12.376V11.126L5.625 11.126ZM6.87598 11.125V9.875L8.12402 9.875V8.62695L9.37402 8.62695V9.87695L8.12598 9.87695V11.125L6.87598 11.125ZM8.75098 7.37598V8.62598L10.626 8.62598V7.37598L9.37402 7.37598V6.12598L8.12402 6.12598V7.37598L8.75098 7.37598ZM6.87598 6.125V4.875L8.12598 4.875V6.125L6.87598 6.125Z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default ArrowRightPixelIcon;
