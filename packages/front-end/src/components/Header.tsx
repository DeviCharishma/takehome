import { Plus, Search } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import type { SortBy, SortOrder } from '../hooks/useUsers';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

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
  { key: 'registered:desc', label: 'Registered Date (Newest)', sortBy: 'registered', sortOrder: 'desc' },
  { key: 'registered:asc', label: 'Registered Date (Oldest)', sortBy: 'registered', sortOrder: 'asc' },
];

export default function Header({ search, onSearchChange, sortBy, sortOrder, onSortChange }: HeaderProps) {
  const openAddDialog = useUIStore(state => state.openAddDialog);
  const selectedKey = sortBy === null ? 'default' : `${sortBy}:${sortOrder}`;

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
        <Button onClick={openAddDialog} className="hidden md:inline-flex">
          <Plus aria-hidden size={16} />
          Add User
        </Button>
      </div>
      <div className="mx-auto flex max-w-5xl gap-2 px-4 pb-4 sm:px-6">
        <Input
          type="search"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          leadingIcon={<Search aria-hidden size={16} />}
          className="flex-1"
        />
        <Select
          aria-label="Sort by"
          value={selectedKey}
          onChange={e => {
            const option = SORT_OPTIONS.find(o => o.key === e.target.value);
            if (option) {
              onSortChange({ sortBy: option.sortBy, sortOrder: option.sortOrder });
            }
          }}
          className="w-auto shrink-0 md:hidden"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </header>
  );
}
