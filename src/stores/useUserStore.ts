import { create } from "zustand";

type UserStore = {
  image: string;
  setImage: (url: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  image: "/default-avatar.png",
  setImage: (url) => set({ image: url }),
}));
