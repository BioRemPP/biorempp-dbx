import type { ToxicityRiskBucket } from '@/features/toxicity/types';

/**
 * @packageDocumentation
 *
 * Contracts for pathway explorer filters, overview responses, and toxicity visualizations.
 */
/**
 * Summary row returned by pathway explorer list endpoints.
 */
export interface PathwaySummary {
  /** Pathway name or identifier used as the canonical route key. */
  pathway: string;
  /** Source catalog associated with the pathway row. */
  source: string;
  /** Number of compounds linked to the pathway. */
  compound_count: number;
  /** Number of genes linked to the pathway. */
  gene_count: number;
  /** ISO-like timestamp indicating when the row was last refreshed. */
  updated_at: string;
}

/**
 * Filter parameters accepted by pathway explorer endpoints.
 */
export interface PathwayFilters {
  /** Source filter applied to the pathway catalog. */
  source?: string;
  /** Free-text search term forwarded to the backend. */
  search?: string;
}

/**
 * Quantitative summary returned by pathway overview endpoints.
 */
export interface PathwayOverviewSummary {
  /** Pathway currently being summarized. */
  pathway: string;
  /** Source selected to resolve the detail view. */
  selected_source: string;
  /** Number of distinct KO identifiers linked to the pathway. */
  ko_count: number;
  /** Number of distinct genes linked to the pathway. */
  gene_count: number;
  /** Number of distinct compounds linked to the pathway. */
  compound_count: number;
  /** Number of distinct reaction EC classes linked to the pathway. */
  reaction_ec_count: number;
  /** Number of available source catalogs for the same pathway name. */
  source_count: number;
  /** Percentage overlap used by the backend to summarize KO coverage across sources. */
  ko_overlap_pct: number | null;
}

/**
 * Bar chart datum representing compound support for a KO term inside a pathway.
 */
export interface PathwayKoDistributionDatum {
  /** KO identifier associated with the bar. */
  ko: string;
  /** Number of supporting rows contributing to the bar height. */
  count: number;
}

/**
 * Bar chart datum representing compound support for a gene inside a pathway.
 */
export interface PathwayGeneDistributionDatum {
  /** Gene symbol or identifier shown in the distribution. */
  gene: string;
  /** Number of supporting rows contributing to the bar height. */
  count: number;
}

/**
 * Bar chart datum summarizing pathway support by EC class.
 */
export interface PathwayEcClassDistributionDatum {
  /** Top-level EC class label. */
  ec_class: string;
  /** Number of supporting rows contributing to the bar height. */
  count: number;
}

/**
 * Compound header entry used by the pathway toxicity matrix.
 */
export interface PathwayToxicityMatrixCompound {
  /** Compound identifier used as the matrix column key. */
  cpd: string;
  /** Optional display name shown for the compound column. */
  compoundname: string | null;
}

/**
 * Matrix cell representing one compound-endpoint toxicity value.
 */
export interface PathwayToxicityMatrixCell {
  /** Compound identifier associated with the current cell. */
  cpd: string;
  /** Toxicity endpoint identifier associated with the current cell. */
  endpoint: string;
  /** Optional human-readable endpoint label. */
  label: string | null;
  /** Numeric toxicity value returned for the compound-endpoint pair. */
  value: number | null;
  /** Backend-derived categorical risk bucket for the numeric value. */
  risk_bucket: ToxicityRiskBucket;
}

/**
 * Heatmap payload used by pathway and gene detail views.
 */
export interface PathwayToxicityMatrix {
  /** Ordered compound headers used to render matrix columns. */
  compounds: PathwayToxicityMatrixCompound[];
  /** Ordered toxicity endpoints used to render matrix rows. */
  endpoints: string[];
  /** Sparse matrix cells containing compound-endpoint toxicity values. */
  cells: PathwayToxicityMatrixCell[];
}

/**
 * Full overview payload returned by pathway detail endpoints.
 */
export interface PathwayDetailOverviewResponse {
  /** Pathway requested by the client. */
  pathway: string;
  /** Source catalogs available for the requested pathway. */
  available_sources: string[];
  /** Source currently selected for the response payload. */
  selected_source: string;
  /** Aggregate counts and coverage metrics for the pathway. */
  summary: PathwayOverviewSummary;
  /** KO distribution used by pathway detail visualizations. */
  ko_distribution: PathwayKoDistributionDatum[];
  /** Gene distribution used by pathway detail visualizations. */
  gene_distribution: PathwayGeneDistributionDatum[];
  /** EC class distribution used by pathway detail visualizations. */
  ec_class_distribution: PathwayEcClassDistributionDatum[];
  /** Toxicity matrix spanning compounds and toxicity endpoints. */
  toxicity_matrix: PathwayToxicityMatrix;
}
