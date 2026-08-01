import { useInfiniteQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/apiClient';
import type { ApiListSuccess } from '../types/api';
import type { User } from '../types/user';

const PAGE_SIZE = 50;

export type SortBy = 'first_name' | 'last_name' | 'email' | 'created_at';
export type SortOrder = 'asc' | 'desc';

interface UseUsersOptions {
  search?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export function useUsers({ search = '', sortBy = 'last_name', sortOrder = 'asc' }: UseUsersOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['users', { search, sortBy, sortOrder }],
    queryFn: ({ pageParam, signal }) => {
      const params = new URLSearchParams({
        offset: String(pageParam),
        limit: String(PAGE_SIZE),
        sortBy,
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
  });
}
