import { describe, expect, it } from 'vitest';
import { APP_BRAND, APP_DOCUMENT_TITLE, APP_RELEASE } from '@/app/config/appMetadata';

describe('app metadata', () => {
  it('exposes the public release label from the central metadata file', () => {
    expect(APP_BRAND.title).toBe('BioRemPP Database Explorer');
    expect(APP_RELEASE.stage).toBe('beta');
    expect(APP_RELEASE.version).toBe('1.0.0');
    expect(APP_RELEASE.label).toBe('Beta 1.0.0');
    expect(APP_DOCUMENT_TITLE).toContain(APP_RELEASE.label);
  });
});
