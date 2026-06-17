import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const KEGG_CACHE_ENABLED = process.env.KEGG_IMAGE_CACHE_ENABLED !== 'false';
const KEGG_CACHE_DIR = process.env.KEGG_IMAGE_CACHE_DIR || path.join(projectRoot, 'data', 'kegg-images');

if (KEGG_CACHE_ENABLED) {
  fs.mkdirSync(KEGG_CACHE_DIR, { recursive: true });
}

const keggMemCache = new Map();
const keggInFlight = new Map();

const KEGG_IMAGE_FETCH_TIMEOUT_MS = 15000;

export function normalizeContentType(value) {
  return String(value || '')
    .split(';')[0]
    .trim()
    .toLowerCase();
}

export function inferImageContentType(buffer) {
  if (!buffer || buffer.length < 4) {
    return null;
  }

  if (buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a') {
    return 'image/gif';
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  return null;
}

export async function fetchValidatedKeggImage(cpd) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), KEGG_IMAGE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`https://rest.kegg.jp/get/${encodeURIComponent(cpd)}/image`, {
      headers: {
        Accept: 'image/gif,image/*;q=0.9,*/*;q=0.1',
        'User-Agent': 'BioRemPP Database Explorer/1.0',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (response.status === 404) {
      return { kind: 'not_found' };
    }

    if (!response.ok) {
      return { kind: 'upstream_error', status: response.status };
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    if (imageBuffer.length === 0) {
      return { kind: 'invalid_payload', reason: 'Empty image payload.' };
    }

    const upstreamContentType = normalizeContentType(response.headers.get('content-type'));
    const detectedContentType = inferImageContentType(imageBuffer);
    const resolvedContentType = detectedContentType || (upstreamContentType.startsWith('image/') ? upstreamContentType : null);

    if (!resolvedContentType) {
      return {
        kind: 'invalid_payload',
        reason: `Unexpected content type: ${upstreamContentType || 'unknown'}.`,
      };
    }

    return {
      kind: 'ok',
      buffer: imageBuffer,
      contentType: resolvedContentType,
    };
  } catch (error) {
    return {
      kind: 'upstream_error',
      status: null,
      reason: error instanceof Error ? error.message : 'Unknown upstream error.',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

const KEGG_EXT_MAP = { 'image/gif': '.gif', 'image/png': '.png', 'image/jpeg': '.jpg' };

export async function getKeggImageCached(cpd) {
  if (keggMemCache.has(cpd)) {
    const cached = keggMemCache.get(cpd);
    return cached === 'not_found' ? { kind: 'not_found' } : { kind: 'ok', ...cached };
  }

  if (keggInFlight.has(cpd)) {
    return keggInFlight.get(cpd);
  }

  const promise = (async () => {
    if (KEGG_CACHE_ENABLED) {
      for (const [ct, ext] of Object.entries(KEGG_EXT_MAP)) {
        const diskPath = path.join(KEGG_CACHE_DIR, `${cpd}${ext}`);
        if (fs.existsSync(diskPath)) {
          const buffer = fs.readFileSync(diskPath);
          keggMemCache.set(cpd, { buffer, contentType: ct });
          return { kind: 'ok', buffer, contentType: ct };
        }
      }
      const sentinel = path.join(KEGG_CACHE_DIR, `${cpd}.404`);
      if (fs.existsSync(sentinel)) {
        keggMemCache.set(cpd, 'not_found');
        return { kind: 'not_found' };
      }
    }

    const result = await fetchValidatedKeggImage(cpd);

    if (KEGG_CACHE_ENABLED) {
      if (result.kind === 'ok') {
        const ext = KEGG_EXT_MAP[result.contentType] ?? '.gif';
        fs.writeFileSync(path.join(KEGG_CACHE_DIR, `${cpd}${ext}`), result.buffer);
        keggMemCache.set(cpd, { buffer: result.buffer, contentType: result.contentType });
      } else if (result.kind === 'not_found') {
        fs.writeFileSync(path.join(KEGG_CACHE_DIR, `${cpd}.404`), '');
        keggMemCache.set(cpd, 'not_found');
      }
    }

    return result;
  })().finally(() => keggInFlight.delete(cpd));

  keggInFlight.set(cpd, promise);
  return promise;
}
