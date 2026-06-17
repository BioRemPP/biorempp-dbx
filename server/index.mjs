import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import Database from 'better-sqlite3';
import rateLimit from 'express-rate-limit';
import { normalizeBasePath } from '../shared/basePath.mjs';
import { createGuidedEngine } from './guided/engine.mjs';
import { createGuidedLimiter } from './rateLimit.mjs';
import { createCompoundsRouter } from './routes/compounds.mjs';
import { createGenesRouter } from './routes/genes.mjs';
import { createPathwaysRouter } from './routes/pathways.mjs';
import { createToxicityRouter } from './routes/toxicity.mjs';
import { createMetaRouter } from './routes/meta.mjs';
import { createGuidedRouter } from './routes/guided.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PORT = Number(process.env.PORT || (process.env.NODE_ENV === 'production' ? 3000 : 3101));
const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH || path.join(projectRoot, 'data', 'biorempp.sqlite');
const BASE_PATH = normalizeBasePath(process.env.BIOREMPP_URL_BASE_PATH || '/');

const RATE_LIMIT_TRUST_PROXY      = Number(process.env.RATE_LIMIT_TRUST_PROXY)      || 1;
const RATE_LIMIT_GLOBAL_MAX       = Number(process.env.RATE_LIMIT_GLOBAL_MAX)       || 1200;
const RATE_LIMIT_GLOBAL_WINDOW_MS = Number(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS) || 60_000;
const RATE_LIMIT_KEGG_MAX         = Number(process.env.RATE_LIMIT_KEGG_MAX)         || 20;
const RATE_LIMIT_KEGG_WINDOW_MS   = Number(process.env.RATE_LIMIT_KEGG_WINDOW_MS)   || 60_000;
if (!fs.existsSync(SQLITE_DB_PATH)) {
  throw new Error(`SQLite database not found at ${SQLITE_DB_PATH}. Run "npm run ingest:sqlite" first.`);
}

const db = new Database(SQLITE_DB_PATH, {
  readonly: true,
  fileMustExist: true,
});

const REQUIRED_RUNTIME_TABLES = [
  'compound_summary',
  'gene_summary',
  'pathway_summary',
  'toxicity_endpoint',
  'compound_gene_map',
  'compound_pathway_map',
  'compound_reference_map',
  'compound_metadata',
  'compound_gene_card',
  'compound_pathway_card',
  'compound_ko_pathway_rel',
  'compound_ko_overview',
];

const availableTables = new Set(
  db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table'`)
    .all()
    .map((row) => row.name)
);
const missingTables = REQUIRED_RUNTIME_TABLES.filter((tableName) => !availableTables.has(tableName));
if (missingTables.length > 0) {
  throw new Error(
    `SQLite runtime profile is invalid. Missing required tables: ${missingTables.join(', ')}. Run "npm run ingest:sqlite".`
  );
}

const hasCompoundMetadataTable = Boolean(
  db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'compound_metadata' LIMIT 1`)
    .get()
);

const rootApp = express();
const app = express();
app.use(express.json());
app.set('trust proxy', RATE_LIMIT_TRUST_PROXY);

const globalLimiter = rateLimit({
  windowMs: RATE_LIMIT_GLOBAL_WINDOW_MS,
  limit: RATE_LIMIT_GLOBAL_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});
app.use(globalLimiter);

const keggLimiter = rateLimit({
  windowMs: RATE_LIMIT_KEGG_WINDOW_MS,
  limit: RATE_LIMIT_KEGG_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

const guidedLimiter = createGuidedLimiter();

const guidedEngine = createGuidedEngine({ db, projectRoot });
guidedEngine.getCatalogResponse();

app.use('/api', createCompoundsRouter({ db, keggLimiter, hasCompoundMetadataTable }));
app.use('/api', createGenesRouter({ db }));
app.use('/api', createPathwaysRouter({ db }));
app.use('/api', createToxicityRouter({ db }));
app.use('/api', createMetaRouter({ db, BASE_PATH }));
app.use('/api', createGuidedRouter({ guidedEngine, guidedLimiter }));

const distPath = path.join(projectRoot, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: error instanceof Error ? error.message : 'Internal server error',
  });
});

rootApp.get('/health', (_req, res) => {
  res.json({ ok: true, basePath: BASE_PATH });
});

if (BASE_PATH !== '/' && process.env.NODE_ENV === 'production') {
  rootApp.get('/', (_req, res) => {
    res.redirect(302, BASE_PATH);
  });
}

rootApp.use(BASE_PATH, app);

rootApp.listen(PORT, () => {
  console.log(`BioRemPP monolith listening on http://0.0.0.0:${PORT}`);
  console.log(`Base path: ${BASE_PATH}`);
  console.log(`SQLite DB: ${SQLITE_DB_PATH}`);
});
