import { parsePositiveInt, likeValue } from '../../shared/query.mjs';

export function executePathwayFunctionalCoverage({ db, query, filters, page, pageSize }) {
  const selectedSource =
    typeof filters.source === 'string' && filters.source.trim() !== '' ? filters.source.trim() : 'all';

  const where = [];
  const params = [];
  if (selectedSource !== 'all') {
    where.push('rel.source = ?');
    params.push(selectedSource);
  }

  if (filters.pathway) {
    where.push('rel.pathway LIKE ? COLLATE NOCASE');
    params.push(likeValue(filters.pathway));
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const groupedSql = `
    SELECT
      rel.pathway AS pathway,
      COUNT(DISTINCT rel.ko) AS ko_count,
      COUNT(DISTINCT rel.cpd) AS compound_count
    FROM compound_ko_pathway_rel rel
    ${whereSql}
    GROUP BY rel.pathway
  `;

  const koRange = filters.ko_count || {};
  const compoundRange = filters.compound_count || {};
  const having = [];
  const havingParams = [];
  if (koRange.min !== undefined) {
    having.push('ko_count >= ?');
    havingParams.push(koRange.min);
  }
  if (koRange.max !== undefined) {
    having.push('ko_count <= ?');
    havingParams.push(koRange.max);
  }
  if (compoundRange.min !== undefined) {
    having.push('compound_count >= ?');
    havingParams.push(compoundRange.min);
  }
  if (compoundRange.max !== undefined) {
    having.push('compound_count <= ?');
    havingParams.push(compoundRange.max);
  }

  const groupedWithHavingSql = `
    ${groupedSql}
    ${having.length > 0 ? `HAVING ${having.join(' AND ')}` : ''}
  `;

  const total = db
    .prepare(
      `
      SELECT COUNT(*) AS total
      FROM (${groupedWithHavingSql}) scope
      `
    )
    .get(...params, ...havingParams).total;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;

  const rowsRaw = db
    .prepare(
      `
      SELECT
        pathway,
        ko_count,
        compound_count
      FROM (${groupedWithHavingSql}) scope
      ORDER BY ko_count DESC, pathway ASC
      LIMIT ? OFFSET ?
      `
    )
    .all(...params, ...havingParams, pageSize, offset);

  const rows = rowsRaw.map((row, idx) => ({
    rank: offset + idx + 1,
    pathway: row.pathway,
    source: selectedSource === 'all' ? 'Mixed' : selectedSource,
    ko_count: Number(row.ko_count) || 0,
    compound_count: Number(row.compound_count) || 0,
  }));

  const topN = Math.min(100, parsePositiveInt(query.executor_config?.bar_top_n, 10));
  const barItems = db
    .prepare(
      `
      SELECT
        pathway,
        ko_count
      FROM (${groupedWithHavingSql}) scope
      ORDER BY ko_count DESC, pathway ASC
      LIMIT ?
      `
    )
    .all(...params, ...havingParams, topN)
    .map((row) => ({
      id: row.pathway,
      label: row.pathway,
      value: Number(row.ko_count) || 0,
      tooltip: `${row.pathway}: ${Number(row.ko_count) || 0} KOs`,
      color: '#2563eb',
    }));

  const maxKo = barItems.length > 0 ? Math.max(...barItems.map((item) => item.value)) : 0;

  return {
    summaryValues: {
      pathways_in_scope: total,
      selected_source: selectedSource === 'all' ? 'All sources' : selectedSource,
      max_ko_count: maxKo,
    },
    visualizationValues: {
      bar_items: {
        items: barItems,
        empty_message: 'No pathways available for current filters.',
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
      selected_source: selectedSource,
      metric_basis: 'count(distinct ko) by pathway',
    },
  };
}
