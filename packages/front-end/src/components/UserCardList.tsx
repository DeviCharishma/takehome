import type { User } from '../types/user';
import { formatDate } from '../lib/formatDate';

interface UserCardListProps {
  users: User[];
}

export default function UserCardList({ users }: UserCardListProps) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {users.map(user => (
        <li key={user.id} className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="font-medium text-neutral-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-neutral-600">{user.email}</p>
          {user.phoneNumber && <p className="text-sm text-neutral-500">{user.phoneNumber}</p>}
          <p className="mt-1 text-xs text-neutral-400">Registered {formatDate(user.registered)}</p>
        </li>
      ))}
    </ul>
  );
}
