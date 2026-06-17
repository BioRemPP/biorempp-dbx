import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

function fail(message) {
  throw new Error(`scientific-overview-config: ${message}`);
}

function assertObject(value, context) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${context} must be an object`);
  }
}

function assertString(value, context) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${context} must be a non-empty string`);
  }
  return value.trim();
}

function assertArray(value, context) {
  if (!Array.isArray(value)) {
    fail(`${context} must be an array`);
  }
}

function assertObjectArray(value, context) {
  assertArray(value, context);
  if (value.length === 0) {
    fail(`${context} must contain at least one item`);
  }
}

function readYaml(filePath, projectRoot = defaultProjectRoot) {
  if (!fs.existsSync(filePath)) {
    fail(`missing file: ${path.relative(projectRoot, filePath)}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return parseYaml(raw);
  } catch (error) {
    fail(`invalid yaml in ${path.relative(projectRoot, filePath)}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function validateScientificOverviewConfig({ projectRoot = defaultProjectRoot } = {}) {
  const baseDir = path.join(projectRoot, 'src', 'content', 'editorial', 'scientific_overview');
  const indexPath = path.join(baseDir, 'index.yaml');
  const scientificPath = path.join(baseDir, 'scientific.yaml');
  const datasciencePath = path.join(baseDir, 'datascience.yaml');
  const bioremediationPath = path.join(baseDir, 'bioremediation.yaml');
  const multiomicsPath = path.join(baseDir, 'multiomics.yaml');

  const indexRoot = readYaml(indexPath, projectRoot);
  const scientificRoot = readYaml(scientificPath, projectRoot);
  const datascienceRoot = readYaml(datasciencePath, projectRoot);
  const bioremediationRoot = readYaml(bioremediationPath, projectRoot);
  const multiomicsRoot = readYaml(multiomicsPath, projectRoot);

  assertObject(indexRoot, 'scientific overview index');
  assertString(indexRoot.version, 'scientific overview index.version');
  assertObject(indexRoot.header, 'scientific overview index.header');
  assertString(indexRoot.header.eyebrow, 'scientific overview index.header.eyebrow');
  assertString(indexRoot.header.title, 'scientific overview index.header.title');
  assertString(indexRoot.header.subtitle, 'scientific overview index.header.subtitle');
  assertObject(indexRoot.home_cta, 'scientific overview index.home_cta');
  assertString(indexRoot.home_cta.title, 'scientific overview index.home_cta.title');
  assertString(indexRoot.home_cta.description, 'scientific overview index.home_cta.description');
  assertString(indexRoot.home_cta.button_label, 'scientific overview index.home_cta.button_label');
  assertObject(indexRoot.quick_nav, 'scientific overview index.quick_nav');
  assertString(indexRoot.quick_nav.title, 'scientific overview index.quick_nav.title');
  assertString(indexRoot.quick_nav.description, 'scientific overview index.quick_nav.description');
  assertArray(indexRoot.section_order, 'scientific overview index.section_order');
  if (indexRoot.section_order.length !== 4) {
    fail('scientific overview index.section_order must contain exactly four items');
  }

  assertObject(scientificRoot, 'scientific overview scientific');
  assertObject(scientificRoot.section, 'scientific overview scientific.section');
  assertString(scientificRoot.section.title, 'scientific overview scientific.section.title');
  assertObjectArray(scientificRoot.section.terms, 'scientific overview scientific.section.terms');

  assertObject(datascienceRoot, 'scientific overview datascience');
  assertObject(datascienceRoot.section, 'scientific overview datascience.section');
  assertString(datascienceRoot.section.title, 'scientific overview datascience.section.title');
  assertObjectArray(datascienceRoot.section.categories, 'scientific overview datascience.section.categories');

  assertObject(bioremediationRoot, 'scientific overview bioremediation');
  assertObject(bioremediationRoot.section, 'scientific overview bioremediation.section');
  assertString(bioremediationRoot.section.title, 'scientific overview bioremediation.section.title');
  assertObjectArray(
    bioremediationRoot.section.fair_principles,
    'scientific overview bioremediation.section.fair_principles'
  );
  assertObjectArray(
    bioremediationRoot.section.integrated_databases,
    'scientific overview bioremediation.section.integrated_databases'
  );

  assertObject(multiomicsRoot, 'scientific overview multiomics');
  assertObject(multiomicsRoot.section, 'scientific overview multiomics.section');
  assertString(multiomicsRoot.section.framework_title, 'scientific overview multiomics.section.framework_title');
  assertObjectArray(
    multiomicsRoot.section.interoperability_groups,
    'scientific overview multiomics.section.interoperability_groups'
  );

  return {
    baseDir,
    sectionOrderCount: indexRoot.section_order.length,
    scientificTermCount: scientificRoot.section.terms.length,
    datascienceCategoryCount: datascienceRoot.section.categories.length,
    fairPrincipleCount: bioremediationRoot.section.fair_principles.length,
    integratedDatabaseCount: bioremediationRoot.section.integrated_databases.length,
    interoperabilityGroupCount: multiomicsRoot.section.interoperability_groups.length,
  };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedPath === __filename) {
  try {
    const result = validateScientificOverviewConfig();
    console.log(
      `scientific-overview-config: validated ${result.scientificTermCount} terms and ${result.interoperabilityGroupCount} interoperability groups in ${path.relative(defaultProjectRoot, result.baseDir)}`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
