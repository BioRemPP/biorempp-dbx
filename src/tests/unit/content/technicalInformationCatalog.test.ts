import { describe, expect, it } from 'vitest';
import {
  TECHNICAL_INFORMATION_CATALOG,
  parseTechnicalInformationCatalog,
} from '@/content/technical-information/catalog';

const VALID_TECHNICAL_INFORMATION_YAML = `
version: v1
language: en
header:
  eyebrow: Technical Reference
  title: Technical Information
  subtitle: Test subtitle
  intro_note: Test note
intro:
  title: Why This Page Exists
  paragraphs:
    - Intro paragraph
runtime_delivery:
  title: Why the app uses SQLite at runtime
  intro: Runtime intro
  bullets:
    - id: query-performance
      label: Query performance
      description: Runtime description
  recommendation_title: Use CSV artifacts
  recommendation: Prefer CSV files for downstream analysis.
  closing: Runtime closing
build_overview:
  title: How the Database Is Built
  intro: Build intro
  bullets:
    - id: curated-inputs
      label: Curated inputs
      description: Curated description
  closing: Build closing
schema_quality:
  title: Schema
  intro: Schema intro
  quality_points:
    - Quality point
  coverage_note: Coverage note
validation:
  title: Validation
  intro: Validation intro
  bullets:
    - Validation point
  closing: Validation closing
provenance:
  title: Provenance
  intro: Provenance intro
  bullets:
    - Provenance point
  closing: Provenance closing
limitations:
  title: Limitations
  intro: Limitations intro
  safe_claims_title: Safe claims
  safe_claims:
    - Safe claim
  avoid_claims_title: Avoid claims
  avoid_claims:
    - Avoid claim
  closing: Limitations closing
faq:
  title: FAQ
  intro: FAQ intro
  items:
    - id: faq-1
      question: Question?
      answer: Answer.
footer:
  title: Footer
  note: Footer note
sidebar:
  snapshot_title: Snapshot
  snapshot_intro: Snapshot intro
  quick_nav_title: Quick nav
  quick_nav_description: Quick nav description
  actions_title: Actions
  databases_label: Open Databases
  documentation_label: Open Documentation
`;

describe('technicalInformationCatalog', () => {
  it('loads the shipped technical information catalog successfully', () => {
    expect(TECHNICAL_INFORMATION_CATALOG.header.title).toBe('Technical Information');
    expect(TECHNICAL_INFORMATION_CATALOG.runtime_delivery.bullets.length).toBeGreaterThan(0);
    expect(TECHNICAL_INFORMATION_CATALOG.runtime_delivery.recommendation).toMatch(/CSV/i);
    expect(TECHNICAL_INFORMATION_CATALOG.build_overview.bullets.length).toBeGreaterThan(0);
    expect(TECHNICAL_INFORMATION_CATALOG.faq.items.length).toBeGreaterThan(0);
    expect(TECHNICAL_INFORMATION_CATALOG.sidebar.snapshot_title).toBe('Release Snapshot');
  });

  it('rejects duplicated build-overview bullet ids', () => {
    expect(() =>
      parseTechnicalInformationCatalog(
        VALID_TECHNICAL_INFORMATION_YAML.replace(
          '    - id: curated-inputs\n      label: Curated inputs\n      description: Curated description',
          '    - id: duplicated\n      label: Curated inputs\n      description: Curated description\n    - id: duplicated\n      label: Duplicate\n      description: Duplicate description'
        )
      )
    ).toThrow(/build_overview\.bullets/);
  });

  it('rejects duplicated runtime-delivery bullet ids', () => {
    expect(() =>
      parseTechnicalInformationCatalog(
        VALID_TECHNICAL_INFORMATION_YAML.replace(
          '    - id: query-performance\n      label: Query performance\n      description: Runtime description',
          '    - id: duplicated\n      label: Runtime A\n      description: Runtime description\n    - id: duplicated\n      label: Runtime B\n      description: Another runtime description'
        )
      )
    ).toThrow(/runtime_delivery\.bullets/);
  });

  it('rejects duplicated FAQ item ids', () => {
    expect(() =>
      parseTechnicalInformationCatalog(
        VALID_TECHNICAL_INFORMATION_YAML.replace(
          '    - id: faq-1\n      question: Question?\n      answer: Answer.',
          '    - id: repeated\n      question: Question?\n      answer: Answer.\n    - id: repeated\n      question: Another question?\n      answer: Another answer.'
        )
      )
    ).toThrow(/faq\.items/);
  });

  it('rejects empty required arrays', () => {
    expect(() =>
      parseTechnicalInformationCatalog(
        VALID_TECHNICAL_INFORMATION_YAML.replace('  quality_points:\n    - Quality point', '  quality_points: []')
      )
    ).toThrow(/schema_quality\.quality_points/);
  });
});
