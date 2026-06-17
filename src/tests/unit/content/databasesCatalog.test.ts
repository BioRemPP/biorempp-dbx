import { describe, expect, it } from 'vitest';
import {
  DATABASE_SCHEMA_CATALOGS,
  DATABASE_SCHEMAS_INDEX_CATALOG,
  getDatabaseSchemaCatalog,
} from '@/content/databases/catalog';

describe('databases catalog', () => {
  it('loads the shipped index catalog and all schema detail catalogs', () => {
    expect(DATABASE_SCHEMAS_INDEX_CATALOG.title).toBe('Database Schemas');
    expect(DATABASE_SCHEMAS_INDEX_CATALOG.databases.map((database) => database.id)).toEqual([
      'biorempp',
      'hadeg',
      'kegg',
      'toxcsm',
    ]);
    expect(Object.keys(DATABASE_SCHEMA_CATALOGS)).toEqual(['biorempp', 'hadeg', 'kegg', 'toxcsm']);
    expect(getDatabaseSchemaCatalog('biorempp').columns).toHaveLength(11);
    expect(getDatabaseSchemaCatalog('hadeg').columns).toHaveLength(4);
    expect(getDatabaseSchemaCatalog('kegg').columns).toHaveLength(3);
    expect(getDatabaseSchemaCatalog('toxcsm').columns).toHaveLength(4);
  });

  it('normalizes migrated editorial text for shipped schema sources', () => {
    const biorempp = getDatabaseSchemaCatalog('biorempp');
    const hadeg = getDatabaseSchemaCatalog('hadeg');
    const kegg = getDatabaseSchemaCatalog('kegg');

    expect(biorempp.version).toBe('1.1.0');
    expect(biorempp.schema_definition.rows).toBe(123762);
    expect(biorempp.schema_definition.columns).toBe(11);
    expect(biorempp.schema_definition.completeness).toBe(
      'Core identifiers are fully populated; unresolved EC and reaction enrichments are preserved as `NA` sentinels.'
    );
    expect(biorempp.columns.map((column) => column.name)).toEqual([
      'cpd',
      'compoundclass',
      'ko',
      'ec',
      'reaction',
      'reaction_description',
      'referenceAG',
      'compoundname',
      'genesymbol',
      'genename',
      'enzyme_activity',
    ]);
    expect(biorempp.columns.find((column) => column.name === 'reaction_description')?.nullable).toBe(true);
    expect(biorempp.usage_examples.r).toContain('dim(db)  # [1] 123762     11');
    expect(
      biorempp.constraints.cardinality_relationships?.[0]?.example
    ).toBe('Ammonia (C00014) -> 334 unique KO groups');
    expect(
      DATABASE_SCHEMAS_INDEX_CATALOG.databases.find((database) => database.id === 'biorempp')
    ).toMatchObject({
      rows: 123762,
      columns: 11,
      file: 'biorempp_database_v1.1.0.csv',
      route: '/databases/biorempp',
    });

    expect(hadeg.schema_definition.completeness).toBe('100% - Zero missing values across all fields');
    expect(hadeg.constraints.cardinality_relationships?.[0]?.example).toBe('alkB -> 5 different pathways');

    expect(kegg.data_quality.source).toBe(
      'KEGG Pathway Database - Metabolism -> Xenobiotics biodegradation and metabolism'
    );
  });
});
