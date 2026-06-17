import { parsePositiveInt, readDistinctStrings, likeValue } from '../../shared/query.mjs';
import { getEndpointGroupKey, getEndpointGroupTitle, formatEndpoint } from '../toxicity-groups.mjs';
import { deriveRiskBucketFromValue } from '../utils/toxicity.mjs';

export function executePathwaysToxicCompounds({ db, query, filters, page, pageSize }) {
  const selectedSource =
    typeof filters.source === 'string' && filters.source.trim() !== '' ? filters.source.trim() : 'all';
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
      throw new Error('UC6 requires a valid endpoint selection');
    }
    if (endpointGroup !== 'all' && getEndpointGroupKey(endpoint) !== endpointGroup) {
      throw new Error(`Endpoint "${endpoint}" is not part of endpoint_group "${endpointGroup}"`);
    }
  }

  const yRange = filters.y_value || {};
  const compoundRange = filters.compound_count || {};
  const toxicCompoundRange = filters.toxic_compound_count || {};

  const baseWhere = [];
  const baseParams = [];
  if (selectedSource !== 'all') {
    baseWhere.push('rel.source = ?');
    baseParams.push(selectedSource);
  }
  if (filters.pathway) {
    baseWhere.push('rel.pathway LIKE ? COLLATE NOCASE');
    baseParams.push(likeValue(filters.pathway));
  }
  const baseWhereSql = baseWhere.length > 0 ? `WHERE ${baseWhere.join(' AND ')}` : '';

  const riskRows =
    riskMode === 'endpoint'
      ? db
          .prepare(
            `
            SELECT
              b.pathway,
              b.source,
              b.cpd,
              te.value AS y_value,
              te.endpoint AS endpoint_used
            FROM (
              SELECT DISTINCT rel.pathway, rel.source, rel.cpd
              FROM compound_ko_pathway_rel rel
              ${baseWhereSql}
            ) b
            LEFT JOIN toxicity_endpoint te
              ON te.cpd = b.cpd
             AND te.endpoint = ?
            ORDER BY b.pathway ASC, b.cpd ASC
            `
          )
          .all(...baseParams, endpoint)
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
                  MAX(value) AS y_value
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
                 AND em.y_value = es.value
                GROUP BY es.cpd
              )
              SELECT
                b.pathway,
                b.source,
                b.cpd,
                em.y_value,
                ec.endpoint_used
              FROM (
                SELECT DISTINCT rel.pathway, rel.source, rel.cpd
                FROM compound_ko_pathway_rel rel
                ${baseWhereSql}
              ) b
              LEFT JOIN endpoint_max em
                ON em.cpd = b.cpd
              LEFT JOIN endpoint_choice ec
                ON ec.cpd = b.cpd
              ORDER BY b.pathway ASC, b.cpd ASC
              `
            )
            .all(...groupEndpoints, ...baseParams);
        })();

  const pathwayStats = new Map();
  const compoundsInScope = new Set();
  const toxicCompoundsInScope = new Set();

  for (const row of riskRows) {
    const pathway = String(row.pathway || '').trim();
    if (!pathway) {
      continue;
    }
    const source = String(row.source || '').trim() || (selectedSource === 'all' ? 'Mixed' : selectedSource);
    const cpd = String(row.cpd || '').trim();
    if (!cpd) {
      continue;
    }
    compoundsInScope.add(cpd);

    let stat = pathwayStats.get(pathway);
    if (!stat) {
      stat = {
        pathway,
        sourceSet: new Set(),
        compounds: new Set(),
        toxicCompounds: new Set(),
        maxPrediction: null,
      };
      pathwayStats.set(pathway, stat);
    }

    stat.sourceSet.add(source);
    stat.compounds.add(cpd);

    const yValue = row.y_value === null || row.y_value === undefined ? null : Number(row.y_value);
    if (yValue === null || Number.isNaN(yValue)) {
      continue;
    }
    if (yRange.min !== undefined && yValue < yRange.min) {
      continue;
    }
    if (yRange.max !== undefined && yValue > yRange.max) {
      continue;
    }

    stat.toxicCompounds.add(cpd);
    stat.maxPrediction = stat.maxPrediction === null ? yValue : Math.max(stat.maxPrediction, yValue);
    toxicCompoundsInScope.add(cpd);
  }

  const rankedRows = [...pathwayStats.values()]
    .map((stat) => {
      const compoundCount = stat.compounds.size;
      const toxicCompoundCount = stat.toxicCompounds.size;
      const toxicRatio = compoundCount > 0 ? Number(((toxicCompoundCount / compoundCount) * 100).toFixed(2)) : 0;
      return {
        pathway: stat.pathway,
        source:
          selectedSource === 'all'
            ? stat.sourceSet.size > 1
              ? 'Mixed'
              : [...stat.sourceSet][0] || 'Mixed'
            : selectedSource,
        compound_count: compoundCount,
        toxic_compound_count: toxicCompoundCount,
        toxic_ratio: toxicRatio,
        max_prediction: stat.maxPrediction === null ? null : Number(stat.maxPrediction.toFixed(4)),
      };
    })
    .filter((row) => row.toxic_compound_count > 0)
    .filter((row) => {
      if (compoundRange.min !== undefined && row.compound_count < compoundRange.min) {
        return false;
      }
      if (compoundRange.max !== undefined && row.compound_count > compoundRange.max) {
        return false;
      }
      if (toxicCompoundRange.min !== undefined && row.toxic_compound_count < toxicCompoundRange.min) {
        return false;
      }
      if (toxicCompoundRange.max !== undefined && row.toxic_compound_count > toxicCompoundRange.max) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const toxicDelta = b.toxic_compound_count - a.toxic_compound_count;
      if (toxicDelta !== 0) {
        return toxicDelta;
      }
      const maxDelta = (b.max_prediction || 0) - (a.max_prediction || 0);
      if (maxDelta !== 0) {
        return maxDelta;
      }
      return a.pathway.localeCompare(b.pathway);
    });

  const total = rankedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;
  const tableRows = rankedRows.slice(offset, offset + pageSize).map((row, idx) => ({
    rank: offset + idx + 1,
    ...row,
  }));

  const barTopN = Math.min(200, parsePositiveInt(query.executor_config?.bar_top_n, 10));
  const barItems = rankedRows.slice(0, barTopN).map((row) => ({
    id: row.pathway,
    label: row.pathway,
    value: row.toxic_compound_count,
    tooltip: `${row.pathway}: ${row.toxic_compound_count} toxic compounds`,
    color: '#2563eb',
  }));

  const heatmapTopN = Math.min(200, parsePositiveInt(query.executor_config?.heatmap_top_n, 30));
  const heatmapPathways = rankedRows.slice(0, heatmapTopN).map((row) => row.pathway);
  const heatmapPathwaySet = new Set(heatmapPathways);
  const heatmapCompoundsByPathway = new Map();

  for (const row of riskRows) {
    const pathway = String(row.pathway || '').trim();
    const cpd = String(row.cpd || '').trim();
    const yValue = row.y_value === null || row.y_value === undefined ? null : Number(row.y_value);
    if (!pathway || !cpd || !heatmapPathwaySet.has(pathway) || yValue === null || Number.isNaN(yValue)) {
      continue;
    }
    if (yRange.min !== undefined && yValue < yRange.min) {
      continue;
    }
    if (yRange.max !== undefined && yValue > yRange.max) {
      continue;
    }
    let set = heatmapCompoundsByPathway.get(pathway);
    if (!set) {
      set = new Set();
      heatmapCompoundsByPathway.set(pathway, set);
    }
    set.add(cpd);
  }

  const heatmapEndpoints = endpointGroup === 'all' ? allEndpoints : groupEndpoints;
  let heatmapCells = [];
  if (heatmapPathways.length > 0 && heatmapEndpoints.length > 0) {
    const pathwayCompoundPairs = [];
    for (const pathway of heatmapPathways) {
      const cpds = [...(heatmapCompoundsByPathway.get(pathway) || new Set())];
      for (const cpd of cpds) {
        pathwayCompoundPairs.push({ pathway, cpd });
      }
    }

    if (pathwayCompoundPairs.length > 0) {
      const endpointPlaceholders = heatmapEndpoints.map(() => '?').join(', ');
      const pairPlaceholders = pathwayCompoundPairs.map(() => '(?, ?)').join(', ');
      const pairParams = pathwayCompoundPairs.flatMap((pair) => [pair.pathway, pair.cpd]);
      heatmapCells = db
        .prepare(
          `
          WITH pathway_cpd(pathway, cpd) AS (
            VALUES ${pairPlaceholders}
          )
          SELECT
            pc.pathway AS row_id,
            te.endpoint AS endpoint,
            MAX(te.value) AS value
          FROM pathway_cpd pc
          JOIN toxicity_endpoint te
            ON te.cpd = pc.cpd
          WHERE te.endpoint IN (${endpointPlaceholders})
            AND te.value IS NOT NULL
          GROUP BY pc.pathway, te.endpoint
          ORDER BY pc.pathway ASC, te.endpoint ASC
          `
        )
        .all(...pairParams, ...heatmapEndpoints)
        .map((row) => {
          const numericValue = row.value === null || row.value === undefined ? null : Number(row.value);
          const bucket = deriveRiskBucketFromValue(numericValue);
          const label =
            bucket === 'high_risk' ? 'High Risk' : bucket === 'medium_risk' ? 'Medium Risk' : bucket === 'low_risk' ? 'Low Risk' : null;
          return {
            row_id: row.row_id,
            cpd: row.row_id,
            endpoint: row.endpoint,
            label,
            value: numericValue,
            risk_bucket: bucket,
          };
        });
    }
  }

  const endpointContext =
    riskMode === 'endpoint'
      ? `Endpoint: ${formatEndpoint(endpoint)}`
      : `Endpoint Group Peak: ${
          endpointGroup === 'all' ? 'All Groups' : getEndpointGroupTitle(endpointGroup)
        }`;

  return {
    summaryValues: {
      pathways_in_scope: total,
      compounds_in_scope: compoundsInScope.size,
      toxic_compounds_in_scope: toxicCompoundsInScope.size,
      risk_mode_label: riskMode === 'endpoint' ? 'Single Endpoint' : 'Endpoint Group Peak',
      endpoint_context: endpointContext,
    },
    visualizationValues: {
      bar_items: {
        items: barItems,
        empty_message: 'No pathways available for selected toxicity filters.',
      },
      toxicity_matrix: {
        row_label: 'Pathway',
        row_label_plural: 'Pathways',
        rows: heatmapPathways.map((pathway) => {
          const row = rankedRows.find((item) => item.pathway === pathway);
          return {
            id: pathway,
            label: pathway,
            secondary_label:
              row ? `${row.toxic_compound_count}/${row.compound_count} toxic compounds` : null,
          };
        }),
        compounds: [],
        endpoints: heatmapEndpoints,
        cells: heatmapCells,
        total_rows_in_scope: rankedRows.length,
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
      threshold_min: yRange.min ?? null,
      threshold_max: yRange.max ?? null,
    },
  };
}
