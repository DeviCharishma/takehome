import { useUIStore } from '../store/useUIStore';
import type { SortBy, SortOrder } from '../hooks/useUsers';

interface SortValue {
  sortBy: SortBy | null;
  sortOrder: SortOrder;
}

interface HeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: SortBy | null;
  sortOrder: SortOrder;
  onSortChange: (sort: SortValue) => void;
}

// Mirrors the desktop table's sortable columns (see UserTable.tsx) so mobile and desktop
// offer the same sort options.
const SORT_OPTIONS: { key: string; label: string; sortBy: SortBy | null; sortOrder: SortOrder }[] = [
  { key: 'default', label: 'Sort: Default', sortBy: null, sortOrder: 'asc' },
  { key: 'first_name:asc', label: 'First Name (A–Z)', sortBy: 'first_name', sortOrder: 'asc' },
  { key: 'first_name:desc', label: 'First Name (Z–A)', sortBy: 'first_name', sortOrder: 'desc' },
  { key: 'last_name:asc', label: 'Last Name (A–Z)', sortBy: 'last_name', sortOrder: 'asc' },
  { key: 'last_name:desc', label: 'Last Name (Z–A)', sortBy: 'last_name', sortOrder: 'desc' },
  { key: 'email:asc', label: 'Email (A–Z)', sortBy: 'email', sortOrder: 'asc' },
  { key: 'email:desc', label: 'Email (Z–A)', sortBy: 'email', sortOrder: 'desc' },
];

export default function Header({ search, onSearchChange, sortBy, sortOrder, onSortChange }: HeaderProps) {
  const openAddDialog = useUIStore(state => state.openAddDialog);
  const selectedKey = sortBy === null ? 'default' : `${sortBy}:${sortOrder}`;

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
      <div className="mx-auto flex max-w-5xl gap-2 px-4 pb-3">
        <input
          type="search"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
        <select
          aria-label="Sort by"
          value={selectedKey}
          onChange={e => {
            const option = SORT_OPTIONS.find(o => o.key === e.target.value);
            if (option) {
              onSortChange({ sortBy: option.sortBy, sortOrder: option.sortOrder });
            }
          }}
          className="shrink-0 rounded-md border border-neutral-300 bg-white px-2 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 md:hidden"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
