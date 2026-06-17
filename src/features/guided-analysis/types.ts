/**
 * @packageDocumentation
 *
 * Catalog, filter, request, and visualization contracts for guided analysis workflows.
 */
import type { HorizontalBarItem } from '@shared/visualization/charts/HorizontalBarChart';
/**
 * Supported filter control types declared by guided query definitions.
 */
export type GuidedFilterType = 'select' | 'number_range' | 'search' | 'dependent_select' | 'toggle';
/**
 * Supported option provider strategies for guided filters.
 */
export type GuidedProviderType = 'meta_endpoint' | 'static' | 'query_derived';
/**
 * Supported visualization types returned by guided query execution.
 */
export type GuidedVisualizationType = 'horizontal_bar' | 'scatter_quadrant' | 'heatmap_matrix' | 'boxplot' | 'table';
/**
 * Supported column renderers for guided analysis result tables.
 */
export type GuidedTableColumnType = 'text' | 'number' | 'compound_link';

/**
 * Category entry used to group guided analysis queries.
 */
export interface GuidedCategory {
  /** Stable category identifier used by the catalog. */
  id: string;
  /** Display label shown to users. */
  label: string;
}

/**
 * Single option returned or declared for a guided filter provider.
 */
export interface GuidedFilterProviderOption {
  /** Stored filter value sent back to the backend. */
  value: string;
  /** Human-readable option label shown in the UI. */
  label: string;
}

/**
 * Data provider configuration used to populate guided filter options.
 */
export interface GuidedFilterProvider {
  /** Provider strategy used to resolve the option list. */
  type: GuidedProviderType;
  /** Metadata endpoint used when `type` resolves options remotely. */
  endpoint?: string;
  /** Optional source discriminator forwarded to metadata endpoints. */
  source?: string;
  /** Whether the provider exposes a synthetic mean option. */
  include_mean_option?: boolean;
  /** Label used for the synthetic mean option when enabled. */
  mean_option_label?: string;
  /** Inline static options when `type` is `static`. */
  options?: GuidedFilterProviderOption[];
}

/**
 * Filter definition declared by a guided query.
 */
export interface GuidedFilterDefinition {
  /** Stable filter identifier used in request payloads. */
  id: string;
  /** UI control type used to render the filter. */
  type: GuidedFilterType;
  /** Human-readable label shown in the filter panel. */
  label: string;
  /** Placeholder text for search-like controls. */
  placeholder?: string;
  /** Placeholder text for the minimum input of range controls. */
  min_placeholder?: string;
  /** Placeholder text for the maximum input of range controls. */
  max_placeholder?: string;
  /** Upstream filter identifier required before this filter becomes available. */
  depends_on?: string;
  /** Inclusive numeric minimum for range filters. */
  min?: number;
  /** Inclusive numeric maximum for range filters. */
  max?: number;
  /** Numeric step used by range filters. */
  step?: number;
  /** Option provider definition used by select-like controls. */
  provider?: GuidedFilterProvider;
}

/**
 * Summary card definition declared by a guided query.
 */
export interface GuidedSummaryCardDefinition {
  /** Stable summary card identifier. */
  id: string;
  /** Display label shown above the summary value. */
  label: string;
  /** Key used to resolve the summary value from execution results. */
  value_key: string;
  /** Optional explanatory hint shown alongside the summary card. */
  hint?: string;
}

/**
 * Visualization definition declared by a guided query.
 */
export interface GuidedVisualizationDefinition {
  /** Stable visualization identifier. */
  id: string;
  /** Visualization renderer used by the client. */
  type: GuidedVisualizationType;
  /** Primary chart title shown in the UI. */
  title: string;
  /** Optional subtitle shown below the chart title. */
  subtitle?: string;
  /** Key used to resolve the visualization data from execution results. */
  data_key: string;
}

/**
 * Column definition used by guided result tables.
 */
export interface GuidedTableColumnDefinition {
  /** Stable column identifier and row lookup key. */
  id: string;
  /** Header label shown to the user. */
  label: string;
  /** Renderer type used for the column values. */
  type: GuidedTableColumnType;
}

/**
 * Table definition declared by a guided query.
 */
export interface GuidedTableDefinition {
  /** Stable table identifier. */
  id: string;
  /** Primary table title shown in the UI. */
  title: string;
  /** Optional subtitle shown below the title. */
  subtitle?: string;
  /** Row field used to build drill-down navigation on click. */
  row_click_field?: string;
  /** Message shown when the table has no rows. */
  empty_message?: string;
  /** Ordered column definitions used to render rows. */
  columns: GuidedTableColumnDefinition[];
}

/**
 * Visual element descriptor used inside guided use-case descriptions.
 */
export interface GuidedUseCaseVisualElement {
  /** Visual element label. */
  label: string;
  /** Short explanation of what the visual element represents. */
  description: string;
}

/**
 * Narrative use-case description attached to a guided query definition.
 */
export interface GuidedUseCaseDescription {
  /** Scientific question that the guided query helps answer. */
  scientific_question: string;
  /** High-level description of the use case. */
  description: string;
  /** Optional visual element descriptors shown alongside the use case. */
  visual_elements?: GuidedUseCaseVisualElement[];
  /** Interpretation bullets shown to the user when reading the use-case guidance. */
  interpretation_guidelines: string[];
  /** Stated limitations that bound interpretation of the use case. */
  limitations: string[];
  /** Optional semantic color family used by the descriptive panel. */
  color_scheme?: string;
}

/**
 * Single step included in a guided methods modal.
 */
export interface GuidedMethodsStep {
  /** Step title shown in the modal. */
  title: string;
  /** Step description shown in the modal body. */
  description: string;
  /** Optional bullet list expanding the step description. */
  bullets?: string[];
}

/**
 * Methods modal content attached to a guided query definition.
 */
export interface GuidedMethodsModal {
  /** Label shown on the button that opens the modal. */
  button_label: string;
  /** Modal title. */
  title: string;
  /** Introductory paragraph shown before the steps. */
  introduction: string;
  /** Ordered step list describing the method. */
  steps: GuidedMethodsStep[];
  /** Optional closing note shown at the end of the modal. */
  footer_note?: string;
}

/**
 * Guided query definition returned by the catalog endpoint.
 */
export interface GuidedQueryDefinition {
  /** Stable query identifier used in route state and API requests. */
  id: string;
  /** Category identifier grouping the query in the catalog. */
  category: string;
  /** Display title shown to users. */
  title: string;
  /** User-facing question phrased by the query. */
  question: string;
  /** Narrative description of what the query investigates. */
  description: string;
  /** Dataset identifier used by the backend executor. */
  dataset: string;
  /** Executor identifier used by the backend to run the query. */
  executor: string;
  /** Default filter and option values applied before execution. */
  defaults: Record<string, unknown>;
  /** Executor-specific configuration forwarded to the backend. */
  executor_config: Record<string, unknown>;
  /** Filter controls available for the query. */
  filters: GuidedFilterDefinition[];
  /** Use-case narrative shown in the guided analysis UI. */
  use_case_description: GuidedUseCaseDescription;
  /** Methods modal content shown in the guided analysis UI. */
  methods_modal: GuidedMethodsModal;
  /** Summary cards configured for the query. */
  summary_cards: GuidedSummaryCardDefinition[];
  /** Visualization definitions configured for the query. */
  visualizations: GuidedVisualizationDefinition[];
  /** Table definition configured for the query, when present. */
  table: GuidedTableDefinition | null;
}

/**
 * Catalog payload returned by guided analysis definition endpoints.
 */
export interface GuidedCatalogResponse {
  /** Catalog version string. */
  version: string;
  /** Catalog title shown in the guided analysis landing view. */
  title: string;
  /** Available guided analysis categories. */
  categories: GuidedCategory[];
  /** Available guided analysis queries. */
  queries: GuidedQueryDefinition[];
  /** Catalog generation timestamp when available. */
  generated_at: string | null;
}

/**
 * Resolved option item returned by guided filter option endpoints.
 */
export interface GuidedFilterOption {
  /** Stored filter value sent back to the backend. */
  value: string;
  /** Human-readable option label shown in the UI. */
  label: string;
  /** Optional grouping key used to cluster options in the UI. */
  group_key?: string;
  /** Optional grouping label shown for the option cluster. */
  group_title?: string;
}

/**
 * Options payload returned for a specific guided query.
 */
export interface GuidedQueryOptionsResponse {
  /** Guided query identifier that owns the returned option sets. */
  query_id: string;
  /** Map of filter identifiers to their available options. */
  options: Record<string, GuidedFilterOption[]>;
}

/**
 * Quadrant counts returned by scatter-based guided visualizations.
 */
export interface GuidedQuadrantCounts {
  /** Number of points in the top-right quadrant. */
  top_right: number;
  /** Number of points in the top-left quadrant. */
  top_left: number;
  /** Number of points in the bottom-right quadrant. */
  bottom_right: number;
  /** Number of points in the bottom-left quadrant. */
  bottom_left: number;
}

/**
 * Valid quadrant identifiers derived from `GuidedQuadrantCounts`.
 */
export type GuidedQuadrantId = keyof GuidedQuadrantCounts;

/**
 * Point rendered by guided scatter-quadrant visualizations.
 */
export interface GuidedScatterPoint {
  /** Compound identifier represented by the point. */
  cpd: string;
  /** Compound display name when available. */
  compoundname: string | null;
  /** Compound class label when available. */
  compoundclass: string | null;
  /** Number of genes linked to the compound. */
  gene_count: number;
  /** Number of KO identifiers linked to the compound. */
  ko_count: number;
  /** Number of pathways linked to the compound. */
  pathway_count: number;
  /** Mean toxicity risk score across supported endpoints. */
  toxicity_risk_mean: number | null;
  /** Metric value plotted on the y axis. */
  y_value: number;
  /** Quadrant assignment derived by the backend. */
  quadrant: GuidedQuadrantId;
}

/**
 * Scatter visualization payload returned by guided query execution.
 */
export interface GuidedScatterVisualizationData {
  /** Points rendered by the scatter view. */
  points: GuidedScatterPoint[];
  /** Threshold applied to the x axis. */
  x_threshold: number;
  /** Threshold applied to the y axis. */
  y_threshold: number;
  /** Source field name used for the x axis metric. */
  x_field: string;
  /** Source field name used for the y axis metric. */
  y_field: string;
  /** Human-readable label for the y axis metric. */
  y_metric_label: string;
  /** Endpoint used to derive the y axis metric. */
  endpoint: string;
  /** Scale mode applied to the x axis. */
  x_scale: 'log10p1' | 'linear';
  /** Backend explanation for how thresholds were chosen. */
  threshold_basis: string;
}

/**
 * Horizontal bar visualization payload returned by guided query execution.
 */
export interface GuidedHorizontalBarVisualizationData {
  /** Chart items rendered by the horizontal bar component. */
  items: HorizontalBarItem[];
  /** Message shown when the chart has no items. */
  empty_message: string;
}

/**
 * Single boxplot group returned by guided query execution.
 */
export interface GuidedBoxplotGroup {
  /** Stable group identifier. */
  id: string;
  /** Human-readable group label. */
  label: string;
  /** Number of observations included in the group. */
  count: number;
  /** Minimum value included in the group. */
  min: number;
  /** First quartile value. */
  q1: number;
  /** Median value. */
  median: number;
  /** Third quartile value. */
  q3: number;
  /** Maximum value included in the group. */
  max: number;
  /** Optional raw points exposed for drill-down or overlays. */
  points?: GuidedBoxplotPoint[];
}

/**
 * Raw point optionally included in a guided boxplot group.
 */
export interface GuidedBoxplotPoint {
  /** Compound identifier represented by the point. */
  cpd: string;
  /** Compound display name when available. */
  compoundname?: string | null;
  /** Endpoint associated with the toxicity value when relevant. */
  endpoint?: string;
  /** Numeric toxicity value represented by the point. */
  toxicity_value: number;
}

/**
 * Boxplot visualization payload returned by guided query execution.
 */
export interface GuidedBoxplotVisualizationData {
  /** Ordered boxplot groups rendered by the chart. */
  groups: GuidedBoxplotGroup[];
  /** Message shown when the chart has no groups. */
  empty_message: string;
  /** Optional y-axis label supplied by the backend. */
  y_label?: string;
}

/**
 * Compound header entry used by guided heatmap matrix visualizations.
 */
export interface GuidedHeatmapMatrixCompound {
  /** Compound identifier used as the matrix column key. */
  cpd: string;
  /** Compound display name when available. */
  compoundname: string | null;
  /** Compound class label when available. */
  compoundclass?: string | null;
  /** Optional secondary numeric value associated with the compound. */
  y_value?: number | null;
  /** Endpoint actually used to compute the secondary value when relevant. */
  endpoint_used?: string | null;
}

/**
 * Row descriptor used by guided heatmap matrix visualizations.
 */
export interface GuidedHeatmapMatrixRow {
  /** Stable row identifier used by matrix cells. */
  id: string;
  /** Primary row label shown in the UI. */
  label: string;
  /** Optional secondary row label. */
  secondary_label?: string | null;
  /** Additional row metadata preserved for custom renderers. */
  meta?: Record<string, unknown>;
}

/**
 * Sparse cell used by guided heatmap matrix visualizations.
 */
export interface GuidedHeatmapMatrixCell {
  /** Optional row identifier when the matrix uses explicit rows. */
  row_id?: string;
  /** Optional compound identifier when the matrix is compound-oriented. */
  cpd?: string;
  /** Toxicity endpoint identifier associated with the cell. */
  endpoint: string;
  /** Optional human-readable endpoint label. */
  label: string | null;
  /** Numeric toxicity value associated with the cell. */
  value: number | null;
  /** Backend-derived categorical risk bucket string. */
  risk_bucket: string;
}

/**
 * Heatmap matrix payload returned by guided query execution.
 */
export interface GuidedHeatmapMatrixVisualizationData {
  /** Optional explicit row descriptors used by the matrix. */
  rows?: GuidedHeatmapMatrixRow[];
  /** Singular label used for matrix rows when present. */
  row_label?: string;
  /** Plural label used for matrix rows when present. */
  row_label_plural?: string;
  /** Ordered compound headers used to render matrix columns. */
  compounds: GuidedHeatmapMatrixCompound[];
  /** Ordered toxicity endpoints used to render matrix rows or sub-rows. */
  endpoints: string[];
  /** Sparse matrix cells containing toxicity values. */
  cells: GuidedHeatmapMatrixCell[];
  /** Total number of rows available before client-side slicing. */
  total_rows_in_scope?: number;
  /** Total number of compounds available before client-side slicing. */
  total_compounds_in_scope?: number;
}

/**
 * Union of visualization payloads that can be returned by guided query execution.
 */
export type GuidedVisualizationData =
  | GuidedHorizontalBarVisualizationData
  | GuidedScatterVisualizationData
  | GuidedHeatmapMatrixVisualizationData
  | GuidedBoxplotVisualizationData
  | Record<string, unknown>
  | null;

/**
 * Resolved summary card value returned by guided query execution.
 */
export interface GuidedSummaryCardResult {
  /** Summary card identifier matching the query definition. */
  id: string;
  /** Display label shown above the resolved value. */
  label: string;
  /** Resolved summary value. */
  value: string | number | null;
  /** Optional explanatory hint shown alongside the value. */
  hint: string | null;
}

/**
 * Resolved visualization entry returned by guided query execution.
 */
export interface GuidedVisualizationResult {
  /** Visualization identifier matching the query definition. */
  id: string;
  /** Visualization renderer used by the client. */
  type: GuidedVisualizationType;
  /** Primary chart title shown in the UI. */
  title: string;
  /** Optional subtitle shown below the title. */
  subtitle: string | null;
  /** Key used to associate the resolved data with the definition. */
  data_key: string;
  /** Visualization payload consumed by the corresponding renderer. */
  data: GuidedVisualizationData;
}

/**
 * Paginated table result returned by guided query execution.
 */
export interface GuidedTableResult extends GuidedTableDefinition {
  /** Table rows keyed by column identifiers and backend field names. */
  rows: Array<Record<string, unknown>>;
  /** One-based page number returned for the current result set. */
  page: number;
  /** Maximum number of rows returned per page. */
  pageSize: number;
  /** Total number of rows available for the current filter scope. */
  total: number;
  /** Total number of available pages for the current filter scope. */
  totalPages: number;
}

/**
 * Execution metadata returned by guided query execution endpoints.
 */
export interface GuidedExecutionMeta {
  /** Guided query identifier that produced the result. */
  query_id: string;
  /** Dataset identifier used by the backend executor. */
  dataset: string;
  /** Result version string returned by the backend. */
  version: string;
  /** Total execution time reported by the backend, in milliseconds. */
  execution_ms: number;
  /** One-based page number returned for the current result set. */
  page: number;
  /** Maximum number of rows returned per page. */
  pageSize: number;
  /** Total number of rows available for the current filter scope. */
  total: number;
  /** Total number of available pages for the current filter scope. */
  totalPages: number;
  /** Number of rows excluded because no y-axis value was available. */
  excluded_null_y?: number;
  /** Number of plotted points returned by scatter-style visualizations. */
  points_count?: number;
  /** Quadrant counts returned when the visualization uses quadrant analysis. */
  quadrant_counts?: GuidedQuadrantCounts;
  /** Backend field key used for the selected y-axis metric. */
  y_metric_key?: string;
  /** Human-readable label for the selected y-axis metric. */
  y_metric_label?: string;
  /** Threshold applied to the x axis when relevant. */
  x_threshold?: number;
  /** Threshold applied to the y axis when relevant. */
  y_threshold?: number;
  /** Backend explanation for how thresholds were chosen. */
  threshold_basis?: string;
  /** Scale mode applied to the x axis when relevant. */
  x_scale?: 'log10p1' | 'linear';
  /** Whether the backend focused the result on a detected cluster. */
  focus_cluster?: boolean;
  /** Ninety-fifth percentile of gene counts when reported by the backend. */
  gene_p95?: number | null;
}

/**
 * Full guided query execution payload returned by the backend.
 */
export interface GuidedExecutionResponse {
  /** Execution metadata for pagination, thresholds, and timing. */
  meta: GuidedExecutionMeta;
  /** Resolved summary cards for the current execution. */
  summary_cards: GuidedSummaryCardResult[];
  /** Resolved visualizations for the current execution. */
  visualizations: GuidedVisualizationResult[];
  /** Paginated table result when the query defines a table. */
  table: GuidedTableResult | null;
  /** Normalized filters applied by the backend. */
  filters_applied: Record<string, unknown>;
}

/**
 * Request payload accepted by guided execution endpoints.
 */
export interface GuidedExecuteRequest {
  /** One-based page number requested by the client. */
  page?: number;
  /** Maximum number of rows requested per page. */
  pageSize?: number;
  /** Filter state forwarded to the backend executor. */
  filters?: Record<string, unknown>;
}

/**
 * Supported value shapes stored in client-side guided filter state.
 */
export type GuidedFilterValue =
  | string
  | boolean
  | {
      /** Inclusive numeric minimum selected by the user. */
      min?: number;
      /** Inclusive numeric maximum selected by the user. */
      max?: number;
    };

/**
 * Client-side map of guided filter identifiers to their current values.
 */
export type GuidedFilterState = Record<string, GuidedFilterValue>;
