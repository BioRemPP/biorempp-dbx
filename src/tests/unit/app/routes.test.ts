import { describe, expect, it } from 'vitest';
import {
  buildCompoundClassPath,
  buildCompoundPath,
  buildDatabaseSchemaPath,
  buildGenePath,
  buildPathwayPath,
  getActiveView,
  getLegacyRedirectPath,
  getViewPath,
  parseRoute,
} from '../../../app/routes';

describe('app routes', () => {
  it('parses primary views and detail routes', () => {
    expect(parseRoute('/')).toEqual({ kind: 'view', view: 'home' });
    expect(parseRoute('/scientific-overview')).toEqual({ kind: 'view', view: 'scientific-overview' });
    expect(parseRoute('/user-guide')).toEqual({ kind: 'view', view: 'user-guide' });
    expect(parseRoute('/technical-information')).toEqual({ kind: 'view', view: 'technical-information' });
    expect(parseRoute('/faq')).toEqual({ kind: 'view', view: 'faq' });
    expect(parseRoute('/documentation')).toEqual({ kind: 'view', view: 'documentation' });
    expect(parseRoute('/databases')).toEqual({ kind: 'view', view: 'databases' });
    expect(parseRoute('/database-metrics')).toEqual({ kind: 'view', view: 'databases' });
    expect(parseRoute('/databases/hadeg')).toEqual({ kind: 'databaseSchema', schemaId: 'hadeg' });
    expect(parseRoute('/compounds/C00014')).toEqual({ kind: 'compound', cpd: 'C00014' });
    expect(parseRoute('/genes/k00001')).toEqual({ kind: 'gene', ko: 'K00001' });
    expect(parseRoute('/compound-classes/detail/Aromatic')).toEqual({
      kind: 'compoundClass',
      compoundclass: 'Aromatic',
    });
    expect(parseRoute('/pathways/detail/KEGG/Benzoate%20degradation')).toEqual({
      kind: 'pathway',
      pathway: 'Benzoate degradation',
      source: 'KEGG',
    });
  });

  it('keeps the legacy guided-analysis alias and path builders stable', () => {
    expect(parseRoute('/visualizations')).toEqual({ kind: 'view', view: 'guided-analysis' });
    expect(getLegacyRedirectPath('/visualizations')).toBe('/guided-analysis');
    expect(getLegacyRedirectPath('/database-metrics')).toBe('/databases');
    expect(getActiveView(parseRoute('/databases/hadeg'))).toBe('databases');
    expect(getActiveView(parseRoute('/scientific-overview'))).toBe('scientific-overview');
    expect(getActiveView(parseRoute('/documentation'))).toBe('documentation');
    expect(getActiveView(parseRoute('/technical-information'))).toBe('technical-information');
    expect(getViewPath('documentation')).toBe('/documentation');
    expect(getViewPath('scientific-overview')).toBe('/scientific-overview');
    expect(getViewPath('technical-information')).toBe('/technical-information');
    expect(getViewPath('databases')).toBe('/databases');
    expect(getViewPath('user-guide')).toBe('/user-guide');
    expect(buildCompoundPath('C00014')).toBe('/compounds/C00014');
    expect(buildDatabaseSchemaPath('hadeg')).toBe('/databases/hadeg');
    expect(buildGenePath('K00001')).toBe('/genes/K00001');
    expect(buildCompoundClassPath('Aromatic')).toBe('/compound-classes/detail/Aromatic');
    expect(buildPathwayPath('Benzoate degradation', 'KEGG')).toBe('/pathways/detail/KEGG/Benzoate%20degradation');
    expect(buildPathwayPath('Benzoate degradation', 'ALL')).toBe('/pathways/detail/Benzoate%20degradation');
  });
});
