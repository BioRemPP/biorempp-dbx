import fs from 'node:fs';
import path from 'node:path';

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseEnvFileContents(contents) {
  const values = {};
  const lines = String(contents || '').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const normalizedLine = trimmed.startsWith('export ') ? trimmed.slice('export '.length).trim() : trimmed;
    const separatorIndex = normalizedLine.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = normalizedLine.slice(0, separatorIndex).trim();
    const rawValue = normalizedLine.slice(separatorIndex + 1).trim();
    if (!key) {
      continue;
    }

    values[key] = stripWrappingQuotes(rawValue);
  }

  return values;
}

export function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const contents = fs.readFileSync(filePath, 'utf8');
  return parseEnvFileContents(contents);
}

export function resolveEnvValues(options = {}) {
  const cwd = options.cwd || process.cwd();
  const primary = options.primary || '.env';
  const fallback = options.fallback || '.env.example';
  const primaryPath = path.resolve(cwd, primary);
  const fallbackPath = path.resolve(cwd, fallback);
  const primaryValues = readEnvFile(primaryPath);
  const fallbackValues = readEnvFile(fallbackPath);

  return {
    fallbackFound: fallbackValues !== null,
    fallbackPath,
    primaryFound: primaryValues !== null,
    primaryPath,
    values: {
      ...(fallbackValues || {}),
      ...(primaryValues || {}),
    },
  };
}

export function loadResolvedEnvIntoProcess(options = {}) {
  const resolved = resolveEnvValues(options);

  for (const [key, value] of Object.entries(resolved.values)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return resolved;
}
