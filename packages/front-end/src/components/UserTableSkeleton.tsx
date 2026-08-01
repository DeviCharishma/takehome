import Skeleton from './ui/Skeleton';

const SKELETON_ROWS = 8;

// Mirrors UserTable's column layout so the loading state doesn't visually "jump" once real
// data arrives.
export default function UserTableSkeleton() {
  return (
    <table className="hidden w-full table-auto border-collapse text-left text-sm md:table">
      <thead>
        <tr className="border-b border-slate-200">
          {['First Name', 'Last Name', 'Email', 'Phone', 'Registered'].map(label => (
            <th key={label} className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {label}
            </th>
          ))}
          <th className="py-3 pr-4 sr-only">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
          <tr key={i} className="border-b border-slate-100">
            <td className="py-3 pr-4"><Skeleton className="h-4 w-20" /></td>
            <td className="py-3 pr-4"><Skeleton className="h-4 w-24" /></td>
            <td className="py-3 pr-4"><Skeleton className="h-4 w-40" /></td>
            <td className="py-3 pr-4"><Skeleton className="h-4 w-28" /></td>
            <td className="py-3 pr-4"><Skeleton className="h-4 w-20" /></td>
            <td className="py-3 pr-4"><Skeleton className="h-4 w-12" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
