import { create } from "zustand";

export const useStore = create((set) => ({
  data: [],
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true });
    await fetch("./data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        set({ data });
      })
      .catch((e) => {
        console.log(e.message);
        set({ error: e.message });
      })
      .finally(() => {
        set({ isLoading: false });
      });
  },
}));
