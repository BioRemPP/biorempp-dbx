/**
 * @packageDocumentation
 *
 * Loader and validator for the public downloads catalog used by home-page release cards.
 */
import { parse as parseYaml } from 'yaml';
import { assertNonEmptyString } from '../shared/guards';
import rawCatalog from '../editorial/downloads/downloads.zenodo.yaml?raw';
import type { ExternalDownloadCatalog, ExternalDownloadItem } from '../../types/frontConfig';

/**
 * Normalizes one raw download catalog entry into the runtime contract used by the UI.
 *
 * @param rawItem Raw YAML item value.
 * @param index Zero-based item index used to build validation errors.
 * @returns A validated download item.
 * @throws Error When the item is not an object or required fields are missing.
 */
function normalizeDownloadItem(rawItem: unknown, index: number): ExternalDownloadItem {
  if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) {
    throw new Error(`Invalid downloads config at items[${index}]: expected object`);
  }
  const item = rawItem as Record<string, unknown>;
  return {
    id: assertNonEmptyString(item.id, `items[${index}].id`),
    label: assertNonEmptyString(item.label, `items[${index}].label`),
    format: assertNonEmptyString(item.format, `items[${index}].format`),
    url: assertNonEmptyString(item.url, `items[${index}].url`),
    version: assertNonEmptyString(item.version, `items[${index}].version`),
    size: typeof item.size === 'string' ? item.size.trim() : undefined,
    updated_at: typeof item.updated_at === 'string' ? item.updated_at.trim() : undefined,
    source: assertNonEmptyString(item.source, `items[${index}].source`),
  };
}

/**
 * Parses and validates the public downloads YAML catalog.
 *
 * @param rawYaml Raw YAML source loaded from the editorial downloads file.
 * @returns A normalized download catalog ready for runtime use.
 * @throws Error When the YAML root or any required item fields fail validation.
 */
export function parseDownloadCatalog(rawYaml: string): ExternalDownloadCatalog {
  const raw = parseYaml(rawYaml);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Invalid downloads config: root must be an object');
  }
  const root = raw as Record<string, unknown>;
  const items = root.items;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid downloads config: items must be a non-empty array');
  }

  return {
    version: assertNonEmptyString(root.version, 'version'),
    title: assertNonEmptyString(root.title, 'title'),
    note: typeof root.note === 'string' ? root.note.trim() : undefined,
    items: items.map((item, index) => normalizeDownloadItem(item, index)),
  };
}

/**
 * Loads the bundled downloads catalog from the raw editorial YAML asset.
 *
 * @returns The validated public downloads catalog.
 */
export function loadDownloadCatalog(): ExternalDownloadCatalog {
  return parseDownloadCatalog(rawCatalog);
}

/**
 * Public download catalog consumed by home-page release cards and dialogs.
 */
export const DOWNLOAD_CATALOG = loadDownloadCatalog();
