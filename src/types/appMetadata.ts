/**
 * @packageDocumentation
 *
 * Shared branding and release metadata contracts used by the application shell and document head.
 */

/**
 * Supported release channels displayed in the UI metadata.
 */
export type AppReleaseStage = 'alpha' | 'beta' | 'rc' | 'stable';

/**
 * Brand labels rendered in the application shell and supporting metadata surfaces.
 */
export interface AppBrandMetadata {
  /** Full product name used in prominent headings and titles. */
  title: string;
  /** Short brand label used in compact navigation contexts. */
  shortTitle: string;
  /** Supplemental tagline displayed alongside the brand title. */
  subtitle: string;
}

/**
 * Release metadata shown to the user for the current build.
 */
export interface AppReleaseMetadata {
  /** Lifecycle stage associated with the current release. */
  stage: AppReleaseStage;
  /** Human-readable version identifier for the deployed build. */
  version: string;
}

/**
 * Top-level metadata bundle consumed by app branding helpers.
 */
export interface AppMetadata {
  /** Brand labels and tagline copy. */
  brand: AppBrandMetadata;
  /** Version and release stage for the current build. */
  release: AppReleaseMetadata;
}
