import { describe, expect, it } from 'vitest';
import { FAQ_CATALOG, parseFaqCatalog } from '@/content/faq/catalog';

const REQUIRED_SECTION_IDS = [
  'getting-started',
  'navigation-and-support-pages',
  'explorers-and-detail-pages',
  'guided-analysis',
  'data-scope-and-coverage',
  'interpretation-and-limitations',
  'downloads-reproducibility-and-citation',
  'technical-access-and-api',
  'privacy-terms-and-licensing',
  'troubleshooting-and-support',
];

function buildValidFaqYaml() {
  const sections = REQUIRED_SECTION_IDS.map((sectionId, sectionIndex) => {
    const items = Array.from({ length: 3 }, (_, itemIndex) => {
      const itemId = `${sectionId}-item-${itemIndex + 1}`;
      return `      - id: ${itemId}
        question: Question ${sectionIndex + 1}.${itemIndex + 1}
        answer: Answer ${sectionIndex + 1}.${itemIndex + 1}
        tags:
          - faq
          - section-${sectionIndex + 1}`;
    }).join('\n');

    return `  - id: ${sectionId}
    title: Section ${sectionIndex + 1}
    description: Description ${sectionIndex + 1}
    items:
${items}`;
  }).join('\n');

  return `version: v2
language: en
title: Frequently Asked Questions
intro: Intro text
header_actions:
  - label: Open User Guide
    view: user-guide
  - label: Open Docs
    url: https://example.com/docs
sections:
${sections}
`;
}

describe('faqCatalog', () => {
  it('loads the shipped YAML catalog successfully', () => {
    expect(FAQ_CATALOG.title).toBe('Frequently Asked Questions');
    expect(FAQ_CATALOG.header_actions).toHaveLength(4);
    expect(FAQ_CATALOG.sections.map((section) => section.id)).toEqual(REQUIRED_SECTION_IDS);
    expect(FAQ_CATALOG.sections.length).toBe(10);
  });

  it('parses a valid faq catalog with header actions and section descriptions', () => {
    const catalog = parseFaqCatalog(buildValidFaqYaml());

    expect(catalog.header_actions).toHaveLength(2);
    expect(catalog.sections).toHaveLength(10);
    expect(catalog.sections[0].description).toBe('Description 1');
  });

  it('rejects duplicate section ids', () => {
    expect(() =>
      parseFaqCatalog(
        buildValidFaqYaml().replace(
          '  - id: navigation-and-support-pages',
          '  - id: getting-started'
        )
      )
    ).toThrow(/duplicated section id|expected "navigation-and-support-pages"/i);
  });

  it('rejects duplicate item ids', () => {
    expect(() =>
      parseFaqCatalog(
        buildValidFaqYaml().replace(
          '      - id: guided-analysis-item-1',
          '      - id: getting-started-item-1'
        )
      )
    ).toThrow(/duplicated item id/i);
  });

  it('rejects reordered required sections', () => {
    expect(() =>
      parseFaqCatalog(
        buildValidFaqYaml()
          .replace('  - id: navigation-and-support-pages', '  - id: __TEMP_SECTION__')
          .replace('  - id: explorers-and-detail-pages', '  - id: navigation-and-support-pages')
          .replace('  - id: __TEMP_SECTION__', '  - id: explorers-and-detail-pages')
      )
    ).toThrow(/expected "navigation-and-support-pages"/i);
  });

  it('rejects links that declare both view and url', () => {
    expect(() =>
      parseFaqCatalog(
        buildValidFaqYaml().replace(
          '  - label: Open User Guide\n    view: user-guide',
          '  - label: Open User Guide\n    view: user-guide\n    url: https://example.com/guide'
        )
      )
    ).toThrow(/exactly one of "view" or "url"/i);
  });

  it('rejects invalid internal views', () => {
    expect(() =>
      parseFaqCatalog(
        buildValidFaqYaml().replace('view: user-guide', 'view: invalid-view')
      )
    ).toThrow(/header_actions\[0\]\.view/i);
  });
});
