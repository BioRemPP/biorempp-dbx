/**
 * @packageDocumentation
 *
 * Editorial contracts for the user guide page, including navigation, workflow, and category sections.
 */
import type { View } from '../app/routes';

/**
 * Supported user guide category identifiers.
 */
export type UserGuideCategoryId =
  | 'compounds'
  | 'compound-classes'
  | 'genes'
  | 'pathways'
  | 'toxicity'
  | 'guided-analysis';

/**
 * Application views that can be launched from user guide category CTAs.
 */
export type UserGuideTargetView = Extract<View, UserGuideCategoryId>;

/**
 * Workflow summary displayed near the top of the user guide page.
 */
export interface UserGuideWorkflowSection {
  /** Workflow section title. */
  title: string;
  /** Ordered steps guiding the user through the platform. */
  steps: string[];
}

/**
 * Quick-navigation introduction for the user guide anchor list.
 */
export interface UserGuideQuickNavSection {
  /** Heading for the quick navigation block. */
  title: string;
  /** Description explaining how to use the quick links. */
  description: string;
}

/**
 * One explorer or workflow category described in the user guide.
 */
export interface UserGuideCategorySection {
  /** Stable category id used for anchors and navigation targets. */
  id: UserGuideCategoryId;
  /** User-facing category label. */
  label: string;
  /** Eyebrow label displayed above the section heading. */
  eyebrow: string;
  /** Short summary of the category. */
  summary: string;
  /** Capabilities highlighted for the category. */
  capabilities: string[];
  /** Filters the user can expect to work with. */
  filters: string[];
  /** Outputs or result types exposed by the view. */
  outputs: string[];
  /** Recommended use cases for the category. */
  when_to_use: string[];
  /** Label for the CTA that opens the category view. */
  cta_label: string;
  /** Application view opened when the CTA is triggered. */
  target_view: UserGuideTargetView;
}

/**
 * Full editorial catalog consumed by the user guide page loader.
 */
export interface UserGuideCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Main page title. */
  page_title: string;
  /** Supporting subtitle shown below the title. */
  page_subtitle: string;
  /** Introductory paragraphs shown before the workflow section. */
  intro_paragraphs: string[];
  /** Access note clarifying how to reach the documented areas. */
  access_note: string;
  /** Workflow summary section. */
  workflow: UserGuideWorkflowSection;
  /** Quick navigation header content. */
  quick_nav: UserGuideQuickNavSection;
  /** Ordered guide sections for the supported views. */
  categories: UserGuideCategorySection[];
  /** Closing note rendered at the end of the page. */
  closing_note: string;
}
