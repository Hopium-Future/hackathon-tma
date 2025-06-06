import { useState } from 'react';

export const useAsyncFunc = <T>(
    func: () => Promise<T>,
): {
    loading: boolean;
    state: T | undefined;
    fetch: () => void;
} => {
    const [state, setState] = useState<T | undefined>();
    const [loading, setLoading] = useState(false);

    const fetch = async () => {
        setLoading(true);
        try {
            setState(await func());
        } catch (error) {
            console.log("Error", error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, state, fetch };
};
