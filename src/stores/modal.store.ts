import { create } from 'zustand';

type Store = {
    modalStack: string[];
    addModal: (id: string) => void;
    removeModal: (id: string) => void;
    currentZIndex: () => number;
};

const useModalStore = create<Store>((set, get) => ({
    modalStack: [],
    addModal: (id: string) => set((state) => ({ modalStack: [...state.modalStack, id] })),
    removeModal: (id: string) =>
        set((state) => ({
            modalStack: state.modalStack.filter((modalId) => modalId !== id)
        })),
    currentZIndex: () => 1000 + get().modalStack.length * 10
}));

export default useModalStore;
