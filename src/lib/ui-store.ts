import { create } from "zustand";

type UiState = {
  moreOpen: boolean;
  setMoreOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  moreOpen: false,
  setMoreOpen: (open) => set({ moreOpen: open }),
}));
