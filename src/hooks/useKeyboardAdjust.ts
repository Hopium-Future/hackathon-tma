import { useEffect, useState, useRef } from 'react';

const useKeyboardAdjust = () => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsKeyboardVisible(window.innerHeight < window.outerHeight * 0.75);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isKeyboardVisible && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [isKeyboardVisible]);

    return inputRef;
};

export default useKeyboardAdjust;
