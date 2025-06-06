import N3CloseCircleIcon from '@/components/icons/N3CloseCircleIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import { cn } from '@/helper';
import classNames from 'classnames';
import { useRef, useState } from 'react';

interface InputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    onValueChange?: (value: string) => void;
    value?: string;
    inputClassName?: string;
    className?: string;
    loading?: boolean;
}
const InputSearch = ({ placeholder, onValueChange, value, inputClassName, className, loading, ...props }: InputSearchProps) => {
    const [strSearch, setStrSearch] = useState(value || '');
    const timer = useRef<NodeJS.Timeout | null>(null);
    const [isFocus, setIsFocus] = useState(false);

    const _onFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        if (props.onFocus) props.onFocus(e);
        setIsFocus(true);
    };
    const _onBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        if (props.onBlur) props.onBlur(e);
        setIsFocus(false);
    };

    const handleChange = (v: string) => {
        const str = v.normalize('NFD');
        v = str.replace(/[\u0300-\u036f]/g, '');
        setStrSearch(v);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            onValueChange && onValueChange(v);
        }, 500);
    };

    const onClear = () => {
        setStrSearch('');
        if (onValueChange) onValueChange('');
    };

    return (
        <div
            className={cn('flex space-x-2 items-center bg-background-3 rounded h-10 px-3 py-2 ring-0.5 ring-divider', { '!ring-green-1': isFocus }, className)}
        >
            <SearchIcon />
            <input
                {...props}
                className={classNames('flex-1 outline-none text-md', inputClassName)}
                onChange={({ target: { value: v } }) => handleChange(v)}
                value={strSearch}
                placeholder={placeholder}
                onFocus={_onFocus}
                onBlur={_onBlur}
                type="text"
            />
            {!loading && strSearch && <N3CloseCircleIcon onClick={onClear} />}
        </div>
    );
};

export default InputSearch;
