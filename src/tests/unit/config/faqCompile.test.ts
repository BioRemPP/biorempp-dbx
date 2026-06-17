import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateFaqConfig } from '../../../../scripts/compile-faq-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');

describe('faq compile config', () => {
  it('validates the shipped faq editorial domain', () => {
    const result = validateFaqConfig({ projectRoot });

    expect(result.headerActionCount).toBe(4);
    expect(result.sectionCount).toBe(10);
    expect(result.questionCount).toBeGreaterThanOrEqual(24);
  });
});
