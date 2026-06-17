import { parsePositiveInt, readDistinctStrings, deriveRiskBucket } from '../../shared/query.mjs';
import { getEndpointGroupKey, getEndpointGroupTitle, formatEndpoint } from '../toxicity-groups.mjs';
import { buildCompoundWhereSql } from '../utils/filters.mjs';

export function executeMostToxicCompounds({ db, query, filters, page, pageSize }) {
  const riskMode = filters.risk_mode === 'group_peak' ? 'group_peak' : 'endpoint';
  const endpointGroup =
    typeof filters.endpoint_group === 'string' && filters.endpoint_group.trim() !== ''
      ? filters.endpoint_group.trim()
      : 'all';

  const allEndpoints = readDistinctStrings(
    db,
    `
      SELECT DISTINCT endpoint AS value
      FROM toxicity_endpoint
      WHERE endpoint IS NOT NULL
      ORDER BY endpoint
    `
  );
  const groupEndpoints =
    endpointGroup === 'all'
      ? allEndpoints
      : allEndpoints.filter((candidate) => getEndpointGroupKey(candidate) === endpointGroup);

  if (groupEndpoints.length === 0) {
    throw new Error(`No toxicity endpoints found for endpoint_group "${endpointGroup}"`);
  }

  let endpoint = typeof filters.endpoint === 'string' ? filters.endpoint.trim() : '';
  if (riskMode === 'endpoint') {
    if (!endpoint) {
      endpoint = groupEndpoints[0];
    }
    if (!endpoint) {
      throw new Error('UC2 requires a valid endpoint selection');
    }
    if (endpointGroup !== 'all' && getEndpointGroupKey(endpoint) !== endpointGroup) {
      throw new Error(`Endpoint "${endpoint}" is not part of endpoint_group "${endpointGroup}"`);
    }
  }

  const { whereSql, params } = buildCompoundWhereSql(filters);
  const scopeTotal = db.prepare(`SELECT COUNT(*) AS total FROM compound_summary cs ${whereSql}`).get(...params).total;
  const yRange = filters.y_value || {};

  const metricRows =
    riskMode === 'endpoint'
      ? db
          .prepare(
            `
            SELECT
              cs.cpd,
              cs.compoundname,
              cs.compoundclass,
              cs.gene_count,
              cs.ko_count,
              cs.pathway_count,
              te.value AS endpoint_value,
              te.endpoint AS endpoint_used
            FROM compound_summary cs
            LEFT JOIN toxicity_endpoint te
              ON te.cpd = cs.cpd
             AND te.endpoint = ?
            ${whereSql}
            ORDER BY cs.cpd ASC
          `
          )
          .all(endpoint, ...params)
      : (() => {
          const endpointPlaceholders = groupEndpoints.map(() => '?').join(', ');
          return db
            .prepare(
              `
              WITH endpoint_scope AS (
                SELECT
                  cpd,
                  endpoint,
                  value
                FROM toxicity_endpoint
                WHERE value IS NOT NULL
                  AND endpoint IN (${endpointPlaceholders})
              ),
              endpoint_max AS (
                SELECT
                  cpd,
                  MAX(value) AS endpoint_value
                FROM endpoint_scope
                GROUP BY cpd
              ),
              endpoint_choice AS (
                SELECT
                  es.cpd,
                  MIN(es.endpoint) AS endpoint_used
                FROM endpoint_scope es
                JOIN endpoint_max em
                  ON em.cpd = es.cpd
                 AND em.endpoint_value = es.value
                GROUP BY es.cpd
              )
              SELECT
                cs.cpd,
                cs.compoundname,
                cs.compoundclass,
                cs.gene_count,
                cs.ko_count,
                cs.pathway_count,
                em.endpoint_value,
                ec.endpoint_used
              FROM compound_summary cs
              LEFT JOIN endpoint_max em
                ON em.cpd = cs.cpd
              LEFT JOIN endpoint_choice ec
                ON ec.cpd = cs.cpd
              ${whereSql}
              ORDER BY cs.cpd ASC
            `
            )
            .all(...groupEndpoints, ...params);
        })();

  let excludedNullY = 0;
  const rankedRowsRaw = [];
  for (const row of metricRows) {
    const yValue = row.endpoint_value === null || row.endpoint_value === undefined ? null : Number(row.endpoint_value);
    if (yValue === null || Number.isNaN(yValue)) {
      excludedNullY += 1;
      continue;
    }

    if (yRange.min !== undefined && yValue < yRange.min) {
      continue;
    }
    if (yRange.max !== undefined && yValue > yRange.max) {
      continue;
    }

    rankedRowsRaw.push({
      cpd: row.cpd,
      compoundname: row.compoundname,
      compoundclass: row.compoundclass,
      gene_count: Number(row.gene_count) || 0,
      ko_count: Number(row.ko_count) || 0,
      pathway_count: Number(row.pathway_count) || 0,
      y_value: yValue,
      endpoint_used: row.endpoint_used || endpoint || null,
    });
  }

  const rankedRows = rankedRowsRaw.sort((a, b) => {
    const riskDelta = b.y_value - a.y_value;
    if (riskDelta !== 0) {
      return riskDelta;
    }
    const potentialDelta = b.gene_count - a.gene_count;
    if (potentialDelta !== 0) {
      return potentialDelta;
    }
    return a.cpd.localeCompare(b.cpd);
  });

  const total = rankedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;
  const tableRows = rankedRows.slice(offset, offset + pageSize).map((row, idx) => ({
    rank: offset + idx + 1,
    ...row,
  }));

  const heatmapTopN = Math.min(200, parsePositiveInt(query.executor_config?.heatmap_top_n, 25));
  const heatmapCompounds = rankedRows.slice(0, heatmapTopN);
  const heatmapEndpoints = riskMode === 'endpoint' ? [endpoint] : groupEndpoints;

  let heatmapCells = [];
  if (heatmapCompounds.length > 0 && heatmapEndpoints.length > 0) {
    const cpdPlaceholders = heatmapCompounds.map(() => '?').join(', ');
    const endpointPlaceholders = heatmapEndpoints.map(() => '?').join(', ');
    heatmapCells = db
      .prepare(
        `
          SELECT
            cpd,
            endpoint,
            label,
            value
          FROM toxicity_endpoint
          WHERE cpd IN (${cpdPlaceholders})
            AND endpoint IN (${endpointPlaceholders})
          ORDER BY cpd ASC, endpoint ASC
        `
      )
      .all(
        ...heatmapCompounds.map((row) => row.cpd),
        ...heatmapEndpoints
      )
      .map((row) => ({
        cpd: row.cpd,
        endpoint: row.endpoint,
        label: row.label,
        value: row.value === null ? null : Number(row.value),
        risk_bucket: deriveRiskBucket(row.label),
      }));
  }

  const endpointContext =
    riskMode === 'endpoint'
      ? `Endpoint: ${formatEndpoint(endpoint)}`
      : `Endpoint Group Peak: ${
          endpointGroup === 'all' ? 'All Groups' : getEndpointGroupTitle(endpointGroup)
        }`;

  return {
    summaryValues: {
      compounds_in_scope: scopeTotal,
      ranked_points: rankedRows.length,
      excluded_null_y: excludedNullY,
      endpoint_context: endpointContext,
      risk_mode_label: riskMode === 'endpoint' ? 'Single Endpoint' : 'Endpoint Group Peak',
    },
    visualizationValues: {
      toxicity_matrix: {
        compounds: heatmapCompounds.map((row) => ({
          cpd: row.cpd,
          compoundname: row.compoundname || null,
          compoundclass: row.compoundclass || null,
          y_value: row.y_value,
          endpoint_used: row.endpoint_used,
        })),
        endpoints: heatmapEndpoints,
        cells: heatmapCells,
        total_compounds_in_scope: rankedRows.length,
      },
    },
    table: {
      rows: tableRows,
      total,
      page: safePage,
      pageSize,
      totalPages,
    },
    extraMeta: {
      risk_mode: riskMode,
      endpoint_group: endpointGroup,
      endpoint: riskMode === 'endpoint' ? endpoint : null,
      endpoint_count: heatmapEndpoints.length,
      excluded_null_y: excludedNullY,
    },
  };
}
