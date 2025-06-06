import { useEffect, useState } from 'react';

const useWindowFocus = () => {
    const [focused, setFocused] = useState(true); // Focus for first render

    useEffect(() => {
        const onVisibilityChange = () => {
            setFocused(!document.hidden);
        };

        // setFocused(hasFocus()); // Focus for additional renders

        // action work on IOS
        // const onFocus = () => {
        //     console.log("focus", true)
        //     setFocused(true);
        // };
        // const onBlur = () => {
        //     console.log("focus", false)
        //     setFocused(false);
        // };

        window.addEventListener('visibilitychange', onVisibilityChange);

        // window.addEventListener('focus', onFocus);
        // window.addEventListener('blur', onBlur);

        return () => {
            window.removeEventListener('visibilitychange', onVisibilityChange);

            // window.removeEventListener('focus', onFocus);
            // window.removeEventListener('blur', onBlur);
        };
    }, []);

    return focused;
};

export default useWindowFocus;