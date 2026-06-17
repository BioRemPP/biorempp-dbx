export function parsePositiveInt(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseNumber(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getPagination(query) {
  const page = Math.max(1, parsePositiveInt(query.page, 1));
  const pageSize = Math.min(200, Math.max(1, parsePositiveInt(query.pageSize, 50)));
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset };
}

export function parseOverviewLimit(value, fallback, max = 50) {
  return Math.min(max, Math.max(1, parsePositiveInt(value, fallback)));
}

export function deriveRiskBucket(label) {
  const normalized = (label || '').toLowerCase().trim();
  if (!normalized) {
    return 'unknown';
  }
  if (normalized.includes('high toxicity') || normalized.includes('low safety')) {
    return 'high_risk';
  }
  if (normalized.includes('medium toxicity') || normalized.includes('medium safety')) {
    return 'medium_risk';
  }
  if (normalized.includes('low toxicity') || normalized.includes('high safety')) {
    return 'low_risk';
  }
  return 'unknown';
}

export function likeValue(value) {
  return `%${value}%`;
}

export function toPaginatedResponse(data, total, page, pageSize) {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export function parseJsonObject(value) {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    return {};
  }
  return {};
}

export function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return [];
  }
  return [];
}

export function isMissingToken(value) {
  const normalized = String(value || '').trim().toUpperCase();
  return normalized === '' || normalized === '-' || normalized === 'NA' || normalized === 'N/A' || normalized === 'NULL';
}

export function parseStringTokens(value, options = { allowCommaSplit: true }) {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((token) => !isMissingToken(token));
  }

  const raw = String(value).trim();
  if (isMissingToken(raw)) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter((token) => !isMissingToken(token));
    }
  } catch {
    // fall through to delimiter split
  }

  const delimiter = options.allowCommaSplit ? /[;,]/ : /[;]/;
  return raw
    .split(delimiter)
    .map((token) => token.trim().replace(/^"|"$/g, ''))
    .filter((token) => !isMissingToken(token));
}

export function readDistinctStrings(db, sql, params = []) {
  const rows = db.prepare(sql).all(...params);
  return rows
    .map((row) => row.value)
    .filter((value) => value !== null && value !== undefined && value !== '');
}

export function createEmptyCompoundMetadata(cpd) {
  return {
    identifiers: {
      cpd,
      compound_name: null,
      compound_class: null,
      ko_ids: [],
      gene_symbols: [],
      gene_names: [],
      chebi_id: null,
      smiles: null,
    },
    functional_annotation: {
      enzyme_activity: [],
      ec_numbers: [],
      pathways_hadeg: [],
      pathways_kegg: [],
      compound_pathway_class: [],
      reaction_count: 0,
    },
    chemical_information: {
      compound_name: null,
      compound_class: null,
      smiles: null,
      chebi: null,
    },
    data_sources: [],
    provenance: {
      version: 'unknown',
      last_updated: null,
      pipeline: 'BioRemPP Database Generator',
    },
    cross_references: {
      kegg_compound_id: cpd,
      chebi: null,
      ec_numbers: [],
      reaction_count: 0,
    },
    data_quality: {
      ko_format_valid: false,
      cpd_format_valid: /^C\d{5}$/.test(cpd),
      completeness_pct: 0,
      cross_references_coverage: '0/4',
    },
  };
}
