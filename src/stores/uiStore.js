/**
 * Cross-route UI state (Zustand): the currently selected species and field,
 * so sibling cards stay in sync without prop drilling.
 */
import { create } from "zustand";

export const useUiStore = create((set) => ({
  selectedSpeciesId: null,
  selectedFieldId: null,

  setSelectedSpeciesId: (selectedSpeciesId) => set({ selectedSpeciesId }),
  setSelectedFieldId: (selectedFieldId) => set({ selectedFieldId }),
}));
