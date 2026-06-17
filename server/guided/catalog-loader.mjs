import fs from 'node:fs';
import path from 'node:path';
import { assertValidCompiledGuidedCatalog } from './catalog-schema.mjs';

export function createGuidedCatalogLoader({ projectRoot }) {
  const filePath = path.join(projectRoot, 'server', 'generated', 'guided', 'catalog.json');
  let cache = null;
  let cacheMtimeMs = 0;

  function loadFresh() {
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Guided catalog not found at ${path.relative(projectRoot, filePath)}. Run "npm run compile:guided".`
      );
    }

    const stat = fs.statSync(filePath);
    if (cache && stat.mtimeMs === cacheMtimeMs) {
      return cache;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    const validated = assertValidCompiledGuidedCatalog(parsed, path.relative(projectRoot, filePath));
    cache = validated;
    cacheMtimeMs = stat.mtimeMs;
    return validated;
  }

  return {
    getCatalog() {
      return loadFresh();
    },
    getQueryOrThrow(queryId) {
      const catalog = loadFresh();
      const query = catalog.queries.find((item) => item.id === queryId);
      if (!query) {
        throw new Error(`Guided query "${queryId}" not found`);
      }
      return query;
    },
  };
}
