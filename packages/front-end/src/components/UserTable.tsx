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

// Columns that both display and sort by the *same* field. `Registered` sorts by the backend's
// `registered` column (not `created_at`, which is row insert time) so the printed dates in that
// column actually reorder when clicked - see the matching note in the backend's users route.
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

interface SortableHeaderProps {
  column: SortBy;
  label: string;
  align?: 'left' | 'center';
  sortBy: SortBy | null;
  sortOrder: SortOrder;
  onSortChange: (column: SortBy) => void;
}

function SortableHeader({ column, label, align = 'left', sortBy, sortOrder, onSortChange }: SortableHeaderProps) {
  const activeDirection = sortBy === column ? sortOrder : null;

  return (
    <th
      className={clsx(
        'py-3 text-xs font-semibold uppercase tracking-wide text-slate-500',
        align === 'center' ? 'px-4 text-center' : 'pr-4',
      )}
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
}

export default function UserTable({ users, sortBy, sortOrder, onSortChange, highlightedUserId }: UserTableProps) {
  const openEditDialog = useUIStore(state => state.openEditDialog);
  const openDeleteDialog = useUIStore(state => state.openDeleteDialog);

  return (
    // Phone/Registered/Actions hold fixed-format, bounded content (a phone mask, a date, two
    // 44px icon buttons), so they get fixed pixel widths sized to that content (measured
    // directly, with margin) - guaranteed regardless of viewport. First/Last Name get fixed
    // minimums too, sized for a typical name. Email is the one column left unconstrained, so
    // `table-fixed` gives it 100% of whatever space remains - a well-defined case, unlike
    // splitting the remainder across several percentage columns (which, mixed with fixed-pixel
    // columns, turned out to get squeezed to a fraction of their nominal share, not their
    // intended share of the full table width - that's what caused First/Last Name to wrap
    // badly at 768px on the first pass). Below the resulting min-width, the wrapper scrolls
    // horizontally on its own rather than deforming any column to fit.
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[930px] table-fixed border-collapse text-left text-sm">
        <colgroup>
          <col className="w-[110px]" />
          <col className="w-[110px]" />
          <col />
          <col className="w-[220px]" />
          <col className="w-[150px]" />
          <col className="w-[140px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-slate-200">
            {SORTABLE_COLUMNS.map(({ column, label }) => (
              <SortableHeader
                key={column}
                column={column}
                label={label}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              />
            ))}
            {/* Phone isn't sortable (no natural order for a formatted phone string), so it stays
                a plain header. Centered per standard table convention for fixed-width,
                non-text data (a number, a date), unlike the left-aligned text columns. */}
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Phone
            </th>
            <SortableHeader
              column="registered"
              label="Registered"
              align="center"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
            />
            <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sr-only">
              Actions
            </th>
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
    </div>
  );
}
