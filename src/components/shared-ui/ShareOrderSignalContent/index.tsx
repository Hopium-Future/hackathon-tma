import { LegacyRef, memo, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@/components/common/Button';
import { createPostApi } from '@/apis/feed.api';
import useFuturesConfig from '@/stores/futures.store';
import { isIOS } from '@/helper';
import useKeyboardAdjust from '@/hooks/useKeyboardAdjust';

export interface IShareOrderSignalContentProps {
    orderId: number;
    description?: string;
    placeholder?: string;
    buttonText?: string;
    title?: string;
    onFinished: (isSuccess: boolean, data?: any) => void;
    useDebounce?: boolean;
}

const ShareOrderSignalContent = ({
    onFinished,
    title,
    orderId,
    useDebounce,
    description = 'Drop your alpha',
    placeholder = "What's your call?!",
    buttonText = 'make the call'
}: IShareOrderSignalContentProps) => {
    const MAX_TEXT_LENGTH = 100;
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTextFocused, setTextFocused] = useState(false);
    const inputRef = useKeyboardAdjust();
    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_TEXT_LENGTH) {
            setText(e.target.value);
        }
    };
    const addOrderShared = useFuturesConfig((state) => state.addOrderShared);

    const handleShareSignal = async () => {
        setLoading(true);
        try {
            const data = await createPostApi({
                orderId,
                caption: text.trim()
            });
            if (data.orderId) {
                addOrderShared(`${data.orderId}`);
                onFinished(true, data);
            }
        } catch (error) {
            toast.error('Share signal failed');
            if (error instanceof Error && error.message === 'Post already exists') {
                addOrderShared(`${orderId}`);
            }
            onFinished(false, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (useDebounce) {
            setLoading(true);
            const id = setTimeout(() => {
                setLoading(false);
            }, 3000);

            return () => {
                clearTimeout(id);
            };
        }
    }, [useDebounce]);

    return (
        <div className={isTextFocused && isIOS ? 'h-[62vh]' : ''}>
            {title && <h2 className="text-lg text-main font-bold mb-4 uppercase">{title}</h2>}
            <div className="flex items-center justify-between">
                <span className="text-main text-md font-normal">{description}</span>
                <span className="text-sub text-sm">
                    {text.length}/{MAX_TEXT_LENGTH}
                </span>
            </div>
            <div className="flex flex-grow mt-1">
                <textarea
                    value={text}
                    onChange={onTextChange}
                    onFocus={() => setTextFocused(true)}
                    onBlur={() => setTextFocused(false)}
                    maxLength={MAX_TEXT_LENGTH}
                    className="py-2 px-3 w-full min-h-12 border text-md border-divider bg-background-2 focus:border-green-1 focus:outline-none rounded"
                    placeholder={placeholder}
                    ref={inputRef.current as LegacyRef<HTMLTextAreaElement>}
                />
            </div>
            <Button variant="primary" disabled={loading} className="mt-6 h-11 font-bold uppercase" onClick={!loading ? handleShareSignal : undefined}>
                {loading ? <span className="animate-pulse">Loading...</span> : buttonText}
            </Button>
        </div>
    );
};

export default memo(ShareOrderSignalContent);
