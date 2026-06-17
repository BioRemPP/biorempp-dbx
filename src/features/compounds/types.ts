import type { ToxicityHeatmapDatum } from '@/features/toxicity/types';

/**
 * @packageDocumentation
 *
 * Response and filter contracts for compound explorer and compound detail API payloads.
 */
export type { ToxicityHeatmapDatum };

/**
 * Summary row returned by compound explorer endpoints.
 */
export interface CompoundSummary {
  /** Compound identifier used as the canonical route key. */
  cpd: string;
  /** Preferred compound name when available. */
  compoundname: string | null;
  /** Compound class label when available. */
  compoundclass: string | null;
  /** Reference agency associated with the compound row when available. */
  reference_ag: string | null;
  /** Number of reference records linked to the compound. */
  reference_count: number;
  /** Number of KO identifiers linked to the compound. */
  ko_count: number;
  /** Number of genes linked to the compound. */
  gene_count: number;
  /** Number of pathways linked to the compound. */
  pathway_count: number;
  /** Mean toxicity risk score across supported endpoints. */
  toxicity_risk_mean: number | null;
  /** Number of linked endpoints currently classified as high risk. */
  high_risk_endpoint_count: number;
  /** Per-endpoint toxicity scores keyed by endpoint identifier. */
  toxicity_scores: Record<string, number | null>;
  /** Compound SMILES string when available. */
  smiles: string | null;
  /** Linked gene symbols included in compact list responses. */
  genes: string[];
  /** Linked pathway names included in compact list responses. */
  pathways: string[];
  /** ISO-like timestamp indicating when the row was last refreshed. */
  updated_at: string;
}

/**
 * Reduced summary embedded in compound overview payloads.
 */
export interface CompoundOverviewSummary {
  /** Compound identifier requested by the client. */
  cpd: string;
  /** Preferred compound name when available. */
  compoundname: string | null;
  /** Compound class label when available. */
  compoundclass: string | null;
  /** Number of reference records linked to the compound. */
  reference_count: number;
  /** Number of KO identifiers linked to the compound. */
  ko_count: number;
  /** Number of genes linked to the compound. */
  gene_count: number;
  /** Number of pathways linked to the compound. */
  pathway_count: number;
  /** Mean toxicity risk score across supported endpoints. */
  toxicity_risk_mean: number | null;
  /** Number of linked endpoints currently classified as high risk. */
  high_risk_endpoint_count: number;
}

/**
 * Bar chart datum representing KO support for a compound.
 */
export interface KoBarDatum {
  /** KO identifier shown on the chart. */
  ko: string;
  /** Total supporting rows contributing to the bar. */
  count: number;
  /** Supporting rows coming from HADEG relations. */
  relation_count_hadeg: number;
  /** Supporting rows coming from KEGG relations. */
  relation_count_kegg: number;
}

/**
 * Top-ranked pathway row returned by compound overview endpoints.
 */
export interface PathwayTopDatum {
  /** Source catalog associated with the pathway. */
  source: string;
  /** Pathway name or identifier. */
  pathway: string;
  /** Number of supporting rows contributing to the ranking. */
  supporting_rows: number;
}

/**
 * Cell used to render compound pathway coverage matrices.
 */
export interface PathwayCoverageCell {
  /** Source catalog represented by the matrix row or column. */
  source: string;
  /** Pathway name represented by the matrix row or column. */
  pathway: string;
  /** Presence flag used by the UI to mark whether the pathway is linked. */
  present: number;
  /** Backend-derived weight used to rank or emphasize coverage. */
  weight: number;
}

/**
 * Coverage matrix returned by compound overview endpoints.
 */
export interface PathwayCoverageMatrix {
  /** Ordered source labels used by the matrix. */
  sources: string[];
  /** Ordered pathway labels used by the matrix. */
  pathways: string[];
  /** Sparse matrix cells combining source and pathway values. */
  cells: PathwayCoverageCell[];
}

/**
 * Quantitative overview payload returned by compound detail endpoints.
 */
export interface CompoundOverviewResponse {
  /** Compound identifier requested by the client. */
  cpd: string;
  /** Requested limits used to shape top-ranked overview sections. */
  limits: {
    /** Maximum number of KO rows returned in `ko_bar`. */
    top_ko: number;
    /** Maximum number of pathway rows returned per source section. */
    top_pathways: number;
  };
  /** Aggregate counts and summary metrics for the compound. */
  summary: CompoundOverviewSummary;
  /** KO distribution used by the overview bar chart. */
  ko_bar: KoBarDatum[];
  /** Top KEGG pathways linked to the compound. */
  pathways_top_kegg: PathwayTopDatum[];
  /** Top HADEG pathways linked to the compound. */
  pathways_top_hadeg: PathwayTopDatum[];
  /** Cross-source pathway coverage matrix. */
  pathway_coverage: PathwayCoverageMatrix;
  /** Metric descriptions explaining how overview aggregates were derived. */
  metric_basis: {
    /** Basis used to compute KO bar counts. */
    ko_bar: string;
    /** Basis used to compute KEGG top pathway counts. */
    pathways_top_kegg: string;
    /** Basis used to compute HADEG top pathway counts. */
    pathways_top_hadeg: string;
    /** Basis used to compute pathway coverage weights. */
    pathway_coverage_weight: string;
  };
  /** Endpoint-level toxicity values used by the overview heatmap. */
  toxicity_heatmap: ToxicityHeatmapDatum[];
}

/**
 * Data source descriptor included in compound metadata responses.
 */
export interface CompoundMetadataSource {
  /** Source system name displayed to the user. */
  name: string;
  /** Source responsibility within the metadata panel. */
  role: string;
  /** UI color token associated with the source badge. */
  color: 'green' | 'blue' | 'purple' | 'orange' | string;
}

/**
 * Metadata payload returned by compound detail endpoints.
 */
export interface CompoundMetadata {
  /** Identifier and cross-reference fields shown in the metadata panel. */
  identifiers: {
    /** Compound identifier requested by the client. */
    cpd: string;
    /** Preferred compound name when available. */
    compound_name: string | null;
    /** Compound class label when available. */
    compound_class: string | null;
    /** KO identifiers linked to the compound. */
    ko_ids: string[];
    /** Gene symbols linked to the compound. */
    gene_symbols: string[];
    /** Gene names linked to the compound. */
    gene_names: string[];
    /** ChEBI identifier when available. */
    chebi_id: string | null;
    /** Compound SMILES string when available. */
    smiles: string | null;
  };
  /** Functional annotations derived from linked genes, reactions, and pathways. */
  functional_annotation: {
    /** Enzyme activity labels linked to the compound. */
    enzyme_activity: string[];
    /** EC numbers linked to the compound. */
    ec_numbers: string[];
    /** HADEG pathways linked to the compound. */
    pathways_hadeg: string[];
    /** KEGG pathways linked to the compound. */
    pathways_kegg: string[];
    /** COMPOUND_PATHWAY entries linked to the compound. */
    compound_pathway_class: string[];
    /** Number of distinct linked reactions. */
    reaction_count: number;
  };
  /** Chemical identifiers and names exposed by the metadata panel. */
  chemical_information: {
    /** Preferred compound name when available. */
    compound_name: string | null;
    /** Compound class label when available. */
    compound_class: string | null;
    /** Compound SMILES string when available. */
    smiles: string | null;
    /** ChEBI identifier when available. */
    chebi: string | null;
  };
  /** Data source badges shown in the metadata UI. */
  data_sources: CompoundMetadataSource[];
  /** Provenance fields describing the dataset build that produced the payload. */
  provenance: {
    /** Dataset or payload version string. */
    version: string;
    /** Last update timestamp when available. */
    last_updated: string | null;
    /** Pipeline identifier reported by the backend. */
    pipeline: string;
  };
  /** External identifiers and counts used for cross-reference display. */
  cross_references: {
    /** KEGG compound identifier preserved from the backend payload. */
    kegg_compound_id: string;
    /** ChEBI identifier when available. */
    chebi: string | null;
    /** EC numbers linked to the compound. */
    ec_numbers: string[];
    /** Number of distinct linked reactions. */
    reaction_count: number;
  };
  /** Backend-reported data quality signals for the current compound. */
  data_quality: {
    /** Whether linked KO identifiers passed backend format validation. */
    ko_format_valid: boolean;
    /** Whether the compound identifier passed backend format validation. */
    cpd_format_valid: boolean;
    /** Completeness percentage reported by the backend. */
    completeness_pct: number;
    /** Qualitative cross-reference coverage label returned by the backend. */
    cross_references_coverage: string;
  };
}

/**
 * Filter parameters accepted by compound explorer endpoints.
 */
export interface CompoundFilters {
  /** Compound class filter. */
  compoundclass?: string;
  /** Reference agency filter. */
  reference_ag?: string;
  /** Pathway source filter. */
  pathway_source?: string;
  /** Exact pathway filter. */
  pathway?: string;
  /** Exact gene symbol or identifier filter. */
  gene?: string;
  /** Inclusive lower bound for KO counts. */
  ko_count_min?: number;
  /** Inclusive upper bound for KO counts. */
  ko_count_max?: number;
  /** Inclusive lower bound for gene counts. */
  gene_count_min?: number;
  /** Inclusive upper bound for gene counts. */
  gene_count_max?: number;
  /** Free-text search term forwarded to the backend. */
  search?: string;
}

/**
 * Gene association row returned by compound detail endpoints.
 */
export interface CompoundGeneCardRow {
  /** Compound identifier requested by the client. */
  cpd: string;
  /** KO identifier linked to the gene association. */
  ko: string;
  /** Gene symbol linked to the compound. */
  genesymbol: string;
  /** Gene name linked to the compound. */
  genename: string;
  /** Enzyme activity label associated with the gene relation. */
  enzyme_activity: string;
  /** EC number associated with the gene relation. */
  ec: string;
  /** Reaction descriptions linked to the association row. */
  reaction_descriptions: string[];
  /** Total number of reaction descriptions before client-side truncation. */
  reaction_descriptions_total: number;
  /** Number of supporting rows contributing to the association. */
  supporting_rows: number;
  /** ISO-like timestamp indicating when the row was last refreshed. */
  updated_at: string;
}

/**
 * Pathway association row returned by compound detail endpoints.
 */
export interface CompoundPathwayCardRow {
  /** Compound identifier requested by the client. */
  cpd: string;
  /** Source catalog that contributed the pathway association. */
  source: 'HADEG' | 'KEGG' | 'COMPOUND_PATHWAY' | string;
  /** Pathway name linked to the compound. */
  pathway: string;
  /** Number of supporting rows contributing to the association. */
  supporting_rows: number;
  /** ISO-like timestamp indicating when the row was last refreshed. */
  updated_at: string;
}
