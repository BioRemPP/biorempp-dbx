import { parse as parseYaml } from 'yaml';
import {
  assertNonEmptyString,
  assertNonEmptyStringArray,
  assertObject,
} from '../shared/guards';
import rawTechnicalInformationCatalog from '../editorial/pages/technical-information.page.yaml?raw';
import type {
  TechnicalInformationBullet,
  TechnicalInformationFaqItem,
  TechnicalInformationPageCatalog,
} from '../../types/technicalInformation';

function normalizeBullet(rawValue: unknown, path: string): TechnicalInformationBullet {
  const bullet = assertObject(rawValue, path);
  return {
    id: assertNonEmptyString(bullet.id, `${path}.id`),
    label: assertNonEmptyString(bullet.label, `${path}.label`),
    description: assertNonEmptyString(bullet.description, `${path}.description`),
  };
}

function normalizeFaqItem(rawValue: unknown, path: string): TechnicalInformationFaqItem {
  const item = assertObject(rawValue, path);
  return {
    id: assertNonEmptyString(item.id, `${path}.id`),
    question: assertNonEmptyString(item.question, `${path}.question`),
    answer: assertNonEmptyString(item.answer, `${path}.answer`),
  };
}

function normalizeBullets(rawValue: unknown, path: string) {
  if (!Array.isArray(rawValue) || rawValue.length === 0) {
    throw new Error(`Invalid technical information config at ${path}: expected non-empty array`);
  }
  const bullets = rawValue.map((entry, index) => normalizeBullet(entry, `${path}[${index}]`));
  const bulletIds = new Set<string>();
  for (const bullet of bullets) {
    if (bulletIds.has(bullet.id)) {
      throw new Error(`Invalid technical information config at ${path}: duplicated id "${bullet.id}"`);
    }
    bulletIds.add(bullet.id);
  }
  return bullets;
}

function normalizeFaqItems(rawValue: unknown, path: string) {
  if (!Array.isArray(rawValue) || rawValue.length === 0) {
    throw new Error(`Invalid technical information config at ${path}: expected non-empty array`);
  }
  const items = rawValue.map((entry, index) => normalizeFaqItem(entry, `${path}[${index}]`));
  const itemIds = new Set<string>();
  for (const item of items) {
    if (itemIds.has(item.id)) {
      throw new Error(`Invalid technical information config at ${path}: duplicated id "${item.id}"`);
    }
    itemIds.add(item.id);
  }
  return items;
}

export function parseTechnicalInformationCatalog(rawYaml: string): TechnicalInformationPageCatalog {
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (error) {
    throw new Error(
      `Invalid technical information config YAML syntax: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const root = assertObject(parsed, 'technical-information.page.yaml');
  const header = assertObject(root.header, 'header');
  const intro = assertObject(root.intro, 'intro');
  const runtimeDelivery = assertObject(root.runtime_delivery, 'runtime_delivery');
  const buildOverview = assertObject(root.build_overview, 'build_overview');
  const schemaQuality = assertObject(root.schema_quality, 'schema_quality');
  const validation = assertObject(root.validation, 'validation');
  const provenance = assertObject(root.provenance, 'provenance');
  const limitations = assertObject(root.limitations, 'limitations');
  const faq = assertObject(root.faq, 'faq');
  const footer = assertObject(root.footer, 'footer');
  const sidebar = assertObject(root.sidebar, 'sidebar');

  return {
    version: assertNonEmptyString(root.version, 'version'),
    language: assertNonEmptyString(root.language, 'language'),
    header: {
      eyebrow: assertNonEmptyString(header.eyebrow, 'header.eyebrow'),
      title: assertNonEmptyString(header.title, 'header.title'),
      subtitle: assertNonEmptyString(header.subtitle, 'header.subtitle'),
      intro_note: assertNonEmptyString(header.intro_note, 'header.intro_note'),
    },
    intro: {
      title: assertNonEmptyString(intro.title, 'intro.title'),
      paragraphs: assertNonEmptyStringArray(intro.paragraphs, 'intro.paragraphs'),
    },
    runtime_delivery: {
      title: assertNonEmptyString(runtimeDelivery.title, 'runtime_delivery.title'),
      intro: assertNonEmptyString(runtimeDelivery.intro, 'runtime_delivery.intro'),
      bullets: normalizeBullets(runtimeDelivery.bullets, 'runtime_delivery.bullets'),
      recommendation_title: assertNonEmptyString(
        runtimeDelivery.recommendation_title,
        'runtime_delivery.recommendation_title'
      ),
      recommendation: assertNonEmptyString(runtimeDelivery.recommendation, 'runtime_delivery.recommendation'),
      closing: assertNonEmptyString(runtimeDelivery.closing, 'runtime_delivery.closing'),
    },
    build_overview: {
      title: assertNonEmptyString(buildOverview.title, 'build_overview.title'),
      intro: assertNonEmptyString(buildOverview.intro, 'build_overview.intro'),
      bullets: normalizeBullets(buildOverview.bullets, 'build_overview.bullets'),
      closing: assertNonEmptyString(buildOverview.closing, 'build_overview.closing'),
    },
    schema_quality: {
      title: assertNonEmptyString(schemaQuality.title, 'schema_quality.title'),
      intro: assertNonEmptyString(schemaQuality.intro, 'schema_quality.intro'),
      quality_points: assertNonEmptyStringArray(schemaQuality.quality_points, 'schema_quality.quality_points'),
      coverage_note: assertNonEmptyString(schemaQuality.coverage_note, 'schema_quality.coverage_note'),
    },
    validation: {
      title: assertNonEmptyString(validation.title, 'validation.title'),
      intro: assertNonEmptyString(validation.intro, 'validation.intro'),
      bullets: assertNonEmptyStringArray(validation.bullets, 'validation.bullets'),
      closing: assertNonEmptyString(validation.closing, 'validation.closing'),
    },
    provenance: {
      title: assertNonEmptyString(provenance.title, 'provenance.title'),
      intro: assertNonEmptyString(provenance.intro, 'provenance.intro'),
      bullets: assertNonEmptyStringArray(provenance.bullets, 'provenance.bullets'),
      closing: assertNonEmptyString(provenance.closing, 'provenance.closing'),
    },
    limitations: {
      title: assertNonEmptyString(limitations.title, 'limitations.title'),
      intro: assertNonEmptyString(limitations.intro, 'limitations.intro'),
      safe_claims_title: assertNonEmptyString(limitations.safe_claims_title, 'limitations.safe_claims_title'),
      safe_claims: assertNonEmptyStringArray(limitations.safe_claims, 'limitations.safe_claims'),
      avoid_claims_title: assertNonEmptyString(limitations.avoid_claims_title, 'limitations.avoid_claims_title'),
      avoid_claims: assertNonEmptyStringArray(limitations.avoid_claims, 'limitations.avoid_claims'),
      closing: assertNonEmptyString(limitations.closing, 'limitations.closing'),
    },
    faq: {
      title: assertNonEmptyString(faq.title, 'faq.title'),
      intro: assertNonEmptyString(faq.intro, 'faq.intro'),
      items: normalizeFaqItems(faq.items, 'faq.items'),
    },
    footer: {
      title: assertNonEmptyString(footer.title, 'footer.title'),
      note: assertNonEmptyString(footer.note, 'footer.note'),
    },
    sidebar: {
      snapshot_title: assertNonEmptyString(sidebar.snapshot_title, 'sidebar.snapshot_title'),
      snapshot_intro: assertNonEmptyString(sidebar.snapshot_intro, 'sidebar.snapshot_intro'),
      quick_nav_title: assertNonEmptyString(sidebar.quick_nav_title, 'sidebar.quick_nav_title'),
      quick_nav_description: assertNonEmptyString(sidebar.quick_nav_description, 'sidebar.quick_nav_description'),
      actions_title: assertNonEmptyString(sidebar.actions_title, 'sidebar.actions_title'),
      databases_label: assertNonEmptyString(sidebar.databases_label, 'sidebar.databases_label'),
      documentation_label: assertNonEmptyString(sidebar.documentation_label, 'sidebar.documentation_label'),
    },
  };
}

export function loadTechnicalInformationCatalog(): TechnicalInformationPageCatalog {
  return parseTechnicalInformationCatalog(rawTechnicalInformationCatalog);
}

export const TECHNICAL_INFORMATION_CATALOG = loadTechnicalInformationCatalog();
