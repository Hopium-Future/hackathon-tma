import { memo, ReactElement } from 'react';
import { PlacesType, Tooltip } from 'react-tooltip';
import InfoIcon from '../icons/Info';
import { cn } from '@/helper';

interface IProps {
    id: string;
    content: string | ReactElement;
    className?: string;
    contentClassName?: string;
    offset?: number;
    opacity?: number;
    place?: PlacesType;
}

const BaseTooltip = ({ id, content, className, contentClassName, offset = 2, opacity = 1, place = 'bottom-end' }: IProps) => {
    return (
        <>
            <a data-tooltip-id={id} className="flex items-center justify-center">
                <InfoIcon className="size-3" />
            </a>
            <Tooltip
                id={id}
                render={() => <p className={cn('text-sub text-md text-left font-normal', contentClassName)}>{content}</p>}
                offset={offset}
                opacity={opacity}
                place={place}
                className={cn('!rounded !bg-background-4 !p-4 z-10', className)}
            />
        </>
    );
};

export default memo(BaseTooltip);
