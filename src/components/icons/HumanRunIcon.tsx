import { IconProps } from '.';

const HumanRunIcon = ({ ...props }: IconProps) => {
    return (
        <svg width={100} height={100} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M41.667 12.5h-8.334v8.333H25v8.334h8.333v-8.334h8.334v8.334H50V37.5h-8.333v8.333h-8.334v8.334H25V62.5h-8.333v-8.333H8.333V62.5h8.334v8.333H25V62.5h16.667v8.333H50v8.334h-8.333V87.5H50v-8.333h8.333v-8.334H50V54.167h8.333v-8.334h8.334v8.334H75V62.5h8.333v-8.333h8.334v-8.334h-8.334v8.334H75v-8.334h-8.333V37.5H75V20.833H58.333v8.334H50v-8.334h-8.333V12.5z"
                fill="currentColor"
            />
        </svg>
    );
};

export default HumanRunIcon;
