import CopyIcon from '@/components/icons/CopyIcon';
import DoubleCheckIcon from '@/components/icons/DoubleCheckIcon';
import { cn, copyToClipboard2 } from '@/helper';
import React, { useRef, useState } from 'react';

interface ITextCopyable {
    text: string | any;
    className?: string | number;
    showingText?: React.ReactNode;
    iconClassName?: string;
    iconSize?: string;
}

const TextCopyable: React.FC<ITextCopyable> = ({ text = '', showingText, className = '', iconClassName = '', iconSize = 'size-4' }) => {
    const [isCopied, setCopied] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCopy = () => {
        if (text) copyToClipboard2(text);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 3000);
    };
    return (
        <div className={cn('flex items-center space-x-1', className)}>
            <span style={{ wordBreak: 'break-word' }}>{showingText ?? text}</span>
            <button onClick={handleCopy}>
                {isCopied ? <DoubleCheckIcon className={cn(iconSize, iconClassName)} /> : <CopyIcon className={cn(iconSize, iconClassName)} />}
            </button>
        </div>
    );
};

export default TextCopyable;
