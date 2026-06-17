/**
 * @packageDocumentation
 *
 * Contracts for database schema index pages, schema detail pages, and related quality metadata.
 */

/**
 * Supported schema identifiers used by the database explorer routes and content loaders.
 */
export type DatabaseSchemaId = 'biorempp' | 'hadeg' | 'kegg' | 'toxcsm';

/**
 * Accent tones used to visually differentiate schema families in the UI.
 */
export type DatabaseSchemaAccentTone = 'success' | 'info' | 'warning' | 'danger';

/**
 * Contact channels exposed in the database schema documentation.
 */
export interface DatabaseSchemasContact {
  /** URL for issue reporting and repository discussions. */
  github_issues: string;
  /** Email address for direct support or questions. */
  email: string;
}

/**
 * Summary card data for a database listed on the schema index page.
 */
export interface DatabaseSchemasIndexEntry {
  /** Canonical schema identifier used for routing. */
  id: DatabaseSchemaId;
  /** Human-readable database name. */
  name: string;
  /** Total number of rows reported for the dataset snapshot. */
  rows: number;
  /** Total number of columns reported for the dataset snapshot. */
  columns: number;
  /** Short description of the dataset focus or scope. */
  focus: string;
  /** Internal route pointing to the schema detail page. */
  route: string;
  /** Accent tone used by the index card styling. */
  color: DatabaseSchemaAccentTone;
  /** Primary field used to join this dataset with related sources. */
  join_key: string;
  /** Source file name or exported artifact label. */
  file: string;
}

/**
 * Shared file format metadata for the published schema artifacts.
 */
export interface DatabaseSchemasFileFormatCatalog {
  /** File format name shown to the user. */
  format: string;
  /** Delimiter used by the tabular export. */
  delimiter: string;
  /** Character encoding for the distribution file. */
  encoding: string;
  /** Indicates whether the first row contains headers. */
  header: boolean;
  /** Text qualifier used around escaped values when present. */
  text_qualifier: string;
  /** Plain-language note about completeness or export guarantees. */
  completeness: string;
}

/**
 * Overview bullets displayed on the schema index page.
 */
export interface DatabaseSchemasOverviewCatalog {
  /** Summary of formal specifications coverage. */
  formal_specs: string;
  /** Summary of validation rule coverage. */
  validation_rules: string;
  /** Summary of cross-reference documentation. */
  cross_references: string;
  /** Summary of available usage examples. */
  usage_examples: string;
}

/**
 * A cross-database join point highlighted in the integration overview.
 */
export interface DatabaseSchemasIntegrationJoinPoint {
  /** Databases participating in the join point. */
  databases: string[];
  /** Column or field name used as the integration key. */
  key: string;
  /** Explanation of how the datasets connect at this key. */
  description: string;
}

/**
 * Integration overview content for the schema index page.
 */
export interface DatabaseSchemasIntegrationCatalog {
  /** Introductory explanation of the integration model. */
  description: string;
  /** Join points highlighted to the user. */
  join_points: DatabaseSchemasIntegrationJoinPoint[];
}

/**
 * External documentation link associated with the schema section.
 */
export interface DatabaseSchemasRelatedDoc {
  /** Link label shown in the related resources list. */
  title: string;
  /** Destination URL for the related resource. */
  url: string;
}

/**
 * Editorial catalog for the top-level database schema index page.
 */
export interface DatabaseSchemasIndexCatalog {
  /** Stable page identifier used by the loader or CMS mapping. */
  page_id: string;
  /** Main heading displayed on the index page. */
  title: string;
  /** Supporting subtitle shown under the page heading. */
  subtitle: string;
  /** Optional icon token associated with the page header. */
  icon?: string;
  /** Database summaries rendered as entry cards. */
  databases: DatabaseSchemasIndexEntry[];
  /** Shared file format information for exported datasets. */
  file_format: DatabaseSchemasFileFormatCatalog;
  /** Overview bullets that describe the documentation set. */
  overview: DatabaseSchemasOverviewCatalog;
  /** Integration summary and join points across databases. */
  integration: DatabaseSchemasIntegrationCatalog;
  /** Optional external links relevant to schema exploration. */
  related_docs?: DatabaseSchemasRelatedDoc[];
  /** Support contact information for the schema reference. */
  contact: DatabaseSchemasContact;
}

/**
 * One rationale item describing a schema design choice.
 */
export interface DatabaseSchemaDesignRationaleItem {
  /** Short label for the design decision. */
  title: string;
  /** Explanation of why the schema is structured this way. */
  description: string;
}

/**
 * Narrative overview for a single schema detail page.
 */
export interface DatabaseSchemaOverview {
  /** Introductory description of the dataset and its role. */
  description: string;
  /** Design decisions highlighted to the reader. */
  design_rationale: DatabaseSchemaDesignRationaleItem[];
}

/**
 * Machine-readable structural definition of a schema export.
 */
export interface DatabaseSchemaDefinition {
  /** Primary published file format. */
  format: string;
  /** Optional secondary format published alongside the main artifact. */
  alternative_format?: string;
  /** Reported number of rows in the snapshot. */
  rows: number;
  /** Reported number of columns in the snapshot. */
  columns: number;
  /** Character encoding used by the exported file. */
  encoding: string;
  /** Value separator used by the tabular format. */
  delimiter: string;
  /** Text qualifier used when values contain delimiters. */
  text_qualifier: string;
  /** Indicates whether the file includes a header row. */
  header: boolean;
  /** Plain-language note about dataset completeness. */
  completeness: string;
}

/**
 * External identifier pattern associated with a schema column.
 */
export interface DatabaseSchemaCrossReference {
  /** Human-readable name of the referenced system or ontology. */
  name: string;
  /** Optional URL template used to resolve a value into an external record. */
  url_pattern?: string;
}

/**
 * Primitive values allowed in example records embedded in schema documentation.
 */
export type DatabaseSchemaRecordValue = string | number | boolean;

/**
 * Generic example row structure used for valid values and preview tables.
 */
export type DatabaseSchemaRecord = Record<string, DatabaseSchemaRecordValue>;

/**
 * Detailed metadata for a single documented schema column.
 */
export interface DatabaseSchemaColumn {
  /** Raw column name used in the exported dataset. */
  name: string;
  /** Declared storage or semantic data type. */
  type: string;
  /** Indicates whether missing values are allowed. */
  nullable: boolean;
  /** Flags controlled vocabulary columns with enumerated values. */
  controlled_vocabulary?: boolean;
  /** Human-readable value pattern when one is published. */
  pattern?: string;
  /** Regex constraint enforced or expected for the column. */
  regex?: string;
  /** Representative sample value for the column. */
  example?: string;
  /** User-facing explanation of what the column contains. */
  description: string;
  /** Primary analytical purpose of the field in the dataset. */
  purpose: string;
  /** Uniqueness expectation or duplicate behavior for the field. */
  uniqueness: string;
  /** Number of values expected per record or relationship cardinality. */
  cardinality: number;
  /** Optional implementation notes or caveats. */
  notes?: string[];
  /** Optional tabular examples of accepted values. */
  valid_values?: DatabaseSchemaRecord[];
  /** Optional external systems referenced by this column. */
  cross_references?: DatabaseSchemaCrossReference[];
  /** Optional pathway distribution examples used in selected schemas. */
  top_pathways?: DatabaseSchemaRecord[];
  /** Optional family distribution examples used in selected schemas. */
  top_families?: DatabaseSchemaRecord[];
}

/**
 * Foreign-key relationship declared for a schema column.
 */
export interface DatabaseSchemaForeignKey {
  /** Local column participating in the relationship. */
  column: string;
  /** Referenced target expressed as a dataset and column string. */
  references: string;
}

/**
 * Human-readable description of a schema relationship pattern.
 */
export interface DatabaseSchemaCardinalityRelationship {
  /** Relationship label used in the UI. */
  name: string;
  /** Cardinality type such as one-to-many or many-to-many. */
  type: string;
  /** Explanation of how the relationship behaves. */
  description: string;
  /** Optional illustrative example for the relationship. */
  example?: string;
}

/**
 * Constraint metadata for a schema detail page.
 */
export interface DatabaseSchemaConstraints {
  /** Primary key column when a concrete key exists. */
  primary_key?: string | null;
  /** Clarifying note when the key is conceptual or absent. */
  primary_key_note?: string | null;
  /** Columns that together form a conceptual identifier. */
  conceptual_key?: string[];
  /** Description of expected duplicate row behavior. */
  duplicate_rows?: string;
  /** Explicit foreign keys documented for the schema. */
  foreign_keys?: DatabaseSchemaForeignKey[];
  /** Narrative relationship descriptions surfaced to the user. */
  cardinality_relationships?: DatabaseSchemaCardinalityRelationship[];
}

/**
 * Completeness status block used inside the data quality section.
 */
export interface DatabaseSchemaCompleteness {
  /** Badge-like status label for completeness. */
  status: string;
  /** Explanation supporting the completeness classification. */
  description: string;
}

/**
 * Source attribution for an accuracy statement tied to a column.
 */
export interface DatabaseSchemaAccuracySource {
  /** Column whose accuracy is being described. */
  column: string;
  /** Source or method supporting the accuracy claim. */
  source: string;
}

/**
 * Data quality information presented with a schema.
 */
export interface DatabaseSchemaDataQuality {
  /** Completeness assessment for the dataset. */
  completeness: DatabaseSchemaCompleteness;
  /** Consistency notes or validation observations. */
  consistency?: string[];
  /** Column-level provenance for accuracy claims. */
  accuracy?: DatabaseSchemaAccuracySource[];
  /** General source statement for quality assertions. */
  source?: string;
  /** Date when the validation or quality review was performed. */
  validation_date?: string;
}

/**
 * One code example or recipe shown in the usage section.
 */
export interface DatabaseSchemaUsageQuery {
  /** Description of the analysis task the snippet demonstrates. */
  description: string;
  /** Executable example code for the described task. */
  code: string;
}

/**
 * Usage examples presented for a schema detail page.
 */
export interface DatabaseSchemaUsageExamples {
  /** R example block for loading or analyzing the dataset. */
  r: string;
  /** Python example block for loading or analyzing the dataset. */
  python: string;
  /** Optional common query patterns grouped by task. */
  common_queries?: DatabaseSchemaUsageQuery[];
}

/**
 * Column grouping metadata used to summarize schema organization.
 */
export interface DatabaseSchemaColumnOrganizationGroup {
  /** Category label for the group of related columns. */
  category: string;
  /** Number of columns included in the group. */
  count: number;
  /** Optional explicit column names included in the group. */
  columns?: string[];
  /** Optional explanation of the grouping logic. */
  description?: string;
}

/**
 * Toxicity label interpretation metadata for categorical outputs.
 */
export interface DatabaseSchemaLabelCategory {
  /** Raw label value used in the dataset. */
  value: string;
  /** Human-readable meaning of the label. */
  interpretation: string;
  /** Relative severity or ordered level associated with the label. */
  level: number;
}

/**
 * Metadata for one toxicity endpoint family exposed in the schema docs.
 */
export interface DatabaseSchemaToxicityEndpoint {
  /** Endpoint identifier or display label. */
  endpoint: string;
  /** Column storing the categorical endpoint label. */
  label_column: string;
  /** Column storing the numeric endpoint score or probability. */
  value_column: string;
  /** Explanation of what the endpoint measures. */
  description: string;
  /** Population or sample description for the endpoint. */
  samples: string;
  /** Upstream source or model behind the endpoint. */
  source: string;
}

/**
 * Endpoint groups keyed by view section or endpoint family label.
 */
export type DatabaseSchemaToxicityEndpointGroups = Record<string, DatabaseSchemaToxicityEndpoint[]>;

/**
 * Shared description of the numeric toxicity value columns.
 */
export interface DatabaseSchemaValueColumnsInfo {
  /** Declared data type for the value columns. */
  data_type: string;
  /** Expected numeric range or domain. */
  range: string;
  /** Interpretation guidance for end users. */
  interpretation: string;
  /** Notes on how these columns should be consumed in the UI. */
  usage: string;
}

/**
 * One item in the documented version history for a schema snapshot.
 */
export interface DatabaseSchemaVersionHistoryItem {
  /** Published version label. */
  version: string;
  /** Release or snapshot date. */
  date: string;
  /** Row count associated with that version. */
  rows: number;
  /** Summary of changes introduced in the version. */
  changes: string;
}

/**
 * Full schema detail catalog consumed by the database schema pages.
 */
export interface DatabaseSchemaCatalog {
  /** Canonical identifier for the documented schema. */
  schema_id: DatabaseSchemaId;
  /** Display title shown on the schema page. */
  title: string;
  /** Version string for the documented snapshot. */
  version: string;
  /** Last update date shown in the schema metadata. */
  last_updated: string;
  /** Accent tone used by schema-specific UI elements. */
  color: DatabaseSchemaAccentTone;
  /** Narrative overview and design rationale. */
  overview: DatabaseSchemaOverview;
  /** Structural definition of the published dataset. */
  schema_definition: DatabaseSchemaDefinition;
  /** Column-level documentation for the schema. */
  columns: DatabaseSchemaColumn[];
  /** Constraint and relationship metadata. */
  constraints: DatabaseSchemaConstraints;
  /** Quality and validation notes for the dataset. */
  data_quality: DatabaseSchemaDataQuality;
  /** Code snippets and usage examples for consumers. */
  usage_examples: DatabaseSchemaUsageExamples;
  /** Support contact information for the schema. */
  contact: DatabaseSchemasContact;
  /** Optional grouping metadata used to summarize column categories. */
  column_organization?: DatabaseSchemaColumnOrganizationGroup[];
  /** Optional categorical label interpretations for toxicity outputs. */
  label_categories?: DatabaseSchemaLabelCategory[];
  /** Optional toxicity endpoint metadata grouped by family. */
  toxicity_endpoints?: DatabaseSchemaToxicityEndpointGroups;
  /** Optional explanation of shared toxicity value columns. */
  value_columns_info?: DatabaseSchemaValueColumnsInfo;
  /** Optional release history for the schema snapshot. */
  version_history?: DatabaseSchemaVersionHistoryItem[];
}
