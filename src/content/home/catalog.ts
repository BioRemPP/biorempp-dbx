/**
 * @packageDocumentation
 *
 * Loader and validator for the editorial home-page catalog consumed by the landing page.
 */
import { parse as parseYaml } from 'yaml';
import { assertNonEmptyString, assertNonEmptyStringArray, assertOptionalString } from '../shared/guards';
import type { View } from '../../app/routes';
import type {
  HomeBrowseItem,
  HomeBrowseViewId,
  HomeBulletSection,
  HomeDownloadsSection,
  HomeEditorialCatalog,
  HomeFooterContent,
  HomeGuidedAnalysisSection,
  HomeHeroCtaButton,
  HomeHeroCtaId,
  HomeHeroContent,
  HomeHeroModalContent,
  HomeHeroModals,
  HomePanelGroup,
  HomeSectionTextBlock,
  HomeSnapshotSection,
} from '../../types/home';
import rawHomeCatalog from '../editorial/pages/home.page.yaml?raw';

const ALLOWED_BROWSE_VIEW_IDS = new Set<HomeBrowseViewId>([
  'compounds',
  'compound-classes',
  'genes',
  'pathways',
  'toxicity',
  'guided-analysis',
]);

const ALLOWED_HERO_CTA_IDS: HomeHeroCtaId[] = ['launch-analysis', 'how-to-cite', 'terms-of-use'];
const ALLOWED_HERO_CTA_VARIANTS = new Set<HomeHeroCtaButton['variant']>([
  'default',
  'secondary',
  'warning',
  'success',
]);

/**
 * Validates a hero CTA definition and constrains it to the supported CTA identifiers and variants.
 *
 * @param rawItem Raw CTA item loaded from YAML.
 * @param path Validation path used in thrown errors.
 * @returns A normalized hero CTA button definition.
 * @throws Error When the entry shape, identifier, or variant is invalid.
 */
function normalizeHeroCtaButton(rawItem: unknown, path: string): HomeHeroCtaButton {
  if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) {
    throw new Error(`Invalid home config at ${path}: expected object`);
  }

  const item = rawItem as Record<string, unknown>;
  const id = assertNonEmptyString(item.id, `${path}.id`) as HomeHeroCtaId;
  const variant = assertNonEmptyString(item.variant, `${path}.variant`) as HomeHeroCtaButton['variant'];

  if (!ALLOWED_HERO_CTA_IDS.includes(id)) {
    throw new Error(`Invalid home config at ${path}.id: expected one of ${ALLOWED_HERO_CTA_IDS.join('|')}`);
  }

  if (!ALLOWED_HERO_CTA_VARIANTS.has(variant)) {
    throw new Error(`Invalid home config at ${path}.variant: expected one of ${[...ALLOWED_HERO_CTA_VARIANTS].join('|')}`);
  }

  return {
    id,
    label: assertNonEmptyString(item.label, `${path}.label`),
    variant,
  };
}

/**
 * Validates one hero modal configuration block.
 *
 * @param rawModal Raw modal value loaded from YAML.
 * @param path Validation path used in thrown errors.
 * @returns A normalized hero modal payload.
 */
function normalizeHeroModalContent(rawModal: unknown, path: string): HomeHeroModalContent {
  if (!rawModal || typeof rawModal !== 'object' || Array.isArray(rawModal)) {
    throw new Error(`Invalid home config at ${path}: expected object`);
  }

  const modal = rawModal as Record<string, unknown>;
  return {
    title: assertNonEmptyString(modal.title, `${path}.title`),
    description: assertNonEmptyString(modal.description, `${path}.description`),
    paragraphs: assertNonEmptyStringArray(modal.paragraphs, `${path}.paragraphs`),
  };
}

function normalizeHeroModals(rawModals: unknown): HomeHeroModals {
  if (!rawModals || typeof rawModals !== 'object' || Array.isArray(rawModals)) {
    throw new Error('Invalid home config at hero.modals: expected object');
  }

  const modals = rawModals as Record<string, unknown>;
  return {
    how_to_cite: normalizeHeroModalContent(modals.how_to_cite, 'hero.modals.how_to_cite'),
  };
}

/**
 * Validates the home-page hero block, including CTA ordering and paragraph counts.
 *
 * @param rawHero Raw hero value loaded from YAML.
 * @returns A normalized hero content block.
 * @throws Error When required CTA identifiers are missing, duplicated, or out of order.
 */
function normalizeHero(rawHero: unknown): HomeHeroContent {
  if (!rawHero || typeof rawHero !== 'object' || Array.isArray(rawHero)) {
    throw new Error('Invalid home config at hero: expected object');
  }

  const hero = rawHero as Record<string, unknown>;
  const ctaButtonsRaw = hero.cta_buttons;
  if (!Array.isArray(ctaButtonsRaw) || ctaButtonsRaw.length === 0) {
    throw new Error('Invalid home config at hero.cta_buttons: expected non-empty array');
  }

  const ctaButtons = ctaButtonsRaw.map((item, index) => normalizeHeroCtaButton(item, `hero.cta_buttons[${index}]`));
  if (ctaButtons.length !== ALLOWED_HERO_CTA_IDS.length) {
    throw new Error(`Invalid home config at hero.cta_buttons: expected exactly ${ALLOWED_HERO_CTA_IDS.length} items`);
  }

  const seenCtaIds = new Set<string>();
  ctaButtons.forEach((button) => {
    if (seenCtaIds.has(button.id)) {
      throw new Error(`Invalid home config at hero.cta_buttons: duplicated id "${button.id}"`);
    }
    seenCtaIds.add(button.id);
  });

  ALLOWED_HERO_CTA_IDS.forEach((id, index) => {
    if (!seenCtaIds.has(id)) {
      throw new Error(`Invalid home config at hero.cta_buttons: missing required id "${id}"`);
    }
    if (ctaButtons[index]?.id !== id) {
      throw new Error(`Invalid home config at hero.cta_buttons: expected "${id}" at index ${index}`);
    }
  });

  const description = assertNonEmptyStringArray(hero.description, 'hero.description');
  if (description.length !== 3) {
    throw new Error('Invalid home config at hero.description: expected exactly 3 paragraphs');
  }

  return {
    title: assertNonEmptyString(hero.title, 'hero.title'),
    subtitle: assertNonEmptyString(hero.subtitle, 'hero.subtitle'),
    description,
    access_statement: assertNonEmptyString(hero.access_statement, 'hero.access_statement'),
    notice_lines: assertNonEmptyStringArray(hero.notice_lines, 'hero.notice_lines'),
    cta_buttons: ctaButtons,
    modals: normalizeHeroModals(hero.modals),
  };
}

function normalizeSectionTextBlock(rawSection: unknown, path: string): HomeSectionTextBlock {
  if (!rawSection || typeof rawSection !== 'object' || Array.isArray(rawSection)) {
    throw new Error(`Invalid home config at ${path}: expected object`);
  }

  const section = rawSection as Record<string, unknown>;
  return {
    eyebrow: assertOptionalString(section.eyebrow, `${path}.eyebrow`),
    title: assertNonEmptyString(section.title, `${path}.title`),
    content: assertNonEmptyStringArray(section.content, `${path}.content`),
  };
}

function normalizeBulletSection(rawSection: unknown, path: string): HomeBulletSection {
  if (!rawSection || typeof rawSection !== 'object' || Array.isArray(rawSection)) {
    throw new Error(`Invalid home config at ${path}: expected object`);
  }

  const section = rawSection as Record<string, unknown>;
  return {
    eyebrow: assertOptionalString(section.eyebrow, `${path}.eyebrow`),
    title: assertNonEmptyString(section.title, `${path}.title`),
    items: assertNonEmptyStringArray(section.items, `${path}.items`),
    footer:
      section.footer === undefined
        ? undefined
        : assertNonEmptyString(section.footer, `${path}.footer`),
  };
}

/**
 * Validates one browse-section item and constrains it to the set of supported route targets.
 *
 * @param rawItem Raw browse item loaded from YAML.
 * @param path Validation path used in thrown errors.
 * @returns A normalized browse item.
 */
function normalizeBrowseItem(rawItem: unknown, path: string): HomeBrowseItem {
  if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) {
    throw new Error(`Invalid home config at ${path}: expected object`);
  }

  const item = rawItem as Record<string, unknown>;
  const id = assertNonEmptyString(item.id, `${path}.id`);

  if (!ALLOWED_BROWSE_VIEW_IDS.has(id as HomeBrowseViewId)) {
    throw new Error(`Invalid home config at ${path}.id: expected one of ${[...ALLOWED_BROWSE_VIEW_IDS].join('|')}`);
  }

  return {
    id: id as Extract<View, HomeBrowseViewId>,
    label: assertNonEmptyString(item.label, `${path}.label`),
    description: assertNonEmptyString(item.description, `${path}.description`),
  };
}

function normalizeBrowseSection(rawSection: unknown): HomeEditorialCatalog['browse_section'] {
  if (!rawSection || typeof rawSection !== 'object' || Array.isArray(rawSection)) {
    throw new Error('Invalid home config at browse_section: expected object');
  }

  const section = rawSection as Record<string, unknown>;
  const itemsRaw = section.items;
  if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) {
    throw new Error('Invalid home config at browse_section.items: expected non-empty array');
  }

  const items = itemsRaw.map((item, index) => normalizeBrowseItem(item, `browse_section.items[${index}]`));
  const seenIds = new Set<string>();

  for (const item of items) {
    if (seenIds.has(item.id)) {
      throw new Error(`Invalid home config: duplicated browse section id "${item.id}"`);
    }
    seenIds.add(item.id);
  }

  return {
    eyebrow: assertOptionalString(section.eyebrow, 'browse_section.eyebrow'),
    title: assertNonEmptyString(section.title, 'browse_section.title'),
    description: assertNonEmptyString(section.description, 'browse_section.description'),
    items,
  };
}

function normalizePanelGroup(rawPanel: unknown, path: string): HomePanelGroup {
  if (!rawPanel || typeof rawPanel !== 'object' || Array.isArray(rawPanel)) {
    throw new Error(`Invalid home config at ${path}: expected object`);
  }

  const panel = rawPanel as Record<string, unknown>;
  return {
    title: assertNonEmptyString(panel.title, `${path}.title`),
    bullets: assertNonEmptyStringArray(panel.bullets, `${path}.bullets`),
  };
}

/**
 * Validates the guided-analysis home section and its declarative panels.
 *
 * @param rawSection Raw section value loaded from YAML.
 * @returns A normalized guided-analysis section.
 */
function normalizeGuidedAnalysisSection(rawSection: unknown): HomeGuidedAnalysisSection {
  if (!rawSection || typeof rawSection !== 'object' || Array.isArray(rawSection)) {
    throw new Error('Invalid home config at guided_analysis: expected object');
  }

  const section = rawSection as Record<string, unknown>;
  const panelsRaw = section.panels;
  if (!Array.isArray(panelsRaw) || panelsRaw.length === 0) {
    throw new Error('Invalid home config at guided_analysis.panels: expected non-empty array');
  }

  return {
    eyebrow: assertOptionalString(section.eyebrow, 'guided_analysis.eyebrow'),
    title: assertNonEmptyString(section.title, 'guided_analysis.title'),
    description: assertNonEmptyStringArray(section.description, 'guided_analysis.description'),
    cta_label: assertNonEmptyString(section.cta_label, 'guided_analysis.cta_label'),
    panels: panelsRaw.map((panel, index) => normalizePanelGroup(panel, `guided_analysis.panels[${index}]`)),
    scope_note: assertNonEmptyString(section.scope_note, 'guided_analysis.scope_note'),
  };
}

/**
 * Validates the downloads section that controls home-page release messaging and dialog labels.
 *
 * @param rawSection Raw downloads section loaded from YAML.
 * @returns A normalized downloads section.
 */
function normalizeDownloadsSection(rawSection: unknown): HomeDownloadsSection {
  if (!rawSection || typeof rawSection !== 'object' || Array.isArray(rawSection)) {
    throw new Error('Invalid home config at downloads: expected object');
  }

  const section = rawSection as Record<string, unknown>;

  return {
    eyebrow: assertOptionalString(section.eyebrow, 'downloads.eyebrow'),
    title: assertNonEmptyString(section.title, 'downloads.title'),
    description: assertNonEmptyStringArray(section.description, 'downloads.description'),
    primary_title: assertNonEmptyString(section.primary_title, 'downloads.primary_title'),
    primary_description: assertNonEmptyString(section.primary_description, 'downloads.primary_description'),
    accordion_title: assertNonEmptyString(section.accordion_title, 'downloads.accordion_title'),
    accordion_description: assertNonEmptyString(section.accordion_description, 'downloads.accordion_description'),
    disclaimer_title: assertNonEmptyString(section.disclaimer_title, 'downloads.disclaimer_title'),
    disclaimer_paragraphs: assertNonEmptyStringArray(section.disclaimer_paragraphs, 'downloads.disclaimer_paragraphs'),
    selected_release_prefix: assertNonEmptyString(section.selected_release_prefix, 'downloads.selected_release_prefix'),
    open_release_label: assertNonEmptyString(section.open_release_label, 'downloads.open_release_label'),
    close_label: assertNonEmptyString(section.close_label, 'downloads.close_label'),
  };
}

function normalizeSnapshotSection(rawSection: unknown): HomeSnapshotSection {
  if (!rawSection || typeof rawSection !== 'object' || Array.isArray(rawSection)) {
    throw new Error('Invalid home config at snapshot: expected object');
  }

  const section = rawSection as Record<string, unknown>;
  return {
    eyebrow: assertOptionalString(section.eyebrow, 'snapshot.eyebrow'),
    title: assertNonEmptyString(section.title, 'snapshot.title'),
    description: assertNonEmptyString(section.description, 'snapshot.description'),
    action_label: assertNonEmptyString(section.action_label, 'snapshot.action_label'),
  };
}

function normalizeFooter(rawFooter: unknown): HomeFooterContent {
  if (!rawFooter || typeof rawFooter !== 'object' || Array.isArray(rawFooter)) {
    throw new Error('Invalid home config at footer: expected object');
  }

  const footer = rawFooter as Record<string, unknown>;
  return {
    content: assertNonEmptyString(footer.content, 'footer.content'),
  };
}

/**
 * Parses and validates the editorial home-page YAML catalog.
 *
 * @param rawYaml Raw YAML source loaded from the editorial home asset.
 * @returns A normalized home editorial catalog ready for the landing page.
 * @throws Error When the YAML syntax is invalid or any required section fails validation.
 */
export function parseHomeEditorialCatalog(rawYaml: string): HomeEditorialCatalog {
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (error) {
    throw new Error(
      `Invalid home config YAML syntax: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid home config: root must be an object');
  }

  const root = parsed as Record<string, unknown>;
  return {
    version: assertNonEmptyString(root.version, 'version'),
    hero: normalizeHero(root.hero),
    scientific_overview: normalizeSectionTextBlock(root.scientific_overview, 'scientific_overview'),
    data_sources: normalizeBulletSection(root.data_sources, 'data_sources'),
    target_users: normalizeBulletSection(root.target_users, 'target_users'),
    browse_section: normalizeBrowseSection(root.browse_section),
    guided_analysis: normalizeGuidedAnalysisSection(root.guided_analysis),
    downloads: normalizeDownloadsSection(root.downloads),
    snapshot: normalizeSnapshotSection(root.snapshot),
    footer: normalizeFooter(root.footer),
  };
}

/**
 * Loads the bundled home-page editorial catalog from the raw YAML asset.
 *
 * @returns The validated home-page editorial catalog.
 */
export function loadHomeEditorialCatalog(): HomeEditorialCatalog {
  return parseHomeEditorialCatalog(rawHomeCatalog);
}

/**
 * Public home-page editorial catalog consumed by the landing page.
 */
export const HOME_EDITORIAL_CATALOG = loadHomeEditorialCatalog();
