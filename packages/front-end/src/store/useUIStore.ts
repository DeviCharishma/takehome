import { create } from 'zustand';
import type { User } from '../types/user';

// The add/edit/delete dialogs are mutually exclusive, so a single discriminated
// union covers "which dialog is open, and for which user" in one field.
type DialogState =
  | { type: null }
  | { type: 'add' }
  | { type: 'edit'; user: User }
  | { type: 'delete'; user: User };

interface UIStore {
  dialog: DialogState;
  openAddDialog: () => void;
  openEditDialog: (user: User) => void;
  openDeleteDialog: (user: User) => void;
  closeDialog: () => void;
}

export const useUIStore = create<UIStore>(set => ({
  dialog: { type: null },
  openAddDialog: () => set({ dialog: { type: 'add' } }),
  openEditDialog: user => set({ dialog: { type: 'edit', user } }),
  openDeleteDialog: user => set({ dialog: { type: 'delete', user } }),
  closeDialog: () => set({ dialog: { type: null } }),
}));
