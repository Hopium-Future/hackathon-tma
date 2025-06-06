import colors from "@/config/colors";

interface N3SortIconProps {
    direction: string | boolean;
}
const N3SortIcon = ({ direction }: N3SortIconProps) => {
    const isUp = direction === 'asc';
    const isDown = direction === 'desc';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="9" viewBox="0 0 6 9" fill="none">
            <path d="M3 0.5L5.59808 3.5H0.401924L3 0.5Z" fill={isUp ? colors.green[1] : '#9D9D9D'} />
            <path d="M3 8.5L0.401924 5.5L5.59808 5.5L3 8.5Z" fill={isDown ? colors.green[1] : '#9D9D9D'} />
        </svg>
    );
};

export default N3SortIcon;
