import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateTechnicalInformationConfig } from '../../../../scripts/compile-technical-information-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');

describe('technicalInformation compile config', () => {
  it('validates the shipped technical information page config', () => {
    const result = validateTechnicalInformationConfig({ projectRoot });

    expect(result.buildOverviewBulletCount).toBeGreaterThan(0);
    expect(result.runtimeBulletCount).toBeGreaterThan(0);
    expect(result.faqItemCount).toBeGreaterThan(0);
    expect(result.introParagraphCount).toBeGreaterThan(0);
    expect(result.qualityPointCount).toBeGreaterThan(0);
  });
});
