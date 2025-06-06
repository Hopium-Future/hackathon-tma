
import { GAME_DURATION } from '@/config/app.config';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
type Store = {
    activeCooldown: boolean;
    setActiveCooldown: (status: boolean) => void;

    cooldown: number;
    setCooldown: (sec: number) => void;

    pumpActive: boolean;
    setPumpActive: (status: boolean) => void;

    dumpActive: boolean;
    setDumpActive: (status: boolean) => void;

    volume: boolean;
    setVolume: (volume: boolean) => void;
};

const useHomeStore = create<Store>()(

    immer(
        (set) => ({
            activeCooldown: false,
            setActiveCooldown: (status) => {
                set(
                    state => {
                        state.activeCooldown = status;
                    }
                );
            },

            cooldown: GAME_DURATION,
            setCooldown: (sec) => {
                set((state) => {
                    state.cooldown = sec;
                });
            },

            pumpActive: false,
            setPumpActive(status) {
                set(
                    (state) => {
                        state.pumpActive = status;
                    }
                );
            },

            dumpActive: false,
            setDumpActive(status) {
                set(
                    (state) => {
                        state.dumpActive = status;
                    }
                );
            },

            volume: false,
            setVolume: (volume) => {
                set(
                    (state) => {
                        state.volume = volume;
                    }
                );
            },
        })
    ),
);

export default useHomeStore;
