import { parsePositiveInt, likeValue } from '../../shared/query.mjs';

export function executeGeneConnectivityRanking({ db, query, filters, page, pageSize }) {
  const groupedSql = `
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
    WHERE cgm.genesymbol IS NOT NULL
      AND TRIM(cgm.genesymbol) <> ''
    GROUP BY cgm.genesymbol
  `;

  const where = [];
  const params = [];

  if (filters.search) {
    const search = likeValue(filters.search);
    where.push('(genesymbol LIKE ? COLLATE NOCASE OR gene_name LIKE ? COLLATE NOCASE)');
    params.push(search, search);
  }

  const compoundRange = filters.compound_count || {};
  if (compoundRange.min !== undefined) {
    where.push('compound_count >= ?');
    params.push(compoundRange.min);
  }
  if (compoundRange.max !== undefined) {
    where.push('compound_count <= ?');
    params.push(compoundRange.max);
  }

  const koRange = filters.ko_count || {};
  if (koRange.min !== undefined) {
    where.push('ko_count >= ?');
    params.push(koRange.min);
  }
  if (koRange.max !== undefined) {
    where.push('ko_count <= ?');
    params.push(koRange.max);
  }

  const scopedSql = `
    SELECT
      genesymbol,
      ko,
      gene_name,
      compound_count,
      ko_count
    FROM (${groupedSql}) scope
    ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
  `;

  const total = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM (${scopedSql}) ranked
      `
    )
    .get(...params).total;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;

  const rowsRaw = db
    .prepare(
      `
      SELECT
        genesymbol,
        ko,
        gene_name,
        compound_count,
        ko_count
      FROM (${scopedSql}) ranked
      ORDER BY compound_count DESC, genesymbol ASC
      LIMIT ? OFFSET ?
      `
    )
    .all(...params, pageSize, offset);

  const rows = rowsRaw.map((row, idx) => ({
    rank: offset + idx + 1,
    genesymbol: row.genesymbol,
    ko: row.ko,
    gene_name: row.gene_name,
    compound_count: Number(row.compound_count) || 0,
    ko_count: Number(row.ko_count) || 0,
  }));

  const topN = Math.min(100, parsePositiveInt(query.executor_config?.bar_top_n, 10));
  const barItems = db
    .prepare(
      `
      SELECT
        genesymbol,
        compound_count
      FROM (${scopedSql}) ranked
      ORDER BY compound_count DESC, genesymbol ASC
      LIMIT ?
      `
    )
    .all(...params, topN)
    .map((row) => ({
      id: row.genesymbol,
      label: row.genesymbol,
      value: Number(row.compound_count) || 0,
      tooltip: `${row.genesymbol}: ${Number(row.compound_count) || 0} compounds`,
      color: '#2563eb',
    }));

  const maxCompoundCount = barItems.length > 0 ? Math.max(...barItems.map((item) => item.value)) : 0;

  return {
    summaryValues: {
      genes_in_scope: total,
      max_compound_count: maxCompoundCount,
      ranked_metric_label: 'compound_count',
    },
    visualizationValues: {
      bar_items: {
        items: barItems,
        empty_message: 'No genes available for current filters.',
      },
    },
    table: {
      rows,
      total,
      page: safePage,
      pageSize,
      totalPages,
    },
    extraMeta: {
      metric_basis: 'count(distinct cpd) by genesymbol',
    },
  };
}
