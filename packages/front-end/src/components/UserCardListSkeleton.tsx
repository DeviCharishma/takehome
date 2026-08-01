import Skeleton from './ui/Skeleton';

const SKELETON_CARDS = 6;

export default function UserCardListSkeleton() {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
        <li key={i} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-3.5 w-44" />
          <Skeleton className="mt-2 h-3.5 w-28" />
          <Skeleton className="mt-2.5 h-3 w-24" />
        </li>
      ))}
    </ul>
  );
}
