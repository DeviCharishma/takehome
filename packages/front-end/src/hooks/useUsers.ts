import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/apiClient';
import type { ApiListSuccess } from '../types/api';
import type { User } from '../types/user';

const PAGE_SIZE = 50;

export type SortBy = 'first_name' | 'last_name' | 'email' | 'created_at';
export type SortOrder = 'asc' | 'desc';

const DEFAULT_SORT_BY: SortBy = 'last_name';

interface UseUsersOptions {
  search?: string;
  // `null`/omitted means "no explicit sort chosen" - falls back to the default below, but is
  // tracked separately so the UI can tell "default" apart from "user picked this column".
  sortBy?: SortBy | null;
  sortOrder?: SortOrder;
}

export function useUsers({ search = '', sortBy, sortOrder = 'asc' }: UseUsersOptions = {}) {
  const effectiveSortBy = sortBy ?? DEFAULT_SORT_BY;

  return useInfiniteQuery({
    queryKey: ['users', { search, sortBy: effectiveSortBy, sortOrder }],
    queryFn: ({ pageParam, signal }) => {
      const params = new URLSearchParams({
        offset: String(pageParam),
        limit: String(PAGE_SIZE),
        sortBy: effectiveSortBy,
        sortOrder,
      });

      if (search) {
        params.set('search', search);
      }

      return apiRequest<ApiListSuccess<User>>(`/users?${params.toString()}`, { signal });
    },
    initialPageParam: 0,
    // The offset for the next page is just how many rows we've loaded so far;
    // once that catches up to `total`, there's nothing left to fetch.
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
    // `search`/`sortBy`/`sortOrder` are part of the query key, so changing them starts a
    // fresh paginated query rather than appending to the old one. Without this, that switch
    // would blank the list back to a loading state on every search keystroke; this keeps the
    // previous results on screen until the new ones arrive.
    placeholderData: keepPreviousData,
  });
}
