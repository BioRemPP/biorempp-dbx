import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const metadataPath = path.join(projectRoot, 'src', 'app', 'config', 'app-metadata.json');
const docsIncludesDir = path.join(projectRoot, 'docs', 'includes');
const docsSnippetPath = path.join(docsIncludesDir, 'app-release.md');

const RELEASE_STAGE_LABELS = {
  alpha: 'Alpha',
  beta: 'Beta',
  rc: 'RC',
  stable: 'Release',
};

function fail(message) {
  throw new Error(`app-metadata: ${message}`);
}

function assertObject(value, context) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${context} must be an object`);
  }
}

function assertString(value, context) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${context} must be a non-empty string`);
  }
  return value.trim();
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`missing file: ${path.relative(projectRoot, filePath)}`);
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`invalid json in ${path.relative(projectRoot, filePath)}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function validateMetadata(rawMetadata) {
  assertObject(rawMetadata, 'app-metadata.json');

  const brand = rawMetadata.brand;
  const release = rawMetadata.release;

  assertObject(brand, 'app-metadata.json brand');
  assertObject(release, 'app-metadata.json release');

  const title = assertString(brand.title, 'app-metadata.json brand.title');
  const shortTitle = assertString(brand.shortTitle, 'app-metadata.json brand.shortTitle');
  const subtitle = assertString(brand.subtitle, 'app-metadata.json brand.subtitle');
  const stage = assertString(release.stage, 'app-metadata.json release.stage');
  const version = assertString(release.version, 'app-metadata.json release.version');

  if (!(stage in RELEASE_STAGE_LABELS)) {
    fail(`app-metadata.json release.stage must be one of ${Object.keys(RELEASE_STAGE_LABELS).join('|')}`);
  }

  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    fail('app-metadata.json release.version must follow major.minor.patch');
  }

  return {
    brand: {
      title,
      shortTitle,
      subtitle,
    },
    release: {
      stage,
      version,
      label: `${RELEASE_STAGE_LABELS[stage]} ${version}`,
    },
  };
}

function writeDocsSnippet(metadata) {
  const snippet = [
    '!!! info "Application release"',
    `    Current public UI release: **${metadata.release.label}**`,
    '    Source of truth: `src/app/config/app-metadata.json`',
    '',
  ].join('\n');

  fs.mkdirSync(docsIncludesDir, { recursive: true });
  fs.writeFileSync(docsSnippetPath, snippet, 'utf8');
}

function main() {
  const rawMetadata = readJson(metadataPath);
  const metadata = validateMetadata(rawMetadata);
  writeDocsSnippet(metadata);

  console.log(
    `app-metadata: validated ${metadata.release.label} and generated ${path.relative(projectRoot, docsSnippetPath)}`
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
