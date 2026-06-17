import { parse as parseYaml } from 'yaml';
import { assertNonEmptyString, assertObject, assertOptionalString } from '../shared/guards';
import rawDocumentationCatalog from '../editorial/pages/documentation.page.yaml?raw';
import type {
  DocumentationFrameworkBullet,
  DocumentationIconToken,
  DocumentationPageCatalog,
  DocumentationResourceCard,
} from '../../types/documentation';

const VALID_ICON_TOKENS = new Set<DocumentationIconToken>(['book', 'info', 'server']);

function assertValidIconToken(value: unknown, path: string): DocumentationIconToken {
  const icon = assertNonEmptyString(value, path) as DocumentationIconToken;
  if (!VALID_ICON_TOKENS.has(icon)) {
    throw new Error(`Invalid documentation config at ${path}: expected one of ${[...VALID_ICON_TOKENS].join('|')}`);
  }
  return icon;
}

function assertValidUrl(value: unknown, path: string): string {
  const url = assertNonEmptyString(value, path);
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error('unsupported protocol');
    }
  } catch {
    throw new Error(`Invalid documentation config at ${path}: invalid URL`);
  }
  return url;
}

function normalizeFrameworkBullet(rawBullet: unknown, path: string): DocumentationFrameworkBullet {
  const bullet = assertObject(rawBullet, path);
  const url = bullet.url == null ? undefined : assertValidUrl(bullet.url, `${path}.url`);
  const urlLabel = bullet.url_label == null ? undefined : assertNonEmptyString(bullet.url_label, `${path}.url_label`);

  if ((url && !urlLabel) || (!url && urlLabel)) {
    throw new Error(`Invalid documentation config at ${path}: url and url_label must be provided together`);
  }

  return {
    id: assertNonEmptyString(bullet.id, `${path}.id`),
    label: assertNonEmptyString(bullet.label, `${path}.label`),
    description: assertNonEmptyString(bullet.description, `${path}.description`),
    url,
    url_label: urlLabel,
  };
}

function normalizeResourceCard(rawValue: unknown, path: string): DocumentationResourceCard {
  const card = assertObject(rawValue, path);
  return {
    title: assertNonEmptyString(card.title, `${path}.title`),
    description: assertNonEmptyString(card.description, `${path}.description`),
    button_label: assertNonEmptyString(card.button_label, `${path}.button_label`),
    url: assertValidUrl(card.url, `${path}.url`),
    icon: assertValidIconToken(card.icon, `${path}.icon`),
    image_src: assertOptionalString(card.image_src, `${path}.image_src`),
  };
}

export function parseDocumentationCatalog(rawYaml: string): DocumentationPageCatalog {
  let parsed: unknown;
  try {
    parsed = parseYaml(rawYaml);
  } catch (error) {
    throw new Error(
      `Invalid documentation config YAML syntax: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid documentation config: root must be an object');
  }

  const root = parsed as Record<string, unknown>;
  const framework = assertObject(root.framework, 'framework');
  const bullets = framework.bullets;
  if (!Array.isArray(bullets) || bullets.length === 0) {
    throw new Error('Invalid documentation config at framework.bullets: expected non-empty array');
  }

  const normalizedBullets = bullets.map((bullet, index) => normalizeFrameworkBullet(bullet, `framework.bullets[${index}]`));
  const bulletIds = new Set<string>();
  for (const bullet of normalizedBullets) {
    if (bulletIds.has(bullet.id)) {
      throw new Error(`Invalid documentation config at framework.bullets: duplicated id "${bullet.id}"`);
    }
    bulletIds.add(bullet.id);
  }

  return {
    version: assertNonEmptyString(root.version, 'version'),
    language: assertNonEmptyString(root.language, 'language'),
    title: assertNonEmptyString(root.title, 'title'),
    subtitle: assertNonEmptyString(root.subtitle, 'subtitle'),
    icon: assertValidIconToken(root.icon, 'icon'),
    framework: {
      title: assertNonEmptyString(framework.title, 'framework.title'),
      intro: assertNonEmptyString(framework.intro, 'framework.intro'),
      bullets: normalizedBullets,
      closing: assertNonEmptyString(framework.closing, 'framework.closing'),
    },
    resources_title: assertNonEmptyString(root.resources_title, 'resources_title'),
    resource_card: normalizeResourceCard(root.resource_card, 'resource_card'),
  };
}

export function loadDocumentationCatalog(): DocumentationPageCatalog {
  return parseDocumentationCatalog(rawDocumentationCatalog);
}

export const DOCUMENTATION_CATALOG = loadDocumentationCatalog();
