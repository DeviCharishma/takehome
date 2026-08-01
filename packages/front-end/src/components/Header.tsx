import { useUIStore } from '../store/useUIStore';

interface HeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
}

export default function Header({ search, onSearchChange }: HeaderProps) {
  const openAddDialog = useUIStore(state => state.openAddDialog);

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <h1 className="text-xl font-semibold text-neutral-900">User Management</h1>
        <button
          type="button"
          onClick={openAddDialog}
          className="hidden shrink-0 items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 md:inline-flex"
        >
          + Add User
        </button>
      </div>
      <div className="mx-auto max-w-5xl px-4 pb-3">
        <input
          type="search"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>
    </header>
  );
}
