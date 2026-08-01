import type { User } from '../types/user';
import { formatDate } from '../lib/formatDate';

interface UserTableProps {
  users: User[];
}

// Middle name and address are deliberately omitted here (long/low-signal for a scan-list) -
// they're still available in the edit form and detail view.
export default function UserTable({ users }: UserTableProps) {
  return (
    <table className="hidden w-full table-auto border-collapse text-left text-sm md:table">
      <thead>
        <tr className="border-b border-neutral-200 text-neutral-500">
          <th className="py-2 pr-4 font-medium">First Name</th>
          <th className="py-2 pr-4 font-medium">Last Name</th>
          <th className="py-2 pr-4 font-medium">Email</th>
          <th className="py-2 pr-4 font-medium">Phone</th>
          <th className="py-2 pr-4 font-medium">Registered</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
