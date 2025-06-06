import { cn } from '@/helper';
import { MouseEventHandler } from 'react';

type IProps = {
    onClick: MouseEventHandler<HTMLButtonElement>;
    className?: string;
};

const ScrollTopButton = ({ onClick, className }: IProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'flex flex-col items-center justify-center size-10 rounded-full border border-divider bg-background-3 fixed bottom-2 right-2',
                className
            )}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none" className="animate-bounce">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.33333 5.66602H2.66666V4.33268H1.33333V5.66602ZM9.33333 5.66602H10.6667V4.33268H9.33333V5.66602ZM9.33332 4.33268H7.99999V2.99935L6.66666 2.99935V1.66601H8L7.99999 2.99935H9.33332V4.33268ZM5.33333 2.33268H6.66666V0.33268H5.33333V1.66601H4V2.99935H5.33333V2.33268ZM4 2.99935H2.66666V4.33268H4L4 2.99935Z"
                    fill="#9D9D9D"
                />
                <rect width="1.33333" height="1.33333" transform="matrix(1 0 0 -1 10.6667 7)" fill="#9D9D9D" />
                <rect x="1.33334" y="7" width="1.33333" height="1.33333" transform="rotate(180 1.33334 7)" fill="#9D9D9D" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none" className="animate-bounce">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.333328 5.66602H1.66666V4.33268H0.333328V5.66602ZM8.33333 5.66602H9.66667V4.33268H8.33333V5.66602ZM8.33332 4.33268H6.99999V2.99935H8.33332V4.33268ZM5.66666 2.99935H7V1.66601H5.66666V2.99935ZM4.33333 2.33268H5.66666V0.33268H4.33333V1.66601H3V2.99935H4.33333V2.33268ZM3 4.33268H1.66666V2.99935H3V4.33268Z"
                    fill="#575757"
                />
            </svg>
        </button>
    );
};

export default ScrollTopButton;
