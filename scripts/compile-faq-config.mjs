import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, '..');

const REQUIRED_SECTION_IDS = [
  'getting-started',
  'navigation-and-support-pages',
  'explorers-and-detail-pages',
  'guided-analysis',
  'data-scope-and-coverage',
  'interpretation-and-limitations',
  'downloads-reproducibility-and-citation',
  'technical-access-and-api',
  'privacy-terms-and-licensing',
  'troubleshooting-and-support',
];

const VALID_NOTE_TYPES = new Set(['info', 'warning', 'success']);
const VALID_VIEWS = new Set([
  'home',
  'scientific-overview',
  'user-guide',
  'technical-information',
  'faq',
  'contact',
  'documentation',
  'databases',
  'compounds',
  'compound-classes',
  'genes',
  'pathways',
  'toxicity',
  'guided-analysis',
]);
const VALID_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

function fail(message) {
  throw new Error(`faq-config: ${message}`);
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

function assertOptionalString(value, context) {
  if (value === undefined || value === null) {
    return undefined;
  }
  return assertString(value, context);
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

function validateExternalUrl(value, context) {
  if (value.startsWith('/')) {
    fail(`${context} must use "view" for internal app links`);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(value);
  } catch {
    fail(`${context} must be a valid absolute URL`);
  }

  if (!VALID_EXTERNAL_PROTOCOLS.has(parsedUrl.protocol)) {
    fail(`${context} uses unsupported protocol "${parsedUrl.protocol}"`);
  }
}

function validateLink(link, context) {
  assertObject(link, context);
  assertString(link.label, `${context}.label`);

  const hasView = link.view !== undefined && link.view !== null;
  const hasUrl = link.url !== undefined && link.url !== null;

  if (hasView === hasUrl) {
    fail(`${context} must declare exactly one of view or url`);
  }

  if (hasView) {
    const view = assertString(link.view, `${context}.view`);
    if (!VALID_VIEWS.has(view)) {
      fail(`${context}.view must be one of ${Array.from(VALID_VIEWS).join('|')}`);
    }
    return { kind: 'view', value: view };
  }

  const url = assertString(link.url, `${context}.url`);
  validateExternalUrl(url, `${context}.url`);
  return { kind: 'url', value: url };
}

export function validateFaqConfig({ projectRoot = defaultProjectRoot } = {}) {
  const faqPath = path.join(projectRoot, 'src', 'content', 'editorial', 'faq', 'faq.en.yaml');
  const root = readYaml(faqPath, projectRoot);

  assertObject(root, 'faq.en.yaml');
  assertString(root.version, 'faq.en.yaml version');
  assertString(root.language, 'faq.en.yaml language');
  assertString(root.title, 'faq.en.yaml title');
  assertString(root.intro, 'faq.en.yaml intro');
  assertArray(root.header_actions, 'faq.en.yaml header_actions');
  assertArray(root.sections, 'faq.en.yaml sections');

  if (root.header_actions.length < 2 || root.header_actions.length > 4) {
    fail(`faq.en.yaml header_actions must contain 2 to 4 entries, found ${root.header_actions.length}`);
  }

  if (root.sections.length !== REQUIRED_SECTION_IDS.length) {
    fail(`faq.en.yaml sections must contain exactly ${REQUIRED_SECTION_IDS.length} sections, found ${root.sections.length}`);
  }

  root.header_actions.forEach((action, index) => validateLink(action, `faq.en.yaml header_actions[${index}]`));

  const sectionIds = new Set();
  const itemIds = new Set();
  let questionCount = 0;

  root.sections.forEach((section, sectionIndex) => {
    const sectionPath = `faq.en.yaml sections[${sectionIndex}]`;
    assertObject(section, sectionPath);
    const sectionId = assertString(section.id, `${sectionPath}.id`);
    assertString(section.title, `${sectionPath}.title`);
    assertOptionalString(section.description, `${sectionPath}.description`);
    assertArray(section.items, `${sectionPath}.items`);

    if (sectionId !== REQUIRED_SECTION_IDS[sectionIndex]) {
      fail(`${sectionPath}.id must be "${REQUIRED_SECTION_IDS[sectionIndex]}"`);
    }
    if (sectionIds.has(sectionId)) {
      fail(`duplicated section id: ${sectionId}`);
    }
    sectionIds.add(sectionId);

    if (section.items.length === 0) {
      fail(`${sectionPath}.items must contain at least one item`);
    }

    section.items.forEach((item, itemIndex) => {
      const itemPath = `${sectionPath}.items[${itemIndex}]`;
      assertObject(item, itemPath);
      const itemId = assertString(item.id, `${itemPath}.id`);
      assertString(item.question, `${itemPath}.question`);
      assertString(item.answer, `${itemPath}.answer`);

      if (itemIds.has(itemId)) {
        fail(`duplicated item id: ${itemId}`);
      }
      itemIds.add(itemId);
      questionCount += 1;

      if (item.bullets !== undefined) {
        assertArray(item.bullets, `${itemPath}.bullets`);
        item.bullets.forEach((bullet, bulletIndex) => {
          assertString(bullet, `${itemPath}.bullets[${bulletIndex}]`);
        });
      }

      if (item.note !== undefined) {
        assertObject(item.note, `${itemPath}.note`);
        const noteType = assertString(item.note.type, `${itemPath}.note.type`);
        if (!VALID_NOTE_TYPES.has(noteType)) {
          fail(`${itemPath}.note.type must be one of info|warning|success`);
        }
        assertString(item.note.text, `${itemPath}.note.text`);
      }

      if (item.links !== undefined) {
        assertArray(item.links, `${itemPath}.links`);
        item.links.forEach((link, linkIndex) => {
          validateLink(link, `${itemPath}.links[${linkIndex}]`);
        });
      }

      if (item.code_example !== undefined) {
        assertString(item.code_example, `${itemPath}.code_example`);
      }

      if (item.tags !== undefined) {
        assertArray(item.tags, `${itemPath}.tags`);
        item.tags.forEach((tag, tagIndex) => {
          assertString(tag, `${itemPath}.tags[${tagIndex}]`);
        });
      }
    });
  });

  if (questionCount < 24) {
    fail(`faq.en.yaml question count must be at least 24, found ${questionCount}`);
  }

  return {
    faqPath,
    headerActionCount: root.header_actions.length,
    sectionCount: root.sections.length,
    questionCount,
  };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedPath === __filename) {
  try {
    const result = validateFaqConfig();
    console.log(
      `faq-config: validated ${result.questionCount} questions across ${result.sectionCount} sections in ${path.relative(defaultProjectRoot, result.faqPath)}`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
