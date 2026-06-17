/**
 * @packageDocumentation
 *
 * Loader and validator for the FAQ catalog rendered by the FAQ page.
 */
import { parse as parseYaml } from 'yaml';
import { VIEW_PATHS, type View } from '../../app/routes';
import { assertNonEmptyString, assertObject, assertOptionalString } from '../shared/guards';
import rawFaqCatalog from '../editorial/faq/faq.en.yaml?raw';
import type { FaqCatalog, FaqItem, FaqLink, FaqNoteType, FaqSection } from '../../types/faq';

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
] as const;

const ALLOWED_VIEWS = new Set<View>(Object.keys(VIEW_PATHS) as View[]);
const ALLOWED_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

function validateExternalUrl(value: string, path: string) {
  if (value.startsWith('/')) {
    throw new Error(`Invalid FAQ config at ${path}: internal app links must use "view" instead of "url"`);
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(`Invalid FAQ config at ${path}: expected valid absolute URL`);
  }

  if (!ALLOWED_EXTERNAL_PROTOCOLS.has(parsedUrl.protocol)) {
    throw new Error(`Invalid FAQ config at ${path}: unsupported protocol "${parsedUrl.protocol}"`);
  }
}

/**
 * Validates the tone of an optional FAQ note block.
 *
 * @param value Raw note type loaded from YAML.
 * @param path Validation path used in thrown errors.
 * @returns A normalized FAQ note type.
 * @throws Error When the note type is not one of the supported values.
 */
function normalizeNoteType(value: unknown, path: string): FaqNoteType {
  const noteType = assertNonEmptyString(value, path);
  if (noteType !== 'info' && noteType !== 'warning' && noteType !== 'success') {
    throw new Error(`Invalid FAQ config at ${path}: expected one of info|warning|success`);
  }
  return noteType;
}

/**
 * Validates one FAQ reference link.
 *
 * @param rawLink Raw link payload loaded from YAML.
 * @param path Validation path used in thrown errors.
 * @returns A normalized FAQ link.
 */
function normalizeLink(rawLink: unknown, path: string): FaqLink {
  const link = assertObject(rawLink, path);
  const label = assertNonEmptyString(link.label, `${path}.label`);
  const rawView = link.view;
  const rawUrl = link.url;
  const hasView = rawView !== undefined && rawView !== null;
  const hasUrl = rawUrl !== undefined && rawUrl !== null;

  if (hasView === hasUrl) {
    throw new Error(`Invalid FAQ config at ${path}: exactly one of "view" or "url" must be present`);
  }

  if (hasView) {
    const view = assertNonEmptyString(rawView, `${path}.view`) as View;
    if (!ALLOWED_VIEWS.has(view)) {
      throw new Error(`Invalid FAQ config at ${path}.view: expected one of ${Array.from(ALLOWED_VIEWS).join('|')}`);
    }
    return { label, view };
  }

  const url = assertNonEmptyString(rawUrl, `${path}.url`);
  validateExternalUrl(url, `${path}.url`);
  return { label, url };
}

/**
 * Validates an array of non-empty strings used by bullets, tags, or similar fields.
 *
 * @param rawValue Raw array value loaded from YAML.
 * @param path Validation path used in thrown errors.
 * @returns A normalized string list.
 */
function normalizeStringList(rawValue: unknown, path: string): string[] {
  if (!Array.isArray(rawValue)) {
    throw new Error(`Invalid FAQ config at ${path}: expected array`);
  }
  return rawValue.map((value, index) => assertNonEmptyString(value, `${path}[${index}]`));
}

/**
 * Validates one FAQ item and its optional nested sections.
 *
 * @param rawItem Raw FAQ item loaded from YAML.
 * @param path Validation path used in thrown errors.
 * @returns A normalized FAQ item.
 */
function normalizeItem(rawItem: unknown, path: string): FaqItem {
  if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) {
    throw new Error(`Invalid FAQ config at ${path}: expected object`);
  }

  const item = rawItem as Record<string, unknown>;
  const normalized: FaqItem = {
    id: assertNonEmptyString(item.id, `${path}.id`),
    question: assertNonEmptyString(item.question, `${path}.question`),
    answer: assertNonEmptyString(item.answer, `${path}.answer`),
  };

  if (item.bullets !== undefined) {
    normalized.bullets = normalizeStringList(item.bullets, `${path}.bullets`);
  }

  if (item.note !== undefined) {
    if (!item.note || typeof item.note !== 'object' || Array.isArray(item.note)) {
      throw new Error(`Invalid FAQ config at ${path}.note: expected object`);
    }
    const note = item.note as Record<string, unknown>;
    normalized.note = {
      type: normalizeNoteType(note.type, `${path}.note.type`),
      text: assertNonEmptyString(note.text, `${path}.note.text`),
    };
  }

  if (item.links !== undefined) {
    if (!Array.isArray(item.links)) {
      throw new Error(`Invalid FAQ config at ${path}.links: expected array`);
    }
    normalized.links = item.links.map((rawLink, index) => normalizeLink(rawLink, `${path}.links[${index}]`));
  }

  if (item.code_example !== undefined) {
    normalized.code_example = assertNonEmptyString(item.code_example, `${path}.code_example`);
  }

  if (item.tags !== undefined) {
    normalized.tags = normalizeStringList(item.tags, `${path}.tags`);
  }

  return normalized;
}

/**
 * Validates one FAQ section and its nested items.
 *
 * @param rawSection Raw section payload loaded from YAML.
 * @param path Validation path used in thrown errors.
 * @returns A normalized FAQ section.
 * @throws Error When the section item list is missing or empty.
 */
function normalizeSection(rawSection: unknown, path: string): FaqSection {
  const section = assertObject(rawSection, path);
  const itemsRaw = section.items;
  if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
    throw new Error(`Invalid FAQ config at ${path}.items: expected non-empty array`);
  }

  return {
    id: assertNonEmptyString(section.id, `${path}.id`),
    title: assertNonEmptyString(section.title, `${path}.title`),
    description: assertOptionalString(section.description, `${path}.description`),
    items: itemsRaw.map((item, index) => normalizeItem(item, `${path}.items[${index}]`)),
  };
}

/**
 * Parses and validates the FAQ YAML catalog.
 *
 * @param rawYaml Raw YAML source loaded from the editorial FAQ asset.
 * @returns A normalized FAQ catalog ready for runtime use.
 * @throws Error When the YAML syntax is invalid, required fields are missing, or ids are duplicated.
 */
export function parseFaqCatalog(rawYaml: string): FaqCatalog {
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (error) {
    throw new Error(
      `Invalid FAQ config YAML syntax: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid FAQ config: root must be an object');
  }

  const root = parsed as Record<string, unknown>;
  const headerActionsRaw = root.header_actions;
  const sectionsRaw = root.sections;

  if (!Array.isArray(headerActionsRaw) || headerActionsRaw.length < 2 || headerActionsRaw.length > 4) {
    throw new Error('Invalid FAQ config at header_actions: expected array with 2 to 4 entries');
  }
  if (!Array.isArray(sectionsRaw) || sectionsRaw.length === 0) {
    throw new Error('Invalid FAQ config: sections must be a non-empty array');
  }

  const header_actions = headerActionsRaw.map((action, index) => normalizeLink(action, `header_actions[${index}]`));
  const sections = sectionsRaw.map((section, index) => normalizeSection(section, `sections[${index}]`));

  if (sections.length !== REQUIRED_SECTION_IDS.length) {
    throw new Error(
      `Invalid FAQ config at sections: expected exactly ${REQUIRED_SECTION_IDS.length} sections`
    );
  }

  const sectionIdSet = new Set<string>();
  const itemIdSet = new Set<string>();
  let questionCount = 0;
  for (const section of sections) {
    if (sectionIdSet.has(section.id)) {
      throw new Error(`Invalid FAQ config: duplicated section id "${section.id}"`);
    }
    sectionIdSet.add(section.id);
    for (const item of section.items) {
      if (itemIdSet.has(item.id)) {
        throw new Error(`Invalid FAQ config: duplicated item id "${item.id}"`);
      }
      itemIdSet.add(item.id);
      questionCount += 1;
    }
  }

  sections.forEach((section, index) => {
    if (section.id !== REQUIRED_SECTION_IDS[index]) {
      throw new Error(
        `Invalid FAQ config at sections[${index}].id: expected "${REQUIRED_SECTION_IDS[index]}"`
      );
    }
  });

  if (questionCount < 24) {
    throw new Error(`Invalid FAQ config at sections: expected at least 24 questions, found ${questionCount}`);
  }

  return {
    version: assertNonEmptyString(root.version, 'version'),
    language: assertNonEmptyString(root.language, 'language'),
    title: assertNonEmptyString(root.title, 'title'),
    intro: assertNonEmptyString(root.intro, 'intro'),
    header_actions,
    sections,
  };
}

/**
 * Loads the bundled FAQ catalog from the raw YAML asset.
 *
 * @returns The validated FAQ catalog.
 */
export function loadFaqCatalog(): FaqCatalog {
  return parseFaqCatalog(rawFaqCatalog);
}

/**
 * Public FAQ catalog consumed by the FAQ page.
 */
export const FAQ_CATALOG = loadFaqCatalog();
