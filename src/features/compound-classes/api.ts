/**
 * @packageDocumentation
 *
 * Client-side API wrappers for compound class explorer and detail endpoints.
 *
 * These helpers expose the paginated class explorer and the class-level overview payload used by
 * detail pages and API reference consumers.
 */
import { buildQuery, fetchJson } from '@/shared/api/client';
import type { PaginatedResponse, PaginationParams } from '@/shared/types';
import type {
  CompoundClassDetailOverviewResponse,
  CompoundClassFilters,
  CompoundClassSummary,
} from '@/features/compound-classes/types';

/**
 * Fetches a paginated list of compound classes.
 *
 * @param filters Compound class filters forwarded to the backend.
 * @param pagination Requested page and page size.
 * @returns A paginated compound class response.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The default request loads the first page with `50` rows, matching the standard explorer page
 * size used by the class table.
 */
export async function getCompoundClasses(
  filters: CompoundClassFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: 50 }
): Promise<PaginatedResponse<CompoundClassSummary>> {
  return fetchJson(
    `/api/compound-classes${buildQuery({
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches the overview dataset for a single compound class detail page.
 *
 * @param compoundclass Compound class name used by the detail endpoint.
 * @returns The aggregated overview payload for the requested compound class.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The class name is forwarded as a query parameter because the backend detail overview endpoint is
 * query-driven rather than path-parameter-driven.
 */
export async function getCompoundClassDetailOverview(
  compoundclass: string
): Promise<CompoundClassDetailOverviewResponse> {
  return fetchJson(
    `/api/compound-classes/detail/overview${buildQuery({
      compoundclass,
    })}`
  );
}
