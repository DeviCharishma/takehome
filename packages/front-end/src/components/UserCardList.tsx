import clsx from 'clsx';
import { Pencil, Trash2 } from 'lucide-react';
import type { User } from '../types/user';
import { formatDate } from '../lib/formatDate';
import { useUIStore } from '../store/useUIStore';
import IconButton from './ui/IconButton';

interface UserCardListProps {
  users: User[];
  highlightedUserId: number | null;
}

export default function UserCardList({ users, highlightedUserId }: UserCardListProps) {
  const openEditDialog = useUIStore(state => state.openEditDialog);
  const openDeleteDialog = useUIStore(state => state.openDeleteDialog);

  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {users.map(user => (
        <li
          key={user.id}
          className={clsx(
            'rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-150',
            highlightedUserId === user.id && 'animate-row-highlight',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            {/* `min-w-0` overrides the flex default of `min-width: auto`, which otherwise
                refuses to shrink this column below its longest unbroken line of text (e.g. an
                email with no spaces) - without it, that text pushes the card wider instead of
                wrapping, shoving the action buttons out past the card's edge. */}
            <div className="min-w-0 flex-1 break-words">
              <p className="font-semibold text-slate-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">{user.email}</p>
              <p className="text-sm text-slate-500">{user.phoneNumber ?? '—'}</p>
              <p className="mt-1.5 text-xs text-slate-500">Registered {formatDate(user.registered)}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <IconButton label={`Edit ${user.firstName} ${user.lastName}`} onClick={() => openEditDialog(user)}>
                <Pencil aria-hidden size={16} />
              </IconButton>
              <IconButton
                label={`Delete ${user.firstName} ${user.lastName}`}
                variant="destructive"
                onClick={() => openDeleteDialog(user)}
              >
                <Trash2 aria-hidden size={16} />
              </IconButton>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
