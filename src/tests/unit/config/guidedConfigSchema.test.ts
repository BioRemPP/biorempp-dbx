import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import {
  assertValidGuidedCatalogSource,
  assertValidGuidedQuerySource,
} from '../../../../server/guided/catalog-schema.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');
const guidedConfigRoot = path.join(projectRoot, 'src', 'features', 'guided-analysis', 'config');

function buildValidCatalogSource() {
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

function buildValidQuerySource() {
  return {
    id: 'uc_test',
    category: 'compound_analysis',
    title: 'Top Compounds',
    question: 'Which compounds should be inspected first?',
    description: 'Ranks compounds by annotation-derived breadth.',
    dataset: 'compound_summary',
    executor: 'uc_ranked_metric',
    defaults: {
      page_size: 10,
    },
    executor_config: {
      metric_field: 'ko_count',
    },
    filters: [
      {
        id: 'compoundclass',
        type: 'select',
        label: 'Compound Class',
        provider: {
          type: 'static',
          options: [
            {
              value: 'chlorinated',
              label: 'Chlorinated',
            },
          ],
        },
      },
    ],
    use_case_description: {
      scientific_question: 'Which compounds concentrate broader functional coverage?',
      description: 'This view supports exploratory prioritization within the selected scope.',
      visual_elements: [
        {
          label: 'Ranking Table',
          description: 'Shows the ranked compounds together with supporting metrics.',
        },
      ],
      interpretation_guidelines: [
        'Use the ranking for exploratory prioritization rather than confirmatory interpretation.',
      ],
      limitations: [
        'This ranking does not establish confirmed remediation efficacy or causal biological superiority.',
      ],
      color_scheme: 'primary',
    },
    methods_modal: {
      button_label: 'View Methods',
      title: 'Methods',
      introduction: 'Summarizes the analytical workflow used by the ranking.',
      steps: [
        {
          title: 'Analytical Objective',
          description: 'Identify compounds with broader functional annotation coverage in scope.',
          bullets: ['The metric is annotation-derived and exploratory.'],
        },
      ],
      footer_note: 'Downstream validation remains necessary.',
    },
    summary_cards: [
      {
        id: 'compounds_in_scope',
        label: 'Compounds in Scope',
        value_key: 'compounds_in_scope',
      },
    ],
    visualizations: [
      {
        id: 'uc_test_bar',
        type: 'horizontal_bar',
        title: 'Top Compounds',
        data_key: 'bar_items',
      },
    ],
    table: {
      id: 'uc_test_table',
      title: 'Ranked compounds',
      columns: [
        {
          id: 'cpd',
          label: 'Compound ID',
          type: 'compound_link',
        },
      ],
    },
  };
}

describe('guided catalog schema', () => {
  it('validates the current guided-analysis source YAML files', () => {
    const catalog = parseYaml(fs.readFileSync(path.join(guidedConfigRoot, 'catalog.yaml'), 'utf8'));
    expect(() => assertValidGuidedCatalogSource(catalog, 'catalog.yaml')).not.toThrow();

    const queriesDir = path.join(guidedConfigRoot, 'queries');
    const queryFiles = fs.readdirSync(queriesDir).filter((name) => name.endsWith('.yaml')).sort();

    for (const fileName of queryFiles) {
      const query = parseYaml(fs.readFileSync(path.join(queriesDir, fileName), 'utf8'));
      expect(() => assertValidGuidedQuerySource(query, `queries/${fileName}`)).not.toThrow();
    }
  });

  it('rejects invalid filter types', () => {
    const query = structuredClone(buildValidQuerySource());
    query.filters[0].type = 'invalid_filter';

    expect(() => assertValidGuidedQuerySource(query, 'queries/uc_test.yaml')).toThrow(
      /filters\[0\]\.type/
    );
  });

  it('rejects provider payloads that do not satisfy their conditional requirements', () => {
    const metaEndpointQuery = structuredClone(buildValidQuerySource());
    metaEndpointQuery.filters[0].provider = {
      type: 'meta_endpoint',
    };

    expect(() => assertValidGuidedQuerySource(metaEndpointQuery, 'queries/uc_test.yaml')).toThrow(
      /filters\[0\]\.provider\.endpoint is required/
    );

    const queryDerivedQuery = structuredClone(buildValidQuerySource());
    queryDerivedQuery.filters[0].provider = {
      type: 'query_derived',
    };

    expect(() => assertValidGuidedQuerySource(queryDerivedQuery, 'queries/uc_test.yaml')).toThrow(
      /filters\[0\]\.provider\.source is required/
    );

    const staticQuery = structuredClone(buildValidQuerySource());
    staticQuery.filters[0].provider = {
      type: 'static',
    };

    expect(() => assertValidGuidedQuerySource(staticQuery, 'queries/uc_test.yaml')).toThrow(
      /filters\[0\]\.provider\.options is required/
    );
  });

  it('rejects unknown properties in restricted config blocks', () => {
    const query = structuredClone(buildValidQuerySource());
    query.use_case_description.extra_note = 'Unexpected field';

    expect(() => assertValidGuidedQuerySource(query, 'queries/uc_test.yaml')).toThrow(
      /use_case_description\.extra_note is not allowed/
    );
  });

  it('rejects empty required arrays', () => {
    const catalog = structuredClone(buildValidCatalogSource());
    catalog.query_order = [];

    expect(() => assertValidGuidedCatalogSource(catalog, 'catalog.yaml')).toThrow(/query_order/);

    const query = structuredClone(buildValidQuerySource());
    query.methods_modal.steps = [];

    expect(() => assertValidGuidedQuerySource(query, 'queries/uc_test.yaml')).toThrow(
      /methods_modal\.steps/
    );
  });

  it('rejects invalid visualization and column types', () => {
    const invalidVisualization = structuredClone(buildValidQuerySource());
    invalidVisualization.visualizations[0].type = 'pie_chart';

    expect(() => assertValidGuidedQuerySource(invalidVisualization, 'queries/uc_test.yaml')).toThrow(
      /visualizations\[0\]\.type/
    );

    const invalidColumn = structuredClone(buildValidQuerySource());
    invalidColumn.table.columns[0].type = 'markdown';

    expect(() => assertValidGuidedQuerySource(invalidColumn, 'queries/uc_test.yaml')).toThrow(
      /table\.columns\[0\]\.type/
    );
  });
});
