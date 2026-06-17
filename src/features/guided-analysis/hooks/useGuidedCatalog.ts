/**
 * @packageDocumentation
 *
 * Hook for loading and retrying the guided analysis catalog.
 */
import { useEffect, useState } from 'react';
import { getGuidedCatalog } from '@/features/guided-analysis/api';
import type { GuidedCatalogResponse } from '@/features/guided-analysis/types';

/**
 * Result contract returned by the guided catalog hook.
 */
interface UseGuidedCatalogResult {
  /** Guided analysis catalog returned by the backend. */
  catalog: GuidedCatalogResponse | null;
  /** Whether the catalog is currently loading. */
  catalogLoading: boolean;
  /** User-facing error string for the latest failed catalog load. */
  catalogError: string | null;
  /** Triggers a fresh catalog request. */
  reload: () => void;
}

/**
 * Loads the guided analysis catalog and exposes retry controls.
 *
 * @returns Catalog data together with loading, error, and retry state.
 */
export function useGuidedCatalog(): UseGuidedCatalogResult {
  const [catalog, setCatalog] = useState<GuidedCatalogResponse | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError(null);

      try {
        const response = await getGuidedCatalog();
        if (cancelled) {
          return;
        }

        setCatalog(response);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setCatalogError(error instanceof Error ? error.message : 'Unable to load guided catalog.');
      } finally {
        if (!cancelled) {
          setCatalogLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [reloadVersion]);

  return {
    catalog,
    catalogLoading,
    catalogError,
    reload: () => setReloadVersion((current) => current + 1),
  };
}
