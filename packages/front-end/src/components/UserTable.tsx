import clsx from 'clsx';
import { ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import type { User } from '../types/user';
import type { SortBy, SortOrder } from '../hooks/useUsers';
import { formatDate } from '../lib/formatDate';
import { useUIStore } from '../store/useUIStore';
import IconButton from './ui/IconButton';

interface UserTableProps {
  users: User[];
  sortBy: SortBy | null;
  sortOrder: SortOrder;
  onSortChange: (column: SortBy) => void;
  highlightedUserId: number | null;
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
    return <ArrowUpDown aria-hidden size={14} className="text-slate-500" />;
  }

  return (
    <ArrowUp
      aria-hidden
      size={14}
      className={clsx('text-primary-600 transition-transform duration-150', direction === 'desc' && 'rotate-180')}
    />
  );
}

export default function UserTable({ users, sortBy, sortOrder, onSortChange, highlightedUserId }: UserTableProps) {
  const openEditDialog = useUIStore(state => state.openEditDialog);
  const openDeleteDialog = useUIStore(state => state.openDeleteDialog);

  return (
    // `table-fixed` + explicit column widths (below) so a long unbroken string in any one
    // column (an email, a huge phone number, ...) wraps within its own column instead of
    // stretching that column - and the whole table - wider than the viewport.
    <table className="hidden w-full table-fixed border-collapse text-left text-sm md:table">
      <colgroup>
        <col className="w-[15%]" />
        <col className="w-[15%]" />
        <col className="w-[28%]" />
        <col className="w-[15%]" />
        <col className="w-[13%]" />
        <col className="w-[14%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-slate-200">
          {SORTABLE_COLUMNS.map(({ column, label }) => {
            const activeDirection = sortBy === column ? sortOrder : null;

            return (
              <th
                key={column}
                className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500"
                aria-sort={activeDirection ? (activeDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <button
                  type="button"
                  onClick={() => onSortChange(column)}
                  className="inline-flex items-center gap-1.5 rounded py-1 transition-colors duration-150 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                >
                  {label}
                  <SortIcon direction={activeDirection} />
                </button>
              </th>
            );
          })}
          {/* Phone/Registered are fixed-width, non-text data (a number, a date) - centered per
              standard table convention, unlike the left-aligned text columns. Symmetric `px-4`
              (not `pr-4`) so the centering is relative to the whole column, not skewed by
              one-sided padding. */}
          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            Phone
          </th>
          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            Registered
          </th>
          <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sr-only">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr
            key={user.id}
            className={clsx(
              'border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50',
              highlightedUserId === user.id && 'animate-row-highlight',
            )}
          >
            <td className="break-words py-3 pr-4 font-medium text-slate-900">{user.firstName}</td>
            <td className="break-words py-3 pr-4 font-medium text-slate-900">{user.lastName}</td>
            <td className="break-words py-3 pr-4 text-slate-600">{user.email}</td>
            {/* Phone numbers read as a single unit, so they get `truncate` (nowrap + ellipsis)
                instead of `break-words` - the opposite of the other columns. Centered along
                with Registered per standard table convention (fixed-width data centered, text
                left-aligned), which also makes the empty-value dash read as an intentional
                placeholder rather than a stray leftover character. */}
            <td className="truncate px-4 py-3 text-center text-slate-600">{user.phoneNumber || '—'}</td>
            <td className="break-words px-4 py-3 text-center text-slate-600">{formatDate(user.registered)}</td>
            <td className="py-3 pr-4">
              <div className="flex gap-1">
                <IconButton label={`Edit ${user.firstName} ${user.lastName}`} onClick={() => openEditDialog(user)}>
                  <Pencil aria-hidden size={15} />
                </IconButton>
                <IconButton
                  label={`Delete ${user.firstName} ${user.lastName}`}
                  variant="destructive"
                  onClick={() => openDeleteDialog(user)}
                >
                  <Trash2 aria-hidden size={15} />
                </IconButton>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
