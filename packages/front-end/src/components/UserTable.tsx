import type { User } from '../types/user';
import type { SortBy, SortOrder } from '../hooks/useUsers';
import { formatDate } from '../lib/formatDate';
import { useUIStore } from '../store/useUIStore';

interface UserTableProps {
  users: User[];
  sortBy: SortBy | null;
  sortOrder: SortOrder;
  onSortChange: (column: SortBy) => void;
}

// Only columns that both display and sort by the *same* field belong here. `Registered`
// (which displays `user.registered`) is deliberately excluded - the backend can only sort
// dates by `created_at` (row insert time), which would visibly disagree with what's shown.
const SORTABLE_COLUMNS: { column: SortBy; label: string }[] = [
  { column: 'first_name', label: 'First Name' },
  { column: 'last_name', label: 'Last Name' },
  { column: 'email', label: 'Email' },
];

function SortIcon({ direction }: { direction: SortOrder | null }) {
  if (!direction) {
    return (
      <span aria-hidden className="text-neutral-300">
        ↕
      </span>
    );
  }

  return (
    <span aria-hidden className="text-neutral-900">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

export default function UserTable({ users, sortBy, sortOrder, onSortChange }: UserTableProps) {
  const openEditDialog = useUIStore(state => state.openEditDialog);

  return (
    <table className="hidden w-full table-auto border-collapse text-left text-sm md:table">
      <thead>
        <tr className="border-b border-neutral-200 text-neutral-500">
          {SORTABLE_COLUMNS.map(({ column, label }) => {
            const activeDirection = sortBy === column ? sortOrder : null;

            return (
              <th
                key={column}
                className="py-2 pr-4 font-medium"
                aria-sort={activeDirection ? (activeDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button
                  type="button"
                  onClick={() => onSortChange(column)}
                  className="inline-flex items-center gap-1 hover:text-neutral-900"
                >
                  {label}
                  <SortIcon direction={activeDirection} />
                </button>
              </th>
            );
          })}
          <th className="py-2 pr-4 font-medium">Phone</th>
          <th className="py-2 pr-4 font-medium">Registered</th>
          <th className="py-2 pr-4 font-medium sr-only">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="border-b border-neutral-100">
            <td className="py-2 pr-4 text-neutral-900">{user.firstName}</td>
            <td className="py-2 pr-4 text-neutral-900">{user.lastName}</td>
            <td className="py-2 pr-4 text-neutral-600">{user.email}</td>
            <td className="py-2 pr-4 text-neutral-600">{user.phoneNumber ?? '—'}</td>
            <td className="py-2 pr-4 text-neutral-600">{formatDate(user.registered)}</td>
            <td className="py-2 pr-4">
              <button
                type="button"
                onClick={() => openEditDialog(user)}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
