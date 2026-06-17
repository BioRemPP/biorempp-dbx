import { parsePositiveInt, readDistinctStrings, likeValue } from '../../shared/query.mjs';
import { getEndpointGroupKey, getEndpointGroupTitle, formatEndpoint } from '../toxicity-groups.mjs';
import { percentile } from '../utils/stats.mjs';

export function executeGeneToxicCompoundsEndpoint({ db, query, filters, page, pageSize }) {
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
  if (!endpoint) {
    endpoint = groupEndpoints[0];
  }
  if (!endpoint) {
    throw new Error('UC8 requires a valid endpoint selection');
  }
  if (endpointGroup !== 'all' && getEndpointGroupKey(endpoint) !== endpointGroup) {
    throw new Error(`Endpoint "${endpoint}" is not part of endpoint_group "${endpointGroup}"`);
  }

  const where = ['cgm.genesymbol IS NOT NULL', "TRIM(cgm.genesymbol) <> ''"];
  const whereParams = [];

  if (filters.search) {
    const search = likeValue(filters.search);
    where.push('(cgm.genesymbol LIKE ? COLLATE NOCASE OR cgc.genename LIKE ? COLLATE NOCASE)');
    whereParams.push(search, search);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  const baseRows = db
    .prepare(
      `
      SELECT
        cgm.genesymbol AS genesymbol,
        MIN(NULLIF(TRIM(cgc.ko), '')) AS ko,
        MIN(NULLIF(TRIM(cgc.genename), '')) AS gene_name,
        COUNT(DISTINCT cgm.cpd) AS compound_count,
        COUNT(DISTINCT cgc.ko) AS ko_count
      FROM compound_gene_map cgm
      LEFT JOIN compound_gene_card cgc
        ON cgc.cpd = cgm.cpd
       AND cgc.genesymbol = cgm.genesymbol
      ${whereSql}
      GROUP BY cgm.genesymbol
      `
    )
    .all(...whereParams);

  const yRange = filters.y_value || {};
  const toxicityWhere = ['te.value IS NOT NULL'];
  const toxicityParams = [];
  if (yRange.min !== undefined) {
    toxicityWhere.push('te.value >= ?');
    toxicityParams.push(yRange.min);
  }
  if (yRange.max !== undefined) {
    toxicityWhere.push('te.value <= ?');
    toxicityParams.push(yRange.max);
  }

  const distributionRows = db
    .prepare(
      `
      SELECT
        cgm.genesymbol AS genesymbol,
        cgm.cpd AS cpd,
        MIN(NULLIF(TRIM(cs.compoundname), '')) AS compoundname,
        te.value AS toxicity_value
      FROM compound_gene_map cgm
      LEFT JOIN compound_gene_card cgc
        ON cgc.cpd = cgm.cpd
       AND cgc.genesymbol = cgm.genesymbol
      LEFT JOIN compound_summary cs
        ON cs.cpd = cgm.cpd
      LEFT JOIN toxicity_endpoint te
        ON te.cpd = cgm.cpd
       AND te.endpoint = ?
      ${whereSql}
        AND ${toxicityWhere.join(' AND ')}
      GROUP BY cgm.genesymbol, cgm.cpd
      ORDER BY cgm.genesymbol ASC, te.value ASC
      `
    )
    .all(endpoint, ...whereParams, ...toxicityParams);

  const toxicityEntriesByGene = new Map();
  for (const row of distributionRows) {
    const value = Number(row.toxicity_value);
    if (!Number.isFinite(value)) {
      continue;
    }
    const genesymbol = String(row.genesymbol || '').trim();
    const cpd = String(row.cpd || '').trim();
    if (!genesymbol || !cpd) {
      continue;
    }
    let entries = toxicityEntriesByGene.get(genesymbol);
    if (!entries) {
      entries = [];
      toxicityEntriesByGene.set(genesymbol, entries);
    }
    entries.push({
      cpd,
      compoundname: row.compoundname || null,
      toxicity_value: value,
      endpoint,
    });
  }

  const toxicByGene = new Map();
  for (const [genesymbol, entries] of toxicityEntriesByGene.entries()) {
    const values = entries.map((entry) => entry.toxicity_value).sort((a, b) => a - b);
    const min = values[0];
    const median = percentile(values, 0.5) ?? min;
    const p90 = percentile(values, 0.9) ?? values[values.length - 1];
    const max = values[values.length - 1];

    toxicByGene.set(genesymbol, {
      toxic_compound_count: entries.length,
      min_prediction: Number(min.toFixed(4)),
      median_toxicity: Number(median.toFixed(4)),
      p90_toxicity: Number(p90.toFixed(4)),
      max_prediction: Number(max.toFixed(4)),
    });
  }

  const compoundRange = filters.compound_count || {};
  const toxicCompoundRange = filters.toxic_compound_count || {};
  const koRange = filters.ko_count || {};

  const rankedRows = baseRows
    .map((row) => {
      const compoundCount = Number(row.compound_count) || 0;
      const koCount = Number(row.ko_count) || 0;
      const toxicInfo = toxicByGene.get(row.genesymbol) || { toxic_compound_count: 0, max_prediction: null };
      const toxicCompoundCount = toxicInfo.toxic_compound_count;

      return {
        genesymbol: row.genesymbol,
        ko: row.ko,
        gene_name: row.gene_name,
        compound_count: compoundCount,
        toxic_compound_count: toxicCompoundCount,
        ko_count: koCount,
        median_toxicity: toxicInfo.median_toxicity ?? null,
        p90_toxicity: toxicInfo.p90_toxicity ?? null,
        max_prediction: toxicInfo.max_prediction,
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
      if (koRange.min !== undefined && row.ko_count < koRange.min) {
        return false;
      }
      if (koRange.max !== undefined && row.ko_count > koRange.max) {
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
      return a.genesymbol.localeCompare(b.genesymbol);
    });

  const total = rankedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;
  const pageRows = rankedRows.slice(offset, offset + pageSize);
  const tableRows = pageRows.map((row, idx) => ({
    rank: offset + idx + 1,
    ...row,
  }));

  const barTopN = Math.min(200, parsePositiveInt(query.executor_config?.bar_top_n, 15));
  const barItems = pageRows.slice(0, barTopN).map((row) => ({
    id: row.genesymbol,
    label: row.genesymbol,
    value: row.toxic_compound_count,
    tooltip: `${row.genesymbol}: ${row.toxic_compound_count} toxic compounds`,
    color: '#2563eb',
  }));

  const boxplotTopN = Math.min(100, parsePositiveInt(query.executor_config?.boxplot_top_n, 12));
  const boxplotGenes = pageRows.slice(0, boxplotTopN).map((row) => row.genesymbol);

  const boxplotGroups = boxplotGenes
    .map((genesymbol) => {
      const entries = (toxicityEntriesByGene.get(genesymbol) || []).sort(
        (a, b) => a.toxicity_value - b.toxicity_value
      );
      if (entries.length === 0) {
        return null;
      }
      const stats = toxicByGene.get(genesymbol);
      if (!stats) {
        return null;
      }

      const pointSampleLimit = 120;
      const samplingStep = Math.max(1, Math.ceil(entries.length / pointSampleLimit));
      const sampledPoints = entries
        .filter((_, idx) => idx % samplingStep === 0)
        .slice(0, pointSampleLimit)
        .map((entry) => ({
          cpd: entry.cpd,
          compoundname: entry.compoundname || null,
          endpoint: entry.endpoint,
          toxicity_value: Number(entry.toxicity_value.toFixed(4)),
        }));

      return {
        id: genesymbol,
        label: genesymbol,
        count: entries.length,
        min: stats.min_prediction,
        q1: Number((percentile(entries.map((entry) => entry.toxicity_value), 0.25) ?? stats.min_prediction).toFixed(4)),
        median: stats.median_toxicity,
        q3: Number((percentile(entries.map((entry) => entry.toxicity_value), 0.75) ?? stats.max_prediction).toFixed(4)),
        max: stats.max_prediction,
        points: sampledPoints,
      };
    })
    .filter((group) => group !== null);

  const endpointContext =
    endpointGroup === 'all'
      ? `Endpoint: ${formatEndpoint(endpoint)}`
      : `Endpoint: ${formatEndpoint(endpoint)} (${getEndpointGroupTitle(endpointGroup)})`;
  const thresholdWindow =
    yRange.min !== undefined && yRange.max !== undefined
      ? `${yRange.min} to ${yRange.max}`
      : yRange.min !== undefined
        ? `>= ${yRange.min}`
        : yRange.max !== undefined
          ? `<= ${yRange.max}`
          : 'Any non-null value';

  return {
    summaryValues: {
      genes_in_scope: total,
      toxic_compounds_peak: rankedRows.length > 0 ? rankedRows[0].toxic_compound_count : 0,
      endpoint_context: endpointContext,
      threshold_window: thresholdWindow,
    },
    visualizationValues: {
      toxicity_boxplot: {
        groups: boxplotGroups,
        y_label: `Endpoint toxicity score (${formatEndpoint(endpoint)})`,
        empty_message: 'No boxplot data available for selected toxicity filters.',
      },
      bar_items: {
        items: barItems,
        empty_message: 'No genes available for selected toxicity filters.',
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
      endpoint_group: endpointGroup,
      endpoint,
      threshold_min: yRange.min ?? null,
      threshold_max: yRange.max ?? null,
      metric_basis: 'count(distinct cpd) by genesymbol with endpoint threshold',
    },
  };
}
