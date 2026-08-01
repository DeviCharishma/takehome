import clsx from 'clsx';
import { useUsers } from '../hooks/useUsers';
import { useInfiniteScrollSentinel } from '../hooks/useInfiniteScrollSentinel';
import { ApiError } from '../lib/apiClient';
import UserTable from './UserTable';
import UserCardList from './UserCardList';

const GENERIC_ERROR_MESSAGE = 'Unable to load users. Please check your connection and try again.';

interface UserListProps {
  search: string;
}

export default function UserList({ search }: UserListProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useUsers({ search });

  // True while a search/sort change is fetching its replacement page in the background
  // (previous results are still on screen via `placeholderData`), as opposed to the initial
  // load or an infinite-scroll page fetch, which have their own indicators.
  const isUpdatingResults = isFetching && !isLoading && !isFetchingNextPage;

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
        {search ? `No users found for "${search}".` : 'No users found.'}
      </div>
    );
  }

  return (
    <div>
      {isUpdatingResults && (
        <p className="pb-2 text-xs text-neutral-400">Updating results...</p>
      )}

      <div className={clsx(isUpdatingResults && 'opacity-60 transition-opacity')}>
        <UserTable users={users} />
        <UserCardList users={users} />
      </div>

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
