import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

function fail(message) {
  throw new Error(`technical-information-config: ${message}`);
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

function assertStringArray(value, context) {
  assertArray(value, context);
  if (value.length === 0) {
    fail(`${context} must contain at least one item`);
  }
  value.forEach((entry, index) => assertString(entry, `${context}[${index}]`));
}

function assertUniqueIds(items, context) {
  const seen = new Set();
  items.forEach((item, index) => {
    assertObject(item, `${context}[${index}]`);
    const id = assertString(item.id, `${context}[${index}].id`);
    if (seen.has(id)) {
      fail(`${context} has duplicated id "${id}"`);
    }
    seen.add(id);
  });
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

export function validateTechnicalInformationConfig({
  projectRoot = defaultProjectRoot,
} = {}) {
  const configPath = path.join(
    projectRoot,
    'src',
    'content',
    'editorial',
    'pages',
    'technical-information.page.yaml'
  );

  const root = readYaml(configPath, projectRoot);
  assertObject(root, 'technical-information.page.yaml');
  assertString(root.version, 'technical-information.page.yaml version');
  assertString(root.language, 'technical-information.page.yaml language');

  const header = root.header;
  const intro = root.intro;
  const runtimeDelivery = root.runtime_delivery;
  const buildOverview = root.build_overview;
  const schemaQuality = root.schema_quality;
  const validation = root.validation;
  const provenance = root.provenance;
  const limitations = root.limitations;
  const faq = root.faq;
  const footer = root.footer;
  const sidebar = root.sidebar;

  assertObject(header, 'technical-information.page.yaml header');
  assertString(header.eyebrow, 'technical-information.page.yaml header.eyebrow');
  assertString(header.title, 'technical-information.page.yaml header.title');
  assertString(header.subtitle, 'technical-information.page.yaml header.subtitle');
  assertString(header.intro_note, 'technical-information.page.yaml header.intro_note');

  assertObject(intro, 'technical-information.page.yaml intro');
  assertString(intro.title, 'technical-information.page.yaml intro.title');
  assertStringArray(intro.paragraphs, 'technical-information.page.yaml intro.paragraphs');

  assertObject(runtimeDelivery, 'technical-information.page.yaml runtime_delivery');
  assertString(runtimeDelivery.title, 'technical-information.page.yaml runtime_delivery.title');
  assertString(runtimeDelivery.intro, 'technical-information.page.yaml runtime_delivery.intro');
  assertArray(runtimeDelivery.bullets, 'technical-information.page.yaml runtime_delivery.bullets');
  if (runtimeDelivery.bullets.length === 0) {
    fail('technical-information.page.yaml runtime_delivery.bullets must contain at least one item');
  }
  assertUniqueIds(runtimeDelivery.bullets, 'technical-information.page.yaml runtime_delivery.bullets');
  runtimeDelivery.bullets.forEach((bullet, index) => {
    assertString(bullet.label, `technical-information.page.yaml runtime_delivery.bullets[${index}].label`);
    assertString(
      bullet.description,
      `technical-information.page.yaml runtime_delivery.bullets[${index}].description`
    );
  });
  assertString(
    runtimeDelivery.recommendation_title,
    'technical-information.page.yaml runtime_delivery.recommendation_title'
  );
  assertString(
    runtimeDelivery.recommendation,
    'technical-information.page.yaml runtime_delivery.recommendation'
  );
  assertString(runtimeDelivery.closing, 'technical-information.page.yaml runtime_delivery.closing');

  assertObject(buildOverview, 'technical-information.page.yaml build_overview');
  assertString(buildOverview.title, 'technical-information.page.yaml build_overview.title');
  assertString(buildOverview.intro, 'technical-information.page.yaml build_overview.intro');
  assertArray(buildOverview.bullets, 'technical-information.page.yaml build_overview.bullets');
  if (buildOverview.bullets.length === 0) {
    fail('technical-information.page.yaml build_overview.bullets must contain at least one item');
  }
  assertUniqueIds(buildOverview.bullets, 'technical-information.page.yaml build_overview.bullets');
  buildOverview.bullets.forEach((bullet, index) => {
    assertString(bullet.label, `technical-information.page.yaml build_overview.bullets[${index}].label`);
    assertString(
      bullet.description,
      `technical-information.page.yaml build_overview.bullets[${index}].description`
    );
  });
  assertString(buildOverview.closing, 'technical-information.page.yaml build_overview.closing');

  assertObject(schemaQuality, 'technical-information.page.yaml schema_quality');
  assertString(schemaQuality.title, 'technical-information.page.yaml schema_quality.title');
  assertString(schemaQuality.intro, 'technical-information.page.yaml schema_quality.intro');
  assertStringArray(
    schemaQuality.quality_points,
    'technical-information.page.yaml schema_quality.quality_points'
  );
  assertString(schemaQuality.coverage_note, 'technical-information.page.yaml schema_quality.coverage_note');

  assertObject(validation, 'technical-information.page.yaml validation');
  assertString(validation.title, 'technical-information.page.yaml validation.title');
  assertString(validation.intro, 'technical-information.page.yaml validation.intro');
  assertStringArray(validation.bullets, 'technical-information.page.yaml validation.bullets');
  assertString(validation.closing, 'technical-information.page.yaml validation.closing');

  assertObject(provenance, 'technical-information.page.yaml provenance');
  assertString(provenance.title, 'technical-information.page.yaml provenance.title');
  assertString(provenance.intro, 'technical-information.page.yaml provenance.intro');
  assertStringArray(provenance.bullets, 'technical-information.page.yaml provenance.bullets');
  assertString(provenance.closing, 'technical-information.page.yaml provenance.closing');

  assertObject(limitations, 'technical-information.page.yaml limitations');
  assertString(limitations.title, 'technical-information.page.yaml limitations.title');
  assertString(limitations.intro, 'technical-information.page.yaml limitations.intro');
  assertString(
    limitations.safe_claims_title,
    'technical-information.page.yaml limitations.safe_claims_title'
  );
  assertStringArray(
    limitations.safe_claims,
    'technical-information.page.yaml limitations.safe_claims'
  );
  assertString(
    limitations.avoid_claims_title,
    'technical-information.page.yaml limitations.avoid_claims_title'
  );
  assertStringArray(
    limitations.avoid_claims,
    'technical-information.page.yaml limitations.avoid_claims'
  );
  assertString(limitations.closing, 'technical-information.page.yaml limitations.closing');

  assertObject(faq, 'technical-information.page.yaml faq');
  assertString(faq.title, 'technical-information.page.yaml faq.title');
  assertString(faq.intro, 'technical-information.page.yaml faq.intro');
  assertArray(faq.items, 'technical-information.page.yaml faq.items');
  if (faq.items.length === 0) {
    fail('technical-information.page.yaml faq.items must contain at least one item');
  }
  assertUniqueIds(faq.items, 'technical-information.page.yaml faq.items');
  faq.items.forEach((item, index) => {
    assertString(item.question, `technical-information.page.yaml faq.items[${index}].question`);
    assertString(item.answer, `technical-information.page.yaml faq.items[${index}].answer`);
  });

  assertObject(footer, 'technical-information.page.yaml footer');
  assertString(footer.title, 'technical-information.page.yaml footer.title');
  assertString(footer.note, 'technical-information.page.yaml footer.note');

  assertObject(sidebar, 'technical-information.page.yaml sidebar');
  assertString(sidebar.snapshot_title, 'technical-information.page.yaml sidebar.snapshot_title');
  assertString(sidebar.snapshot_intro, 'technical-information.page.yaml sidebar.snapshot_intro');
  assertString(sidebar.quick_nav_title, 'technical-information.page.yaml sidebar.quick_nav_title');
  assertString(
    sidebar.quick_nav_description,
    'technical-information.page.yaml sidebar.quick_nav_description'
  );
  assertString(sidebar.actions_title, 'technical-information.page.yaml sidebar.actions_title');
  assertString(sidebar.databases_label, 'technical-information.page.yaml sidebar.databases_label');
  assertString(
    sidebar.documentation_label,
    'technical-information.page.yaml sidebar.documentation_label'
  );

  return {
    path: configPath,
    buildOverviewBulletCount: buildOverview.bullets.length,
    runtimeBulletCount: runtimeDelivery.bullets.length,
    faqItemCount: faq.items.length,
    introParagraphCount: intro.paragraphs.length,
    qualityPointCount: schemaQuality.quality_points.length,
  };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedPath === __filename) {
  try {
    const result = validateTechnicalInformationConfig();
    console.log(
      `technical-information-config: validated ${result.buildOverviewBulletCount} build bullets and ${result.faqItemCount} FAQ items in ${path.relative(defaultProjectRoot, result.path)}`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
