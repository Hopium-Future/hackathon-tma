import { cn } from '@/helper';

interface IProps {
    className?: string;
    side?: 'left' | 'right';
}
const SidePixel = ({ className, side = 'left' }: IProps) => {
    return (
        <svg className={cn('text-green-10', { 'rotate-180': side === 'right' }, className)} viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.50684 3.75V0H28.1318V30H7.50684V26.25H3.75684V22.5H0.00683594V7.5H3.75684V3.75H7.50684Z" fill="currentColor" />
        </svg>
    );
};

export default SidePixel;
