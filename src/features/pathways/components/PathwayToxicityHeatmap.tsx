/**
 * @packageDocumentation
 *
 * Reusable toxicity heatmap component for pathway-like detail views that compare compounds against
 * grouped toxicity endpoints.
 */
import type { PathwayToxicityMatrix } from '@/features/pathways/types';
import type { ToxicityHeatmapDatum } from '@/features/toxicity/types';
import { ChartCard } from '@shared/visualization/charts/ChartCard';
import { formatEndpoint } from '@shared/visualization/utils/visualizationData';
import { toToxicityFacets } from '@features/toxicity/utils/endpointGroups';
import {
  ChartTooltip,
  HeatmapLegend,
  VisualizationEmptyState,
} from '@/shared/visualization';

/**
 * Props accepted by the pathway toxicity heatmap.
 */
interface PathwayToxicityHeatmapProps {
  /** Matrix payload containing compounds, endpoints, and cell values. */
  matrix: PathwayToxicityMatrix;
  /** Optional chart title override. */
  title?: string;
  /** Optional chart subtitle override. */
  subtitle?: string;
  /** Singular label used for the leading sticky row header column. */
  rowLabel?: string;
  /** Plural label used in summary text above the heatmap. */
  rowLabelPlural?: string;
  /** Ordering strategy applied to compound rows before rendering the matrix. */
  rowSort?: 'provided' | 'mean_toxicity_desc';
  /** Optional total row count used when the rendered matrix is a filtered subset. */
  totalRowsInScope?: number;
}

function predictionCellColor(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return '#f3f4f6';
  }

  const ratio = Math.max(0, Math.min(1, value));
  const hue = 130 - ratio * 106;
  const lightness = 86 - ratio * 30;
  return `hsl(${hue}, 78%, ${lightness}%)`;
}

const GROUP_HEADER_CLASS: Record<string, string> = {
  ecotoxicity: 'bg-blue-50 text-blue-800',
  genotoxicity_carcinogenicity: 'bg-rose-50 text-rose-800',
  nuclear_receptors: 'bg-indigo-50 text-indigo-800',
  stress_response: 'bg-amber-50 text-amber-800',
  organ_irritation: 'bg-emerald-50 text-emerald-800',
  other: 'bg-gray-50 text-gray-800',
};

/**
 * Renders a compound-by-endpoint toxicity heatmap with grouped endpoint headers.
 *
 * @param props Matrix payload and presentation controls for titles, labels, and row sorting.
 * @returns A chart card containing the grouped toxicity matrix or an empty-state message.
 *
 * @remarks
 * Endpoint ordering is derived from toxicity facet definitions. When `rowSort` is
 * `mean_toxicity_desc`, compound rows are re-ranked by the mean of their available endpoint values.
 */
export function PathwayToxicityHeatmap({
  matrix,
  title = 'Toxicity Heatmap',
  subtitle = 'Compounds on Y-axis and grouped endpoints on top',
  rowLabel = 'Compound',
  rowLabelPlural = 'Compounds',
  rowSort = 'mean_toxicity_desc',
  totalRowsInScope,
}: PathwayToxicityHeatmapProps) {
  const endpointSeed: ToxicityHeatmapDatum[] = matrix.endpoints.map((endpoint) => ({
    endpoint,
    label: null,
    value: null,
    risk_bucket: 'unknown',
  }));
  const facets = toToxicityFacets(endpointSeed);
  const endpointOrder = facets.flatMap((facet) => facet.endpoints.map((endpoint) => endpoint.endpoint));

  const cellMap = new Map(
    matrix.cells.map((cell) => [`${cell.cpd}|${cell.endpoint}`, cell] as const)
  );
  const minTableWidth = Math.max(760, 280 + endpointOrder.length * 52);

  const compounds =
    rowSort === 'mean_toxicity_desc'
      ? matrix.compounds
          .map((compound) => {
            let sum = 0;
            let count = 0;
            for (const endpoint of endpointOrder) {
              const value = cellMap.get(`${compound.cpd}|${endpoint}`)?.value ?? null;
              if (value !== null && Number.isFinite(value)) {
                sum += value;
                count += 1;
              }
            }
            return {
              ...compound,
              meanToxicity: count > 0 ? sum / count : -1,
            };
          })
          .sort(
            (a, b) =>
              b.meanToxicity - a.meanToxicity || (a.compoundname || a.cpd).localeCompare(b.compoundname || b.cpd)
          )
      : matrix.compounds;

  const rowsInScope = totalRowsInScope ?? matrix.compounds.length;

  if (endpointOrder.length === 0 || compounds.length === 0) {
    return (
      <ChartCard title={title} subtitle={`No toxicity data available for ${rowLabelPlural.toLowerCase()}.`}>
        <VisualizationEmptyState message="No matrix data available." />
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div className="space-y-3">
        <p className="text-xs text-gray-600">
          Showing {compounds.length} of {rowsInScope} {rowLabelPlural.toLowerCase()}
        </p>

        <HeatmapLegend />

        <div className="max-h-[480px] overflow-auto">
          <table
            className="w-full table-fixed border-separate border-spacing-1"
            style={{ minWidth: `${minTableWidth}px` }}
          >
            <thead>
              <tr>
                <th className="sticky top-0 left-0 z-30 bg-white px-2 py-1 text-left text-[11px] font-medium text-gray-600 w-60">
                  {rowLabel}
                </th>
                {facets.map((facet) => (
                  <th
                    key={facet.key}
                    colSpan={facet.endpoints.length}
                    className={`sticky top-0 z-20 px-2 py-2 text-left text-[11px] font-semibold rounded ${
                      GROUP_HEADER_CLASS[facet.key] || GROUP_HEADER_CLASS.other
                    }`}
                    title={facet.title}
                  >
                    {facet.title}
                  </th>
                ))}
              </tr>

              <tr>
                <th className="sticky top-[34px] left-0 z-30 bg-white px-2 py-1 text-left text-[10px] font-medium text-gray-500">
                  Endpoint
                </th>
                {facets.flatMap((facet) =>
                  facet.endpoints.map((endpoint) => (
                    <th
                      key={`endpoint-${endpoint.endpoint}`}
                      className="sticky top-[34px] z-10 bg-white px-1 pt-1 pb-0 text-left text-[10px] font-medium text-gray-600 align-bottom h-16"
                    >
                      <div className="h-14 relative">
                        <span
                          title={formatEndpoint(endpoint.endpoint)}
                          className="absolute left-1 bottom-0 origin-bottom-left -rotate-45 whitespace-nowrap"
                        >
                          {endpoint.shortLabel}
                        </span>
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {compounds.map((compound) => (
                <tr key={compound.cpd}>
                  <th
                    className="sticky left-0 z-10 bg-white px-2 py-1 text-left text-xs font-medium text-gray-700"
                    title={`${compound.compoundname || compound.cpd} (${compound.cpd})`}
                  >
                    <span className="block truncate max-w-[220px]">{compound.compoundname || compound.cpd}</span>
                    <span className="block text-[10px] text-gray-400 font-normal">{compound.cpd}</span>
                  </th>

                  {endpointOrder.map((endpoint) => {
                    const cell = cellMap.get(`${compound.cpd}|${endpoint}`);
                    const value = cell?.value ?? null;
                    return (
                      <td key={`${compound.cpd}|${endpoint}`} className="p-0">
                        <ChartTooltip
                          content={`${compound.compoundname || compound.cpd} | ${formatEndpoint(endpoint)}: ${
                            value === null ? '-' : value.toFixed(4)
                          }`}
                          className="h-7 rounded border border-gray-100"
                          style={{ backgroundColor: predictionCellColor(value) }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ChartCard>
  );
}
