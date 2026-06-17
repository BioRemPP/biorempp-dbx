import { likeValue } from '../../shared/query.mjs';
import { toBoolean, parseRangeValue } from './parsing.mjs';

export const DATASET_FILTER_WHITELIST = {
  compound_summary: new Set([
    'search',
    'pathway',
    'source',
    'compoundclass',
    'reference_ag',
    'ko_count',
    'compound_count',
    'toxic_compound_count',
    'gene_count',
    'pathway_count',
    'risk_mode',
    'endpoint_group',
    'endpoint',
    'x_scale',
    'y_value',
    'focus_cluster',
  ]),
};

export function normalizeFilters(query, rawFilters = {}) {
  const normalized = {};
  const allowedFilterIds = DATASET_FILTER_WHITELIST[query.dataset];
  if (!allowedFilterIds) {
    throw new Error(`No filter whitelist configured for dataset "${query.dataset}"`);
  }

  for (const [filterId] of Object.entries(rawFilters || {})) {
    if (!query.filters.some((filter) => filter.id === filterId)) {
      throw new Error(`Unknown filter "${filterId}" for query "${query.id}"`);
    }
  }

  for (const filter of query.filters || []) {
    if (!allowedFilterIds.has(filter.id)) {
      throw new Error(
        `Filter "${filter.id}" is not allowed for dataset "${query.dataset}" in query "${query.id}"`
      );
    }

    const rawValue = rawFilters?.[filter.id];
    switch (filter.type) {
      case 'search': {
        const value = typeof rawValue === 'string' ? rawValue.trim() : '';
        if (value) {
          normalized[filter.id] = value;
        }
        break;
      }
      case 'select':
      case 'dependent_select': {
        const value = typeof rawValue === 'string' ? rawValue.trim() : '';
        if (value) {
          normalized[filter.id] = value;
        }
        break;
      }
      case 'toggle':
        normalized[filter.id] = toBoolean(rawValue);
        break;
      case 'number_range':
        normalized[filter.id] = parseRangeValue(rawValue);
        break;
      default:
        break;
    }
  }

  return normalized;
}

export function buildCompoundWhereSql(filters) {
  const where = [];
  const params = [];

  if (filters.search) {
    const search = likeValue(filters.search);
    where.push('(cs.compoundname LIKE ? COLLATE NOCASE OR cs.cpd LIKE ? COLLATE NOCASE)');
    params.push(search, search);
  }

  if (filters.compoundclass && filters.compoundclass !== 'all') {
    where.push('cs.compoundclass = ?');
    params.push(filters.compoundclass);
  }

  if (filters.reference_ag && filters.reference_ag !== 'all') {
    where.push(`
      EXISTS (
        SELECT 1
        FROM compound_reference_map crm
        WHERE crm.cpd = cs.cpd
          AND crm.reference_ag = ?
      )
    `);
    params.push(filters.reference_ag);
  }

  const koRange = filters.ko_count || {};
  if (koRange.min !== undefined) {
    where.push('cs.ko_count >= ?');
    params.push(koRange.min);
  }
  if (koRange.max !== undefined) {
    where.push('cs.ko_count <= ?');
    params.push(koRange.max);
  }

  const geneRange = filters.gene_count || {};
  if (geneRange.min !== undefined) {
    where.push('cs.gene_count >= ?');
    params.push(geneRange.min);
  }
  if (geneRange.max !== undefined) {
    where.push('cs.gene_count <= ?');
    params.push(geneRange.max);
  }

  const pathwayRange = filters.pathway_count || {};
  if (pathwayRange.min !== undefined) {
    where.push('cs.pathway_count >= ?');
    params.push(pathwayRange.min);
  }
  if (pathwayRange.max !== undefined) {
    where.push('cs.pathway_count <= ?');
    params.push(pathwayRange.max);
  }

  return {
    whereSql: where.length > 0 ? `WHERE ${where.join(' AND ')}` : '',
    params,
  };
}
