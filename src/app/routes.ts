/**
 * @packageDocumentation
 *
 * Canonical client-side route contracts and path builders.
 *
 * This module is the single source of truth for top-level views, typed detail routes, legacy path
 * redirects, and base-path-aware path construction used by the application shell.
 */
import { getClientBasePath, stripBasePath, withBasePath } from '../utils/basePath';
import type { DatabaseSchemaId } from '../types/databases';

/**
 * Supported top-level application views that can be addressed directly from navigation.
 */
export type View =
  | 'home'
  | 'scientific-overview'
  | 'user-guide'
  | 'technical-information'
  | 'faq'
  | 'contact'
  | 'documentation'
  | 'databases'
  | 'compounds'
  | 'compound-classes'
  | 'genes'
  | 'pathways'
  | 'toxicity'
  | 'guided-analysis';

/**
 * Parsed route variants used by the app shell to decide which page or detail view to render.
 */
export type Route =
  | { kind: 'view'; view: View }
  | { kind: 'not_found' }
  | { kind: 'databaseSchema'; schemaId: DatabaseSchemaId }
  | { kind: 'compound'; cpd: string }
  | { kind: 'gene'; ko: string }
  | { kind: 'compoundClass'; compoundclass: string }
  | { kind: 'pathway'; pathway: string; source?: string };

/**
 * Canonical relative paths for each top-level application view.
 *
 * @remarks
 * These paths are application-relative. Use {@link resolveAppPath} when a deployment-aware path is
 * required for browser history or rendered links.
 */
export const VIEW_PATHS: Record<View, string> = {
  home: '/',
  'scientific-overview': '/scientific-overview',
  'user-guide': '/user-guide',
  'technical-information': '/technical-information',
  faq: '/faq',
  contact: '/contact',
  documentation: '/documentation',
  databases: '/databases',
  compounds: '/compounds',
  'compound-classes': '/compound-classes',
  genes: '/genes',
  pathways: '/pathways',
  toxicity: '/toxicity',
  'guided-analysis': '/guided-analysis',
};

/**
 * Normalized deployment base path used by client-side routing helpers.
 *
 * @defaultValue The normalized value of `VITE_BIOREMPP_URL_BASE_PATH` or `/`.
 */
export const CLIENT_BASE_PATH = getClientBasePath();

/**
 * Removes trailing slashes from a pathname while preserving `/` as the root route.
 *
 * @param pathname Pathname to normalize.
 * @returns The normalized pathname.
 */
export function normalizePath(pathname: string) {
  const cleaned = pathname.replace(/\/+$/, '');
  return cleaned || '/';
}

/**
 * Parses a browser pathname into a typed application route.
 *
 * @param pathname Browser pathname to resolve.
 * @returns The parsed route descriptor used by the application shell.
 *
 * @remarks
 * Gene and compound identifiers are normalized to uppercase. Legacy `/visualizations` paths are
 * mapped to the guided analysis view. Database schema routes are validated against the known schema
 * identifiers before a typed detail route is returned.
 */
export function parseRoute(pathname: string): Route {
  const path = normalizePath(stripBasePath(pathname, CLIENT_BASE_PATH));

  if (path === '/' || path === '/home') {
    return { kind: 'view', view: 'home' };
  }
  if (path === '/compounds') {
    return { kind: 'view', view: 'compounds' };
  }
  if (path === '/scientific-overview') {
    return { kind: 'view', view: 'scientific-overview' };
  }
  if (path === '/user-guide') {
    return { kind: 'view', view: 'user-guide' };
  }
  if (path === '/technical-information') {
    return { kind: 'view', view: 'technical-information' };
  }
  if (path === '/faq') {
    return { kind: 'view', view: 'faq' };
  }
  if (path === '/contact') {
    return { kind: 'view', view: 'contact' };
  }
  if (path === '/documentation') {
    return { kind: 'view', view: 'documentation' };
  }
  if (path === '/databases' || path === '/database-metrics') {
    return { kind: 'view', view: 'databases' };
  }
  if (path.startsWith('/databases/')) {
    const schemaId = decodeURIComponent(path.slice('/databases/'.length)).trim().toLowerCase();
    if (schemaId === 'biorempp' || schemaId === 'hadeg' || schemaId === 'kegg' || schemaId === 'toxcsm') {
      return { kind: 'databaseSchema', schemaId };
    }
  }
  if (path === '/compound-classes') {
    return { kind: 'view', view: 'compound-classes' };
  }
  if (path === '/genes') {
    return { kind: 'view', view: 'genes' };
  }
  if (path.startsWith('/genes/')) {
    const ko = decodeURIComponent(path.slice('/genes/'.length)).trim();
    if (ko) {
      return { kind: 'gene', ko: ko.toUpperCase() };
    }
  }
  if (path === '/pathways') {
    return { kind: 'view', view: 'pathways' };
  }
  if (path === '/toxicity') {
    return { kind: 'view', view: 'toxicity' };
  }
  if (path === '/visualizations' || path === '/guided-analysis') {
    return { kind: 'view', view: 'guided-analysis' };
  }
  if (path.startsWith('/pathways/detail/')) {
    const remainder = path.slice('/pathways/detail/'.length);
    if (remainder) {
      const segments = remainder.split('/').filter(Boolean);
      if (segments.length >= 2) {
        const source = decodeURIComponent(segments[0]).trim().toUpperCase();
        const pathway = decodeURIComponent(segments.slice(1).join('/')).trim();
        if (pathway) {
          return { kind: 'pathway', pathway, source: source || undefined };
        }
      } else {
        const pathway = decodeURIComponent(segments[0]).trim();
        if (pathway) {
          return { kind: 'pathway', pathway };
        }
      }
    }
  }
  if (path.startsWith('/compound-classes/detail/')) {
    const compoundclass = decodeURIComponent(path.slice('/compound-classes/detail/'.length)).trim();
    if (compoundclass) {
      return { kind: 'compoundClass', compoundclass };
    }
  }
  if (path.startsWith('/compounds/')) {
    const cpd = decodeURIComponent(path.slice('/compounds/'.length)).trim();
    if (cpd) {
      return { kind: 'compound', cpd: cpd.toUpperCase() };
    }
  }

  return { kind: 'not_found' };
}

/**
 * Resolves redirect targets for deprecated client-side paths.
 *
 * @param pathname Browser pathname to inspect.
 * @returns The replacement application path, or `null` when no legacy redirect applies.
 *
 * @remarks
 * The returned value is already resolved under the configured deployment base path.
 */
export function getLegacyRedirectPath(pathname: string) {
  const path = normalizePath(stripBasePath(pathname, CLIENT_BASE_PATH));
  if (path === '/visualizations') {
    return withBasePath('/guided-analysis', CLIENT_BASE_PATH);
  }
  if (path === '/database-metrics') {
    return withBasePath('/databases', CLIENT_BASE_PATH);
  }
  return null;
}

/**
 * Resolves an application-relative path under the configured deployment base path.
 *
 * @param path Application-relative path.
 * @returns The normalized path including the deployment base path when configured.
 */
export function resolveAppPath(path: string) {
  return normalizePath(withBasePath(path, CLIENT_BASE_PATH));
}

/**
 * Returns the canonical relative path for a top-level view.
 *
 * @param view View identifier to resolve.
 * @returns The canonical path registered for the provided view.
 */
export function getViewPath(view: View) {
  return VIEW_PATHS[view];
}

/**
 * Builds the canonical detail path for a compound.
 *
 * @param cpd Compound identifier.
 * @returns The encoded compound detail path.
 */
export function buildCompoundPath(cpd: string) {
  return `/compounds/${encodeURIComponent(cpd)}`;
}

/**
 * Builds the canonical detail path for a database schema.
 *
 * @param schemaId Database schema identifier.
 * @returns The encoded database schema detail path.
 */
export function buildDatabaseSchemaPath(schemaId: DatabaseSchemaId) {
  return `/databases/${encodeURIComponent(schemaId)}`;
}

/**
 * Builds the canonical detail path for a gene.
 *
 * @param ko KO identifier.
 * @returns The encoded gene detail path.
 */
export function buildGenePath(ko: string) {
  return `/genes/${encodeURIComponent(ko)}`;
}

/**
 * Builds the canonical detail path for a compound class.
 *
 * @param compoundclass Compound class label to encode into the route.
 * @returns The encoded compound class detail path.
 */
export function buildCompoundClassPath(compoundclass: string) {
  return `/compound-classes/detail/${encodeURIComponent(compoundclass.trim())}`;
}

/**
 * Builds the canonical detail path for a pathway, optionally scoped to a specific source.
 *
 * @param pathway Pathway name to encode into the route.
 * @param source Optional pathway source. The `ALL` source is omitted from the final path.
 * @returns The encoded pathway detail path.
 *
 * @remarks
 * Source values are normalized to uppercase before encoding so route generation stays consistent
 * with the route parser and source-aware pathway views.
 */
export function buildPathwayPath(pathway: string, source?: string) {
  const encodedPathway = encodeURIComponent(pathway.trim());
  const normalizedSource = source?.trim().toUpperCase();
  if (normalizedSource && normalizedSource !== 'ALL') {
    return `/pathways/detail/${encodeURIComponent(normalizedSource)}/${encodedPathway}`;
  }
  return `/pathways/detail/${encodedPathway}`;
}

/**
 * Resolves which top-level view should be highlighted for a parsed route.
 *
 * @param route Parsed route descriptor.
 * @returns The owning top-level view for the route.
 *
 * @remarks
 * Detail routes are mapped back to their explorer parent so the application shell can keep the
 * correct primary navigation item highlighted.
 */
export function getActiveView(route: Route): View {
  if (route.kind === 'view') {
    return route.view;
  }
  if (route.kind === 'databaseSchema') {
    return 'databases';
  }
  if (route.kind === 'compound') {
    return 'compounds';
  }
  if (route.kind === 'gene') {
    return 'genes';
  }
  if (route.kind === 'compoundClass') {
    return 'compound-classes';
  }
  if (route.kind === 'not_found') {
    return 'home';
  }
  return 'pathways';
}
