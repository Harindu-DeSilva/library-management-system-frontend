import { create } from "zustand";
import { meApi } from "../api/authApi";
import { logoutApi } from "../api/authApi";

export const useStore = create((set) => ({

  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const res = await meApi();
      set({ user: res.data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    try {
      await logoutApi();   
    } catch {}

    set({ user: null });

    window.location.replace("/"); // prevents back navigation
  }
,
}));

