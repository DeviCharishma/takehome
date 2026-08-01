import { create } from 'zustand';
import type { User } from '../types/user';

// The add/edit/delete dialogs are mutually exclusive, so a single discriminated
// union covers "which dialog is open, and for which user" in one field.
// (`'closed'` rather than `null`/`undefined` as the "no dialog" discriminant - TypeScript
// 4.9's control-flow narrowing doesn't reliably narrow discriminated unions when a member's
// discriminant is a literal `null`, confirmed while building this store's consumers.)
type DialogState =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; user: User }
  | { type: 'delete'; user: User };

interface UIStore {
  dialog: DialogState;
  openAddDialog: () => void;
  openEditDialog: (user: User) => void;
  openDeleteDialog: (user: User) => void;
  closeDialog: () => void;
  // Briefly identifies a just-created/edited row so the list can pulse-highlight it.
  highlightedUserId: number | null;
  setHighlightedUserId: (id: number | null) => void;
}

export const useUIStore = create<UIStore>(set => ({
  dialog: { type: 'closed' },
  openAddDialog: () => set({ dialog: { type: 'add' } }),
  openEditDialog: user => set({ dialog: { type: 'edit', user } }),
  openDeleteDialog: user => set({ dialog: { type: 'delete', user } }),
  closeDialog: () => set({ dialog: { type: 'closed' } }),
  highlightedUserId: null,
  setHighlightedUserId: id => set({ highlightedUserId: id }),
}));
