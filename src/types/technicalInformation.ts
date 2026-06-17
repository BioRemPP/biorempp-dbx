/**
 * @packageDocumentation
 *
 * Editorial and derived-data contracts used by the Technical Information page.
 */
import type {
  ColumnCompletenessItem,
  LinkMatchSummary,
  ReactionCoverageSummary,
  RowShapeSummary,
} from './frontConfig';

/**
 * One labeled explanatory bullet used in structured technical sections.
 */
export interface TechnicalInformationBullet {
  /** Stable bullet identifier used for keyed rendering. */
  id: string;
  /** Short label shown ahead of the bullet description. */
  label: string;
  /** Supporting copy for the bullet item. */
  description: string;
}

/**
 * Hero section content for the page header.
 */
export interface TechnicalInformationHeader {
  /** Eyebrow label shown above the hero title. */
  eyebrow: string;
  /** Main page title. */
  title: string;
  /** Supporting subtitle shown in the hero block. */
  subtitle: string;
  /** Short note clarifying the provenance of the published claims. */
  intro_note: string;
}

/**
 * Introductory framing section composed of one or more paragraphs.
 */
export interface TechnicalInformationIntroSection {
  /** Section title. */
  title: string;
  /** Ordered intro paragraphs. */
  paragraphs: string[];
}

/**
 * Pipeline overview section with structured explanatory bullets.
 */
export interface TechnicalInformationBuildOverviewSection {
  /** Section title. */
  title: string;
  /** Introductory paragraph for the build-overview section. */
  intro: string;
  /** Ordered explanatory bullets. */
  bullets: TechnicalInformationBullet[];
  /** Closing summary shown after the bullets. */
  closing: string;
}

/**
 * Runtime-delivery framing section that explains why the app ships SQLite while
 * recommending CSV artifacts for downstream analytical reuse.
 */
export interface TechnicalInformationRuntimeDeliverySection {
  /** Section title. */
  title: string;
  /** Introductory paragraph for the runtime section. */
  intro: string;
  /** Ordered explanatory bullets. */
  bullets: TechnicalInformationBullet[];
  /** Heading shown above the practical recommendation callout. */
  recommendation_title: string;
  /** Main recommendation for practical downstream analysis. */
  recommendation: string;
  /** Closing summary for the runtime section. */
  closing: string;
}

/**
 * Schema and quality section content.
 */
export interface TechnicalInformationSchemaQualitySection {
  /** Section title. */
  title: string;
  /** Introductory paragraph for the schema-quality section. */
  intro: string;
  /** Ordered list of qualitative data-quality points. */
  quality_points: string[];
  /** Short note that introduces link-coverage summaries. */
  coverage_note: string;
}

/**
 * Validation framing section.
 */
export interface TechnicalInformationValidationSection {
  /** Section title. */
  title: string;
  /** Introductory paragraph for the validation section. */
  intro: string;
  /** Ordered validation bullets. */
  bullets: string[];
  /** Closing caution or summary for the section. */
  closing: string;
}

/**
 * Provenance and reproducibility section.
 */
export interface TechnicalInformationProvenanceSection {
  /** Section title. */
  title: string;
  /** Introductory paragraph for the provenance section. */
  intro: string;
  /** Ordered provenance bullets. */
  bullets: string[];
  /** Closing summary for the section. */
  closing: string;
}

/**
 * Interpretation-boundaries section.
 */
export interface TechnicalInformationLimitationsSection {
  /** Section title. */
  title: string;
  /** Introductory paragraph for the limitations section. */
  intro: string;
  /** Heading shown above the safe-claims list. */
  safe_claims_title: string;
  /** Claims that are editorially safe for the current snapshot. */
  safe_claims: string[];
  /** Heading shown above the avoid-claims list. */
  avoid_claims_title: string;
  /** Claims that should be avoided for the current snapshot. */
  avoid_claims: string[];
  /** Closing note for the interpretation section. */
  closing: string;
}

/**
 * One FAQ item shown in the technical FAQ accordion.
 */
export interface TechnicalInformationFaqItem {
  /** Stable FAQ identifier used for keyed rendering. */
  id: string;
  /** User-facing question. */
  question: string;
  /** Answer rendered inside the accordion body. */
  answer: string;
}

/**
 * FAQ section content for the page.
 */
export interface TechnicalInformationFaqSection {
  /** Section title. */
  title: string;
  /** Introductory text shown above the accordion list. */
  intro: string;
  /** Ordered FAQ items. */
  items: TechnicalInformationFaqItem[];
}

/**
 * Footer note shown at the end of the page.
 */
export interface TechnicalInformationFooterSection {
  /** Footer title. */
  title: string;
  /** Provenance note shown in the footer card. */
  note: string;
}

/**
 * Sidebar content used for quick navigation and CTA labels.
 */
export interface TechnicalInformationSidebar {
  /** Heading for the release snapshot card. */
  snapshot_title: string;
  /** Introductory copy for the snapshot card. */
  snapshot_intro: string;
  /** Heading for the quick-navigation card. */
  quick_nav_title: string;
  /** Supporting copy for the quick-navigation card. */
  quick_nav_description: string;
  /** Heading for the CTA card. */
  actions_title: string;
  /** CTA label that opens the Databases page. */
  databases_label: string;
  /** CTA label that opens the Documentation page. */
  documentation_label: string;
}

/**
 * Full editorial catalog consumed by the Technical Information page.
 */
export interface TechnicalInformationPageCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Language code for the page content. */
  language: string;
  /** Hero section content. */
  header: TechnicalInformationHeader;
  /** Introductory framing content. */
  intro: TechnicalInformationIntroSection;
  /** Runtime-delivery framing for SQLite and CSV usage. */
  runtime_delivery: TechnicalInformationRuntimeDeliverySection;
  /** Build-overview section. */
  build_overview: TechnicalInformationBuildOverviewSection;
  /** Schema and quality section. */
  schema_quality: TechnicalInformationSchemaQualitySection;
  /** Validation section. */
  validation: TechnicalInformationValidationSection;
  /** Provenance and reproducibility section. */
  provenance: TechnicalInformationProvenanceSection;
  /** Interpretation-boundaries section. */
  limitations: TechnicalInformationLimitationsSection;
  /** FAQ section. */
  faq: TechnicalInformationFaqSection;
  /** Footer note section. */
  footer: TechnicalInformationFooterSection;
  /** Sidebar labels and helper copy. */
  sidebar: TechnicalInformationSidebar;
}

/**
 * Release-sensitive facts shown by the Technical Information page.
 */
export interface TechnicalInformationFacts {
  /** Display name of the bundled database snapshot. */
  database_name: string;
  /** Version label for the bundled database snapshot. */
  database_version: string;
  /** Generation date reported by the bundled metadata. */
  generation_date: string;
  /** Parsed KEGG release label for the bundled snapshot. */
  kegg_release: string;
  /** Total integrated rows in the bundled snapshot. */
  total_entries: number;
  /** Total number of schema columns in the bundled snapshot. */
  total_columns: number;
  /** Ordered schema column names published for the snapshot. */
  column_names: string[];
  /** Total unique compounds in the snapshot. */
  unique_compounds: number;
  /** Total unique KO entries in the snapshot. */
  unique_ko_entries: number;
  /** Total unique gene symbols in the snapshot. */
  unique_gene_symbols: number;
  /** Total unique gene names in the snapshot. */
  unique_gene_names: number;
  /** Total unique enzyme-activity labels in the snapshot. */
  unique_enzyme_activities: number;
  /** Total unique environmental reference agencies in the snapshot. */
  unique_reference_agencies: number;
  /** Column-level completeness metrics sourced from bundled metadata. */
  column_completeness: ColumnCompletenessItem[];
  /** Match summary for KO and compound identifier coverage. */
  link_match: LinkMatchSummary;
  /** Row-shape breakdown for the bundled snapshot. */
  row_shapes: RowShapeSummary;
  /** Coverage metrics for reaction descriptions. */
  reaction_coverage: ReactionCoverageSummary;
}
