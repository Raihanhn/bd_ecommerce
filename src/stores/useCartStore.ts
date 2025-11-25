// stores/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  slug?: string;
}

interface CartState {
  [x: string]: any;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  cartCount: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartCount: 0,

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);

        let updated;

        if (existing) {
          updated = items.map((i) =>
            i.productId === item.productId
              ? { ...i, qty: i.qty + item.qty }
              : i
          );
        } else {
          updated = [...items, item];
        }

        set({
          items: updated,
          cartCount: updated.reduce((sum, i) => sum + i.qty, 0),
        });
      },

      removeItem: (productId) => {
        const updated = get().items.filter((i) => i.productId !== productId);

        set({
          items: updated,
          cartCount: updated.reduce((sum, i) => sum + i.qty, 0),
        });
      },

      clear: () => {
        set({ items: [], cartCount: 0 });
      },
    }),

    {
      name: "auric-cart", // saved in localStorage as "auric-cart"
    }
  )
);
