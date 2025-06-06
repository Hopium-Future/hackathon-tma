import useHapticFeedback from './useHapticFeedback';

const useVibration = () => {
    const [impactOccurred] = useHapticFeedback();

    const vibrate = () => {
        if (navigator && navigator.vibrate) {
            navigator.vibrate(400);
        } else {
            console.log(2)
            impactOccurred("heavy");
        }
    };
    return {
        vibrate
    };
};

export default useVibration;