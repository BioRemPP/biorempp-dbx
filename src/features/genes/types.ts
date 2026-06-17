import type { PathwayToxicityMatrix } from '@/features/pathways/types';

/**
 * @packageDocumentation
 *
 * Response and filter contracts for gene explorer and gene detail API payloads.
 */
/**
 * Summary row returned by gene explorer endpoints.
 */
export interface GeneSummary {
  /** KO identifier used as the canonical gene route key. */
  ko: string;
  /** Preferred gene symbol when available. */
  genesymbol: string | null;
  /** Preferred gene name when available. */
  genename: string | null;
  /** Number of linked compounds. */
  compound_count: number;
  /** Number of linked pathways. */
  pathway_count: number;
  /** Distinct enzyme activity labels linked to the gene. */
  enzyme_activities: string[];
  /** ISO-like timestamp indicating when the row was last refreshed. */
  updated_at: string;
}

/**
 * Aggregate summary returned by gene detail endpoints.
 */
export interface GeneDetailSummary {
  /** KO identifier used as the detail route key. */
  ko: string;
  /** Preferred gene symbol when available. */
  genesymbol: string | null;
  /** Preferred gene name when available. */
  genename: string | null;
  /** Number of linked compounds. */
  compound_count: number;
  /** Number of linked pathways. */
  pathway_count: number;
  /** Distinct enzyme activity labels linked to the gene. */
  enzyme_activities: string[];
  /** Number of distinct compound classes represented by linked compounds. */
  compound_class_count: number;
  /** Number of distinct reference agencies represented by linked compounds. */
  reference_agency_count: number;
  /** Percentage of linked compounds with toxicity coverage. */
  toxicity_coverage_pct: number | null;
  /** ISO-like timestamp indicating when the aggregate row was last refreshed. */
  updated_at: string;
}

/**
 * Summary metrics focused on the gene overview visualization payload.
 */
export interface GeneDetailOverviewSummary {
  /** Total number of compounds linked to the gene. */
  linked_compounds_total: number;
  /** Number of linked compounds that have toxicity data. */
  toxicity_compounds: number;
  /** Number of linked compounds excluded because no toxicity data was available. */
  excluded_no_toxicity: number;
  /** Number of toxicity endpoints represented in the overview matrix. */
  endpoint_count: number;
  /** Percentage of linked compounds with toxicity coverage. */
  toxicity_coverage_pct: number | null;
}

/**
 * Overview payload returned by gene detail endpoints.
 */
export interface GeneDetailOverviewResponse {
  /** KO identifier requested by the client. */
  ko: string;
  /** Aggregate metrics used by the overview page. */
  summary: GeneDetailOverviewSummary;
  /** Compound-endpoint toxicity matrix used by the overview heatmap. */
  toxicity_matrix: PathwayToxicityMatrix;
}

/**
 * Compound row returned by gene association endpoints.
 */
export interface GeneAssociatedCompoundRow {
  /** Compound identifier linked to the gene. */
  cpd: string;
  /** Compound display name when available. */
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
  /** Compound SMILES string when available. */
  smiles: string | null;
  /** ISO-like timestamp indicating when the row was last refreshed. */
  updated_at: string;
}

/**
 * Data source descriptor included in gene metadata responses.
 */
export interface GeneMetadataSource {
  /** Source system name displayed to the user. */
  name: string;
  /** Source responsibility within the metadata panel. */
  role: string;
  /** UI color token associated with the source badge. */
  color: 'green' | 'blue' | 'purple' | 'orange' | string;
}

/**
 * ChEBI cross-reference item included in gene metadata.
 */
export interface GeneMetadataChebiItem {
  /** ChEBI identifier. */
  id: string;
  /** Compound name associated with the ChEBI identifier when available. */
  compound_name: string | null;
}

/**
 * SMILES cross-reference item included in gene metadata.
 */
export interface GeneMetadataSmilesItem {
  /** SMILES string value. */
  value: string;
  /** Compound name associated with the SMILES value when available. */
  compound_name: string | null;
}

/**
 * Reaction cross-reference item included in gene metadata.
 */
export interface GeneMetadataReactionItem {
  /** Reaction identifier. */
  id: string;
  /** Optional reaction description returned by the backend. */
  description: string | null;
}

/**
 * Metadata payload returned by gene detail endpoints.
 */
export interface GeneMetadata {
  /** Identifier and cross-reference fields shown in the metadata panel. */
  identifiers: {
    /** KO identifier requested by the client. */
    ko: string;
    /** Preferred gene symbol when available. */
    gene_symbol: string | null;
    /** Preferred gene name when available. */
    gene_name: string | null;
    /** KEGG KO identifier preserved from the backend payload. */
    kegg_ko_id: string;
    /** Distinct EC numbers linked to the gene. */
    ec_numbers: string[];
    /** Distinct ChEBI identifiers linked to the gene. */
    chebi_ids: string[];
    /** Distinct SMILES strings linked to the gene. */
    smiles: string[];
    /** Distinct reaction identifiers linked to the gene. */
    reaction_ids: string[];
    /** Expanded ChEBI items used by the metadata UI. */
    chebi_items: GeneMetadataChebiItem[];
    /** Expanded SMILES items used by the metadata UI. */
    smiles_items: GeneMetadataSmilesItem[];
    /** Expanded reaction items used by the metadata UI. */
    reaction_items: GeneMetadataReactionItem[];
  };
  /** Data source badges shown in the metadata UI. */
  data_sources: GeneMetadataSource[];
  /** Quantitative counters summarizing linked annotations and coverage. */
  quantitative_overview: {
    /** Number of linked compounds. */
    linked_compounds: number;
    /** Number of distinct linked compound classes. */
    compound_classes: number;
    /** Number of total pathway annotations across sources. */
    pathway_annotations: number;
    /** Number of HADEG pathway annotations. */
    pathways_hadeg: number;
    /** Number of KEGG pathway annotations. */
    pathways_kegg: number;
    /** Number of COMPOUND_PATHWAY annotations. */
    pathways_compound_pathway: number;
    /** Number of distinct EC numbers linked to the gene. */
    ec_count: number;
    /** Number of distinct enzyme activity labels linked to the gene. */
    enzyme_activity_count: number;
    /** Number of distinct reference agencies represented by linked compounds. */
    reference_agencies: number;
    /** Percentage of linked compounds with toxicity coverage. */
    toxicity_coverage_pct: number | null;
    /** Number of distinct reaction identifiers linked to the gene. */
    reaction_id_count: number;
  };
}

/**
 * Filter parameters accepted by gene explorer endpoints.
 */
export interface GeneFilters {
  /** Exact gene symbol filter. */
  genesymbol?: string;
  /** Inclusive lower bound for linked compound counts. */
  compound_count_min?: number;
  /** Inclusive upper bound for linked compound counts. */
  compound_count_max?: number;
  /** Free-text search term forwarded to the backend. */
  search?: string;
}
