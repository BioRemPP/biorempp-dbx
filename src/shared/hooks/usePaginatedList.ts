/**
 * @packageDocumentation
 *
 * Shared pagination-state hook for explorer views and paged detail sections.
 */
import { useCallback, useMemo, useState } from 'react';

/**
 * Partial pagination payload used to sync hook state with API responses.
 */
interface PaginationSyncPayload {
  /** One-based current page index returned by the data source. */
  page?: number;
  /** Page size returned by or applied to the current request. */
  pageSize?: number;
  /** Total number of records available in the full result set. */
  total?: number;
  /** Total number of pages available in the current result set. */
  totalPages?: number;
}

/**
 * Tracks pagination state and exposes helpers for reset and API-driven synchronization.
 *
 * @param initialPageSize Default page size used for the initial state.
 * @returns Pagination values plus setters and synchronization helpers.
 * @remarks
 * `syncPagination` only updates the fields provided in the payload. `totalPages` is clamped to a
 * minimum of `1` so pagination consumers always receive a valid page count.
 */
export function usePaginatedList(initialPageSize = 50) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  const syncPagination = useCallback((payload: PaginationSyncPayload) => {
    if (payload.page !== undefined) {
      setPage(payload.page);
    }
    if (payload.pageSize !== undefined) {
      setPageSize(payload.pageSize);
    }
    if (payload.total !== undefined) {
      setTotal(payload.total);
    }
    if (payload.totalPages !== undefined) {
      setTotalPages(Math.max(1, payload.totalPages));
    }
  }, []);

  const pagination = useMemo(
    () => ({
      page,
      pageSize,
      total,
      totalPages,
    }),
    [page, pageSize, total, totalPages]
  );

  return {
    ...pagination,
    setPage,
    setPageSize,
    setTotal,
    setTotalPages,
    resetPagination,
    syncPagination,
  };
}
