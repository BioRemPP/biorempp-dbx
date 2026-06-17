import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import {
  assertValidCompiledGuidedCatalog,
  assertValidGuidedCatalogSource,
  assertValidGuidedQuerySource,
} from '../server/guided/catalog-schema.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

const MIN_INTERPRETATION_STATEMENT_LENGTH = 20;

function fail(message) {
  throw new Error(`guided-config: ${message}`);
}

function toRelative(projectRoot, filePath) {
  return path.relative(projectRoot, filePath);
}

function readYaml(projectRoot, filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`missing file: ${toRelative(projectRoot, filePath)}`);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  try {
    return parseYaml(content);
  } catch (error) {
    fail(
      `invalid yaml in ${toRelative(projectRoot, filePath)}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function normalizeOptionalString(value) {
  return typeof value === 'string' ? value.trim() : undefined;
}

function normalizeOptionalStringArray(values) {
  return Array.isArray(values) ? values.map((value) => value.trim()) : undefined;
}

function normalizeProvider(provider) {
  if (!provider) {
    return undefined;
  }

  const normalized = {
    type: provider.type,
  };

  if (typeof provider.endpoint === 'string') {
    normalized.endpoint = provider.endpoint.trim();
  }

  if (typeof provider.source === 'string') {
    normalized.source = provider.source.trim();
  }

  if (typeof provider.include_mean_option === 'boolean') {
    normalized.include_mean_option = provider.include_mean_option;
  }

  if (typeof provider.mean_option_label === 'string') {
    normalized.mean_option_label = provider.mean_option_label.trim();
  }

  if (Array.isArray(provider.options)) {
    normalized.options = provider.options.map((option) => ({
      value: option.value.trim(),
      label: option.label.trim(),
    }));
  }

  return normalized;
}

function normalizeFilter(filter) {
  return {
    id: filter.id.trim(),
    type: filter.type.trim(),
    label: filter.label.trim(),
    placeholder: normalizeOptionalString(filter.placeholder),
    min_placeholder: normalizeOptionalString(filter.min_placeholder),
    max_placeholder: normalizeOptionalString(filter.max_placeholder),
    depends_on: normalizeOptionalString(filter.depends_on),
    min: typeof filter.min === 'number' ? filter.min : undefined,
    max: typeof filter.max === 'number' ? filter.max : undefined,
    step: typeof filter.step === 'number' ? filter.step : undefined,
    provider: normalizeProvider(filter.provider),
  };
}

function normalizeSummaryCard(card) {
  return {
    id: card.id.trim(),
    label: card.label.trim(),
    value_key: card.value_key.trim(),
    hint: normalizeOptionalString(card.hint),
  };
}

function normalizeVisualization(visualization) {
  return {
    id: visualization.id.trim(),
    type: visualization.type.trim(),
    title: visualization.title.trim(),
    subtitle: normalizeOptionalString(visualization.subtitle),
    data_key: visualization.data_key.trim(),
  };
}

function normalizeTable(table) {
  if (!table) {
    return null;
  }

  return {
    id: table.id.trim(),
    title: table.title.trim(),
    subtitle: normalizeOptionalString(table.subtitle),
    row_click_field: normalizeOptionalString(table.row_click_field),
    empty_message: normalizeOptionalString(table.empty_message),
    columns: table.columns.map((column) => ({
      id: column.id.trim(),
      label: column.label.trim(),
      type: typeof column.type === 'string' ? column.type.trim() : 'text',
    })),
  };
}

function normalizeUseCaseDescription(useCaseDescription, queryId) {
  const interpretationGuidelines = useCaseDescription.interpretation_guidelines.map((item, index) => {
    const trimmed = item.trim();
    if (trimmed.length < MIN_INTERPRETATION_STATEMENT_LENGTH) {
      fail(
        `queries/${queryId}.yaml use_case_description.interpretation_guidelines[${index}] must have at least ${MIN_INTERPRETATION_STATEMENT_LENGTH} characters`
      );
    }
    return trimmed;
  });

  const limitations = useCaseDescription.limitations.map((item) => item.trim());

  return {
    scientific_question: useCaseDescription.scientific_question.trim(),
    description: useCaseDescription.description.trim(),
    visual_elements: Array.isArray(useCaseDescription.visual_elements)
      ? useCaseDescription.visual_elements.map((item) => ({
          label: item.label.trim(),
          description: item.description.trim(),
        }))
      : undefined,
    interpretation_guidelines: interpretationGuidelines,
    limitations,
    color_scheme: normalizeOptionalString(useCaseDescription.color_scheme),
  };
}

function normalizeMethodsModal(methodsModal) {
  return {
    button_label: methodsModal.button_label.trim(),
    title: methodsModal.title.trim(),
    introduction: methodsModal.introduction.trim(),
    steps: methodsModal.steps.map((step) => ({
      title: step.title.trim(),
      description: step.description.trim(),
      bullets: normalizeOptionalStringArray(step.bullets),
    })),
    footer_note: normalizeOptionalString(methodsModal.footer_note),
  };
}

function normalizeQuery(rawQuery) {
  const filters = Array.isArray(rawQuery.filters) ? rawQuery.filters.map(normalizeFilter) : [];
  const filterIds = new Set(filters.map((filter) => filter.id));
  if (filterIds.size !== filters.length) {
    fail(`queries/${rawQuery.id}.yaml has duplicated filter ids`);
  }

  return {
    id: rawQuery.id.trim(),
    category: rawQuery.category.trim(),
    title: rawQuery.title.trim(),
    question: rawQuery.question.trim(),
    description: rawQuery.description.trim(),
    dataset: rawQuery.dataset.trim(),
    executor: rawQuery.executor.trim(),
    defaults: rawQuery.defaults ?? {},
    executor_config: rawQuery.executor_config ?? {},
    filters,
    use_case_description: normalizeUseCaseDescription(rawQuery.use_case_description, rawQuery.id.trim()),
    methods_modal: normalizeMethodsModal(rawQuery.methods_modal),
    summary_cards: Array.isArray(rawQuery.summary_cards) ? rawQuery.summary_cards.map(normalizeSummaryCard) : [],
    visualizations: Array.isArray(rawQuery.visualizations)
      ? rawQuery.visualizations.map(normalizeVisualization)
      : [],
    table: normalizeTable(rawQuery.table),
  };
}

export function compileGuidedConfig({
  projectRoot = defaultProjectRoot,
  generatedAt = new Date().toISOString(),
} = {}) {
  const configRoot = path.join(projectRoot, 'src', 'features', 'guided-analysis', 'config');
  const catalogPath = path.join(configRoot, 'catalog.yaml');
  const queriesDir = path.join(configRoot, 'queries');
  const outputDir = path.join(projectRoot, 'server', 'generated', 'guided');
  const outputPath = path.join(outputDir, 'catalog.json');

  const catalog = readYaml(projectRoot, catalogPath);
  assertValidGuidedCatalogSource(catalog, 'catalog.yaml');

  const categories = catalog.categories.map((category) => ({
    id: category.id.trim(),
    label: category.label.trim(),
  }));
  const orderedQueryIds = catalog.query_order.map((queryId) => queryId.trim());

  const queryFiles = fs
    .readdirSync(queriesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(ya?ml)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  if (queryFiles.length === 0) {
    fail('no query yaml files found in src/features/guided-analysis/config/queries');
  }

  const queryMap = new Map();
  for (const fileName of queryFiles) {
    const filePath = path.join(queriesDir, fileName);
    const rawQuery = readYaml(projectRoot, filePath);
    assertValidGuidedQuerySource(rawQuery, `queries/${fileName}`);

    const normalized = normalizeQuery(rawQuery);
    if (queryMap.has(normalized.id)) {
      fail(`duplicated query id: ${normalized.id}`);
    }
    queryMap.set(normalized.id, normalized);
  }

  const orderedQueries = orderedQueryIds.map((trimmedQueryId, index) => {
    const query = queryMap.get(trimmedQueryId);
    if (!query) {
      fail(`catalog query_order[${index}] references missing query id: ${trimmedQueryId}`);
    }
    return query;
  });

  const knownCategoryIds = new Set(categories.map((category) => category.id));
  for (const query of orderedQueries) {
    if (!knownCategoryIds.has(query.category)) {
      fail(`query ${query.id} references unknown category: ${query.category}`);
    }
  }

  if (orderedQueries.length !== queryMap.size) {
    const missing = [...queryMap.keys()].filter((queryId) => !orderedQueryIds.includes(queryId));
    fail(`catalog query_order is missing queries: ${missing.join(', ')}`);
  }

  const output = {
    version: catalog.version.trim(),
    title: catalog.title.trim(),
    categories,
    queries: orderedQueries,
    generated_at: generatedAt,
  };

  assertValidCompiledGuidedCatalog(output, toRelative(projectRoot, outputPath));

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  return {
    output,
    outputPath,
    queryCount: orderedQueries.length,
  };
}

export function main() {
  const { outputPath, queryCount } = compileGuidedConfig();
  console.log(`guided-config: compiled ${queryCount} queries to ${path.relative(defaultProjectRoot, outputPath)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
