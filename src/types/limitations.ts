/**
 * @packageDocumentation
 *
 * Editorial contracts for the Scope and Limitations summary card on the home page and
 * its detailed interpretation modal for the BioRemPP DBX Service.
 */

/**
 * Shared tone scale used across summary cards, quick facts, and topic cards.
 */
export type LimitationsTone = 'neutral' | 'warning' | 'success' | 'info';

/**
 * Compact signal card used in the home teaser and modal quick-facts grid.
 */
export interface LimitationsSignalCard {
  /** Stable identifier used for validation and rendering keys. */
  id: string;
  /** Concise card title. */
  title: string;
  /** Short explanatory body. */
  body: string;
  /** Visual emphasis tone. */
  tone: LimitationsTone;
}

/**
 * Home-page summary payload for the limitations block.
 */
export interface LimitationsHomeComponent {
  /** Optional eyebrow label displayed above the title. */
  eyebrow?: string;
  /** Teaser title. */
  title: string;
  /** Short subtitle summarizing the interpretation domain. */
  subtitle: string;
  /** Single-paragraph introduction rendered above the summary cards. */
  intro: string;
  /** Ordered summary cards that surface the three key reading signals. */
  summary_cards: LimitationsSignalCard[];
  /** CTA label used to open the detailed modal. */
  cta_label: string;
}

/**
 * Header block for the detailed limitations modal.
 */
export interface LimitationsModalHeader {
  /** Modal title. */
  title: string;
  /** Supporting subtitle displayed below the title. */
  subtitle: string;
  /** Initial notice or framing callout rendered under the header. */
  notice: string;
}

/**
 * One informational card rendered inside a detailed limitations topic.
 */
export interface LimitationsTopicCard {
  /** Card title. */
  title: string;
  /** Card body text. */
  body: string;
  /** Visual emphasis tone. */
  tone: LimitationsTone;
}

/**
 * Side-by-side comparison block used by selected limitations topics.
 */
export interface LimitationsTopicComparison {
  /** Left-column label. */
  left_label: string;
  /** Bullets shown in the left column. */
  left_items: string[];
  /** Right-column label. */
  right_label: string;
  /** Bullets shown in the right column. */
  right_items: string[];
}

/**
 * One incorrect/correct example triplet used to avoid common misinterpretations.
 */
export interface LimitationsTopicExample {
  /** Example of incorrect phrasing or reasoning. */
  incorrect: string;
  /** Safer interpretation that remains aligned with the dataset. */
  correct: string;
  /** Why the corrected framing is preferred. */
  rationale: string;
}

/**
 * One accordion topic inside the detailed limitations modal.
 */
export interface LimitationsModalTopic {
  /** Stable identifier validated against the fixed topic order. */
  id: string;
  /** Topic title shown in the accordion trigger. */
  title: string;
  /** Short topic summary rendered near the title. */
  summary: string;
  /** Ordered informational cards shown when the topic is expanded. */
  cards: LimitationsTopicCard[];
  /** Optional side-by-side comparison for representation boundaries. */
  comparison?: LimitationsTopicComparison;
  /** Optional incorrect/correct/rationale examples. */
  examples?: LimitationsTopicExample[];
}

/**
 * Footer content rendered at the bottom of the limitations modal.
 */
export interface LimitationsModalFooter {
  /** Closing note or reminder shown above the footer action. */
  text: string;
  /** CTA label for the terms-related action. */
  terms_cta_label: string;
}

/**
 * Full body content for the limitations modal dialog.
 */
export interface LimitationsModalContent {
  /** Modal header content. */
  header: LimitationsModalHeader;
  /** Compact quick-fact cards rendered before the accordion topics. */
  quick_facts: LimitationsSignalCard[];
  /** Ordered topic list rendered in the accordion. */
  topics: LimitationsModalTopic[];
  /** Footer content and CTA labels. */
  footer: LimitationsModalFooter;
}

/**
 * Full editorial catalog consumed by the limitations loaders.
 */
export interface LimitationsEditorialCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Compact home page limitations teaser. */
  home_component: LimitationsHomeComponent;
  /** Detailed modal content. */
  modal: LimitationsModalContent;
}
