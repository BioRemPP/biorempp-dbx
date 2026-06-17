import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const termsPath = path.join(projectRoot, 'src', 'content', 'editorial', 'pages', 'terms-of-use.page.yaml');
const ALLOWED_TONES = new Set(['neutral', 'warning', 'success', 'info']);

function fail(message) {
  throw new Error(`terms-config: ${message}`);
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

function readYaml(filePath) {
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

function validateTerms(root) {
  assertObject(root, 'terms-of-use.page.yaml');
  assertString(root.version, 'terms-of-use.page.yaml version');

  assertObject(root.header, 'terms-of-use.page.yaml header');
  assertString(root.header.title, 'terms-of-use.page.yaml header.title');
  assertString(root.header.subtitle, 'terms-of-use.page.yaml header.subtitle');

  assertObject(root.notice, 'terms-of-use.page.yaml notice');
  assertString(root.notice.title, 'terms-of-use.page.yaml notice.title');
  assertString(root.notice.body, 'terms-of-use.page.yaml notice.body');

  assertArray(root.sections, 'terms-of-use.page.yaml sections');
  if (root.sections.length === 0) {
    fail('terms-of-use.page.yaml sections must contain at least one item');
  }

  root.sections.forEach((section, index) => {
    const sectionPath = `terms-of-use.page.yaml sections[${index}]`;
    assertObject(section, sectionPath);
    assertString(section.id, `${sectionPath}.id`);
    assertString(section.title, `${sectionPath}.title`);
    if (section.tone !== undefined && !ALLOWED_TONES.has(assertString(section.tone, `${sectionPath}.tone`))) {
      fail(`${sectionPath}.tone must be one of ${[...ALLOWED_TONES].join('|')}`);
    }

    const hasParagraphs = section.paragraphs !== undefined;
    const hasBullets = section.bullets !== undefined;
    if (!hasParagraphs && !hasBullets) {
      fail(`${sectionPath} must define paragraphs and/or bullets`);
    }
    if (hasParagraphs) {
      assertStringArray(section.paragraphs, `${sectionPath}.paragraphs`);
    }
    if (hasBullets) {
      assertStringArray(section.bullets, `${sectionPath}.bullets`);
    }
  });

  assertObject(root.footer, 'terms-of-use.page.yaml footer');
  assertString(root.footer.text, 'terms-of-use.page.yaml footer.text');
  assertString(root.footer.close_label, 'terms-of-use.page.yaml footer.close_label');

  return { sectionCount: root.sections.length };
}

try {
  const root = readYaml(termsPath);
  const { sectionCount } = validateTerms(root);
  console.log(`terms-config: validated ${sectionCount} sections in ${path.relative(projectRoot, termsPath)}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
