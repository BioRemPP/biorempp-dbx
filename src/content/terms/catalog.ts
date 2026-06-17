/**
 * @packageDocumentation
 *
 * Loader and validator for the Terms of Use editorial catalog consumed by the reusable modal.
 */
import { parse as parseYaml } from 'yaml';
import { assertNonEmptyString, assertNonEmptyStringArray, assertObject } from '../shared/guards';
import type { TermsCatalog, TermsFooterContent, TermsNoticeContent, TermsSectionContent, TermsSectionTone } from '../../types/terms';
import rawTermsCatalog from '../editorial/pages/terms-of-use.page.yaml?raw';

const ALLOWED_SECTION_TONES = new Set<TermsSectionTone>(['neutral', 'warning', 'success', 'info']);

function normalizeHeader(raw: unknown): TermsCatalog['header'] {
  const header = assertObject(raw, 'header');
  return {
    title: assertNonEmptyString(header.title, 'header.title'),
    subtitle: assertNonEmptyString(header.subtitle, 'header.subtitle'),
  };
}

function normalizeNotice(raw: unknown): TermsNoticeContent {
  const notice = assertObject(raw, 'notice');
  return {
    title: assertNonEmptyString(notice.title, 'notice.title'),
    body: assertNonEmptyString(notice.body, 'notice.body'),
  };
}

function normalizeSection(raw: unknown, index: number): TermsSectionContent {
  const section = assertObject(raw, `sections[${index}]`);
  const toneValue = section.tone;
  if (toneValue !== undefined) {
    const tone = assertNonEmptyString(toneValue, `sections[${index}].tone`) as TermsSectionTone;
    if (!ALLOWED_SECTION_TONES.has(tone)) {
      throw new Error(`Invalid terms config at sections[${index}].tone: expected one of ${[...ALLOWED_SECTION_TONES].join('|')}`);
    }
  }

  const paragraphs = section.paragraphs === undefined ? undefined : assertNonEmptyStringArray(section.paragraphs, `sections[${index}].paragraphs`);
  const bullets = section.bullets === undefined ? undefined : assertNonEmptyStringArray(section.bullets, `sections[${index}].bullets`);

  if (!paragraphs && !bullets) {
    throw new Error(`Invalid terms config at sections[${index}]: expected paragraphs and/or bullets`);
  }

  return {
    id: assertNonEmptyString(section.id, `sections[${index}].id`),
    title: assertNonEmptyString(section.title, `sections[${index}].title`),
    paragraphs,
    bullets,
    tone: toneValue === undefined ? undefined : (toneValue as TermsSectionTone),
  };
}

function normalizeFooter(raw: unknown): TermsFooterContent {
  const footer = assertObject(raw, 'footer');
  return {
    text: assertNonEmptyString(footer.text, 'footer.text'),
    close_label: assertNonEmptyString(footer.close_label, 'footer.close_label'),
  };
}

/**
 * Parses and validates the terms YAML catalog.
 *
 * @param rawYaml Raw YAML source loaded from the editorial asset.
 * @returns A normalized terms catalog ready for runtime use.
 */
export function parseTermsCatalog(rawYaml: string): TermsCatalog {
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (error) {
    throw new Error(`Invalid terms config YAML syntax: ${error instanceof Error ? error.message : String(error)}`);
  }

  const root = assertObject(parsed, 'root');
  const sectionsRaw = root.sections;
  if (!Array.isArray(sectionsRaw) || sectionsRaw.length === 0) {
    throw new Error('Invalid terms config at sections: expected non-empty array');
  }

  return {
    version: assertNonEmptyString(root.version, 'version'),
    header: normalizeHeader(root.header),
    notice: normalizeNotice(root.notice),
    sections: sectionsRaw.map((section, index) => normalizeSection(section, index)),
    footer: normalizeFooter(root.footer),
  };
}

/**
 * Loads the bundled terms catalog from the raw YAML asset.
 *
 * @returns The validated terms catalog.
 */
export function loadTermsCatalog(): TermsCatalog {
  return parseTermsCatalog(rawTermsCatalog);
}

/**
 * Public terms catalog consumed by the reusable Terms of Use dialog.
 */
export const TERMS_CATALOG = loadTermsCatalog();
