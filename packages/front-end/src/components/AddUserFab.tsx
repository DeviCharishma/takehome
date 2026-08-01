import { Plus } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function AddUserFab() {
  const openAddDialog = useUIStore(state => state.openAddDialog);

  return (
    <button
      type="button"
      onClick={openAddDialog}
      aria-label="Add user"
      className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform duration-150 hover:scale-110 hover:bg-primary-700 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 md:hidden"
    >
      <Plus aria-hidden size={24} />
    </button>
  );
}
