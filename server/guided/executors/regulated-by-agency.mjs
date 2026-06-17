import { readDistinctStrings } from '../../shared/query.mjs';
import { buildCompoundWhereSql } from '../utils/filters.mjs';

export function executeRegulatedByAgency({ db, query, filters, page, pageSize }) {
  const allAgencies = readDistinctStrings(
    db,
    `
      SELECT DISTINCT reference_ag AS value
      FROM compound_reference_map
      WHERE reference_ag IS NOT NULL
      ORDER BY reference_ag ASC
    `
  );
  if (allAgencies.length === 0) {
    throw new Error('No reference agencies available in compound_reference_map');
  }

  const selectedAgency =
    typeof filters.reference_ag === 'string' && filters.reference_ag.trim() !== ''
      ? filters.reference_ag.trim()
      : 'all';
  const agencyFilterOn = selectedAgency !== 'all';
  if (agencyFilterOn && !allAgencies.includes(selectedAgency)) {
    throw new Error(`Unsupported regulatory agency selection "${selectedAgency}"`);
  }

  const baseFilters = {
    ...filters,
  };
  delete baseFilters.reference_ag;
  const { whereSql: baseWhereSql, params: baseParams } = buildCompoundWhereSql(baseFilters);
  const scopeTotal = db
    .prepare(`SELECT COUNT(*) AS total FROM compound_summary cs ${baseWhereSql}`)
    .get(...baseParams).total;

  const matchedWhereSql = agencyFilterOn
    ? baseWhereSql
      ? `${baseWhereSql} AND crm.reference_ag = ?`
      : 'WHERE crm.reference_ag = ?'
    : baseWhereSql;
  const matchedParams = agencyFilterOn ? [...baseParams, selectedAgency] : [...baseParams];

  const total = db
    .prepare(
      `
      SELECT COUNT(DISTINCT cs.cpd) AS total
      FROM compound_summary cs
      JOIN compound_reference_map crm
        ON crm.cpd = cs.cpd
      ${matchedWhereSql}
      `
    )
    .get(...matchedParams).total;

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
        cs.reference_count,
        cs.ko_count,
        cs.gene_count,
        cs.pathway_count,
        GROUP_CONCAT(DISTINCT crm.reference_ag) AS matched_references
      FROM compound_summary cs
      JOIN compound_reference_map crm
        ON crm.cpd = cs.cpd
      ${matchedWhereSql}
      GROUP BY
        cs.cpd,
        cs.compoundname,
        cs.compoundclass,
        cs.reference_count,
        cs.ko_count,
        cs.gene_count,
        cs.pathway_count
      ORDER BY cs.reference_count DESC, cs.cpd ASC
      LIMIT ? OFFSET ?
      `
    )
    .all(...matchedParams, pageSize, offset)
    .map((row, idx) => ({
      rank: offset + idx + 1,
      cpd: row.cpd,
      compoundname: row.compoundname,
      compoundclass: row.compoundclass,
      reference_count: Number(row.reference_count) || 0,
      ko_count: Number(row.ko_count) || 0,
      gene_count: Number(row.gene_count) || 0,
      pathway_count: Number(row.pathway_count) || 0,
      matched_references: String(row.matched_references || ''),
    }));

  const countsByAgencyRaw = db
    .prepare(
      `
      SELECT
        crm.reference_ag AS agency,
        COUNT(DISTINCT cs.cpd) AS compounds
      FROM compound_summary cs
      JOIN compound_reference_map crm
        ON crm.cpd = cs.cpd
      ${matchedWhereSql}
      GROUP BY crm.reference_ag
      ORDER BY compounds DESC, crm.reference_ag ASC
      `
    )
    .all(...matchedParams);

  const barItems = countsByAgencyRaw.map((row, idx) => {
    const agency = String(row.agency);
    const compounds = Number(row.compounds) || 0;
    const palette = ['#2563eb', '#0ea5e9', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#14b8a6', '#84cc16', '#64748b'];
    return {
      id: agency,
      label: agency,
      value: compounds,
      tooltip: `${agency}: ${compounds} compounds`,
      color: palette[idx % palette.length],
    };
  });

  return {
    summaryValues: {
      compounds_in_scope: scopeTotal,
      regulated_compounds: total,
      selected_agency: selectedAgency === 'all' ? 'All agencies' : selectedAgency,
    },
    visualizationValues: {
      agency_bar: {
        items: barItems,
        empty_message: 'No regulatory reference data available for current filters.',
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
      selected_agency: selectedAgency,
      active_agencies: agencyFilterOn ? [selectedAgency] : allAgencies,
    },
  };
}
