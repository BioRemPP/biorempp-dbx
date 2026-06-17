import rawAppMetadata from './app-metadata.json';
import type { AppMetadata, AppReleaseStage } from '../../types/appMetadata';

const RELEASE_STAGE_LABELS: Record<AppReleaseStage, string> = {
  alpha: 'Alpha',
  beta: 'Beta',
  rc: 'RC',
  stable: 'Release',
};

function parseAppMetadata(rawMetadata: typeof rawAppMetadata): AppMetadata {
  const stage = rawMetadata.release.stage as AppReleaseStage;

  if (!(stage in RELEASE_STAGE_LABELS)) {
    throw new Error(`Invalid app release stage: ${rawMetadata.release.stage}`);
  }

  return {
    brand: {
      title: rawMetadata.brand.title,
      shortTitle: rawMetadata.brand.shortTitle,
      subtitle: rawMetadata.brand.subtitle,
    },
    release: {
      stage,
      version: rawMetadata.release.version,
    },
  };
}

export const APP_METADATA = parseAppMetadata(rawAppMetadata);
export const APP_BRAND = APP_METADATA.brand;

const releaseStageLabel = RELEASE_STAGE_LABELS[APP_METADATA.release.stage];

export const APP_RELEASE = {
  ...APP_METADATA.release,
  stageLabel: releaseStageLabel,
  label: `${releaseStageLabel} ${APP_METADATA.release.version}`,
};

export const APP_DOCUMENT_TITLE = `${APP_BRAND.shortTitle} | ${APP_RELEASE.label}`;
