/**
 * @packageDocumentation
 *
 * Overview tab composition for gene detail pages, combining summary metrics and a compound-by-
 * endpoint toxicity heatmap.
 */
import type { GeneDetailOverviewResponse } from '@/features/genes/types';
import { PathwayToxicityHeatmap } from '@/features/pathways/components/PathwayToxicityHeatmap';
import { MetricCard } from '@/shared/ui/metric-card';

/**
 * Props accepted by the gene overview tab.
 */
interface GeneOverviewTabProps {
  /** Aggregated overview payload returned by the gene detail overview endpoint. */
  overview: GeneDetailOverviewResponse;
}

/**
 * Renders the overview tab for a selected gene detail page.
 *
 * @param props Overview payload with summary metrics and toxicity matrix data.
 * @returns A metric strip followed by a pathway-style toxicity heatmap.
 */
export function GeneOverviewTab({ overview }: GeneOverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Linked Compounds" value={overview.summary.linked_compounds_total} className="rounded-2xl shadow-none" />
        <MetricCard label="With Toxicity" value={overview.summary.toxicity_compounds} className="rounded-2xl shadow-none" />
        <MetricCard label="Excluded (No ToxCSM)" value={overview.summary.excluded_no_toxicity} className="rounded-2xl shadow-none" />
        <MetricCard label="Endpoints" value={overview.summary.endpoint_count} className="rounded-2xl shadow-none" />
        <MetricCard
          label="Toxicity Coverage"
          value={overview.summary.toxicity_coverage_pct == null ? '-' : `${overview.summary.toxicity_coverage_pct}%`}
          className="rounded-2xl shadow-none"
        />
      </div>

      <PathwayToxicityHeatmap
        matrix={overview.toxicity_matrix}
        title="Toxicity Heatmap"
        subtitle="Compounds on Y-axis and grouped endpoints on top"
        rowLabel="Compound"
        rowLabelPlural="linked compounds"
        rowSort="provided"
        totalRowsInScope={overview.summary.linked_compounds_total}
      />
    </div>
  );
}
