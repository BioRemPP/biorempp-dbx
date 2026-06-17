/**
 * @packageDocumentation
 *
 * Shared front-end configuration contracts for downloads, guided recipes, and database metrics content.
 */

/**
 * Metadata for one externally hosted download artifact.
 */
export interface ExternalDownloadItem {
  /** Stable item identifier used for keyed rendering. */
  id: string;
  /** User-facing artifact label. */
  label: string;
  /** Distribution format label shown in the UI. */
  format: string;
  /** Absolute download URL. */
  url: string;
  /** Published release or artifact version. */
  version: string;
  /** Optional human-readable file size string. */
  size?: string;
  /** Optional upstream update date as provided by the source. */
  updated_at?: string;
  /** Source system or repository name. */
  source: string;
}

/**
 * Full download catalog rendered on the home page and download surfaces.
 */
export interface ExternalDownloadCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Section title shown to the user. */
  title: string;
  /** Optional explanatory note or disclaimer. */
  note?: string;
  /** Download artifacts available to the user. */
  items: ExternalDownloadItem[];
}

/**
 * One executable recipe associated with a guided query example.
 */
export interface GuidedQueryRecipeItem {
  /** Stable recipe identifier used by the UI and loaders. */
  id: string;
  /** User-facing recipe label. */
  label: string;
  /** Short explanation of the task demonstrated by the recipe. */
  description: string;
  /** Syntax highlighting language for the code block. */
  language: 'sql' | 'python' | 'r';
  /** Runtime assumption for the example inputs and execution environment. */
  runtime: 'sqlite' | 'csv';
  /** Full code snippet rendered in the recipe body. */
  code: string;
  /** Optional prerequisites needed before running the recipe. */
  requirements?: string[];
  /** Optional input files consumed by the example. */
  input_files?: string[];
}

/**
 * Recipe group exposed from a guided query trigger.
 */
export interface GuidedQueryRecipe {
  /** Label used by the trigger button that opens the recipes. */
  button_label: string;
  /** Title shown in the recipe dialog or section. */
  title: string;
  /** Introductory copy for the recipe collection. */
  introduction: string;
  /** Ordered recipe variants available to the user. */
  recipes: GuidedQueryRecipeItem[];
  /** Optional notes appended after the recipe list. */
  notes?: string[];
}

/**
 * Catalog of guided query recipes keyed by feature or use-case id.
 */
export interface GuidedQueryRecipeCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Optional global note shown with the recipe set. */
  note?: string;
  /** Recipes indexed by the consuming guided-analysis key. */
  queries: Record<string, GuidedQueryRecipe>;
}

/**
 * Label/value pair rendered in metric card grids.
 */
export interface MetricCardItem {
  /** Stable metric identifier. */
  id: string;
  /** Metric label shown above the value. */
  label: string;
  /** Formatted value already prepared for display. */
  value: string;
  /** Optional supporting hint or explanatory subtitle. */
  hint?: string;
}

/**
 * Simple named count item used in ranked lists.
 */
export interface NamedCountItem {
  /** Entity label or bucket name. */
  name: string;
  /** Count associated with the label. */
  count: number;
}

/**
 * Completeness metrics for one schema column.
 */
export interface ColumnCompletenessItem {
  /** Raw column name being measured. */
  column: string;
  /** Percentage of non-missing values. */
  completeness_pct: number;
  /** Total number of missing values for the column. */
  missing_count: number;
}

/**
 * Cross-reference matching summary between KO and compound identifiers.
 */
export interface LinkMatchSummary {
  /** Total KO records evaluated for matching. */
  ko_total: number;
  /** KO records with a successful match. */
  ko_matched: number;
  /** KO records without a successful match. */
  ko_unmatched: number;
  /** Total compound records evaluated for matching. */
  cpd_total: number;
  /** Compound records with a successful match. */
  cpd_matched: number;
  /** Compound records without a successful match. */
  cpd_unmatched: number;
}

/**
 * Shape breakdown for rows in the generated metrics snapshot.
 */
export interface RowShapeSummary {
  /** Rows containing both EC and reaction annotations. */
  dense: number;
  /** Rows with EC data but no reaction annotation. */
  ec_only: number;
  /** Rows with reaction data but no EC annotation. */
  reaction_only: number;
  /** Rows where both EC and reaction values are absent. */
  both_na: number;
}

/**
 * Coverage metrics for reaction annotations in the snapshot.
 */
export interface ReactionCoverageSummary {
  /** Rows with any reaction identifier populated. */
  with_reaction_rows: number;
  /** Rows with both reaction id and textual description populated. */
  with_reaction_description_rows: number;
  /** Count of reaction identifiers that could not be resolved upstream. */
  unmatched_reaction_id_count: number;
}

/**
 * High-level snapshot of one schema used by the metrics page.
 */
export interface DatabaseSchemaSnapshot {
  /** Canonical schema id used for linking. */
  id: string;
  /** Human-readable database name. */
  database: string;
  /** Snapshot version label. */
  version: string;
  /** Row count reported for the schema snapshot. */
  rows: number;
  /** Column count reported for the schema snapshot. */
  columns: number;
  /** Short description of the schema focus. */
  focus: string;
  /** Primary join key used when integrating this dataset. */
  join_key: string;
  /** Source documentation or artifact identifier. */
  source_doc: string;
  /** Core columns highlighted for quick reference. */
  core_columns: string[];
}

/**
 * Full metrics catalog rendered by the database metrics page.
 */
export interface DatabaseMetricsCatalog {
  /** Label used to cite the source of the metrics snapshot. */
  metrics_source_label: string;
  /** Optional label used for links to the schema reference. */
  schema_reference_label?: string;
  /** Display name of the measured database collection. */
  database_name: string;
  /** Version label for the metrics snapshot. */
  database_version: string;
  /** Generation date shown in the page metadata. */
  generation_date: string;
  /** Primary KPI cards shown near the top of the page. */
  core_metrics: MetricCardItem[];
  /** Secondary highlight metrics emphasized in the layout. */
  highlight_metrics: MetricCardItem[];
  /** Ranked compound class counts. */
  top_compound_classes: NamedCountItem[];
  /** Ranked agency counts. */
  top_agencies: NamedCountItem[];
  /** Ranked gene counts. */
  top_genes: NamedCountItem[];
  /** Ranked KO counts. */
  top_kos: NamedCountItem[];
  /** Ranked enzyme counts. */
  top_enzymes: NamedCountItem[];
  /** Column completeness breakdowns. */
  column_completeness: ColumnCompletenessItem[];
  /** Match quality summary for cross-reference linking. */
  link_match: LinkMatchSummary;
  /** Distribution of row shapes in the source data. */
  row_shapes: RowShapeSummary;
  /** Coverage metrics for reaction annotations. */
  reaction_coverage: ReactionCoverageSummary;
  /** Schema snapshots surfaced for quick comparison. */
  schemas: DatabaseSchemaSnapshot[];
}
