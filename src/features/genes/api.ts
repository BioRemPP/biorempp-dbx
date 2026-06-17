/**
 * @packageDocumentation
 *
 * Client-side API wrappers for gene or KO explorer and detail endpoints.
 *
 * These helpers cover the paginated gene table plus the overview, associated compounds, and
 * metadata payloads used by KO-centric detail screens.
 */
import { buildQuery, fetchJson } from '@/shared/api/client';
import type { PaginatedResponse, PaginationParams } from '@/shared/types';
import type {
  GeneAssociatedCompoundRow,
  GeneDetailOverviewResponse,
  GeneDetailSummary,
  GeneFilters,
  GeneMetadata,
  GeneSummary,
} from '@/features/genes/types';

/**
 * Fetches a paginated list of genes.
 *
 * @param filters Gene filters forwarded to the backend.
 * @param pagination Requested page and page size.
 * @returns A paginated gene response.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The default request loads the first page with `50` rows, matching the standard explorer page
 * size used by the gene table.
 */
export async function getGenes(
  filters: GeneFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: 50 }
): Promise<PaginatedResponse<GeneSummary>> {
  return fetchJson(
    `/api/genes${buildQuery({
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches the summary record for a single KO identifier.
 *
 * @param ko KO identifier.
 * @returns The gene summary, or `null` when the backend reports no matching gene.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The function targets the KO-oriented detail route and returns the detail summary contract rather
 * than the lighter explorer row type.
 */
export async function getGeneByKo(ko: string): Promise<GeneDetailSummary | null> {
  return fetchJson(`/api/genes/${encodeURIComponent(ko)}`);
}

/**
 * Fetches the overview payload for a gene detail page.
 *
 * @param ko KO identifier.
 * @returns The aggregated overview payload for the requested gene.
 * @throws Error When the backend request fails.
 */
export async function getGeneDetailOverview(ko: string): Promise<GeneDetailOverviewResponse> {
  return fetchJson(`/api/genes/${encodeURIComponent(ko)}/overview`);
}

/**
 * Fetches compounds associated with a gene detail page.
 *
 * @param ko KO identifier.
 * @param pagination Requested page and page size.
 * @returns A paginated list of compounds associated with the gene.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The default page size is `25`, which keeps the associated-compounds card compact while still
 * surfacing a meaningful slice of the linked compound set.
 */
export async function getGeneAssociatedCompounds(
  ko: string,
  pagination: PaginationParams = { page: 1, pageSize: 25 }
): Promise<PaginatedResponse<GeneAssociatedCompoundRow>> {
  return fetchJson(
    `/api/genes/${encodeURIComponent(ko)}/compounds${buildQuery({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })}`
  );
}

/**
 * Fetches metadata and cross-reference details for a gene.
 *
 * @param ko KO identifier.
 * @returns The gene metadata payload returned by the backend.
 * @throws Error When the backend request fails.
 */
export async function getGeneMetadata(ko: string): Promise<GeneMetadata> {
  return fetchJson(`/api/genes/${encodeURIComponent(ko)}/metadata`);
}
