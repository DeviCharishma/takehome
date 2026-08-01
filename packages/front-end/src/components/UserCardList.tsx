import type { User } from '../types/user';
import { formatDate } from '../lib/formatDate';
import { useUIStore } from '../store/useUIStore';

interface UserCardListProps {
  users: User[];
}

export default function UserCardList({ users }: UserCardListProps) {
  const openEditDialog = useUIStore(state => state.openEditDialog);

  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {users.map(user => (
        <li key={user.id} className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-neutral-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-neutral-600">{user.email}</p>
              {user.phoneNumber && <p className="text-sm text-neutral-500">{user.phoneNumber}</p>}
              <p className="mt-1 text-xs text-neutral-400">Registered {formatDate(user.registered)}</p>
            </div>
            <button
              type="button"
              onClick={() => openEditDialog(user)}
              className="shrink-0 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Edit
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
