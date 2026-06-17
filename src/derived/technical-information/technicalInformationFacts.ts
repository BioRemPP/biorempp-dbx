/**
 * @packageDocumentation
 *
 * Release-sensitive facts derived from bundled BioRemPP snapshot metadata for the Technical
 * Information page.
 */
import basicStatisticsRaw from '../../../data/databases_metadatas/basic_statistics.json?raw';
import databaseMetadataRaw from '../../../data/databases_metadatas/database_metadata.json?raw';
import type { TechnicalInformationFacts } from '@/types/technicalInformation';

function parseJsonObject(raw: string, source: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('root must be an object');
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      `Invalid technical information facts JSON in ${source}: ${error instanceof Error ? error.message : 'unknown error'}`
    );
  }
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function buildTechnicalInformationFacts(): TechnicalInformationFacts {
  const basicStatistics = parseJsonObject(basicStatisticsRaw, 'basic_statistics.json');
  const databaseMetadata = parseJsonObject(databaseMetadataRaw, 'database_metadata.json');

  const databaseInfo = (databaseMetadata.database_info as Record<string, unknown>) || {};
  const dataSources = (databaseMetadata.data_sources as Record<string, unknown>) || {};
  const keggRelease = (dataSources.kegg_release as Record<string, unknown>) || {};
  const dataQuality = (databaseMetadata.data_quality as Record<string, unknown>) || {};
  const completeness = (dataQuality.completeness as Record<string, unknown>) || {};
  const missingValues = (basicStatistics.missing_values as Record<string, unknown>) || {};
  const linkMatch = (databaseMetadata.link_match as Record<string, unknown>) || {};
  const coverage = (linkMatch.coverage as Record<string, unknown>) || {};
  const kos = (coverage.kos as Record<string, unknown>) || {};
  const cpds = (coverage.cpds as Record<string, unknown>) || {};
  const rowShapes = (linkMatch.row_shapes as Record<string, unknown>) || {};
  const reactionCoverage = (linkMatch.reaction_description as Record<string, unknown>) || {};
  const columnNames = Array.isArray(basicStatistics.column_names)
    ? basicStatistics.column_names.map((value) => String(value).trim()).filter(Boolean)
    : [];

  return {
    database_name: String(databaseInfo.name || 'BioRemPP Database'),
    database_version: String(databaseInfo.version || '1.1.0'),
    generation_date: String(databaseInfo.generation_date || '-'),
    kegg_release: String(keggRelease.parsed_version || '-'),
    total_entries: toNumber(basicStatistics.total_entries),
    total_columns: toNumber(basicStatistics.total_columns),
    column_names: columnNames,
    unique_compounds: toNumber(basicStatistics.unique_compounds),
    unique_ko_entries: toNumber(basicStatistics.unique_ko_entries),
    unique_gene_symbols: toNumber(basicStatistics.unique_gene_symbols),
    unique_gene_names: toNumber(basicStatistics.unique_gene_names),
    unique_enzyme_activities: toNumber(basicStatistics.unique_enzyme_activities),
    unique_reference_agencies: toNumber(basicStatistics.unique_reference_agencies),
    column_completeness: columnNames.map((column) => ({
      column,
      completeness_pct: toNumber(completeness[column]),
      missing_count: toNumber(missingValues[column]),
    })),
    link_match: {
      ko_total: toNumber(kos.total_in_database),
      ko_matched: toNumber(kos.matched_count),
      ko_unmatched: toNumber(kos.unmatched_count),
      cpd_total: toNumber(cpds.total_in_database),
      cpd_matched: toNumber(cpds.matched_count),
      cpd_unmatched: toNumber(cpds.unmatched_count),
    },
    row_shapes: {
      dense: toNumber(rowShapes.dense),
      ec_only: toNumber(rowShapes.ec_only),
      reaction_only: toNumber(rowShapes.reaction_only),
      both_na: toNumber(rowShapes.both_na),
    },
    reaction_coverage: {
      with_reaction_rows: toNumber(reactionCoverage.with_reaction_rows),
      with_reaction_description_rows: toNumber(reactionCoverage.with_reaction_description_rows),
      unmatched_reaction_id_count: toNumber(reactionCoverage.unmatched_reaction_id_count),
    },
  };
}

export const TECHNICAL_INFORMATION_FACTS = buildTechnicalInformationFacts();
