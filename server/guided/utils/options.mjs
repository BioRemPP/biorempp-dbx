import { readDistinctStrings } from '../../shared/query.mjs';
import {
  formatEndpoint,
  getEndpointGroupKey,
  getEndpointGroupTitle,
  getEndpointSortTuple,
} from '../toxicity-groups.mjs';

export function resolveMetaEndpointOptions(db, endpoint) {
  switch (endpoint) {
    case '/api/meta/compound-classes':
      return readDistinctStrings(
        db,
        `
          SELECT DISTINCT compoundclass AS value
          FROM compound_summary
          WHERE compoundclass IS NOT NULL
          ORDER BY compoundclass
        `
      ).map((value) => ({ value, label: value }));
    case '/api/meta/reference-ags':
      return readDistinctStrings(
        db,
        `
          SELECT DISTINCT reference_ag AS value
          FROM compound_reference_map
          WHERE reference_ag IS NOT NULL
          ORDER BY reference_ag
        `
      ).map((value) => ({ value, label: value }));
    case '/api/meta/pathways':
      return readDistinctStrings(
        db,
        `
          SELECT DISTINCT pathway AS value
          FROM pathway_summary
          WHERE pathway IS NOT NULL
          ORDER BY pathway
        `
      ).map((value) => ({ value, label: value }));
    case '/api/meta/genes':
      return readDistinctStrings(
        db,
        `
          SELECT DISTINCT genesymbol AS value
          FROM gene_summary
          WHERE genesymbol IS NOT NULL
          ORDER BY genesymbol
        `
      ).map((value) => ({ value, label: value }));
    default:
      throw new Error(`Unsupported guided meta_endpoint provider: ${endpoint}`);
  }
}

export function resolveQueryDerivedOptions(db, provider, selectedFilters = {}) {
  if (provider.source !== 'toxicity_endpoints') {
    throw new Error(`Unsupported guided query_derived provider source: ${provider.source}`);
  }

  const endpointGroup = typeof selectedFilters.endpoint_group === 'string' ? selectedFilters.endpoint_group : 'all';

  let options = readDistinctStrings(
    db,
    `
      SELECT DISTINCT endpoint AS value
      FROM toxicity_endpoint
      WHERE endpoint IS NOT NULL
      ORDER BY endpoint
    `
  )
    .map((endpoint) => ({
      value: endpoint,
      label: formatEndpoint(endpoint),
      group_key: getEndpointGroupKey(endpoint),
      group_title: getEndpointGroupTitle(getEndpointGroupKey(endpoint)),
    }))
    .sort((a, b) => {
      const [groupA, endpointA, labelA] = getEndpointSortTuple(a.value);
      const [groupB, endpointB, labelB] = getEndpointSortTuple(b.value);
      if (groupA !== groupB) {
        return groupA - groupB;
      }
      if (endpointA !== endpointB) {
        return endpointA - endpointB;
      }
      return labelA.localeCompare(labelB);
    });

  if (endpointGroup && endpointGroup !== 'all') {
    options = options.filter((option) => option.group_key === endpointGroup);
  }

  if (provider.include_mean_option && (!endpointGroup || endpointGroup === 'all')) {
    options = [
      {
        value: 'mean',
        label: provider.mean_option_label || 'toxicity_risk_mean (all endpoints mean)',
      },
      ...options,
    ];
  }

  return options;
}
