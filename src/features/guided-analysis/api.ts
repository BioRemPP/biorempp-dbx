/**
 * @packageDocumentation
 *
 * Client-side API wrappers for guided analysis catalog, option-loading, and execution endpoints.
 *
 * This module covers the declarative query catalog, dependent filter option refreshes, and
 * workflow execution requests that return guided analysis result payloads.
 */
import type {
  GuidedCatalogResponse,
  GuidedExecuteRequest,
  GuidedExecutionResponse,
  GuidedQueryOptionsResponse,
} from '@/features/guided-analysis/types';
import { apiUrl, buildQuery, fetchJson } from '@/shared/api/client';

/**
 * Structured error thrown by guided analysis API wrappers.
 */
export class GuidedApiError extends Error {
  /** HTTP status returned by the backend. */
  status: number;
  /** Retry-after hint when the backend reports a rate-limit cooldown. */
  retryAfterSeconds?: number;

  constructor(message: string, status: number, retryAfterSeconds?: number) {
    super(message);
    this.name = 'GuidedApiError';
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Fetches the guided analysis catalog used to populate the guided query interface.
 *
 * @returns The guided analysis catalog response.
 * @throws Error When the backend request fails.
 */
export async function getGuidedCatalog(): Promise<GuidedCatalogResponse> {
  return fetchJson('/api/guided/catalog');
}

/**
 * Fetches filter options for a guided analysis query.
 *
 * @param queryId Guided query identifier.
 * @param selectedFilters Current filter state serialized as request parameters.
 * @returns The available options for the requested guided query.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * The `selectedFilters` object is serialized into the query string so dependent-select filters can
 * be recomputed server-side without issuing a workflow execution request.
 */
export async function getGuidedQueryOptions(
  queryId: string,
  selectedFilters: Record<string, unknown> = {}
): Promise<GuidedQueryOptionsResponse> {
  return fetchJson(`/api/guided/queries/${encodeURIComponent(queryId)}/options${buildQuery(selectedFilters)}`);
}

/**
 * Executes a guided analysis query.
 *
 * @param queryId Guided query identifier.
 * @param payload Execution payload containing filters and pagination options.
 * @returns The guided analysis execution response.
 * @throws Error When the backend request fails.
 *
 * @remarks
 * This wrapper performs a `POST` request directly because the endpoint requires a JSON body. The
 * shared {@link fetchJson} helper is not used here because the request method and headers differ
 * from the default GET-based wrappers in the other feature modules.
 */
export async function executeGuidedQuery(
  queryId: string,
  payload: GuidedExecuteRequest = {}
): Promise<GuidedExecutionResponse> {
  const response = await fetch(apiUrl(`/api/guided/queries/${encodeURIComponent(queryId)}/execute`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text();
    const retryAfterHeader = Number(response.headers.get('retry-after'));
    const fallbackRetryAfterSeconds = Number.isFinite(retryAfterHeader) ? retryAfterHeader : undefined;

    let message = rawBody || `Request failed: ${response.status}`;
    let retryAfterSeconds = fallbackRetryAfterSeconds;

    if (contentType.includes('application/json') && rawBody) {
      try {
        const payload = JSON.parse(rawBody) as {
          error?: unknown;
          retryAfterSeconds?: unknown;
        };

        if (typeof payload.error === 'string' && payload.error.trim() !== '') {
          message = payload.error.trim();
        }

        if (typeof payload.retryAfterSeconds === 'number' && Number.isFinite(payload.retryAfterSeconds)) {
          retryAfterSeconds = payload.retryAfterSeconds;
        }
      } catch {
        // Fall back to the raw body when the backend sends invalid JSON.
      }
    }

    throw new GuidedApiError(message, response.status, retryAfterSeconds);
  }

  return response.json() as Promise<GuidedExecutionResponse>;
}
