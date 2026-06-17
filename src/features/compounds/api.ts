/**
 * @packageDocumentation
 *
 * Client-side API wrappers for compound explorer, detail, and follow-up endpoints.
 *
 * The functions in this module cover the compound list view plus the overview, metadata, pathway,
 * gene, and toxicity payloads used by compound detail pages.
 */
import { buildQuery, fetchJson } from '@/shared/api/client';
import type { PaginatedResponse, PaginationParams } from '@/shared/types';
import type {
  CompoundFilters,
  CompoundGeneCardRow,
  CompoundMetadata,
  CompoundOverviewResponse,
  CompoundPathwayCardRow,
  CompoundSummary,
} from '@/features/compounds/types';
import type { ToxicityEndpoint } from '@/features/toxicity/types';

/**
 * Fetches a paginated list of compounds.
 *
 * @param filters Compound filters forwarded to the backend.
 * @param pagination Requested page and page size.
 * @returns A paginated compound response.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The default request loads the first page with `50` rows, matching the standard explorer page
 * size used by the compound table.
 */
export async function getCompounds(
  filters: CompoundFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: 50 }
): Promise<PaginatedResponse<CompoundSummary>> {
  return fetchJson(
    `/api/compounds${buildQuery({
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches the summary record for a single compound.
 *
 * @param cpd Compound identifier.
 * @returns The compound summary, or `null` when the backend reports no matching compound.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The identifier is encoded into the path segment exactly as supplied by the caller.
 */
export async function getCompoundById(cpd: string): Promise<CompoundSummary | null> {
  return fetchJson(`/api/compounds/${encodeURIComponent(cpd)}`);
}

/**
 * Fetches metadata for a single compound detail page.
 *
 * @param cpd Compound identifier.
 * @returns The compound metadata payload returned by the backend.
 * @throws Error When the backend request fails.
 */
export async function getCompoundMetadata(cpd: string): Promise<CompoundMetadata> {
  return fetchJson(`/api/compounds/${encodeURIComponent(cpd)}/metadata`);
}

/**
 * Fetches the quantitative overview payload for a compound detail page.
 *
 * @param cpd Compound identifier.
 * @param options Optional limits for top-ranked overview sections.
 * @returns The compound overview payload.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * `top_ko` and `top_pathways` are omitted from the query string when the caller leaves them
 * undefined, allowing the backend defaults to remain authoritative.
 */
export async function getCompoundOverview(
  cpd: string,
  options: { top_ko?: number; top_pathways?: number } = {}
): Promise<CompoundOverviewResponse> {
  return fetchJson(
    `/api/compounds/${encodeURIComponent(cpd)}/overview${buildQuery({
      top_ko: options.top_ko,
      top_pathways: options.top_pathways,
    })}`
  );
}

/**
 * Fetches gene associations for a compound detail page.
 *
 * @param cpd Compound identifier.
 * @param pagination Requested page and page size.
 * @returns A paginated list of gene association cards.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The default page size is `100` because compound-gene associations are typically reviewed in
 * larger batches inside the detail card.
 */
export async function getCompoundGenes(
  cpd: string,
  pagination: PaginationParams = { page: 1, pageSize: 100 }
): Promise<PaginatedResponse<CompoundGeneCardRow>> {
  return fetchJson(
    `/api/compounds/${encodeURIComponent(cpd)}/genes${buildQuery({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches pathway associations for a compound detail page.
 *
 * @param cpd Compound identifier.
 * @param pagination Requested page and page size.
 * @returns A paginated list of pathway association cards.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The default page size is `200`, which reflects the broader cardinality usually seen in pathway
 * associations compared with the explorer tables.
 */
export async function getCompoundPathways(
  cpd: string,
  pagination: PaginationParams = { page: 1, pageSize: 200 }
): Promise<PaginatedResponse<CompoundPathwayCardRow>> {
  return fetchJson(
    `/api/compounds/${encodeURIComponent(cpd)}/pathways${buildQuery({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches endpoint-level toxicity rows for a compound detail page.
 *
 * @param cpd Compound identifier.
 * @param pagination Requested page and page size.
 * @returns A paginated list of toxicity endpoints linked to the compound.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * This endpoint exposes one row per endpoint measurement rather than the compact toxicity summary
 * that appears in compound explorer rows.
 */
export async function getCompoundToxicityProfile(
  cpd: string,
  pagination: PaginationParams = { page: 1, pageSize: 100 }
): Promise<PaginatedResponse<ToxicityEndpoint>> {
  return fetchJson(
    `/api/compounds/${encodeURIComponent(cpd)}/toxicity-profile${buildQuery({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches all endpoint-level toxicity rows for a compound detail page.
 *
 * @param cpd Compound identifier.
 * @param pageSize Requested page size for the paginated backend calls.
 * @returns The concatenated list of toxicity endpoints linked to the compound.
 * @throws Error When any backend request fails.
 *
 * @remarks
 * The first page is loaded eagerly to discover `totalPages`. Remaining pages are then fetched in
 * parallel and concatenated in page order so downstream UI metrics always see the complete dataset.
 */
export async function getAllCompoundToxicityProfile(
  cpd: string,
  pageSize = 100
): Promise<ToxicityEndpoint[]> {
  const firstPage = await getCompoundToxicityProfile(cpd, { page: 1, pageSize });

  if (firstPage.totalPages <= 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      getCompoundToxicityProfile(cpd, { page: index + 2, pageSize })
    )
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.data);
}
