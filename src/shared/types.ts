/**
 * @packageDocumentation
 *
 * Shared request and response contracts reused across feature-level API wrappers.
 */
/**
 * Pagination parameters forwarded to list endpoints.
 */
export interface PaginationParams {
  /** One-based page number requested from the backend. */
  page: number;
  /** Maximum number of records requested for the current page. */
  pageSize: number;
}

/**
 * Standard paginated response shape returned by explorer-style endpoints.
 *
 * @typeParam T Row payload type contained in the `data` array.
 */
export interface PaginatedResponse<T> {
  /** Page rows returned by the backend for the current request. */
  data: T[];
  /** Total number of records available for the current filter scope. */
  total: number;
  /** One-based page number returned in the response. */
  page: number;
  /** Maximum number of records returned per page. */
  pageSize: number;
  /** Total number of available pages for the current filter scope. */
  totalPages: number;
}
