import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SCIENTIFIC_OVERVIEW_CATALOG, parseScientificOverviewCatalog } from '@/content/scientific-overview/catalog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');
const editorialDir = path.join(projectRoot, 'src', 'content', 'editorial', 'scientific_overview');

function readFixture(name: string) {
  return fs.readFileSync(path.join(editorialDir, name), 'utf8');
}

const VALID_CATALOG_INPUT = {
  indexYaml: readFixture('index.yaml'),
  scientificYaml: readFixture('scientific.yaml'),
  datascienceYaml: readFixture('datascience.yaml'),
  bioremediationYaml: readFixture('bioremediation.yaml'),
  multiomicsYaml: readFixture('multiomics.yaml'),
};

describe('scientificOverviewCatalog', () => {
  it('loads the shipped scientific overview catalog successfully', () => {
    expect(SCIENTIFIC_OVERVIEW_CATALOG.header.title).toBe('Scientific Foundations of BioRemPP Database');
    expect(SCIENTIFIC_OVERVIEW_CATALOG.section_order).toHaveLength(4);
    expect(SCIENTIFIC_OVERVIEW_CATALOG.sections.scientificFoundations.terms).toHaveLength(3);
  });

  it('rejects a catalog with missing home CTA button label', () => {
    expect(() =>
      parseScientificOverviewCatalog({
        ...VALID_CATALOG_INPUT,
        indexYaml: VALID_CATALOG_INPUT.indexYaml.replace(
          '  button_label: Understand the Full Potential of BioRemPP Database',
          '  button_label:'
        ),
      })
    ).toThrow(/home_cta\.button_label/);
  });

  it('rejects a catalog with an empty scientific section', () => {
    expect(() =>
      parseScientificOverviewCatalog({
        ...VALID_CATALOG_INPUT,
        scientificYaml: VALID_CATALOG_INPUT.scientificYaml.replace(
          /  terms:[\s\S]*$/,
          '  terms: []\n'
        ),
      })
    ).toThrow(/scientific\.section\.terms/);
  });
});
