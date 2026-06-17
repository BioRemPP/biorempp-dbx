/**
 * @packageDocumentation
 *
 * Shared chart dimensions for guided-analysis scatter renderers.
 */
/**
 * Full SVG width of guided-analysis scatter charts, in pixels.
 */
export const SCATTER_WIDTH = 980;
/**
 * Full SVG height of guided-analysis scatter charts, in pixels.
 */
export const SCATTER_HEIGHT = 560;
/**
 * Outer chart margins that reserve space for axes and labels.
 */
export const SCATTER_MARGIN = { top: 36, right: 36, bottom: 72, left: 72 };
/**
 * Inner plot width after subtracting chart margins, in pixels.
 */
export const SCATTER_PLOT_WIDTH =
  SCATTER_WIDTH - SCATTER_MARGIN.left - SCATTER_MARGIN.right;
/**
 * Inner plot height after subtracting chart margins, in pixels.
 */
export const SCATTER_PLOT_HEIGHT =
  SCATTER_HEIGHT - SCATTER_MARGIN.top - SCATTER_MARGIN.bottom;
