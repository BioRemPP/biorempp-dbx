/**
 * @packageDocumentation
 *
 * Editorial contracts for the reusable Terms of Use dialog.
 */

/**
 * Supported visual emphasis for terms sections.
 */
export type TermsSectionTone = 'neutral' | 'warning' | 'success' | 'info';

/**
 * Header block for the terms dialog.
 */
export interface TermsHeaderContent {
  /** Modal title. */
  title: string;
  /** Supporting subtitle displayed below the title. */
  subtitle: string;
}

/**
 * Introductory notice shown before the legal/editorial sections.
 */
export interface TermsNoticeContent {
  /** Notice title rendered with emphasis. */
  title: string;
  /** Notice body text. */
  body: string;
}

/**
 * One editorial section inside the terms dialog.
 */
export interface TermsSectionContent {
  /** Stable section identifier. */
  id: string;
  /** Visible section heading. */
  title: string;
  /** Ordered paragraph content. */
  paragraphs?: string[];
  /** Optional bullet points rendered after paragraphs. */
  bullets?: string[];
  /** Optional callout tone for visually emphasized sections. */
  tone?: TermsSectionTone;
}

/**
 * Footer content rendered at the end of the terms dialog.
 */
export interface TermsFooterContent {
  /** Closing paragraph or acknowledgment note. */
  text: string;
  /** Close button label. */
  close_label: string;
}

/**
 * Full editorial catalog for Terms of Use.
 */
export interface TermsCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Dialog header content. */
  header: TermsHeaderContent;
  /** Introductory notice content. */
  notice: TermsNoticeContent;
  /** Ordered editorial/legal sections. */
  sections: TermsSectionContent[];
  /** Footer content and action labels. */
  footer: TermsFooterContent;
}
