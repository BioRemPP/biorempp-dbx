export function buildSummaryCards(query, values) {
  return (query.summary_cards || []).map((card) => ({
    id: card.id,
    label: card.label,
    value: values[card.value_key] ?? null,
    hint: card.hint ?? null,
  }));
}

export function buildVisualizations(query, valuesByDataKey) {
  return (query.visualizations || []).map((vis) => ({
    id: vis.id,
    type: vis.type,
    title: vis.title,
    subtitle: vis.subtitle ?? null,
    data_key: vis.data_key,
    data: valuesByDataKey[vis.data_key] ?? null,
  }));
}

export function buildTable(query, tableResult) {
  if (!query.table) {
    return null;
  }
  return {
    ...query.table,
    rows: tableResult.rows,
    page: tableResult.page,
    pageSize: tableResult.pageSize,
    total: tableResult.total,
    totalPages: tableResult.totalPages,
  };
}
