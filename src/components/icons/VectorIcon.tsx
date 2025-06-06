import { BaseIcon, IconProps } from "."

const VectorIcon = ({ ...props }: IconProps) => {
    return (
        <BaseIcon {...props} viewBox="0 0 8 9" fill="none">
            <path d="M8 3.99998L8 5.14284L6.85714 5.14284L6.85714 6.2857L5.71429 6.2857L5.71429 7.42855L4.57143 7.42855L4.57143 8.57141L3.42857 8.57141L3.42857 7.42855L2.28571 7.42855L2.28571 6.2857L1.14286 6.2857L1.14286 5.14284L4.08853e-08 5.14284L5.45137e-08 3.99998L2.28571 3.99998L2.28571 0.428555L5.71429 0.428555L5.71429 3.99998L8 3.99998Z" fill="currentColor" />
        </BaseIcon>
    );
};

export default VectorIcon;