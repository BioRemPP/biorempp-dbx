/**
 * @packageDocumentation
 *
 * Loader and validator for the declarative user guide catalog consumed by the user guide page.
 */
import { parse as parseYaml } from 'yaml';
import { assertNonEmptyString, assertNonEmptyStringArray, assertObject } from '../shared/guards';
import type { View } from '../../app/routes';
import type {
  UserGuideCatalog,
  UserGuideCategoryId,
  UserGuideCategorySection,
  UserGuideQuickNavSection,
  UserGuideTargetView,
  UserGuideWorkflowSection,
} from '../../types/userGuide';
import rawUserGuideCatalog from '../editorial/pages/user-guide.page.yaml?raw';

const ALLOWED_CATEGORY_IDS: UserGuideCategoryId[] = [
  'compounds',
  'compound-classes',
  'genes',
  'pathways',
  'toxicity',
  'guided-analysis',
];

const ALLOWED_TARGET_VIEWS = new Set<UserGuideTargetView>(ALLOWED_CATEGORY_IDS as UserGuideTargetView[]);

/**
 * Validates the workflow section of the user guide catalog.
 *
 * @param rawWorkflow Raw workflow block loaded from YAML.
 * @returns A normalized workflow section.
 */
function normalizeWorkflow(rawWorkflow: unknown): UserGuideWorkflowSection {
  const workflow = assertObject(rawWorkflow, 'workflow');

  return {
    title: assertNonEmptyString(workflow.title, 'workflow.title'),
    steps: assertNonEmptyStringArray(workflow.steps, 'workflow.steps'),
  };
}

/**
 * Validates the quick-navigation section of the user guide catalog.
 *
 * @param rawQuickNav Raw quick-navigation block loaded from YAML.
 * @returns A normalized quick-navigation section.
 */
function normalizeQuickNav(rawQuickNav: unknown): UserGuideQuickNavSection {
  const quickNav = assertObject(rawQuickNav, 'quick_nav');

  return {
    title: assertNonEmptyString(quickNav.title, 'quick_nav.title'),
    description: assertNonEmptyString(quickNav.description, 'quick_nav.description'),
  };
}

/**
 * Validates one user guide category entry and constrains it to supported module ids and targets.
 *
 * @param rawCategory Raw category entry loaded from YAML.
 * @param index Zero-based category index used to build validation errors.
 * @returns A normalized user guide category section.
 * @throws Error When the category id, target view, or required text fields are invalid.
 */
function normalizeCategory(rawCategory: unknown, index: number): UserGuideCategorySection {
  const category = assertObject(rawCategory, `categories[${index}]`);
  const id = assertNonEmptyString(category.id, `categories[${index}].id`) as UserGuideCategoryId;

  if (!ALLOWED_CATEGORY_IDS.includes(id)) {
    throw new Error(
      `Invalid user guide config at categories[${index}].id: expected one of ${ALLOWED_CATEGORY_IDS.join('|')}`
    );
  }

  const targetView = assertNonEmptyString(category.target_view, `categories[${index}].target_view`) as View;

  if (!ALLOWED_TARGET_VIEWS.has(targetView as UserGuideTargetView)) {
    throw new Error(
      `Invalid user guide config at categories[${index}].target_view: expected one of ${ALLOWED_CATEGORY_IDS.join('|')}`
    );
  }

  return {
    id,
    label: assertNonEmptyString(category.label, `categories[${index}].label`),
    eyebrow: assertNonEmptyString(category.eyebrow, `categories[${index}].eyebrow`),
    summary: assertNonEmptyString(category.summary, `categories[${index}].summary`),
    capabilities: assertNonEmptyStringArray(category.capabilities, `categories[${index}].capabilities`),
    filters: assertNonEmptyStringArray(category.filters, `categories[${index}].filters`),
    outputs: assertNonEmptyStringArray(category.outputs, `categories[${index}].outputs`),
    when_to_use: assertNonEmptyStringArray(category.when_to_use, `categories[${index}].when_to_use`),
    cta_label: assertNonEmptyString(category.cta_label, `categories[${index}].cta_label`),
    target_view: targetView as UserGuideTargetView,
  };
}

/**
 * Parses and validates the user guide YAML catalog.
 *
 * @param rawYaml Raw YAML source loaded from the editorial user guide asset.
 * @returns A normalized user guide catalog ready for runtime use.
 * @throws Error When the YAML syntax is invalid, category ordering changes, or required fields are missing.
 */
export function parseUserGuideCatalog(rawYaml: string): UserGuideCatalog {
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (error) {
    throw new Error(
      `Invalid user guide config YAML syntax: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const root = assertObject(parsed, 'root');
  const categoriesRaw = root.categories;

  if (!Array.isArray(categoriesRaw)) {
    throw new Error('Invalid user guide config at categories: expected array');
  }

  const categories = categoriesRaw.map((category, index) => normalizeCategory(category, index));

  if (categories.length !== ALLOWED_CATEGORY_IDS.length) {
    throw new Error(
      `Invalid user guide config at categories: expected exactly ${ALLOWED_CATEGORY_IDS.length} categories`
    );
  }

  const seenIds = new Set<string>();
  categories.forEach((category, index) => {
    if (seenIds.has(category.id)) {
      throw new Error(`Invalid user guide config at categories: duplicated id "${category.id}"`);
    }
    seenIds.add(category.id);

    if (category.id !== ALLOWED_CATEGORY_IDS[index]) {
      throw new Error(
        `Invalid user guide config at categories[${index}].id: expected "${ALLOWED_CATEGORY_IDS[index]}"`
      );
    }
  });

  return {
    version: assertNonEmptyString(root.version, 'version'),
    page_title: assertNonEmptyString(root.page_title, 'page_title'),
    page_subtitle: assertNonEmptyString(root.page_subtitle, 'page_subtitle'),
    intro_paragraphs: assertNonEmptyStringArray(root.intro_paragraphs, 'intro_paragraphs'),
    access_note: assertNonEmptyString(root.access_note, 'access_note'),
    workflow: normalizeWorkflow(root.workflow),
    quick_nav: normalizeQuickNav(root.quick_nav),
    categories,
    closing_note: assertNonEmptyString(root.closing_note, 'closing_note'),
  };
}

/**
 * Loads the bundled user guide catalog from the raw YAML asset.
 *
 * @returns The validated user guide catalog.
 */
export function loadUserGuideCatalog(): UserGuideCatalog {
  return parseUserGuideCatalog(rawUserGuideCatalog);
}

/**
 * Public user guide catalog consumed by the user guide page and related navigation components.
 */
export const USER_GUIDE_CATALOG = loadUserGuideCatalog();
