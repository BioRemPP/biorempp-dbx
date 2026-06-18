import { describe, expect, it } from 'vitest';
import { DOCUMENTATION_CATALOG, parseDocumentationCatalog } from '@/content/documentation/catalog';

const VALID_DOCUMENTATION_YAML = `
version: v1
language: en
title: Documentation
subtitle: Test subtitle
icon: book
framework:
  title: About
  intro: Intro
  bullets:
    - id: database
      label: Database
      description: Database description
    - id: web-service
      label: Web Service
      description: Web service description
      url: https://bioinfo.imd.ufrn.br/biorempp/
      url_label: Open BioRemPP Web Service
  closing: Closing
resources_title: Resources
resource_card:
  title: Database Documentation
  description: Card description
  button_label: View Database Docs
  url: https://biorempp-dbx.readthedocs.io/en/stable/guided-analysis/
  icon: server
`;

describe('documentationCatalog', () => {
  it('loads the shipped documentation catalog successfully', () => {
    expect(DOCUMENTATION_CATALOG.title).toBe('Documentation');
    expect(DOCUMENTATION_CATALOG.framework.bullets).toHaveLength(3);
    expect(DOCUMENTATION_CATALOG.resource_card.title).toBe('Database Documentation');
    expect(DOCUMENTATION_CATALOG.resource_card.url).toBe(
      'https://biorempp-dbx.readthedocs.io/en/stable/guided-analysis/'
    );
    expect(DOCUMENTATION_CATALOG.framework.bullets[1]).toMatchObject({
      label: 'Web Service',
      url: 'https://bioinfo.imd.ufrn.br/biorempp/',
    });
    expect(DOCUMENTATION_CATALOG.framework.bullets[2]).toMatchObject({
      label: 'Database Explorer',
      url: 'https://bioinfo.imd.ufrn.br/bioremppdbx/',
    });
  });

  it('rejects invalid external URLs', () => {
    expect(() =>
      parseDocumentationCatalog(VALID_DOCUMENTATION_YAML.replace(
        'https://biorempp-dbx.readthedocs.io/en/stable/guided-analysis/',
        'ftp://invalid'
      ))
    ).toThrow(/resource_card.url/);
  });

  it('rejects a framework bullet with url but missing url_label', () => {
    expect(() =>
      parseDocumentationCatalog(
        VALID_DOCUMENTATION_YAML.replace(
          'url_label: Open BioRemPP Web Service',
          ''
        )
      )
    ).toThrow(/url and url_label must be provided together/);
  });
});
