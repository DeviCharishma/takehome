import { useUsers } from '../hooks/useUsers';
import { useInfiniteScrollSentinel } from '../hooks/useInfiniteScrollSentinel';
import { ApiError } from '../lib/apiClient';
import UserTable from './UserTable';
import UserCardList from './UserCardList';

const GENERIC_ERROR_MESSAGE = 'Unable to load users. Please check your connection and try again.';

export default function UserList() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useUsers();

  const sentinelRef = useInfiniteScrollSentinel({
    onIntersect: fetchNextPage,
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-400">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-sm text-neutral-500">
        <p>{error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border border-neutral-300 px-3 py-1.5 font-medium hover:bg-neutral-100"
        >
          Retry
        </button>
      </div>
    );
  }

  const users = data.pages.flatMap(page => page.data);
  const total = data.pages[0]?.total ?? 0;

  if (users.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-400">
        No users found.
      </div>
    );
  }

  return (
    <div>
      <UserTable users={users} />
      <UserCardList users={users} />

      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <p className="py-4 text-center text-sm text-neutral-400">Loading more...</p>
      )}

      {!hasNextPage && (
        <p className="py-4 text-center text-sm text-neutral-400">Showing all {total} users.</p>
      )}
    </div>
  );
}
