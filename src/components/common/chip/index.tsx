import classNames from 'classnames';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active: boolean;
    className?: string;
    children: React.ReactNode;
    background?: '1' | '2';
    disabled?: boolean;
}
const Chip = ({ active, className, children, background = '1', disabled, ...props }: Props) => {
    return (
        <button
            {...props}
            className={classNames('px-3 py-[6px] rounded ring-0.5 ring-divider text-sm', className, {
                'bg-background-2 font-bold': active && background === '1',
                'bg-background-3 font-bold': active && background === '2',
                'bg-transparent text-sub': !active,
                'cursor-not-allowed !text-disable': disabled
            })}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Chip;
