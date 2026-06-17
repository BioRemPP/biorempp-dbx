/**
 * @packageDocumentation
 *
 * Editorial contracts for the home page and its guided-analysis, download, and snapshot sections.
 */
import type { View } from '../app/routes';

/**
 * Explorer views that can be launched directly from the home page browse section.
 */
export type HomeBrowseViewId = Extract<
  View,
  'compounds' | 'compound-classes' | 'genes' | 'pathways' | 'toxicity' | 'guided-analysis'
>;

/**
 * Supported CTA identifiers for the home page hero.
 */
export type HomeHeroCtaId = 'launch-analysis' | 'how-to-cite' | 'terms-of-use';

/**
 * One call-to-action button displayed in the home page hero.
 */
export interface HomeHeroCtaButton {
  /** Stable action identifier used by the page logic. */
  id: HomeHeroCtaId;
  /** User-facing button label. */
  label: string;
  /** Shared button variant used for styling the CTA. */
  variant: 'default' | 'secondary' | 'warning' | 'success';
}

/**
 * Modal body content opened from a hero CTA.
 */
export interface HomeHeroModalContent {
  /** Modal title. */
  title: string;
  /** Short description shown below the title. */
  description: string;
  /** Ordered paragraphs rendered in the modal body. */
  paragraphs: string[];
}

/**
 * Collection of modal payloads available from the hero section.
 */
export interface HomeHeroModals {
  /** Citation guidance modal content. */
  how_to_cite: HomeHeroModalContent;
}

/**
 * Content model for the home page hero section.
 */
export interface HomeHeroContent {
  /** Main hero title. */
  title: string;
  /** Secondary hero subtitle. */
  subtitle: string;
  /** Ordered descriptive paragraphs shown in the hero body. */
  description: string[];
  /** Access statement shown near the hero actions. */
  access_statement: string;
  /** Notice lines rendered as additional callouts or disclaimers. */
  notice_lines: string[];
  /** CTA buttons rendered in the hero action area. */
  cta_buttons: HomeHeroCtaButton[];
  /** Modal content referenced by the CTA identifiers. */
  modals: HomeHeroModals;
}

/**
 * Generic section with title and paragraph content.
 */
export interface HomeSectionTextBlock {
  /** Optional eyebrow label displayed above the heading. */
  eyebrow?: string;
  /** Section title. */
  title: string;
  /** Ordered paragraphs rendered for the section body. */
  content: string[];
}

/**
 * Generic section that renders a bullet list and optional footer note.
 */
export interface HomeBulletSection {
  /** Optional eyebrow label displayed above the heading. */
  eyebrow?: string;
  /** Section title. */
  title: string;
  /** Bullet items rendered in order. */
  items: string[];
  /** Optional closing note rendered after the list. */
  footer?: string;
}

/**
 * One browse shortcut shown on the home page.
 */
export interface HomeBrowseItem {
  /** Target view id used for navigation. */
  id: HomeBrowseViewId;
  /** User-facing card label. */
  label: string;
  /** Short explanation of what the view provides. */
  description: string;
}

/**
 * Browse section content linking the user to core explorer views.
 */
export interface HomeBrowseSection {
  /** Optional eyebrow label displayed above the heading. */
  eyebrow?: string;
  /** Section title. */
  title: string;
  /** Introductory description for the browse cards. */
  description: string;
  /** Browse cards rendered in the section. */
  items: HomeBrowseItem[];
}

/**
 * One panel group used inside the guided-analysis home teaser.
 */
export interface HomePanelGroup {
  /** Group title. */
  title: string;
  /** Bullet points summarizing the group content. */
  bullets: string[];
}

/**
 * Guided-analysis teaser content displayed on the home page.
 */
export interface HomeGuidedAnalysisSection {
  /** Optional eyebrow label displayed above the heading. */
  eyebrow?: string;
  /** Section title. */
  title: string;
  /** Ordered paragraphs introducing the workflow. */
  description: string[];
  /** Label for the CTA that opens guided analysis. */
  cta_label: string;
  /** Supporting panel groups shown alongside the description. */
  panels: HomePanelGroup[];
  /** Scope disclaimer clarifying the workflow boundaries. */
  scope_note: string;
}

/**
 * Download section content and labels shown on the home page.
 */
export interface HomeDownloadsSection {
  /** Optional eyebrow label displayed above the heading. */
  eyebrow?: string;
  /** Section title. */
  title: string;
  /** Ordered paragraphs introducing the download section. */
  description: string[];
  /** Title for the primary download card. */
  primary_title: string;
  /** Description for the primary download card. */
  primary_description: string;
  /** Title shown above the releases accordion. */
  accordion_title: string;
  /** Description shown before the accordion list. */
  accordion_description: string;
  /** Title for the disclaimer block. */
  disclaimer_title: string;
  /** Disclaimer paragraphs rendered below the releases. */
  disclaimer_paragraphs: string[];
  /** Prefix used when highlighting the currently selected release. */
  selected_release_prefix: string;
  /** Label shown when expanding a release group. */
  open_release_label: string;
  /** Label shown when collapsing a release group. */
  close_label: string;
}

/**
 * Snapshot section content linking the home page to schema metrics.
 */
export interface HomeSnapshotSection {
  /** Optional eyebrow label displayed above the heading. */
  eyebrow?: string;
  /** Section title. */
  title: string;
  /** Summary of the database snapshot section. */
  description: string;
  /** CTA label used to open the snapshot page. */
  action_label: string;
}

/**
 * Footer copy rendered at the bottom of the home page.
 */
export interface HomeFooterContent {
  /** Footer paragraph or rich text content string. */
  content: string;
}

/**
 * Full editorial catalog consumed by the home page loaders.
 */
export interface HomeEditorialCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Hero section content. */
  hero: HomeHeroContent;
  /** Scientific overview content block. */
  scientific_overview: HomeSectionTextBlock;
  /** Data sources bullet section. */
  data_sources: HomeBulletSection;
  /** Target audience bullet section. */
  target_users: HomeBulletSection;
  /** Browse section linking to explorer views. */
  browse_section: HomeBrowseSection;
  /** Guided-analysis teaser content. */
  guided_analysis: HomeGuidedAnalysisSection;
  /** Home page download section content. */
  downloads: HomeDownloadsSection;
  /** Database snapshot teaser section. */
  snapshot: HomeSnapshotSection;
  /** Footer copy block. */
  footer: HomeFooterContent;
}
