import { useCallback, useState } from 'react';
import type { SortBy, SortOrder } from './useUsers';

interface SortState {
  sortBy: SortBy | null;
  sortOrder: SortOrder;
}

const DEFAULT_SORT: SortState = { sortBy: null, sortOrder: 'asc' };

/** Three-way per-column cycle: unsorted -> ascending -> descending -> unsorted. */
export function useSortState() {
  const [sort, setSortState] = useState<SortState>(DEFAULT_SORT);

  const toggleSort = useCallback((column: SortBy) => {
    setSortState(current => {
      if (current.sortBy !== column) {
        return { sortBy: column, sortOrder: 'asc' };
      }

      if (current.sortOrder === 'asc') {
        return { sortBy: column, sortOrder: 'desc' };
      }

      return DEFAULT_SORT;
    });
  }, []);

  // Direct set, for UI that picks a sort explicitly (e.g. a mobile <select>) rather than
  // cycling through it a click at a time.
  const setSort = useCallback((next: SortState) => {
    setSortState(next);
  }, []);

  return { sortBy: sort.sortBy, sortOrder: sort.sortOrder, toggleSort, setSort };
}
