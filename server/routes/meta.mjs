import express from 'express';
import { readDistinctStrings } from '../shared/query.mjs';

export function createMetaRouter({ db, BASE_PATH }) {
  const router = express.Router();

  router.get('/meta/compound-classes', (_req, res, next) => {
    try {
      const values = readDistinctStrings(db, `
        SELECT DISTINCT compoundclass AS value
        FROM compound_summary
        WHERE compoundclass IS NOT NULL
        ORDER BY compoundclass
      `);
      res.json(values);
    } catch (error) {
      next(error);
    }
  });

  router.get('/meta/reference-ags', (_req, res, next) => {
    try {
      const values = readDistinctStrings(db, `
        SELECT DISTINCT reference_ag AS value
        FROM compound_reference_map
        WHERE reference_ag IS NOT NULL
        ORDER BY reference_ag
      `);
      res.json(values);
    } catch (error) {
      next(error);
    }
  });

  router.get('/meta/genes', (_req, res, next) => {
    try {
      const values = readDistinctStrings(db, `
        SELECT DISTINCT genesymbol AS value
        FROM gene_summary
        WHERE genesymbol IS NOT NULL
        ORDER BY genesymbol
      `);
      res.json(values);
    } catch (error) {
      next(error);
    }
  });

  router.get('/meta/pathways', (_req, res, next) => {
    try {
      const values = readDistinctStrings(db, `
        SELECT DISTINCT pathway AS value
        FROM pathway_summary
        WHERE pathway IS NOT NULL
        ORDER BY pathway
      `);
      res.json(values);
    } catch (error) {
      next(error);
    }
  });

  router.get('/meta/pathways/grouped', (_req, res, next) => {
    try {
      const rows = db
        .prepare(`
          SELECT pathway, source
          FROM pathway_summary
          WHERE pathway IS NOT NULL
            AND source IN ('HADEG', 'KEGG')
          ORDER BY source ASC, pathway ASC
        `)
        .all();
      res.json(rows);
    } catch (error) {
      next(error);
    }
  });

  router.get('/meta/toxicity/endpoints', (_req, res, next) => {
    try {
      const values = readDistinctStrings(db, `
        SELECT DISTINCT endpoint AS value
        FROM toxicity_endpoint
        WHERE endpoint IS NOT NULL
        ORDER BY endpoint
      `);
      res.json(values);
    } catch (error) {
      next(error);
    }
  });

  router.get('/meta/toxicity/labels', (req, res, next) => {
    try {
      const params = [];
      let where = 'label IS NOT NULL';
      if (req.query.endpoint) {
        where += ' AND endpoint = ?';
        params.push(String(req.query.endpoint));
      }
      const values = readDistinctStrings(
        db,
        `
          SELECT DISTINCT label AS value
          FROM toxicity_endpoint
          WHERE ${where}
          ORDER BY label
        `,
        params
      );
      res.json(values);
    } catch (error) {
      next(error);
    }
  });

  router.get('/health', (_req, res) => {
    res.json({ ok: true, basePath: BASE_PATH });
  });

  return router;
}
