/**
 * @packageDocumentation
 *
 * Shared legend component for heatmap-style visualizations with optional discrete items and a
 * continuous color scale.
 */
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { ChartLegend, type ChartLegendItem } from '@/shared/visualization/ChartLegend';

/**
 * Props accepted by the shared heatmap legend.
 */
interface HeatmapLegendProps {
  /** Optional discrete legend items shown before the gradient scale. */
  discreteItems?: ChartLegendItem[];
  /** Optional label shown beside the discrete legend group. */
  scaleLabel?: string;
  /** Label shown at the low end of the gradient scale. */
  lowLabel?: string;
  /** Label shown at the high end of the gradient scale. */
  highLabel?: string;
  /** CSS gradient string used for the continuous scale swatch. */
  gradient?: string;
  /** Optional footer content shown below the legend. */
  footer?: ReactNode;
  /** Optional className forwarded to the outer legend container. */
  className?: string;
}

const DEFAULT_GRADIENT =
  'linear-gradient(90deg, hsl(130,78%,86%), hsl(24,78%,56%))';

/**
 * Renders a shared legend for heatmap-based visualizations.
 *
 * @param props Discrete items, gradient scale labels, footer content, and container className.
 * @returns A composite legend with optional discrete and continuous sections.
 */
export function HeatmapLegend({
  discreteItems = [],
  scaleLabel,
  lowLabel = 'Low',
  highLabel = 'High',
  gradient = DEFAULT_GRADIENT,
  footer,
  className,
}: HeatmapLegendProps) {
  return (
    <div
      className={cn(
        'space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3',
        className
      )}
    >
      {discreteItems.length > 0 || scaleLabel ? (
        <div className="flex items-center justify-between gap-3">
          <ChartLegend items={discreteItems} />
          {scaleLabel ? (
            <div className="text-[11px] whitespace-nowrap text-slate-600">
              {scaleLabel}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span>{lowLabel}</span>
        <div
          className="h-2 flex-1 rounded border border-slate-200"
          style={{ background: gradient }}
        />
        <span>{highLabel}</span>
      </div>

      {footer ? <div className="text-xs text-slate-600">{footer}</div> : null}
    </div>
  );
}
