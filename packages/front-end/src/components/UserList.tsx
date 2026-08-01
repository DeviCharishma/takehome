import { useEffect } from 'react';
import clsx from 'clsx';
import { AlertCircle, SearchX, Users } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import type { SortBy, SortOrder } from '../hooks/useUsers';
import { useInfiniteScrollSentinel } from '../hooks/useInfiniteScrollSentinel';
import { ApiError } from '../lib/apiClient';
import { useUIStore } from '../store/useUIStore';
import UserTable from './UserTable';
import UserCardList from './UserCardList';
import UserTableSkeleton from './UserTableSkeleton';
import UserCardListSkeleton from './UserCardListSkeleton';
import EmptyState from './ui/EmptyState';
import Button from './ui/Button';

const GENERIC_ERROR_MESSAGE = 'Unable to load users. Please check your connection and try again.';

interface UserListProps {
  search: string;
  sortBy: SortBy | null;
  sortOrder: SortOrder;
  onSortChange: (column: SortBy) => void;
}

export default function UserList({ search, sortBy, sortOrder, onSortChange }: UserListProps) {
  const highlightedUserId = useUIStore(state => state.highlightedUserId);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isRefetching,
    refetch,
  } = useUsers({ search, sortBy, sortOrder });

  // True while a search/sort change is fetching its replacement page in the background
  // (previous results are still on screen via `placeholderData`), as opposed to the initial
  // load or an infinite-scroll page fetch, which have their own indicators.
  const isUpdatingResults = isFetching && !isLoading && !isFetchingNextPage;

  const sentinelRef = useInfiniteScrollSentinel({
    onIntersect: fetchNextPage,
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
  });

  // A search/sort change swaps in an entirely different result set. Without this, a user
  // scrolled deep into one list would land mid-page (or past the end) of the new one, with the
  // actual top results invisible above the fold.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [search, sortBy, sortOrder]);

  const users = data?.pages.flatMap(page => page.data) ?? [];

  // Deleting a row removes the focused Delete button from the DOM. The modal's own focus
  // trap restores focus to it right when the modal closes (the row is usually still there at
  // that instant - the list refetch that removes it finishes slightly later), so the *second*
  // loss - when the row's node actually disappears - lands on <body> with nothing to catch it.
  // Deleting doesn't reliably change `users.length` (a full page gets backfilled from the next
  // row), so this deliberately has no dependency array - it re-checks after every render, which
  // is cheap and catches the moment focus resets no matter what triggered the re-render.
  useEffect(() => {
    if (document.activeElement === document.body) {
      document.querySelector<HTMLElement>('main')?.focus();
    }
  });

  if (isLoading) {
    return (
      <div>
        <UserTableSkeleton />
        <UserCardListSkeleton />
      </div>
    );
  }

  // `isError` also flips true if a later fetch fails (e.g. an infinite-scroll page, after
  // exhausting retries) - at that point `data` still holds every previously-loaded page. Only
  // treat this as a full-page error when there's truly nothing to show yet; otherwise keep the
  // existing rows visible and surface the failure inline (handled further down).
  if (isError && !data) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Something went wrong"
        description={error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE}
        action={
          <Button onClick={() => refetch()} disabled={isRefetching}>
            {isRefetching ? 'Retrying...' : 'Retry'}
          </Button>
        }
      />
    );
  }

  const total = data.pages[0]?.total ?? 0;

  if (users.length === 0) {
    return (
      <EmptyState
        icon={search ? SearchX : Users}
        title={search ? `No users found for "${search}"` : 'No users yet'}
        description={search ? 'Try a different name or email.' : 'Add your first user to get started.'}
      />
    );
  }

  return (
    <div>
      {isUpdatingResults && <p className="pb-2 text-xs text-slate-500">Updating results...</p>}

      <div className={clsx(isUpdatingResults && 'opacity-60 transition-opacity duration-150')}>
        <UserTable
          users={users}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
          highlightedUserId={highlightedUserId}
        />
        <UserCardList users={users} highlightedUserId={highlightedUserId} />
      </div>

      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && <p className="py-4 text-center text-sm text-slate-500">Loading more...</p>}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-4 text-center text-sm">
          <p className="text-red-600">Failed to load more users.</p>
          <Button size="sm" variant="secondary" onClick={() => fetchNextPage()}>
            Retry
          </Button>
        </div>
      )}

      {!hasNextPage && !isError && (
        <p className="py-4 text-center text-sm text-slate-500">Showing all {total} users.</p>
      )}
    </div>
  );
}
