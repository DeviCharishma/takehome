import { useUIStore } from '../store/useUIStore';

export default function AddUserFab() {
  const openAddDialog = useUIStore(state => state.openAddDialog);

  return (
    <button
      type="button"
      onClick={openAddDialog}
      aria-label="Add user"
      className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-2xl leading-none text-white shadow-lg hover:bg-neutral-700 md:hidden"
    >
      +
    </button>
  );
}
