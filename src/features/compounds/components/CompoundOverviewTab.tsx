/**
 * @packageDocumentation
 *
 * Overview tab composition for compound detail pages, combining KO, pathway, and toxicity
 * summaries from the compound overview endpoint.
 */
import type { CompoundOverviewResponse } from '@/features/compounds/types';
import { KoBarOverview } from '@/features/compounds/components/overview/KoBarOverview';
import { PathwayTopOverview } from '@/features/compounds/components/overview/PathwayTopOverview';
import { ToxicityHeatmapOverview } from '@/features/compounds/components/overview/ToxicityHeatmapOverview';

/**
 * Props accepted by the compound overview tab.
 */
interface CompoundOverviewTabProps {
  /** Aggregated overview payload returned by the compound overview endpoint. */
  overview: CompoundOverviewResponse;
}

/**
 * Renders the chart-driven overview tab for a compound detail page.
 *
 * @param props Overview payload with KO, pathway, and toxicity summary datasets.
 * @returns A stacked layout of overview visualizations for the selected compound.
 */
export function CompoundOverviewTab({ overview }: CompoundOverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <KoBarOverview rows={overview.ko_bar} />
        <PathwayTopOverview title="Top KEGG Pathways" rows={overview.pathways_top_kegg} />
        <PathwayTopOverview title="Top HADEG Pathways" rows={overview.pathways_top_hadeg} />
      </div>
      <ToxicityHeatmapOverview rows={overview.toxicity_heatmap} />
    </div>
  );
}
