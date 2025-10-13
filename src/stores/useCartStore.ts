import { create } from "zustand";

interface CartState {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  cartCount: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set({ items: [...get().items, item] }),
  removeItem: (id) =>
    set({ items: get().items.filter((p) => p._id !== id) }),
  clear: () => set({ items: [] }),
  cartCount: 0,
}));

