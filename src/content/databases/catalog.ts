import { parse as parseYaml } from 'yaml';
import {
  assertNonEmptyString,
  assertNonEmptyStringArray,
  assertObject,
  assertOptionalString,
} from '../shared/guards';
import rawBioremppSchema from '../editorial/databases/biorempp_schema.yaml?raw';
import rawHadegSchema from '../editorial/databases/hadeg_schema.yaml?raw';
import rawIndexCatalog from '../editorial/databases/index_config.yaml?raw';
import rawKeggSchema from '../editorial/databases/kegg_schema.yaml?raw';
import rawToxcsmSchema from '../editorial/databases/toxcsm_schema.yaml?raw';
import type {
  DatabaseSchemaAccentTone,
  DatabaseSchemaAccuracySource,
  DatabaseSchemaCardinalityRelationship,
  DatabaseSchemaCatalog,
  DatabaseSchemaColumn,
  DatabaseSchemaColumnOrganizationGroup,
  DatabaseSchemaCompleteness,
  DatabaseSchemaConstraints,
  DatabaseSchemaCrossReference,
  DatabaseSchemaDataQuality,
  DatabaseSchemaDefinition,
  DatabaseSchemaDesignRationaleItem,
  DatabaseSchemaForeignKey,
  DatabaseSchemaId,
  DatabaseSchemaLabelCategory,
  DatabaseSchemaRecord,
  DatabaseSchemaRecordValue,
  DatabaseSchemaToxicityEndpoint,
  DatabaseSchemaToxicityEndpointGroups,
  DatabaseSchemaUsageExamples,
  DatabaseSchemaUsageQuery,
  DatabaseSchemaValueColumnsInfo,
  DatabaseSchemaVersionHistoryItem,
  DatabaseSchemasContact,
  DatabaseSchemasFileFormatCatalog,
  DatabaseSchemasIndexCatalog,
  DatabaseSchemasIndexEntry,
  DatabaseSchemasIntegrationCatalog,
  DatabaseSchemasIntegrationJoinPoint,
  DatabaseSchemasOverviewCatalog,
  DatabaseSchemasRelatedDoc,
} from '../../types/databases';

const DATABASE_SCHEMA_IDS = ['biorempp', 'hadeg', 'kegg', 'toxcsm'] as const satisfies readonly DatabaseSchemaId[];
const ALLOWED_ACCENT_TONES = new Set<DatabaseSchemaAccentTone>(['success', 'info', 'warning', 'danger']);

const STRING_REPLACEMENTS: Array<[RegExp, string]> = [
  [/Â/g, ''],
  [/â€”|—/g, ' - '],
  [/â€“|–/g, ' - '],
  [/â†’|→/g, ' -> '],
  [/Ã—|×/g, ' x '],
  [/â€œ|“|â€\u009d|”/g, '"'],
  [/â€˜|‘|â€™|’/g, "'"],
  [/…/g, '...'],
];

function normalizeEditorialText(value: string) {
  return STRING_REPLACEMENTS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+-[ \t]+/g, ' - ')
    .replace(/[ \t]+->[ \t]+/g, ' -> ')
    .replace(/[ \t]+x[ \t]+/g, ' x ');
}

function normalizeUnknownContent(value: unknown): unknown {
  if (typeof value === 'string') {
    return normalizeEditorialText(value);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeUnknownContent(entry));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, normalizeUnknownContent(entry)])
    );
  }
  return value;
}

function assertNumber(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid config at ${path}: expected finite number`);
  }
  return value;
}

function assertBoolean(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid config at ${path}: expected boolean`);
  }
  return value;
}

function assertArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid config at ${path}: expected array`);
  }
  return value;
}

function parseYamlRoot(rawYaml: string, label: string) {
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (error) {
    throw new Error(`Invalid ${label} YAML syntax: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Invalid ${label}: root must be an object`);
  }

  return normalizeUnknownContent(parsed) as Record<string, unknown>;
}

function normalizeSchemaId(value: unknown, path: string): DatabaseSchemaId {
  const schemaId = assertNonEmptyString(value, path) as DatabaseSchemaId;
  if (!DATABASE_SCHEMA_IDS.includes(schemaId)) {
    throw new Error(`Invalid config at ${path}: expected one of ${DATABASE_SCHEMA_IDS.join('|')}`);
  }
  return schemaId;
}

function normalizeAccentTone(value: unknown, path: string): DatabaseSchemaAccentTone {
  const tone = assertNonEmptyString(value, path) as DatabaseSchemaAccentTone;
  if (!ALLOWED_ACCENT_TONES.has(tone)) {
    throw new Error(`Invalid config at ${path}: expected one of ${[...ALLOWED_ACCENT_TONES].join('|')}`);
  }
  return tone;
}

function normalizeContact(rawContact: unknown, path: string): DatabaseSchemasContact {
  const contact = assertObject(rawContact, path);
  return {
    github_issues: assertNonEmptyString(contact.github_issues, `${path}.github_issues`),
    email: assertNonEmptyString(contact.email, `${path}.email`),
  };
}

function normalizeIndexEntry(rawEntry: unknown, path: string): DatabaseSchemasIndexEntry {
  const entry = assertObject(rawEntry, path);
  return {
    id: normalizeSchemaId(entry.id, `${path}.id`),
    name: assertNonEmptyString(entry.name, `${path}.name`),
    rows: assertNumber(entry.rows, `${path}.rows`),
    columns: assertNumber(entry.columns, `${path}.columns`),
    focus: assertNonEmptyString(entry.focus, `${path}.focus`),
    route: assertNonEmptyString(entry.route, `${path}.route`),
    color: normalizeAccentTone(entry.color, `${path}.color`),
    join_key: assertNonEmptyString(entry.join_key, `${path}.join_key`),
    file: assertNonEmptyString(entry.file, `${path}.file`),
  };
}

function normalizeFileFormat(rawValue: unknown, path: string): DatabaseSchemasFileFormatCatalog {
  const fileFormat = assertObject(rawValue, path);
  return {
    format: assertNonEmptyString(fileFormat.format, `${path}.format`),
    delimiter: assertNonEmptyString(fileFormat.delimiter, `${path}.delimiter`),
    encoding: assertNonEmptyString(fileFormat.encoding, `${path}.encoding`),
    header: assertBoolean(fileFormat.header, `${path}.header`),
    text_qualifier: assertNonEmptyString(fileFormat.text_qualifier, `${path}.text_qualifier`),
    completeness: assertNonEmptyString(fileFormat.completeness, `${path}.completeness`),
  };
}

function normalizeOverview(rawValue: unknown, path: string): DatabaseSchemasOverviewCatalog {
  const overview = assertObject(rawValue, path);
  return {
    formal_specs: assertNonEmptyString(overview.formal_specs, `${path}.formal_specs`),
    validation_rules: assertNonEmptyString(overview.validation_rules, `${path}.validation_rules`),
    cross_references: assertNonEmptyString(overview.cross_references, `${path}.cross_references`),
    usage_examples: assertNonEmptyString(overview.usage_examples, `${path}.usage_examples`),
  };
}

function normalizeJoinPoint(rawValue: unknown, path: string): DatabaseSchemasIntegrationJoinPoint {
  const joinPoint = assertObject(rawValue, path);
  return {
    databases: assertNonEmptyStringArray(joinPoint.databases, `${path}.databases`),
    key: assertNonEmptyString(joinPoint.key, `${path}.key`),
    description: assertNonEmptyString(joinPoint.description, `${path}.description`),
  };
}

function normalizeIntegration(rawValue: unknown, path: string): DatabaseSchemasIntegrationCatalog {
  const integration = assertObject(rawValue, path);
  const joinPoints = assertArray(integration.join_points, `${path}.join_points`);
  if (joinPoints.length === 0) {
    throw new Error(`Invalid config at ${path}.join_points: expected non-empty array`);
  }

  return {
    description: assertNonEmptyString(integration.description, `${path}.description`),
    join_points: joinPoints.map((joinPoint, index) => normalizeJoinPoint(joinPoint, `${path}.join_points[${index}]`)),
  };
}

function normalizeRelatedDoc(rawValue: unknown, path: string): DatabaseSchemasRelatedDoc {
  const relatedDoc = assertObject(rawValue, path);
  return {
    title: assertNonEmptyString(relatedDoc.title, `${path}.title`),
    url: assertNonEmptyString(relatedDoc.url, `${path}.url`),
  };
}

function normalizeDesignRationaleItem(rawValue: unknown, path: string): DatabaseSchemaDesignRationaleItem {
  const item = assertObject(rawValue, path);
  return {
    title: assertNonEmptyString(item.title, `${path}.title`),
    description: assertNonEmptyString(item.description, `${path}.description`),
  };
}

function normalizeSchemaDefinition(rawValue: unknown, path: string): DatabaseSchemaDefinition {
  const definition = assertObject(rawValue, path);
  return {
    format: assertNonEmptyString(definition.format, `${path}.format`),
    alternative_format: assertOptionalString(definition.alternative_format, `${path}.alternative_format`),
    rows: assertNumber(definition.rows, `${path}.rows`),
    columns: assertNumber(definition.columns, `${path}.columns`),
    encoding: assertNonEmptyString(definition.encoding, `${path}.encoding`),
    delimiter: assertNonEmptyString(definition.delimiter, `${path}.delimiter`),
    text_qualifier: assertNonEmptyString(definition.text_qualifier, `${path}.text_qualifier`),
    header: assertBoolean(definition.header, `${path}.header`),
    completeness: assertNonEmptyString(definition.completeness, `${path}.completeness`),
  };
}

function normalizeCrossReference(rawValue: unknown, path: string): DatabaseSchemaCrossReference {
  const crossReference = assertObject(rawValue, path);
  return {
    name: assertNonEmptyString(crossReference.name, `${path}.name`),
    url_pattern: assertOptionalString(crossReference.url_pattern, `${path}.url_pattern`),
  };
}

function normalizeRecordValue(value: unknown, path: string): DatabaseSchemaRecordValue {
  if (typeof value === 'string') {
    return assertNonEmptyString(value, path);
  }
  if (typeof value === 'number') {
    return assertNumber(value, path);
  }
  if (typeof value === 'boolean') {
    return assertBoolean(value, path);
  }
  throw new Error(`Invalid config at ${path}: expected string, number, or boolean`);
}

function normalizeRecord(rawValue: unknown, path: string): DatabaseSchemaRecord {
  const record = assertObject(rawValue, path);
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, normalizeRecordValue(value, `${path}.${key}`)])
  );
}

function normalizeRecordList(rawValue: unknown, path: string): DatabaseSchemaRecord[] {
  const records = assertArray(rawValue, path);
  if (records.length === 0) {
    throw new Error(`Invalid config at ${path}: expected non-empty array`);
  }
  return records.map((record, index) => normalizeRecord(record, `${path}[${index}]`));
}

function normalizeColumn(rawValue: unknown, path: string): DatabaseSchemaColumn {
  const column = assertObject(rawValue, path);
  return {
    name: assertNonEmptyString(column.name, `${path}.name`),
    type: assertNonEmptyString(column.type, `${path}.type`),
    nullable: assertBoolean(column.nullable, `${path}.nullable`),
    controlled_vocabulary:
      column.controlled_vocabulary === undefined
        ? undefined
        : assertBoolean(column.controlled_vocabulary, `${path}.controlled_vocabulary`),
    pattern: assertOptionalString(column.pattern, `${path}.pattern`),
    regex: assertOptionalString(column.regex, `${path}.regex`),
    example: assertOptionalString(column.example, `${path}.example`),
    description: assertNonEmptyString(column.description, `${path}.description`),
    purpose: assertNonEmptyString(column.purpose, `${path}.purpose`),
    uniqueness: assertNonEmptyString(column.uniqueness, `${path}.uniqueness`),
    cardinality: assertNumber(column.cardinality, `${path}.cardinality`),
    notes: column.notes === undefined ? undefined : assertNonEmptyStringArray(column.notes, `${path}.notes`),
    valid_values:
      column.valid_values === undefined ? undefined : normalizeRecordList(column.valid_values, `${path}.valid_values`),
    cross_references:
      column.cross_references === undefined
        ? undefined
        : assertArray(column.cross_references, `${path}.cross_references`).map((entry, index) =>
            normalizeCrossReference(entry, `${path}.cross_references[${index}]`)
          ),
    top_pathways:
      column.top_pathways === undefined ? undefined : normalizeRecordList(column.top_pathways, `${path}.top_pathways`),
    top_families:
      column.top_families === undefined ? undefined : normalizeRecordList(column.top_families, `${path}.top_families`),
  };
}

function normalizeForeignKey(rawValue: unknown, path: string): DatabaseSchemaForeignKey {
  const foreignKey = assertObject(rawValue, path);
  return {
    column: assertNonEmptyString(foreignKey.column, `${path}.column`),
    references: assertNonEmptyString(foreignKey.references, `${path}.references`),
  };
}

function normalizeCardinalityRelationship(rawValue: unknown, path: string): DatabaseSchemaCardinalityRelationship {
  const relationship = assertObject(rawValue, path);
  return {
    name: assertNonEmptyString(relationship.name, `${path}.name`),
    type: assertNonEmptyString(relationship.type, `${path}.type`),
    description: assertNonEmptyString(relationship.description, `${path}.description`),
    example: assertOptionalString(relationship.example, `${path}.example`),
  };
}

function normalizeConstraints(rawValue: unknown, path: string): DatabaseSchemaConstraints {
  const constraints = assertObject(rawValue, path);
  return {
    primary_key:
      constraints.primary_key === undefined
        ? undefined
        : constraints.primary_key === null
          ? null
          : assertNonEmptyString(constraints.primary_key, `${path}.primary_key`),
    primary_key_note:
      constraints.primary_key_note === undefined
        ? undefined
        : constraints.primary_key_note === null
          ? null
          : assertNonEmptyString(constraints.primary_key_note, `${path}.primary_key_note`),
    conceptual_key:
      constraints.conceptual_key === undefined
        ? undefined
        : assertNonEmptyStringArray(constraints.conceptual_key, `${path}.conceptual_key`),
    duplicate_rows: assertOptionalString(constraints.duplicate_rows, `${path}.duplicate_rows`),
    foreign_keys:
      constraints.foreign_keys === undefined
        ? undefined
        : assertArray(constraints.foreign_keys, `${path}.foreign_keys`).map((entry, index) =>
            normalizeForeignKey(entry, `${path}.foreign_keys[${index}]`)
          ),
    cardinality_relationships:
      constraints.cardinality_relationships === undefined
        ? undefined
        : assertArray(constraints.cardinality_relationships, `${path}.cardinality_relationships`).map((entry, index) =>
            normalizeCardinalityRelationship(entry, `${path}.cardinality_relationships[${index}]`)
          ),
  };
}

function normalizeCompleteness(rawValue: unknown, path: string): DatabaseSchemaCompleteness {
  const completeness = assertObject(rawValue, path);
  return {
    status: assertNonEmptyString(completeness.status, `${path}.status`),
    description: assertNonEmptyString(completeness.description, `${path}.description`),
  };
}

function normalizeAccuracySource(rawValue: unknown, path: string): DatabaseSchemaAccuracySource {
  const accuracy = assertObject(rawValue, path);
  return {
    column: assertNonEmptyString(accuracy.column, `${path}.column`),
    source: assertNonEmptyString(accuracy.source, `${path}.source`),
  };
}

function normalizeDataQuality(rawValue: unknown, path: string): DatabaseSchemaDataQuality {
  const dataQuality = assertObject(rawValue, path);
  return {
    completeness: normalizeCompleteness(dataQuality.completeness, `${path}.completeness`),
    consistency:
      dataQuality.consistency === undefined
        ? undefined
        : assertNonEmptyStringArray(dataQuality.consistency, `${path}.consistency`),
    accuracy:
      dataQuality.accuracy === undefined
        ? undefined
        : assertArray(dataQuality.accuracy, `${path}.accuracy`).map((entry, index) =>
            normalizeAccuracySource(entry, `${path}.accuracy[${index}]`)
          ),
    source: assertOptionalString(dataQuality.source, `${path}.source`),
    validation_date: assertOptionalString(dataQuality.validation_date, `${path}.validation_date`),
  };
}

function normalizeUsageQuery(rawValue: unknown, path: string): DatabaseSchemaUsageQuery {
  const query = assertObject(rawValue, path);
  return {
    description: assertNonEmptyString(query.description, `${path}.description`),
    code: assertNonEmptyString(query.code, `${path}.code`),
  };
}

function normalizeUsageExamples(rawValue: unknown, path: string): DatabaseSchemaUsageExamples {
  const usageExamples = assertObject(rawValue, path);
  return {
    r: assertNonEmptyString(usageExamples.r, `${path}.r`),
    python: assertNonEmptyString(usageExamples.python, `${path}.python`),
    common_queries:
      usageExamples.common_queries === undefined
        ? undefined
        : assertArray(usageExamples.common_queries, `${path}.common_queries`).map((entry, index) =>
            normalizeUsageQuery(entry, `${path}.common_queries[${index}]`)
          ),
  };
}

function normalizeColumnOrganizationGroup(rawValue: unknown, path: string): DatabaseSchemaColumnOrganizationGroup {
  const group = assertObject(rawValue, path);
  return {
    category: assertNonEmptyString(group.category, `${path}.category`),
    count: assertNumber(group.count, `${path}.count`),
    columns: group.columns === undefined ? undefined : assertNonEmptyStringArray(group.columns, `${path}.columns`),
    description: assertOptionalString(group.description, `${path}.description`),
  };
}

function normalizeLabelCategory(rawValue: unknown, path: string): DatabaseSchemaLabelCategory {
  const category = assertObject(rawValue, path);
  return {
    value: assertNonEmptyString(category.value, `${path}.value`),
    interpretation: assertNonEmptyString(category.interpretation, `${path}.interpretation`),
    level: assertNumber(category.level, `${path}.level`),
  };
}

function normalizeToxicityEndpoint(rawValue: unknown, path: string): DatabaseSchemaToxicityEndpoint {
  const endpoint = assertObject(rawValue, path);
  return {
    endpoint: assertNonEmptyString(endpoint.endpoint, `${path}.endpoint`),
    label_column: assertNonEmptyString(endpoint.label_column, `${path}.label_column`),
    value_column: assertNonEmptyString(endpoint.value_column, `${path}.value_column`),
    description: assertNonEmptyString(endpoint.description, `${path}.description`),
    samples: assertNonEmptyString(endpoint.samples, `${path}.samples`),
    source: assertNonEmptyString(endpoint.source, `${path}.source`),
  };
}

function normalizeToxicityEndpointGroups(rawValue: unknown, path: string): DatabaseSchemaToxicityEndpointGroups {
  const groups = assertObject(rawValue, path);
  return Object.fromEntries(
    Object.entries(groups).map(([groupName, endpoints]) => [
      groupName,
      assertArray(endpoints, `${path}.${groupName}`).map((entry, index) =>
        normalizeToxicityEndpoint(entry, `${path}.${groupName}[${index}]`)
      ),
    ])
  );
}

function normalizeValueColumnsInfo(rawValue: unknown, path: string): DatabaseSchemaValueColumnsInfo {
  const valueColumnsInfo = assertObject(rawValue, path);
  return {
    data_type: assertNonEmptyString(valueColumnsInfo.data_type, `${path}.data_type`),
    range: assertNonEmptyString(valueColumnsInfo.range, `${path}.range`),
    interpretation: assertNonEmptyString(valueColumnsInfo.interpretation, `${path}.interpretation`),
    usage: assertNonEmptyString(valueColumnsInfo.usage, `${path}.usage`),
  };
}

function normalizeVersionHistoryItem(rawValue: unknown, path: string): DatabaseSchemaVersionHistoryItem {
  const entry = assertObject(rawValue, path);
  return {
    version: assertNonEmptyString(entry.version, `${path}.version`),
    date: assertNonEmptyString(entry.date, `${path}.date`),
    rows: assertNumber(entry.rows, `${path}.rows`),
    changes: assertNonEmptyString(entry.changes, `${path}.changes`),
  };
}

export function parseDatabaseSchemasIndexCatalog(rawYaml: string): DatabaseSchemasIndexCatalog {
  const root = parseYamlRoot(rawYaml, 'database schemas index config');
  const databases = assertArray(root.databases, 'databases');
  if (databases.length === 0) {
    throw new Error('Invalid database schemas index config at databases: expected non-empty array');
  }

  return {
    page_id: assertNonEmptyString(root.page_id, 'page_id'),
    title: assertNonEmptyString(root.title, 'title'),
    subtitle: assertNonEmptyString(root.subtitle, 'subtitle'),
    icon: assertOptionalString(root.icon, 'icon'),
    databases: databases.map((entry, index) => normalizeIndexEntry(entry, `databases[${index}]`)),
    file_format: normalizeFileFormat(root.file_format, 'file_format'),
    overview: normalizeOverview(root.overview, 'overview'),
    integration: normalizeIntegration(root.integration, 'integration'),
    related_docs:
      root.related_docs === undefined
        ? undefined
        : assertArray(root.related_docs, 'related_docs').map((entry, index) =>
            normalizeRelatedDoc(entry, `related_docs[${index}]`)
          ),
    contact: normalizeContact(root.contact, 'contact'),
  };
}

export function parseDatabaseSchemaCatalog(rawYaml: string): DatabaseSchemaCatalog {
  const root = parseYamlRoot(rawYaml, 'database schema config');
  const columns = assertArray(root.columns, 'columns');
  if (columns.length === 0) {
    throw new Error('Invalid database schema config at columns: expected non-empty array');
  }

  const overview = assertObject(root.overview, 'overview');
  const designRationale = assertArray(overview.design_rationale, 'overview.design_rationale');
  if (designRationale.length === 0) {
    throw new Error('Invalid database schema config at overview.design_rationale: expected non-empty array');
  }

  return {
    schema_id: normalizeSchemaId(root.schema_id, 'schema_id'),
    title: assertNonEmptyString(root.title, 'title'),
    version: assertNonEmptyString(root.version, 'version'),
    last_updated: assertNonEmptyString(root.last_updated, 'last_updated'),
    color: normalizeAccentTone(root.color, 'color'),
    overview: {
      description: assertNonEmptyString(overview.description, 'overview.description'),
      design_rationale: designRationale.map((entry, index) =>
        normalizeDesignRationaleItem(entry, `overview.design_rationale[${index}]`)
      ),
    },
    schema_definition: normalizeSchemaDefinition(root.schema_definition, 'schema_definition'),
    columns: columns.map((entry, index) => normalizeColumn(entry, `columns[${index}]`)),
    constraints: normalizeConstraints(root.constraints, 'constraints'),
    data_quality: normalizeDataQuality(root.data_quality, 'data_quality'),
    usage_examples: normalizeUsageExamples(root.usage_examples, 'usage_examples'),
    contact: normalizeContact(root.contact, 'contact'),
    column_organization:
      root.column_organization === undefined
        ? undefined
        : assertArray(root.column_organization, 'column_organization').map((entry, index) =>
            normalizeColumnOrganizationGroup(entry, `column_organization[${index}]`)
          ),
    label_categories:
      root.label_categories === undefined
        ? undefined
        : assertArray(root.label_categories, 'label_categories').map((entry, index) =>
            normalizeLabelCategory(entry, `label_categories[${index}]`)
          ),
    toxicity_endpoints:
      root.toxicity_endpoints === undefined
        ? undefined
        : normalizeToxicityEndpointGroups(root.toxicity_endpoints, 'toxicity_endpoints'),
    value_columns_info:
      root.value_columns_info === undefined
        ? undefined
        : normalizeValueColumnsInfo(root.value_columns_info, 'value_columns_info'),
    version_history:
      root.version_history === undefined
        ? undefined
        : assertArray(root.version_history, 'version_history').map((entry, index) =>
            normalizeVersionHistoryItem(entry, `version_history[${index}]`)
          ),
  };
}

export function loadDatabaseSchemasIndexCatalog() {
  return parseDatabaseSchemasIndexCatalog(rawIndexCatalog);
}

export function loadDatabaseSchemaCatalogs(): Record<DatabaseSchemaId, DatabaseSchemaCatalog> {
  return {
    biorempp: parseDatabaseSchemaCatalog(rawBioremppSchema),
    hadeg: parseDatabaseSchemaCatalog(rawHadegSchema),
    kegg: parseDatabaseSchemaCatalog(rawKeggSchema),
    toxcsm: parseDatabaseSchemaCatalog(rawToxcsmSchema),
  };
}

export const DATABASE_SCHEMAS_INDEX_CATALOG = loadDatabaseSchemasIndexCatalog();

export const DATABASE_SCHEMA_CATALOGS = loadDatabaseSchemaCatalogs();

export function getDatabaseSchemaCatalog(schemaId: DatabaseSchemaId) {
  return DATABASE_SCHEMA_CATALOGS[schemaId];
}

export const DATABASE_SCHEMAS_ORDER = DATABASE_SCHEMAS_INDEX_CATALOG.databases.map((database) => database.id);
