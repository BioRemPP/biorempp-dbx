/**
 * @packageDocumentation
 *
 * Shared response and filter contracts for toxicity explorer and detail payloads.
 */
/**
 * Risk bucket labels used by toxicity summary payloads and visualizations.
 */
export type ToxicityRiskBucket = 'low_risk' | 'medium_risk' | 'high_risk' | 'unknown';

/**
 * Endpoint-level toxicity value rendered in heatmap-style views.
 */
export interface ToxicityHeatmapDatum {
  /** Toxicity endpoint identifier used as the row or column key. */
  endpoint: string;
  /** Optional human-readable endpoint label returned by the backend. */
  label: string | null;
  /** Numeric toxicity value associated with the endpoint for the current compound. */
  value: number | null;
  /** Risk bucket derived by the backend for the current endpoint value. */
  risk_bucket: ToxicityRiskBucket;
}

/**
 * Row returned by compound toxicity profile endpoints.
 */
export interface ToxicityEndpoint {
  /** Compound identifier linked to the endpoint measurement. */
  cpd: string;
  /** Compound display name when available. */
  compoundname: string | null;
  /** Compound class label when available. */
  compoundclass: string | null;
  /** Toxicity endpoint identifier. */
  endpoint: string;
  /** Optional human-readable endpoint label. */
  label: string | null;
  /** Numeric endpoint value reported by the backend. */
  value: number | null;
  /** ISO-like timestamp indicating when the underlying row was last updated. */
  updated_at: string;
}

/**
 * Filter parameters accepted by toxicity explorer endpoints.
 */
export interface ToxicityFilters {
  /** Exact endpoint identifier filter. */
  endpoint?: string;
  /** Exact endpoint label filter. */
  label?: string;
  /** Compound class filter applied to linked compounds. */
  compoundclass?: string;
  /** Inclusive lower bound for numeric toxicity values. */
  value_min?: number;
  /** Inclusive upper bound for numeric toxicity values. */
  value_max?: number;
  /** Free-text search term forwarded to the backend. */
  search?: string;
}
