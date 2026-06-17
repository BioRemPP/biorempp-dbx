import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateScientificOverviewConfig } from '../../../../scripts/compile-scientific-overview-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');

describe('scientificOverview compile config', () => {
  it('validates the shipped scientific overview editorial domain', () => {
    const result = validateScientificOverviewConfig({ projectRoot });

    expect(result.sectionOrderCount).toBe(4);
    expect(result.scientificTermCount).toBeGreaterThan(0);
    expect(result.datascienceCategoryCount).toBeGreaterThan(0);
    expect(result.fairPrincipleCount).toBeGreaterThan(0);
    expect(result.integratedDatabaseCount).toBeGreaterThan(0);
    expect(result.interoperabilityGroupCount).toBeGreaterThan(0);
  });
});
