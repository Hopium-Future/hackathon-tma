import { BaseIcon, IconProps } from '.';

const EmptyIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 100 100" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M50 16.666H8.333v66.667h83.333V83H92V33h-9v-8H50v8h33v42H16.666V25H50v-8.334zM66.665 50h-8.332v-8.334H50V50h8.332v8.333H50v8.334h8.333v-8.334h8.332v8.334H75v-8.334h-8.334V50zm0 0H75v-8.334h-8.334V50z"
                fill="currentColor"
            />
        </BaseIcon>
    );
};

export default EmptyIcon;
