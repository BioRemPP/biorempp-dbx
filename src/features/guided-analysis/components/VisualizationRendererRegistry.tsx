/**
 * @packageDocumentation
 *
 * Registry component that renders the ordered list of guided-analysis visualizations returned by a
 * query execution.
 */
import { Fragment } from 'react';
import { renderGuidedVisualization } from '@/features/guided-analysis/components/visualizationRenderers';
import type { GuidedVisualizationResult } from '@/features/guided-analysis/types';

/**
 * Props accepted by the guided visualization registry.
 */
interface VisualizationRendererRegistryProps {
  /** Ordered visualization entries returned by the current guided execution. */
  visualizations: GuidedVisualizationResult[];
  /** Callback used by visualization renderers that support compound drill-down. */
  onCompoundSelect: (cpd: string) => void;
}

/**
 * Renders all visualization entries returned by the current guided execution.
 *
 * @param props Visualization list and compound drill-down callback.
 * @returns A stacked visualization list, or `null` when no visualizations are present.
 */
export function VisualizationRendererRegistry({
  visualizations,
  onCompoundSelect,
}: VisualizationRendererRegistryProps) {
  if (!visualizations.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {visualizations.map((visualization, index) => (
        <Fragment key={`${visualization.id}-${visualization.data_key}-${index}`}>
          {renderGuidedVisualization({
            visualization,
            onCompoundSelect,
          })}
        </Fragment>
      ))}
    </div>
  );
}
