import useHomeStore from "@/stores/home.store";
import { useEffect } from "react";

export const useTimer = (count: number, onFinish?: any) => {
    const { cooldown, setCooldown, activeCooldown, setActiveCooldown } = useHomeStore();

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        if (activeCooldown) {

            intervalId = setInterval(() => {
                if (cooldown !== 0) {
                    setCooldown(cooldown - 1);
                } else {
                    setActiveCooldown(false);
                    setCooldown(count);

                    if (onFinish) {
                        onFinish();
                    }
                }
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [activeCooldown, cooldown]);

    function pause() {
        setActiveCooldown(false);
    }

    function resume() {
        setActiveCooldown(true);
    }

    function reset() {
        setCooldown(count);
        setActiveCooldown(true);
    }

    return {
        activeCooldown,
        cooldown,
        pause,
        resume,
        reset,
    };
};