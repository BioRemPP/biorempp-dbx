import type {
  PathwayEcClassDistributionDatum,
  PathwayGeneDistributionDatum,
  PathwayKoDistributionDatum,
  PathwayToxicityMatrix,
} from '@/features/pathways/types';

/**
 * @packageDocumentation
 *
 * Contracts for compound class explorer filters and detail overview payloads.
 */
/**
 * Summary row returned by compound class explorer endpoints.
 */
export interface CompoundClassSummary {
  /** Compound class label used as the canonical route key. */
  compoundclass: string;
  /** Number of compounds assigned to the class. */
  compound_count: number;
  /** Number of distinct KO identifiers linked to the class. */
  ko_count: number;
  /** Number of distinct genes linked to the class. */
  gene_count: number;
  /** Number of distinct pathways linked to the class. */
  pathway_count: number;
  /** ISO-like timestamp indicating when the aggregate row was last refreshed. */
  updated_at: string | null;
}

/**
 * Quantitative summary returned by compound class overview endpoints.
 */
export interface CompoundClassOverviewSummary {
  /** Compound class currently being summarized. */
  compoundclass: string;
  /** Number of distinct KO identifiers linked to the class. */
  ko_count: number;
  /** Number of distinct genes linked to the class. */
  gene_count: number;
  /** Number of distinct compounds linked to the class. */
  compound_count: number;
  /** Number of distinct reaction EC classes linked to the class. */
  reaction_ec_count: number;
  /** Number of distinct pathways linked to the class. */
  pathway_count: number;
  /** Number of pathway source catalogs represented in the class. */
  source_count: number;
  /** Percentage of linked compounds that have toxicity coverage. */
  toxicity_coverage_pct: number | null;
}

/**
 * Filter parameters accepted by compound class explorer endpoints.
 */
export interface CompoundClassFilters {
  /** Free-text search term forwarded to the backend. */
  search?: string;
}

/**
 * Full overview payload returned by compound class detail endpoints.
 */
export interface CompoundClassDetailOverviewResponse {
  /** Compound class requested by the client. */
  compoundclass: string;
  /** Aggregate counts and coverage metrics for the class. */
  summary: CompoundClassOverviewSummary;
  /** KO distribution reused by compound class overview charts. */
  ko_distribution: PathwayKoDistributionDatum[];
  /** Gene distribution reused by compound class overview charts. */
  gene_distribution: PathwayGeneDistributionDatum[];
  /** EC class distribution reused by compound class overview charts. */
  ec_class_distribution: PathwayEcClassDistributionDatum[];
  /** Toxicity matrix reused by compound class overview charts. */
  toxicity_matrix: PathwayToxicityMatrix;
}
