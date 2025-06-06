interface IProps {
    className?: string;
}

const CirclePixel = ({ className }: IProps) => {
    return (
        <svg className={className} viewBox="0 0 26.25 27.25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="3.75" height="11.25" transform="matrix(-1 0 0 1 26.2549 8.375)" fill="currentColor" />
            <rect x="3.75488" y="4.625" width="3.75" height="18.75" fill="currentColor" />
            <rect width="3.75" height="18.75" transform="matrix(-1 0 0 1 22.5049 4.625)" fill="currentColor" />
            <rect x="7.50488" y="0.875" width="11.25" height="26.25" fill="currentColor" />
            <rect x="0.00488281" y="8.375" width="3.75" height="11.25" fill="currentColor" />
        </svg>
    );
};

export default CirclePixel;
