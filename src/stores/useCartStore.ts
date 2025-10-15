// stores/useCartStore.ts
import { create } from "zustand";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  slug?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  cartCount: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items;
    const existing = items.find((i) => i.productId === item.productId);
    if (existing) {
      // Increase quantity if already in cart
      const updated = items.map((i) =>
        i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i
      );
      set({ items: updated, cartCount: updated.reduce((a, c) => a + c.qty, 0) });
    } else {
      const updated = [...items, item];
      set({ items: updated, cartCount: updated.reduce((a, c) => a + c.qty, 0) });
    }
  },
  removeItem: (productId) => {
    const updated = get().items.filter((i) => i.productId !== productId);
    set({ items: updated, cartCount: updated.reduce((a, c) => a + c.qty, 0) });
  },
  clear: () => set({ items: [], cartCount: 0 }),
  cartCount: 0,
}));
