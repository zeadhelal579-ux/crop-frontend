/**
 * Minimal toast store: any component can call toast(...) and the Toaster
 * component renders the queue. Each toast removes itself after a few seconds.
 */
import { create } from "zustand";

const TOAST_LIFETIME_MS = 4000;
let nextToastId = 1;

export const useToastStore = create((set) => ({
  toasts: [],
  /** Remove one toast by id. */
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
  /** Add a toast to the queue and schedule its removal. */
  push: (toast) => {
    const id = nextToastId++;
    set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }));
    setTimeout(() => useToastStore.getState().dismiss(id), TOAST_LIFETIME_MS);
  },
}));

/** Show a toast. variant is "default" or "error". */
export function toast({ title, description, variant = "default" }) {
  useToastStore.getState().push({ title, description, variant });
}
