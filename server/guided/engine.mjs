import { parsePositiveInt } from '../shared/query.mjs';
import { createGuidedCatalogLoader } from './catalog-loader.mjs';
import { normalizeFilters } from './utils/filters.mjs';
import { buildSummaryCards, buildVisualizations, buildTable } from './utils/response-builders.mjs';
import { resolveMetaEndpointOptions, resolveQueryDerivedOptions } from './utils/options.mjs';

import { executeRankedMetric } from './executors/ranked-metric.mjs';
import { executeMostToxicCompounds } from './executors/most-toxic-compounds.mjs';
import { executeRegulatedByAgency } from './executors/regulated-by-agency.mjs';
import { executePathwayFunctionalCoverage } from './executors/pathway-functional-coverage.mjs';
import { executeGeneConnectivityRanking } from './executors/gene-connectivity-ranking.mjs';
import { executeGeneToxicCompoundsEndpoint } from './executors/gene-toxic-compounds-endpoint.mjs';
import { executePathwaysToxicCompounds } from './executors/pathways-toxic-compounds.mjs';
import { executeRiskPotentialScatter } from './executors/risk-potential-scatter.mjs';

const EXECUTOR_REGISTRY = {
  uc_ranked_metric: executeRankedMetric,
  uc_most_toxic_compounds: executeMostToxicCompounds,
  uc_regulated_by_agency: executeRegulatedByAgency,
  uc_pathway_functional_coverage: executePathwayFunctionalCoverage,
  uc_gene_connectivity_ranking: executeGeneConnectivityRanking,
  uc_gene_toxic_compounds_endpoint: executeGeneToxicCompoundsEndpoint,
  uc_pathways_toxic_compounds: executePathwaysToxicCompounds,
  uc_risk_potential_scatter: executeRiskPotentialScatter,
};

export function createGuidedEngine({ db, projectRoot }) {
  const catalogLoader = createGuidedCatalogLoader({ projectRoot });

  function getCatalogResponse() {
    const catalog = catalogLoader.getCatalog();
    return {
      version: catalog.version,
      title: catalog.title,
      categories: catalog.categories,
      queries: catalog.queries,
      generated_at: catalog.generated_at ?? null,
    };
  }

  function getQueryOptions(queryId, selectedFilters = {}) {
    const query = catalogLoader.getQueryOrThrow(queryId);
    const normalizedFilters = normalizeFilters(query, selectedFilters);
    const optionsByFilter = {};

    for (const filter of query.filters || []) {
      const provider = filter.provider;
      if (!provider) {
        continue;
      }

      if (provider.type === 'meta_endpoint') {
        optionsByFilter[filter.id] = resolveMetaEndpointOptions(db, provider.endpoint);
      } else if (provider.type === 'static') {
        optionsByFilter[filter.id] = (provider.options || []).map((option) => ({
          value: option.value,
          label: option.label,
        }));
      } else if (provider.type === 'query_derived') {
        optionsByFilter[filter.id] = resolveQueryDerivedOptions(db, provider, normalizedFilters);
      } else {
        throw new Error(`Unsupported guided provider type: ${provider.type}`);
      }
    }

    return {
      query_id: query.id,
      options: optionsByFilter,
    };
  }

  function executeQuery(queryId, payload = {}) {
    const startedAt = Date.now();
    const catalog = catalogLoader.getCatalog();
    const query = catalogLoader.getQueryOrThrow(queryId);

    const defaultPageSize = parsePositiveInt(query.defaults?.page_size, 10);
    const page = parsePositiveInt(payload.page, 1);
    const pageSize = Math.min(200, parsePositiveInt(payload.pageSize, defaultPageSize));
    const filters = normalizeFilters(query, payload.filters || {});

    const executor = EXECUTOR_REGISTRY[query.executor];
    if (!executor) {
      throw new Error(`No guided executor registered for "${query.executor}"`);
    }

    const result = executor({
      db,
      query,
      filters,
      page,
      pageSize,
    });

    return {
      meta: {
        query_id: query.id,
        dataset: query.dataset,
        version: catalog.version,
        execution_ms: Date.now() - startedAt,
        page: result.table.page,
        pageSize: result.table.pageSize,
        total: result.table.total,
        totalPages: result.table.totalPages,
        ...(result.extraMeta || {}),
      },
      summary_cards: buildSummaryCards(query, result.summaryValues || {}),
      visualizations: buildVisualizations(query, result.visualizationValues || {}),
      table: buildTable(query, result.table),
      filters_applied: filters,
    };
  }

  return {
    getCatalogResponse,
    getQueryOptions,
    executeQuery,
  };
}
