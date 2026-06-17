import express from 'express';
import { getPagination, parseNumber, likeValue, toPaginatedResponse } from '../shared/query.mjs';

export function createToxicityRouter({ db }) {
  const router = express.Router();

  router.get('/toxicity', (req, res, next) => {
    try {
      const { page, pageSize, offset } = getPagination(req.query);
      const where = [];
      const params = [];

      if (req.query.endpoint) {
        where.push('endpoint = ?');
        params.push(String(req.query.endpoint));
      }

      if (req.query.label) {
        where.push('label = ?');
        params.push(String(req.query.label));
      }

      if (req.query.compoundclass) {
        where.push('compoundclass = ?');
        params.push(String(req.query.compoundclass));
      }

      const valueMin = parseNumber(req.query.value_min);
      if (valueMin !== undefined) {
        where.push('value >= ?');
        params.push(valueMin);
      }

      const valueMax = parseNumber(req.query.value_max);
      if (valueMax !== undefined) {
        where.push('value <= ?');
        params.push(valueMax);
      }

      if (req.query.search) {
        const search = likeValue(String(req.query.search));
        where.push('(compoundname LIKE ? COLLATE NOCASE OR cpd LIKE ? COLLATE NOCASE)');
        params.push(search, search);
      }

      const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
      const total = db
        .prepare(`SELECT COUNT(*) AS total FROM toxicity_endpoint ${whereSql}`)
        .get(...params).total;

      const rows = db
        .prepare(`
          SELECT
            cpd,
            compoundname,
            compoundclass,
            endpoint,
            label,
            value,
            updated_at
          FROM toxicity_endpoint
          ${whereSql}
          ORDER BY (value IS NULL) ASC, value DESC, compoundname ASC, cpd ASC
          LIMIT ? OFFSET ?
        `)
        .all(...params, pageSize, offset);

      res.json(toPaginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
