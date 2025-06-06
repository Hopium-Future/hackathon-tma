import classNames from 'classnames';
import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'primary' | 'secondary';
    className?: string;
    children: React.ReactNode;
}
const Text = ({ children, variant = 'primary', className, ...props }: TextProps) => {
    return (
        <div
            className={classNames(
                '',
                {
                    'text-main font-bold': variant === 'primary',
                    'text-sub': variant === 'secondary'
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Text;
