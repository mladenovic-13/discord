import { create } from 'zustand';

type ModalType = 'createServer';

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (modal: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
