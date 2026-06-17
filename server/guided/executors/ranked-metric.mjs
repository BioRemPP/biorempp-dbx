import { buildCompoundWhereSql } from '../utils/filters.mjs';

export function executeRankedMetric({ db, query, filters, page, pageSize }) {
  const metricField = query.executor_config?.metric_field || 'ko_count';
  const sortField = query.executor_config?.sort_field || metricField;
  const sortOrder = String(query.executor_config?.sort_order || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  if (!['ko_count', 'gene_count', 'pathway_count', 'reference_count'].includes(sortField)) {
    throw new Error(`Unsupported sort field for ${query.id}: ${sortField}`);
  }

  const { whereSql, params } = buildCompoundWhereSql(filters);

  const total = db.prepare(`SELECT COUNT(*) AS total FROM compound_summary cs ${whereSql}`).get(...params).total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;

  const rows = db
    .prepare(
      `
      SELECT
        cs.cpd,
        cs.compoundname,
        cs.compoundclass,
        cs.ko_count,
        cs.gene_count,
        cs.pathway_count
      FROM compound_summary cs
      ${whereSql}
      ORDER BY cs.${sortField} ${sortOrder}, cs.cpd ASC
      LIMIT ? OFFSET ?
    `
    )
    .all(...params, pageSize, offset);

  const rankingRows = rows.map((row, idx) => ({
    rank: offset + idx + 1,
    cpd: row.cpd,
    compoundname: row.compoundname,
    compoundclass: row.compoundclass,
    ko_count: Number(row.ko_count) || 0,
    gene_count: Number(row.gene_count) || 0,
    pathway_count: Number(row.pathway_count) || 0,
  }));

  const barItems = rankingRows.map((row) => ({
    id: row.cpd,
    label: row.compoundname || row.cpd,
    value: Number(row[metricField]) || 0,
    tooltip: `${row.cpd} - ${metricField}: ${Number(row[metricField]) || 0}`,
    color: '#2563eb',
  }));

  return {
    summaryValues: {
      compounds_in_scope: total,
      ranked_metric_label: metricField,
    },
    visualizationValues: {
      bar_items: {
        items: barItems,
        empty_message: 'No ranking data available.',
      },
    },
    table: {
      rows: rankingRows,
      total,
      page: safePage,
      pageSize,
      totalPages,
    },
  };
}
