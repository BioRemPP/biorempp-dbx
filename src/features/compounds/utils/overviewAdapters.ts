/**
 * @packageDocumentation
 *
 * Adapter helpers that map compound overview payloads into visualization component inputs.
 */
import type {
  KoBarDatum,
  PathwayCoverageMatrix,
  PathwayTopDatum,
} from '@/features/compounds/types';
import type { ToxicityRiskBucket } from '@/features/toxicity/types';
import type { HeatmapCell } from '@shared/visualization/charts/CategoricalHeatmap';
import type { HorizontalBarItem } from '@shared/visualization/charts/HorizontalBarChart';

/**
 * Converts KO distribution rows into horizontal bar chart items.
 *
 * @param rows KO distribution rows returned by the compound overview payload.
 * @returns Bar items ready for the shared horizontal bar chart.
 */
export function toKoBarItems(rows: KoBarDatum[]): HorizontalBarItem[] {
  return rows.map((row) => ({
    id: row.ko,
    label: row.ko,
    value: row.count,
    tooltip: `${row.ko}: ${row.count} distinct KO-Pathway relations (HADEG=${row.relation_count_hadeg}, KEGG=${row.relation_count_kegg})`,
    color: '#2563eb',
  }));
}

/**
 * Converts top-pathway rows into horizontal bar chart items.
 *
 * @param rows Ranked pathway rows returned by the compound overview payload.
 * @returns Bar items ready for the shared horizontal bar chart.
 */
export function toPathwayTopItems(rows: PathwayTopDatum[]): HorizontalBarItem[] {
  return rows.map((row) => ({
    id: `${row.source}|${row.pathway}`,
    label: row.pathway,
    value: row.supporting_rows,
    tooltip: `${row.pathway} [${row.source}] - ${row.supporting_rows} distinct KO-Pathway relations`,
    color: row.source === 'HADEG' ? '#3b82f6' : row.source === 'KEGG' ? '#22c55e' : '#64748b',
  }));
}

/**
 * Converts a pathway coverage matrix into categorical heatmap inputs.
 *
 * @param matrix Cross-source pathway coverage matrix returned by the overview payload.
 * @returns Axis labels and heatmap cells ready for the shared categorical heatmap.
 */
export function toPathwayCoverageHeatmap(matrix: PathwayCoverageMatrix): {
  xLabels: string[];
  yLabels: string[];
  cells: HeatmapCell[];
} {
  return {
    xLabels: matrix.pathways,
    yLabels: matrix.sources,
    cells: matrix.cells.map((cell) => ({
      x: cell.pathway,
      y: cell.source,
      value: cell.weight,
      displayValue: cell.present ? String(cell.weight) : '',
      tooltip: `${cell.source} x ${cell.pathway}: ${
        cell.present ? `${cell.weight} distinct KO-Pathway relations` : 'not present'
      }`,
    })),
  };
}

/**
 * Converts a qualitative toxicity risk bucket into a normalized numeric score.
 *
 * @param bucket Qualitative toxicity risk bucket.
 * @returns A score in the range `0..1` used by visualization layers.
 */
export function riskBucketToScore(bucket: ToxicityRiskBucket) {
  if (bucket === 'high_risk') return 1;
  if (bucket === 'medium_risk') return 0.66;
  if (bucket === 'low_risk') return 0.33;
  return 0;
}

/**
 * Converts a qualitative toxicity risk bucket into a human-readable label.
 *
 * @param bucket Qualitative toxicity risk bucket.
 * @returns A display label suitable for legends and tooltips.
 */
export function riskBucketLabel(bucket: ToxicityRiskBucket) {
  if (bucket === 'high_risk') return 'High Risk';
  if (bucket === 'medium_risk') return 'Medium Risk';
  if (bucket === 'low_risk') return 'Low Risk';
  return 'Unknown';
}
