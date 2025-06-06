interface IProps {
    strokeColor: string;
    bgColor?: string;
    className?: string;
}

const BorderBoard = ({ bgColor, strokeColor, className }: IProps) => {
    return (
        <svg className={className} width="112" height="135" viewBox="0 0 112 135" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V1H109V3H111V132H109V134H3V132H1V3H3Z" fill={bgColor ?? 'none'} />
            <rect y="4" width="1" height="127" fill={strokeColor} />
            <rect width="1" height="127" transform="matrix(-1 0 0 1 112 4)" fill={strokeColor} />
            <rect x="4" width="104" height="1" fill={strokeColor} />
            <rect x="3" y="1" width="1" height="1" fill={strokeColor} />
            <rect x="1" y="3" width="1" height="1" fill={strokeColor} />
            <rect x="2" y="2" width="1" height="1" fill={strokeColor} />
            <rect x="5" y="5" width="1" height="1" fill={strokeColor} />
            <rect x="106" y="5" width="1" height="1" fill={strokeColor} />
            <rect x="108" y="1" width="1" height="1" fill={strokeColor} />
            <rect x="109" y="2" width="1" height="1" fill={strokeColor} />
            <rect x="110" y="3" width="1" height="1" fill={strokeColor} />
            <rect x="5" y="129" width="1" height="1" fill={strokeColor} />
            <rect x="106" y="129" width="1" height="1" fill={strokeColor} />
            <rect width="1" height="1" transform="matrix(-1 0 0 1 109 133)" fill={strokeColor} />
            <rect width="1" height="1" transform="matrix(-1 0 0 1 110 132)" fill={strokeColor} />
            <rect width="1" height="1" transform="matrix(-1 0 0 1 111 131)" fill={strokeColor} />
            <rect x="1" y="131" width="1" height="1" fill={strokeColor} />
            <rect x="2" y="132" width="1" height="1" fill={strokeColor} />
            <rect x="3" y="133" width="1" height="1" fill={strokeColor} />
            <rect x="4" y="134" width="104" height="1" fill={strokeColor} />
        </svg>
    );
};

export default BorderBoard;
