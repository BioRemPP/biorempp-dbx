/**
 * @packageDocumentation
 *
 * Guided results section that renders visualizations, paginated tables, and drill-down behavior
 * for compound, gene, and pathway oriented use cases.
 */
import { GuidedResultTable } from '@/features/guided-analysis/components/GuidedResultTable';
import { VisualizationRendererRegistry } from '@/features/guided-analysis/components/VisualizationRendererRegistry';
import type { GuidedExecutionResponse } from '@/features/guided-analysis/types';
import { LoadingState } from '@/shared/feedback';
import { GuidedStatusBanner } from '@/features/guided-analysis/components/GuidedStatusBanner';
import { useMemo, useState } from 'react';

/**
 * Props accepted by the guided results section.
 */
interface GuidedResultsSectionProps {
  /** Latest guided execution payload returned by the backend. */
  execution: GuidedExecutionResponse | null;
  /** Whether a guided execution request is currently in flight. */
  executionLoading: boolean;
  /** User-facing error string from the latest failed execution. */
  executionError: string | null;
  /** Callback used to open compound detail pages from guided outputs. */
  onCompoundSelect: (cpd: string) => void;
  /** Optional callback used to open gene detail pages from guided outputs. */
  onGeneSelect?: (ko: string) => void;
  /** Optional callback used to open the gene explorer with a prefilled search fallback. */
  onGeneExplorerSelect?: (payload: { search: string; notice: string }) => void;
  /** Optional callback used to open pathway detail pages from guided outputs. */
  onPathwaySelect?: (pathway: string, source?: string) => void;
  /** Callback used to request a different table page. */
  onPageChange: (page: number) => void;
}

/**
 * Renders guided execution results with drill-down behavior tuned to the active use case.
 *
 * @param props Execution payload, loading/error state, drill-down callbacks, and pagination.
 * @returns Guided visualizations and tabular results for the current execution.
 *
 * @remarks
 * Certain use cases receive client-side result shaping before rendering so page-scoped visual
 * elements stay aligned with the currently visible table rows.
 */
export function GuidedResultsSection({
  execution,
  executionLoading,
  executionError,
  onCompoundSelect,
  onGeneSelect,
  onGeneExplorerSelect,
  onPathwaySelect,
  onPageChange,
}: GuidedResultsSectionProps) {
  const [geneDrilldownError, setGeneDrilldownError] = useState<string | null>(null);

  function buildExecutionWithPageScopedUc8Visuals(
    currentExecution: GuidedExecutionResponse
  ): GuidedExecutionResponse {
    if (currentExecution.meta.query_id !== 'uc8_genes_linked_toxic_compounds') {
      return currentExecution;
    }

    const pageGeneOrder = (currentExecution.table?.rows || [])
      .map((row) => (typeof row.genesymbol === 'string' ? row.genesymbol.trim() : ''))
      .filter((value) => value.length > 0);

    if (pageGeneOrder.length === 0) {
      return currentExecution;
    }

    const pageGeneSet = new Set(pageGeneOrder);

    const visualizations = currentExecution.visualizations.map((visualization) => {
      if (visualization.id === 'uc8_bar') {
        const data = visualization.data;
        if (!data || typeof data !== 'object' || !Array.isArray((data as { items?: unknown[] }).items)) {
          return visualization;
        }

        const rawItems = (data as { items: Array<{ id?: unknown }> }).items;
        const itemById = new Map(
          rawItems
            .filter((item) => typeof item.id === 'string')
            .map((item) => [String(item.id), item])
        );

        const orderedItems = pageGeneOrder
          .map((geneSymbol) => itemById.get(geneSymbol))
          .filter((item) => item !== undefined);

        return {
          ...visualization,
          data: {
            ...(data as Record<string, unknown>),
            items: orderedItems,
          },
        };
      }

      if (visualization.id === 'uc8_boxplot') {
        const data = visualization.data;
        if (!data || typeof data !== 'object' || !Array.isArray((data as { groups?: unknown[] }).groups)) {
          return visualization;
        }

        const rawGroups = (data as { groups: Array<{ id?: unknown }> }).groups;
        const groupById = new Map(
          rawGroups
            .filter((group) => typeof group.id === 'string')
            .map((group) => [String(group.id), group])
        );

        const orderedGroups = pageGeneOrder
          .map((geneSymbol) => groupById.get(geneSymbol))
          .filter((group) => group !== undefined);

        const fallbackGroups = orderedGroups.length > 0
          ? orderedGroups
          : rawGroups.filter((group) => typeof group.id === 'string' && pageGeneSet.has(String(group.id)));

        return {
          ...visualization,
          data: {
            ...(data as Record<string, unknown>),
            groups: fallbackGroups,
          },
        };
      }

      return visualization;
    });

    return {
      ...currentExecution,
      visualizations,
    };
  }

  function normalizePathwaySource(rawSource: unknown): string | undefined {
    if (typeof rawSource !== 'string') {
      return undefined;
    }
    const normalized = rawSource.trim().toUpperCase();
    if (!normalized || normalized === 'ALL' || normalized === 'MIXED') {
      return undefined;
    }
    return normalized;
  }

  const activeExecution = useMemo(
    () => (execution ? buildExecutionWithPageScopedUc8Visuals(execution) : null),
    [execution]
  );

  if (!execution && executionLoading) {
    return (
      <LoadingState
        title="Executing query..."
        message="Preparing guided results and visualizations."
      />
    );
  }

  if (executionError && !execution) {
    return (
      <GuidedStatusBanner tone="error">
        Unable to execute guided query: {executionError}
      </GuidedStatusBanner>
    );
  }

  if (!execution) {
    return null;
  }
  const renderedExecution = activeExecution ?? execution;

  function handleGuidedRowSelect(row: Record<string, unknown>) {
    setGeneDrilldownError(null);

    const queryId = renderedExecution.meta.query_id;

    const isPathwayDrilldownQuery =
      queryId === 'uc5_pathways_functional_coverage' ||
      queryId === 'uc6_pathways_toxic_compounds';

    if (isPathwayDrilldownQuery && onPathwaySelect) {
      const pathway = typeof row.pathway === 'string' ? row.pathway.trim() : '';
      if (!pathway) {
        return;
      }
      const source = normalizePathwaySource(row.source);
      onPathwaySelect(pathway, source);
      return;
    }

    const isGeneDrilldownQuery =
      queryId === 'uc7_genes_most_connected' ||
      queryId === 'uc8_genes_linked_toxic_compounds';

    if (isGeneDrilldownQuery) {
      const ko = typeof row.ko === 'string' ? row.ko.trim().toUpperCase() : '';
      if (ko && onGeneSelect) {
        onGeneSelect(ko);
        return;
      }

      const geneSymbol = typeof row.genesymbol === 'string' ? row.genesymbol.trim() : '';
      if (geneSymbol && onGeneExplorerSelect) {
        onGeneExplorerSelect({
          notice: `KO detail was unavailable for "${geneSymbol}". Showing Gene / KO Explorer results filtered by this symbol instead.`,
          search: geneSymbol,
        });
        return;
      }

      setGeneDrilldownError(
        geneSymbol
          ? 'Gene drill-down is unavailable for this guided result.'
          : 'Unable to open gene detail because this guided result does not include a KO or gene symbol.'
      );
      return;
    }

    const clickField = renderedExecution.table?.row_click_field;
    const clickValue = clickField ? row[clickField] : null;
    if (typeof clickValue === 'string' && clickValue.trim() !== '') {
      onCompoundSelect(clickValue);
    }
  }

  return (
    <div className="space-y-4" aria-busy={executionLoading}>
      {executionLoading ? (
        <GuidedStatusBanner tone="info">Refreshing results...</GuidedStatusBanner>
      ) : null}
      {executionError ? (
        <GuidedStatusBanner tone="error">
          Unable to execute guided query: {executionError}
        </GuidedStatusBanner>
      ) : null}
      {geneDrilldownError ? (
        <GuidedStatusBanner tone="error">{geneDrilldownError}</GuidedStatusBanner>
      ) : null}
      <VisualizationRendererRegistry
        visualizations={renderedExecution.visualizations}
        onCompoundSelect={onCompoundSelect}
      />
      <GuidedResultTable
        table={renderedExecution.table}
        onCompoundSelect={onCompoundSelect}
        onRowSelect={handleGuidedRowSelect}
        onPageChange={onPageChange}
      />
    </div>
  );
}
