import { useEffect, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/helper';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon';
import CheckedIcon from '@/components/icons/CheckedIcon';

interface IProps {
    options: { text: string; value: string }[];
    value: string;
    onChange: (value: string, e: any) => void;
    labelClassName?: string;
    contentClassName?: string;
    container?: string;
    optionClassName?: string;
    label?: string;
    alignOffset?: number;
}
const Select = ({ options, value, onChange, labelClassName, contentClassName, container, optionClassName, label, alignOffset=-12 }: IProps) => {
    const [width, setWidth] = useState<any>(null);
    const item = useMemo(() => {
        const item = options.find((item) => item['value'] === value);
        return {
            text: item?.text,
            value: item?.value
        };
    }, [options, value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const _container = container ? document.querySelector(container) : null;
            if (_container?.clientWidth) setWidth(_container?.clientWidth);
        }, 1000);
        return () => clearTimeout(timer);
    }, [container, value]);

    return (
        <DropdownMenu.Root modal>
            <DropdownMenu.Trigger className="w-full [&[data-state=open]>div>svg]:rotate-180">
                <div className={cn('flex items-center justify-between space-x-1 w-full', labelClassName)}>
                    {label && <span>{label}</span>}
                    <span>{item.text}</span>
                    <ChevronDownIcon />
                </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    style={{ width, zIndex: 99999 }}
                    className={cn('DropdownMenuContent w-full space-y-3', contentClassName)}
                    align="end"
                    alignOffset={alignOffset}
                    sideOffset={12}
                >
                    {options.map((item, index) => (
                        <DropdownMenu.Item
                            onClick={() => onChange && onChange(item.value, item)}
                            className={cn('DropdownMenuItem', optionClassName)}
                            key={index}
                        >
                            {item.text}
                            {item.value === value && (
                                <div className="RightSlot">
                                    <CheckedIcon />
                                </div>
                            )}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default Select;
