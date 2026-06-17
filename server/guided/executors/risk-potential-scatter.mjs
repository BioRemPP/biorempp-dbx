import { formatEndpoint } from '../toxicity-groups.mjs';
import { buildCompoundWhereSql } from '../utils/filters.mjs';
import { percentile, quadrantFor } from '../utils/stats.mjs';

export function executeRiskPotentialScatter({ db, query, filters, page, pageSize }) {
  const thresholdBasis = String(query.executor_config?.threshold_basis || 'p75_filtered_scope');
  const defaultXScale = String(query.defaults?.x_scale || 'log10p1').toLowerCase();
  const xScaleModeRaw = typeof filters.x_scale === 'string' ? filters.x_scale.toLowerCase() : defaultXScale;
  const xScaleMode = xScaleModeRaw === 'linear' ? 'linear' : 'log10p1';
  const endpoint = filters.endpoint && filters.endpoint !== 'mean' ? filters.endpoint : null;

  const { whereSql, params } = buildCompoundWhereSql(filters);
  const scopeTotal = db.prepare(`SELECT COUNT(*) AS total FROM compound_summary cs ${whereSql}`).get(...params).total;

  const yRange = filters.y_value || {};

  const rows = endpoint
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
            cs.toxicity_risk_mean,
            te.value AS endpoint_value
          FROM compound_summary cs
          LEFT JOIN toxicity_endpoint te
            ON te.cpd = cs.cpd
           AND te.endpoint = ?
          ${whereSql}
          ORDER BY cs.cpd ASC
        `
        )
        .all(endpoint, ...params)
    : db
        .prepare(
          `
          SELECT
            cs.cpd,
            cs.compoundname,
            cs.compoundclass,
            cs.gene_count,
            cs.ko_count,
            cs.pathway_count,
            cs.toxicity_risk_mean,
            cs.toxicity_risk_mean AS endpoint_value
          FROM compound_summary cs
          ${whereSql}
          ORDER BY cs.cpd ASC
        `
        )
        .all(...params);

  let excludedNullY = 0;
  const pointsRaw = [];

  for (const row of rows) {
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

    pointsRaw.push({
      cpd: row.cpd,
      compoundname: row.compoundname,
      compoundclass: row.compoundclass,
      gene_count: Number(row.gene_count) || 0,
      ko_count: Number(row.ko_count) || 0,
      pathway_count: Number(row.pathway_count) || 0,
      toxicity_risk_mean:
        row.toxicity_risk_mean === null || row.toxicity_risk_mean === undefined
          ? null
          : Number(row.toxicity_risk_mean),
      y_value: yValue,
    });
  }

  let points = pointsRaw;
  let geneP95 = null;
  if (filters.focus_cluster) {
    geneP95 = percentile(pointsRaw.map((point) => point.gene_count), 0.95);
    if (geneP95 !== undefined) {
      points = pointsRaw.filter((point) => point.gene_count <= geneP95);
    }
  }

  const xThreshold =
    percentile(points.map((point) => point.gene_count), 0.75) ??
    percentile(pointsRaw.map((point) => point.gene_count), 0.75) ??
    0;
  const yThreshold =
    percentile(points.map((point) => point.y_value), 0.75) ??
    percentile(pointsRaw.map((point) => point.y_value), 0.75) ??
    0.5;

  const pointsWithQuadrant = points.map((point) => ({
    ...point,
    quadrant: quadrantFor(point, xThreshold, yThreshold),
  }));

  const quadrantCounts = {
    top_right: 0,
    top_left: 0,
    bottom_right: 0,
    bottom_left: 0,
  };
  for (const point of pointsWithQuadrant) {
    quadrantCounts[point.quadrant] += 1;
  }

  const topRightRows = pointsWithQuadrant
    .filter((point) => point.quadrant === 'top_right')
    .sort((a, b) => {
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

  const total = topRightRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * pageSize;
  const topRightPageRows = topRightRows.slice(offset, offset + pageSize).map((row, idx) => ({
    rank: offset + idx + 1,
    ...row,
  }));

  const yMetricLabel = endpoint ? formatEndpoint(endpoint) : 'toxicity_risk_mean';
  const yMetricKey = endpoint || 'toxicity_risk_mean';

  const quadrantSum =
    quadrantCounts.top_right + quadrantCounts.top_left + quadrantCounts.bottom_right + quadrantCounts.bottom_left;

  return {
    summaryValues: {
      compounds_in_scope: scopeTotal,
      plotted_points: pointsWithQuadrant.length,
      excluded_null_y: excludedNullY,
      top_right_count: quadrantCounts.top_right,
      quadrant_sum_check: quadrantSum,
      thresholds_label: `x(P75)=${xThreshold}, y(P75)=${yThreshold.toFixed(3)}`,
    },
    visualizationValues: {
      scatter_points: {
        points: pointsWithQuadrant,
        x_threshold: xThreshold,
        y_threshold: yThreshold,
        x_field: 'gene_count',
        y_field: yMetricKey,
        y_metric_label: yMetricLabel,
        endpoint: endpoint || 'mean',
        x_scale: xScaleMode,
        threshold_basis: thresholdBasis,
      },
    },
    table: {
      rows: topRightPageRows,
      total,
      page: safePage,
      pageSize,
      totalPages,
    },
    extraMeta: {
      excluded_null_y: excludedNullY,
      points_count: pointsWithQuadrant.length,
      quadrant_counts: quadrantCounts,
      y_metric_key: yMetricKey,
      y_metric_label: yMetricLabel,
      x_threshold: xThreshold,
      y_threshold: yThreshold,
      threshold_basis: thresholdBasis,
      x_scale: xScaleMode,
      focus_cluster: Boolean(filters.focus_cluster),
      gene_p95: geneP95 ?? null,
    },
  };
}
