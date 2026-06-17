/**
 * @packageDocumentation
 *
 * Guided-analysis visualization renderers and type guards used to map execution payloads to
 * concrete chart components.
 */
import type { ComponentType, ReactNode } from 'react';
import { BoxplotChart } from '@shared/visualization/charts/BoxplotChart';
import { ChartCard } from '@shared/visualization/charts/ChartCard';
import { HorizontalBarChart } from '@shared/visualization/charts/HorizontalBarChart';
import { GuidedToxicityHeatmapMatrix } from '@/features/guided-analysis/components/GuidedToxicityHeatmapMatrix';
import { RiskPotentialScatterChart } from '@/features/guided-analysis/charts/RiskPotentialScatterChart';
import type {
  GuidedBoxplotVisualizationData,
  GuidedHeatmapMatrixVisualizationData,
  GuidedHorizontalBarVisualizationData,
  GuidedScatterVisualizationData,
  GuidedVisualizationResult,
  GuidedVisualizationType,
} from '@/features/guided-analysis/types';
import { VisualizationErrorState } from '@/shared/visualization';

/**
 * Props shared by guided visualization renderer components.
 */
export interface GuidedVisualizationRendererProps {
  /** Resolved visualization entry returned by guided query execution. */
  visualization: GuidedVisualizationResult;
  /** Callback used by renderers that support compound drill-down selection. */
  onCompoundSelect: (cpd: string) => void;
}

type GuidedVisualizationRendererComponent =
  ComponentType<GuidedVisualizationRendererProps>;

function isHorizontalBarData(
  data: unknown
): data is GuidedHorizontalBarVisualizationData {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  return Array.isArray((data as GuidedHorizontalBarVisualizationData).items);
}

function isScatterData(data: unknown): data is GuidedScatterVisualizationData {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  return Array.isArray((data as GuidedScatterVisualizationData).points);
}

function isHeatmapData(
  data: unknown
): data is GuidedHeatmapMatrixVisualizationData {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  const candidate = data as GuidedHeatmapMatrixVisualizationData;
  return (
    Array.isArray(candidate.compounds) &&
    Array.isArray(candidate.endpoints) &&
    Array.isArray(candidate.cells)
  );
}

function isBoxplotData(data: unknown): data is GuidedBoxplotVisualizationData {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }

  return Array.isArray((data as GuidedBoxplotVisualizationData).groups);
}

function renderVisualizationShell(
  visualization: GuidedVisualizationResult,
  children: ReactNode
) {
  return (
    <ChartCard
      key={visualization.id}
      title={visualization.title}
      subtitle={visualization.subtitle || undefined}
    >
      {children}
    </ChartCard>
  );
}

function renderInvalidVisualizationData(visualization: GuidedVisualizationResult) {
  return renderVisualizationShell(
    visualization,
    <VisualizationErrorState
      title="Visualization payload is incompatible"
      message={`Renderer "${visualization.type}" received an unexpected data shape.`}
    />
  );
}

function GuidedHorizontalBarVisualization({
  visualization,
}: GuidedVisualizationRendererProps) {
  if (!isHorizontalBarData(visualization.data)) {
    return renderInvalidVisualizationData(visualization);
  }

  return renderVisualizationShell(
    visualization,
    <HorizontalBarChart
      items={visualization.data.items}
      emptyMessage={visualization.data.empty_message || 'No data available.'}
    />
  );
}

function GuidedScatterVisualization({
  visualization,
  onCompoundSelect,
}: GuidedVisualizationRendererProps) {
  if (!isScatterData(visualization.data)) {
    return renderInvalidVisualizationData(visualization);
  }

  const data = visualization.data;
  const computedSubtitle = [
    visualization.subtitle || `x=${data.x_field}, y=${data.y_field}`,
    `x_scale=${data.x_scale}`,
    `thresholds x=${data.x_threshold}, y=${data.y_threshold}`,
    `basis=${data.threshold_basis}`,
  ].join(' | ');

  return (
    <ChartCard
      key={visualization.id}
      title={visualization.title}
      subtitle={computedSubtitle}
    >
      <RiskPotentialScatterChart
        points={data.points}
        xThreshold={data.x_threshold}
        yThreshold={data.y_threshold}
        xScaleMode={data.x_scale}
        yMetricLabel={data.y_metric_label}
        onSelectCompound={onCompoundSelect}
      />
    </ChartCard>
  );
}

function GuidedHeatmapVisualization({
  visualization,
}: GuidedVisualizationRendererProps) {
  if (!isHeatmapData(visualization.data)) {
    return renderInvalidVisualizationData(visualization);
  }

  return renderVisualizationShell(
    visualization,
    <GuidedToxicityHeatmapMatrix matrix={visualization.data} />
  );
}

function GuidedBoxplotVisualization({
  visualization,
}: GuidedVisualizationRendererProps) {
  if (!isBoxplotData(visualization.data)) {
    return renderInvalidVisualizationData(visualization);
  }

  return renderVisualizationShell(
    visualization,
    <BoxplotChart
      groups={visualization.data.groups}
      emptyMessage={visualization.data.empty_message || 'No data available.'}
      yLabel={visualization.data.y_label}
    />
  );
}

function GuidedUnsupportedVisualization({
  visualization,
}: GuidedVisualizationRendererProps) {
  return renderVisualizationShell(
    visualization,
    <VisualizationErrorState
      title="No renderer registered"
      message={`Visualization type "${visualization.type}" is not registered.`}
    />
  );
}

function GuidedTableVisualization() {
  return null;
}

/**
 * Renderer registry keyed by guided visualization type.
 *
 * @remarks
 * The map is intentionally partial so unknown visualization types fall back to the unsupported
 * renderer rather than failing at definition time.
 */
export const GUIDED_VISUALIZATION_RENDERERS: Partial<
  Record<GuidedVisualizationType, GuidedVisualizationRendererComponent>
> = {
  boxplot: GuidedBoxplotVisualization,
  heatmap_matrix: GuidedHeatmapVisualization,
  horizontal_bar: GuidedHorizontalBarVisualization,
  scatter_quadrant: GuidedScatterVisualization,
  table: GuidedTableVisualization,
};

/**
 * Resolves and renders the correct visualization component for one guided execution entry.
 *
 * @param props Visualization payload and compound drill-down callback.
 * @returns The registered visualization renderer output.
 */
export function renderGuidedVisualization(
  props: GuidedVisualizationRendererProps
) {
  const Renderer =
    GUIDED_VISUALIZATION_RENDERERS[props.visualization.type] ||
    GuidedUnsupportedVisualization;

  return <Renderer {...props} />;
}
