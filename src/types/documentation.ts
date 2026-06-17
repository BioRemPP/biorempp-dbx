/**
 * @packageDocumentation
 *
 * Editorial contracts for the documentation landing page and supporting resource cards.
 */

/**
 * Icon tokens supported by the documentation editorial content.
 */
export type DocumentationIconToken = 'book' | 'info' | 'server';

/**
 * One bullet item inside the framework summary section.
 */
export interface DocumentationFrameworkBullet {
  /** Stable identifier used as the keyed item id. */
  id: string;
  /** Short label rendered as the bullet heading. */
  label: string;
  /** Supporting description for the framework item. */
  description: string;
  /** Optional external URL associated with the bullet. */
  url?: string;
  /** Optional link label rendered for the external URL. */
  url_label?: string;
}

/**
 * Documentation framework section shown on the overview page.
 */
export interface DocumentationFrameworkSection {
  /** Section title. */
  title: string;
  /** Introductory paragraph for the framework section. */
  intro: string;
  /** Ordered framework bullets presented in the section. */
  bullets: DocumentationFrameworkBullet[];
  /** Closing summary shown after the bullet list. */
  closing: string;
}

/**
 * Callout card linking to a primary documentation resource.
 */
export interface DocumentationResourceCard {
  /** Card title. */
  title: string;
  /** Card description explaining the resource. */
  description: string;
  /** CTA label rendered on the card button. */
  button_label: string;
  /** Destination URL for the resource. */
  url: string;
  /** Icon token rendered with the card. */
  icon: DocumentationIconToken;
  /** Optional illustration or screenshot URL. */
  image_src?: string;
}

/**
 * Full editorial catalog consumed by the documentation landing page.
 */
export interface DocumentationPageCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Language code for the documentation content. */
  language: string;
  /** Main page title. */
  title: string;
  /** Supporting subtitle shown below the title. */
  subtitle: string;
  /** Icon token shown in the page hero. */
  icon: DocumentationIconToken;
  /** Framework explanation section. */
  framework: DocumentationFrameworkSection;
  /** Heading shown above the resource card section. */
  resources_title: string;
  /** Primary highlighted resource card. */
  resource_card: DocumentationResourceCard;
}
