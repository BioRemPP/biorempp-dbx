import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateLimitationsConfig } from '../../../../scripts/compile-limitations-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');

describe('limitations compile config', () => {
  it('validates the shipped limitations editorial domain', () => {
    const result = validateLimitationsConfig({ projectRoot });

    expect(result.homeSummaryCardCount).toBe(3);
    expect(result.quickFactCount).toBe(4);
    expect(result.topicCount).toBe(5);
    expect(result.exampleCount).toBeGreaterThan(0);
  });
});
