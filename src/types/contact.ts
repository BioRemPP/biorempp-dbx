/**
 * @packageDocumentation
 *
 * Editorial contracts for the contact page, including laboratory, team, and social sections.
 */

/**
 * Supported icon tokens for contact and social links.
 */
export type ContactSocialIcon = 'github' | 'linkedin' | 'instagram' | 'email';

/**
 * Link metadata rendered in the contact page social section.
 */
export interface ContactLinkItem {
  /** Stable identifier used as the React key for the link item. */
  id: string;
  /** User-facing label for the destination. */
  label: string;
  /** Absolute URL or mailto target opened from the contact page. */
  url: string;
  /** Icon token mapped to the shared contact icon set. */
  icon: ContactSocialIcon;
}

/**
 * Laboratory profile content displayed near the top of the contact page.
 */
export interface ContactLabSection {
  /** Section heading shown above the lab card. */
  section_title: string;
  /** Card title used inside the lab section body. */
  card_title: string;
  /** Laboratory or institution name. */
  name: string;
  /** Ordered paragraphs describing the laboratory context. */
  paragraphs: string[];
  /** Asset lookup key for the laboratory logo. */
  logo_image_key: string;
}

/**
 * Team member card content shown in the contact page roster.
 */
export interface ContactTeamMember {
  /** Stable identifier for keyed rendering and anchor linking. */
  id: string;
  /** Display name for the team member. */
  name: string;
  /** Primary role or function shown with the member profile. */
  role: string;
  /** Short biographical or responsibility summary. */
  description: string;
  /** Asset lookup key for the member portrait. */
  image_key: string;
  /** Optional secondary information such as affiliation or contact note. */
  additional_info?: string;
  /** Optional badge label used to highlight a role or status. */
  badge_text?: string;
}

/**
 * Contact page section containing the team roster.
 */
export interface ContactTeamSection {
  /** Section heading displayed above the roster. */
  section_title: string;
  /** Ordered team members rendered in the section. */
  members: ContactTeamMember[];
}

/**
 * Contact page section used for direct outreach and social links.
 */
export interface ContactGetInTouchSection {
  /** Section heading for the outreach area. */
  section_title: string;
  /** Introductory copy shown before the contact methods. */
  intro: string;
  /** Primary contact email shown to the user. */
  email: string;
  /** Heading for the social links subsection. */
  social_title: string;
  /** Social and external links available in the section. */
  social_links: ContactLinkItem[];
}

/**
 * Full editorial catalog consumed by the contact page loader.
 */
export interface ContactPageCatalog {
  /** Catalog schema or content version. */
  version: string;
  /** Language code for the loaded editorial content. */
  language: string;
  /** Main page title. */
  page_title: string;
  /** Supporting subtitle displayed below the title. */
  page_subtitle: string;
  /** Laboratory section content. */
  laboratory: ContactLabSection;
  /** Team roster section content. */
  team: ContactTeamSection;
  /** Outreach and social section content. */
  get_in_touch: ContactGetInTouchSection;
}
