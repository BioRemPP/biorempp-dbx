/**
 * @packageDocumentation
 *
 * Top-pathway overview chart used by compound detail pages for source-specific pathway rankings.
 */
import type { PathwayTopDatum } from '@/features/compounds/types';
import { toPathwayTopItems } from '@features/compounds/utils/overviewAdapters';
import { ChartCard } from '@shared/visualization/charts/ChartCard';
import { HorizontalBarChart } from '@shared/visualization/charts/HorizontalBarChart';

/**
 * Props accepted by the top-pathway overview chart.
 */
interface PathwayTopOverviewProps {
  /** Title shown above the pathway ranking chart. */
  title: string;
  /** Ranked pathway summary rows returned by the compound overview endpoint. */
  rows: PathwayTopDatum[];
}

/**
 * Renders a horizontal ranking chart for one set of top pathway annotations.
 *
 * @param props Chart title and pathway ranking rows for the selected source.
 * @returns A chart card with source-specific pathway coverage bars.
 */
export function PathwayTopOverview({ title, rows }: PathwayTopOverviewProps) {
  const items = toPathwayTopItems(rows);

  return (
    <ChartCard title={title} subtitle="Distinct KO↔Pathway relations">
      <HorizontalBarChart
        items={items}
        emptyMessage="No pathway annotations available."
        valueFormatter={(value) => `${value}`}
      />
    </ChartCard>
  );
}
