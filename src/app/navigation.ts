/**
 * @packageDocumentation
 *
 * Application-level navigation metadata and footer labels consumed by the app shell.
 */
import type { View } from './routes';
import { APP_BRAND, APP_RELEASE } from './config/appMetadata';

/**
 * One primary navigation entry rendered by the app shell.
 */
export interface AppNavigationItem {
  /** Stable identifier used as the React key and semantic navigation id. */
  id: string;
  /** User-facing label shown in the primary navigation bar. */
  label: string;
  /** Top-level view activated when the navigation item is selected. */
  view: View;
}

/**
 * Ordered primary navigation model rendered in the app shell header.
 */
export const APP_PRIMARY_NAV: AppNavigationItem[] = [
  { id: 'user-guide', label: 'User Guide', view: 'user-guide' },
  { id: 'databases', label: 'Databases', view: 'databases' },
  { id: 'technical-information', label: 'Technical Information', view: 'technical-information' },
  { id: 'faq', label: 'FAQ', view: 'faq' },
  { id: 'documentation', label: 'Documentation', view: 'documentation' },
  { id: 'contact', label: 'Contact', view: 'contact' },
];

/**
 * Explorer views reachable from the Browse dropdown in the app shell header.
 */
export const APP_BROWSE_NAV: AppNavigationItem[] = [
  { id: 'compounds', label: 'Compounds', view: 'compounds' },
  { id: 'compound-classes', label: 'Compound Classes', view: 'compound-classes' },
  { id: 'genes', label: 'Genes / KO', view: 'genes' },
  { id: 'pathways', label: 'Pathways', view: 'pathways' },
  { id: 'toxicity', label: 'Toxicity', view: 'toxicity' },
  { id: 'guided-analysis', label: 'Guided Analysis', view: 'guided-analysis' },
];

/**
 * Set of views considered "active" when the Browse dropdown trigger should be highlighted.
 */
export const BROWSE_ACTIVE_VIEWS = new Set<View>(APP_BROWSE_NAV.map((item) => item.view));

/**
 * Brand metadata reused by the app shell header.
 */
export { APP_BRAND };

/**
 * Footer release label derived from the current compiled application metadata.
 */
export const APP_FOOTER_RELEASE_LABEL = `BioRemPP v${APP_RELEASE.version}`;

/**
 * Footer copyright notice shown by the app shell.
 */
export const APP_FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} BioRemPP Development Team`;

/**
 * Public support email shown in the application footer.
 */
export const APP_FOOTER_CONTACT_EMAIL = 'biorempp@gmail.com';
