/**
 * @packageDocumentation
 *
 * Editorial contracts for the FAQ page, including sections, notes, and optional code examples.
 */
import type { View } from '@/app/routes';

/**
 * Supported semantic styles for FAQ note callouts.
 */
export type FaqNoteType = 'info' | 'warning' | 'success';

interface FaqBaseLink {
  /** User-facing link label. */
  label: string;
}

/**
 * Internal application link resolved through the typed route layer.
 */
export interface FaqInternalLink extends FaqBaseLink {
  /** Application view opened through the shared navigation callback. */
  view: View;
  /** External URLs are not allowed on internal links. */
  url?: never;
}

/**
 * External link attached to an FAQ answer.
 */
export interface FaqExternalLink extends FaqBaseLink {
  /** Absolute destination URL opened from the answer body. */
  url: string;
  /** Internal application routes are expressed through `view`. */
  view?: never;
}

/**
 * Supported link payload rendered by the FAQ page.
 */
export type FaqLink = FaqInternalLink | FaqExternalLink;

/**
 * Optional note block rendered alongside an FAQ answer.
 */
export interface FaqNote {
  /** Visual severity token used by the note component. */
  type: FaqNoteType;
  /** Short explanatory text shown inside the callout. */
  text: string;
}

/**
 * One FAQ entry rendered in a section accordion.
 */
export interface FaqItem {
  /** Stable identifier used for anchors, filtering, and keyed rendering. */
  id: string;
  /** Question shown in the accordion trigger. */
  question: string;
  /** Main answer body for the question. */
  answer: string;
  /** Optional bullet list appended to the answer body. */
  bullets?: string[];
  /** Optional note callout highlighting a caveat or tip. */
  note?: FaqNote;
  /** Optional supporting links associated with the answer. */
  links?: FaqLink[];
  /** Optional code snippet rendered in a preformatted block. */
  code_example?: string;
  /** Optional search and grouping tags for the item. */
  tags?: string[];
}

/**
 * Logical FAQ section grouping related items.
 */
export interface FaqSection {
  /** Stable identifier used for jump navigation. */
  id: string;
  /** Section title shown in the page layout. */
  title: string;
  /** Optional supporting sentence shown below the section title. */
  description?: string;
  /** FAQ items contained in the section. */
  items: FaqItem[];
}

/**
 * Full FAQ catalog consumed by the FAQ page loader.
 */
export interface FaqCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Language code for the loaded FAQ content. */
  language: string;
  /** Main page title. */
  title: string;
  /** Introductory paragraph shown above the FAQ sections. */
  intro: string;
  /** Shortcut actions rendered in the page header. */
  header_actions: FaqLink[];
  /** Ordered FAQ sections rendered on the page. */
  sections: FaqSection[];
}
