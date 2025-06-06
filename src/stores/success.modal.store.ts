import { create } from 'zustand';

type Store = {
    isOpen: boolean;
    handleClose: () => void;
};

const useModalStore = create<Store>((set) => ({
    isOpen: false,
    handleClose: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useModalStore;
