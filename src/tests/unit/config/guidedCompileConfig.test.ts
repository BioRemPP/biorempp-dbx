import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { stringify as stringifyYaml } from 'yaml';
import { compileGuidedConfig } from '../../../../scripts/compile-guided-config.mjs';

const tempDirs = new Set<string>();

function buildCatalogSource() {
  return {
    version: 'v1',
    title: 'Guided Analysis',
    categories: [
      {
        id: 'compound_analysis',
        label: 'Compound Analysis',
      },
    ],
    query_order: ['uc_test'],
  };
}

function buildQuerySource() {
  return {
    id: 'uc_test',
    category: 'compound_analysis',
    title: 'Top Compounds',
    question: 'Which compounds should be inspected first?',
    description: 'Ranks compounds by annotation-derived breadth.',
    dataset: 'compound_summary',
    executor: 'uc_ranked_metric',
    filters: [
      {
        id: 'search',
        type: 'search',
        label: 'Search Compound',
        placeholder: 'e.g. Ammonia or C00014',
      },
      {
        id: 'gene_count',
        type: 'number_range',
        label: 'Gene Count',
        min: 0,
        min_placeholder: 'e.g. 10',
        max_placeholder: 'e.g. 250',
      },
    ],
    use_case_description: {
      scientific_question: 'Which compounds concentrate broader functional coverage?',
      description: 'This view supports exploratory prioritization within the selected scope.',
      interpretation_guidelines: [
        'Use the ranking for exploratory prioritization rather than confirmatory interpretation.',
      ],
      limitations: [
        'This ranking does not establish confirmed remediation efficacy or causal biological superiority.',
      ],
    },
    methods_modal: {
      button_label: 'View Methods',
      title: 'Methods',
      introduction: 'Summarizes the analytical workflow used by the ranking.',
      steps: [
        {
          title: 'Analytical Objective',
          description: 'Identify compounds with broader functional annotation coverage in scope.',
        },
      ],
    },
  };
}

function createTempProject({
  catalog = buildCatalogSource(),
  queries = {
    'uc_test.yaml': buildQuerySource(),
  },
}: {
  catalog?: ReturnType<typeof buildCatalogSource>;
  queries?: Record<string, ReturnType<typeof buildQuerySource>>;
} = {}) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'biorempp-guided-'));
  tempDirs.add(tempDir);

  const queriesDir = path.join(tempDir, 'src', 'features', 'guided-analysis', 'config', 'queries');
  fs.mkdirSync(queriesDir, { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'server', 'generated', 'guided'), { recursive: true });

  fs.writeFileSync(
    path.join(tempDir, 'src', 'features', 'guided-analysis', 'config', 'catalog.yaml'),
    stringifyYaml(catalog),
    'utf8'
  );

  for (const [fileName, query] of Object.entries(queries)) {
    fs.writeFileSync(path.join(queriesDir, fileName), stringifyYaml(query), 'utf8');
  }

  return tempDir;
}

afterEach(() => {
  for (const tempDir of tempDirs) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  tempDirs.clear();
});

describe('compileGuidedConfig', () => {
  it('compiles a valid guided catalog and writes the generated JSON payload', () => {
    const projectRoot = createTempProject();

    const { output, outputPath, queryCount } = compileGuidedConfig({
      projectRoot,
      generatedAt: '2026-05-14T12:00:00.000Z',
    });

    expect(queryCount).toBe(1);
    expect(output.generated_at).toBe('2026-05-14T12:00:00.000Z');
    expect(output.queries[0].filters).toEqual([
      {
        id: 'search',
        type: 'search',
        label: 'Search Compound',
        placeholder: 'e.g. Ammonia or C00014',
        min_placeholder: undefined,
        max_placeholder: undefined,
        depends_on: undefined,
        min: undefined,
        max: undefined,
        step: undefined,
        provider: undefined,
      },
      {
        id: 'gene_count',
        type: 'number_range',
        label: 'Gene Count',
        placeholder: undefined,
        min_placeholder: 'e.g. 10',
        max_placeholder: 'e.g. 250',
        depends_on: undefined,
        min: 0,
        max: undefined,
        step: undefined,
        provider: undefined,
      },
    ]);
    expect(output.queries[0].table).toBeNull();

    const compiled = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    expect(compiled.queries[0].id).toBe('uc_test');
    expect(compiled.generated_at).toBe('2026-05-14T12:00:00.000Z');
  });

  it('rejects catalogs whose query_order references a missing query id', () => {
    const catalog = buildCatalogSource();
    catalog.query_order = ['uc_missing'];
    const projectRoot = createTempProject({ catalog });

    expect(() => compileGuidedConfig({ projectRoot })).toThrow(
      /catalog query_order\[0\] references missing query id: uc_missing/
    );
  });

  it('rejects queries that reference an unknown category', () => {
    const query = buildQuerySource();
    query.category = 'unknown_category';
    const projectRoot = createTempProject({
      queries: {
        'uc_test.yaml': query,
      },
    });

    expect(() => compileGuidedConfig({ projectRoot })).toThrow(
      /query uc_test references unknown category: unknown_category/
    );
  });

  it('rejects duplicate filter ids within the same query', () => {
    const query = buildQuerySource();
    query.filters = [
      ...query.filters,
      {
        id: 'search',
        type: 'search',
        label: 'Search Again',
      },
    ];
    const projectRoot = createTempProject({
      queries: {
        'uc_test.yaml': query,
      },
    });

    expect(() => compileGuidedConfig({ projectRoot })).toThrow(/queries\/uc_test\.yaml has duplicated filter ids/);
  });

  it('rejects duplicate query ids across query files', () => {
    const projectRoot = createTempProject({
      catalog: {
        ...buildCatalogSource(),
        query_order: ['uc_test', 'uc_test'],
      },
      queries: {
        'uc_test.yaml': buildQuerySource(),
        'uc_test_copy.yaml': {
          ...buildQuerySource(),
          title: 'Alternative Title',
        },
      },
    });

    expect(() => compileGuidedConfig({ projectRoot })).toThrow(/duplicated query id: uc_test/);
  });
});
