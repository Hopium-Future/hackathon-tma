import Card from '@/components/common/card';
import { cn } from '@/helper';
import React, { useEffect, useRef, useState } from 'react';

interface IBaseInput {
    onChange: (value: string) => void;
    value: string;
    isValid: boolean;
    errorMsg?: string;
    label: React.ReactNode;
    inputPlaceholder?: string;
}

const BaseInput: React.FC<IBaseInput> = ({ label, inputPlaceholder = '', onChange, value, isValid, errorMsg }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [input, setInput] = useState('');

    useEffect(() => setInput(value), [value]);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => onChange(input), 300);

        return () => {
            timeoutRef.current && clearTimeout(timeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    const onPaste = () => {
        navigator.clipboard.readText().then((text) => {
            setInput?.(text);
            inputRef.current?.focus();
        });
    };
    return (
        <div className="space-y-1">
            <div className="font-medium text-md">{label}</div>
            <div>
                <Card
                    className={cn('border-0.5 ring-0 border-divider justify-between py-3 space-x-2 text-md', {
                        'border-red-1': value && !isValid
                    })}
                >
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 truncate outline-none text-sub"
                        placeholder={inputPlaceholder || ''}
                    />
                    <button onClick={onPaste} className="font-semibold cursor-pointer text-green-1 ">
                        Paste
                    </button>
                </Card>
                {value && !isValid && (
                    <div className="pt-1 overflow-hidden text-sm transition-all duration-200 text-red-1 text-ellipsis whitespace-nowrap">{errorMsg}</div>
                )}
            </div>
        </div>
    );
};

export default BaseInput;
