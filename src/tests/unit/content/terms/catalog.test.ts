import { describe, expect, it } from 'vitest';
import { TERMS_CATALOG, parseTermsCatalog } from '@/content/terms/catalog';

const VALID_TERMS_YAML = `
version: v1
header:
  title: Terms
  subtitle: subtitle
notice:
  title: Notice
  body: body
sections:
  - id: scope
    title: Scope
    paragraphs:
      - paragraph
  - id: warning
    title: Warning
    tone: warning
    bullets:
      - bullet
footer:
  text: footer
  close_label: Close
`;

describe('termsCatalog', () => {
  it('loads the shipped YAML catalog successfully', () => {
    expect(TERMS_CATALOG.header.title).toBe('BioRemPP Terms of Use');
    expect(TERMS_CATALOG.sections.length).toBeGreaterThan(0);
    expect(TERMS_CATALOG.footer.close_label).toBe('Close');
  });

  it('rejects empty required header fields', () => {
    expect(() =>
      parseTermsCatalog(VALID_TERMS_YAML.replace('  title: Terms', '  title: ""'))
    ).toThrow(/header.title/);
  });

  it('rejects empty sections array', () => {
    expect(() =>
      parseTermsCatalog(VALID_TERMS_YAML.replace('sections:\n  - id: scope\n    title: Scope\n    paragraphs:\n      - paragraph\n  - id: warning\n    title: Warning\n    tone: warning\n    bullets:\n      - bullet', 'sections: []'))
    ).toThrow(/sections/);
  });

  it('rejects sections without title', () => {
    expect(() =>
      parseTermsCatalog(VALID_TERMS_YAML.replace('    title: Scope', '    title: ""'))
    ).toThrow(/sections\[0\]\.title/);
  });

  it('rejects sections without paragraphs and bullets', () => {
    expect(() =>
      parseTermsCatalog(VALID_TERMS_YAML.replace('    paragraphs:\n      - paragraph', ''))
    ).toThrow(/expected paragraphs and\/or bullets/);
  });
});
