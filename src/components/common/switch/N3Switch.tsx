import colors from '@/config/colors';

interface SwitchProps {
    active?: boolean;
    onClick?: () => void;
}
const N3Switch = ({ active, onClick }: SwitchProps) => {
    const bg = active ? colors.green[2] : colors.background[3];
    const circle = active ? colors.green[1] : colors.disable;
    return (
        <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="34" height="18" viewBox="0 0 34 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M4 0H30V2H32V4H34V14H32V16H30V18H4V16H2V14H0V4H2V2H4V0Z" fill={bg} />
            {active ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M28 4V2H22V4L20 4V6H18V12H20V14H22V16L28 16V14H30V12H32L32 6H30V4H28Z" fill={circle} />
            ) : (
                <path fillRule="evenodd" clipRule="evenodd" d="M12 4V2H6V4L4 4V6H2V12H4V14H6V16L12 16V14H14V12H16L16 6H14V4H12Z" fill={circle} />
            )}
        </svg>
    );
};

export default N3Switch;
