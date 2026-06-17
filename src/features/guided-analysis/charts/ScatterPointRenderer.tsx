/**
 * @packageDocumentation
 *
 * Point renderer for guided-analysis scatter charts.
 */
import type { GuidedScatterPoint } from '@/features/guided-analysis/types';

/**
 * Props accepted by the scatter-point renderer.
 */
interface ScatterPointRendererProps {
  /** Scatter points returned by the guided execution payload. */
  points: GuidedScatterPoint[];
  /** Human-readable label used inside point tooltips for the y metric. */
  yMetricLabel: string;
  /** Color mapping keyed by compound class. */
  classColorMap: Map<string, string>;
  /** Position resolver for the x coordinate. */
  getX: (point: GuidedScatterPoint) => number;
  /** Position resolver for the y coordinate. */
  getY: (point: GuidedScatterPoint) => number;
  /** Radius resolver for point sizing. */
  getRadius: (point: GuidedScatterPoint) => number;
  /** Callback invoked when a point opens a compound detail view. */
  onSelectCompound: (cpd: string) => void;
}

/**
 * Renders interactive scatter points with class coloring and point-level tooltips.
 *
 * @param props Scatter points, positioning helpers, colors, and drill-down callback.
 * @returns SVG circle elements for each scatter point.
 */
export function ScatterPointRenderer({
  points,
  yMetricLabel,
  classColorMap,
  getX,
  getY,
  getRadius,
  onSelectCompound,
}: ScatterPointRendererProps) {
  return (
    <>
      {points.map((point) => {
        const classKey = point.compoundclass || 'Unclassified';
        const color = classColorMap.get(classKey) || '#64748b';

        return (
          <circle
            key={point.cpd}
            data-testid={`scatter-point-${point.cpd}`}
            cx={getX(point)}
            cy={getY(point)}
            r={getRadius(point)}
            fill={color}
            fillOpacity={0.75}
            stroke="#1f2937"
            strokeOpacity={0.25}
            strokeWidth={0.75}
            className="cursor-pointer"
            onClick={() => onSelectCompound(point.cpd)}
          >
            <title>
              {`${point.compoundname || point.cpd} (${point.cpd}) | class=${
                point.compoundclass || 'Unclassified'
              } | gene_count=${point.gene_count} | ${yMetricLabel}=${point.y_value.toFixed(
                3
              )} | pathway_count=${point.pathway_count}`}
            </title>
          </circle>
        );
      })}
    </>
  );
}
