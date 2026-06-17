/**
 * @packageDocumentation
 *
 * Client-side API wrappers for pathway explorer and source-aware detail endpoints.
 *
 * The pathway API keeps source scoping explicit so callers can move between explorer rows and
 * detail payloads without losing the KEGG or HADEG context attached to a pathway.
 */
import { buildQuery, fetchJson } from '@/shared/api/client';
import type { PaginatedResponse, PaginationParams } from '@/shared/types';
import type { PathwayDetailOverviewResponse, PathwayFilters, PathwaySummary } from '@/features/pathways/types';

/**
 * Fetches a paginated list of pathways.
 *
 * @param filters Pathway filters forwarded to the backend.
 * @param pagination Requested page and page size.
 * @returns A paginated pathway response.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The default request loads the first page with `50` rows, matching the standard explorer page
 * size used by the pathway table.
 */
export async function getPathways(
  filters: PathwayFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: 50 }
): Promise<PaginatedResponse<PathwaySummary>> {
  return fetchJson(
    `/api/pathways${buildQuery({
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches the overview payload for a single pathway detail page.
 *
 * @param pathway Pathway identifier or label expected by the backend.
 * @param options Optional source scoping for pathway detail data.
 * @returns The aggregated overview payload for the requested pathway.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The pathway name and optional source are forwarded as query parameters because the current
 * backend overview endpoint is query-driven even though the UI exposes path-based detail routes.
 */
export async function getPathwayDetailOverview(
  pathway: string,
  options: { source?: string } = {}
): Promise<PathwayDetailOverviewResponse> {
  return fetchJson(
    `/api/pathways/detail/overview${buildQuery({
      pathway,
      source: options.source,
    })}`
  );
}
