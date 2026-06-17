import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createGuidedCatalogLoader } from '../../../../server/guided/catalog-loader.mjs';

const tempDirs = new Set<string>();

function buildCompiledCatalog() {
  return {
    version: 'v1',
    title: 'Guided Analysis',
    categories: [
      {
        id: 'compound_analysis',
        label: 'Compound Analysis',
      },
    ],
    queries: [
      {
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
        filters: [],
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
        summary_cards: [],
        visualizations: [],
        table: null,
      },
    ],
    generated_at: '2026-05-14T12:00:00.000Z',
  };
}

function createTempProject(compiledCatalog = buildCompiledCatalog()) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'biorempp-guided-loader-'));
  tempDirs.add(tempDir);

  const outputDir = path.join(tempDir, 'server', 'generated', 'guided');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'catalog.json'), `${JSON.stringify(compiledCatalog, null, 2)}\n`, 'utf8');

  return tempDir;
}

afterEach(() => {
  for (const tempDir of tempDirs) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  tempDirs.clear();
});

describe('createGuidedCatalogLoader', () => {
  it('loads and resolves a valid compiled guided catalog', () => {
    const projectRoot = createTempProject();
    const loader = createGuidedCatalogLoader({ projectRoot });

    const catalog = loader.getCatalog();
    const query = loader.getQueryOrThrow('uc_test');

    expect(catalog.title).toBe('Guided Analysis');
    expect(query.id).toBe('uc_test');
  });

  it('rejects malformed compiled catalogs with a clear schema error', () => {
    const compiledCatalog = buildCompiledCatalog();
    compiledCatalog.queries[0].visualizations = 'not-an-array' as never;
    const projectRoot = createTempProject(compiledCatalog);
    const loader = createGuidedCatalogLoader({ projectRoot });

    expect(() => loader.getCatalog()).toThrow(/catalog\.json failed schema validation: queries\[0\]\.visualizations/);
  });
});
