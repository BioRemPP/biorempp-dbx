import { describe, expect, it } from 'vitest';
import {
  LIMITATIONS_EDITORIAL_CATALOG,
  parseLimitationsEditorialCatalog,
} from '@/content/limitations/catalog';

const VALID_LIMITATIONS_YAML = `
version: v2
home_component:
  title: Scope and Limitations
  subtitle: Interpretation guidance
  intro: Short intro
  summary_cards:
    - id: exploratory-evidence
      title: Exploratory evidence
      body: Use for prioritization
      tone: info
    - id: coverage-boundaries
      title: Coverage boundaries
      body: Coverage is partial
      tone: warning
    - id: responsible-reuse
      title: Responsible reuse
      body: Cite versions
      tone: success
  cta_label: View full interpretation guidelines
modal:
  header:
    title: Scope and Limitations
    subtitle: Full interpretation guidance
    notice: Read carefully
  quick_facts:
    - id: database-derived-evidence
      title: Database-derived evidence
      body: Curated evidence
      tone: info
    - id: not-proof-of-activity
      title: Not proof of activity
      body: No direct activity
      tone: warning
    - id: predictive-toxicity-only
      title: Predictive toxicity only
      body: Predictions only
      tone: warning
    - id: versioned-snapshot
      title: Versioned snapshot
      body: Release-specific
      tone: success
  topics:
    - id: scientific-boundaries
      title: Scientific Boundaries
      summary: Summary 1
      cards:
        - title: Card 1
          body: Body 1
          tone: info
      comparison:
        left_label: Represents
        left_items:
          - Item 1
        right_label: Does not represent
        right_items:
          - Item 2
    - id: database-coverage-and-prediction-scope
      title: Database Coverage and Prediction Scope
      summary: Summary 2
      cards:
        - title: Card 2
          body: Body 2
          tone: warning
    - id: common-misinterpretations
      title: Common Misinterpretations
      summary: Summary 3
      cards:
        - title: Card 3
          body: Body 3
          tone: neutral
      examples:
        - incorrect: Incorrect
          correct: Correct
          rationale: Why
    - id: regulatory-and-use-restrictions
      title: Regulatory and Use Restrictions
      summary: Summary 4
      cards:
        - title: Card 4
          body: Body 4
          tone: info
    - id: reproducibility-and-reporting
      title: Reproducibility and Reporting
      summary: Summary 5
      cards:
        - title: Card 5
          body: Body 5
          tone: success
  footer:
    text: Review terms
    terms_cta_label: Terms of Use
`;

describe('limitationsCatalog', () => {
  it('loads the shipped YAML catalog successfully', () => {
    expect(LIMITATIONS_EDITORIAL_CATALOG.home_component.title).toBe('Scope and Limitations');
    expect(LIMITATIONS_EDITORIAL_CATALOG.home_component.summary_cards).toHaveLength(3);
    expect(LIMITATIONS_EDITORIAL_CATALOG.modal.quick_facts).toHaveLength(4);
    expect(LIMITATIONS_EDITORIAL_CATALOG.modal.topics).toHaveLength(5);
    expect(LIMITATIONS_EDITORIAL_CATALOG.modal.footer.terms_cta_label).toBe('Terms of Use');
  });

  it('rejects empty summary cards', () => {
    expect(() =>
      parseLimitationsEditorialCatalog(
        VALID_LIMITATIONS_YAML.replace(
          `  summary_cards:
    - id: exploratory-evidence
      title: Exploratory evidence
      body: Use for prioritization
      tone: info
    - id: coverage-boundaries
      title: Coverage boundaries
      body: Coverage is partial
      tone: warning
    - id: responsible-reuse
      title: Responsible reuse
      body: Cite versions
      tone: success`,
          '  summary_cards: []'
        )
      )
    ).toThrow(/home_component\.summary_cards/);
  });

  it('rejects empty quick facts', () => {
    expect(() =>
      parseLimitationsEditorialCatalog(
        VALID_LIMITATIONS_YAML.replace(
          `  quick_facts:
    - id: database-derived-evidence
      title: Database-derived evidence
      body: Curated evidence
      tone: info
    - id: not-proof-of-activity
      title: Not proof of activity
      body: No direct activity
      tone: warning
    - id: predictive-toxicity-only
      title: Predictive toxicity only
      body: Predictions only
      tone: warning
    - id: versioned-snapshot
      title: Versioned snapshot
      body: Release-specific
      tone: success`,
          '  quick_facts: []'
        )
      )
    ).toThrow(/modal\.quick_facts/);
  });

  it('rejects duplicated topic ids', () => {
    expect(() =>
      parseLimitationsEditorialCatalog(
        VALID_LIMITATIONS_YAML.replace('    - id: reproducibility-and-reporting', '    - id: scientific-boundaries')
      )
    ).toThrow(/modal\.topics\[\d+\]\.id: duplicated/i);
  });

  it('rejects topic lists with invalid order', () => {
    expect(() =>
      parseLimitationsEditorialCatalog(
        VALID_LIMITATIONS_YAML
          .replace('    - id: database-coverage-and-prediction-scope', '    - id: __TEMP__')
          .replace('    - id: common-misinterpretations', '    - id: database-coverage-and-prediction-scope')
          .replace('    - id: __TEMP__', '    - id: common-misinterpretations')
      )
    ).toThrow(/expected "database-coverage-and-prediction-scope" in this position/);
  });
});
