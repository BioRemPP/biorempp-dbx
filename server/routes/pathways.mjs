import express from 'express';
import { getPagination, likeValue, toPaginatedResponse, readDistinctStrings, deriveRiskBucket } from '../shared/query.mjs';

export function createPathwaysRouter({ db }) {
  const router = express.Router();

  router.get('/pathways/detail/overview', (req, res, next) => {
    try {
      const pathway = String(req.query.pathway || '').trim();
      if (!pathway) {
        res.status(400).json({ error: 'Missing required query parameter: pathway' });
        return;
      }

      const sourceRaw = String(req.query.source || '').trim().toUpperCase();
      const useSourceFilter = sourceRaw !== '' && sourceRaw !== 'ALL';

      const availableSources = readDistinctStrings(
        db,
        `
          SELECT DISTINCT source AS value
          FROM compound_pathway_card
          WHERE pathway = ?
          ORDER BY source ASC
        `,
        [pathway]
      );

      if (availableSources.length === 0) {
        res.status(404).json({ error: `Pathway "${pathway}" not found` });
        return;
      }

      if (useSourceFilter && !availableSources.includes(sourceRaw)) {
        res.status(404).json({ error: `Pathway "${pathway}" not found for source "${sourceRaw}"` });
        return;
      }

      const sourceWhere = useSourceFilter ? ' AND source = ?' : '';
      const sourceParams = useSourceFilter ? [sourceRaw] : [];

      const compounds = db
        .prepare(
          `
            SELECT DISTINCT
              cpc.cpd,
              cs.compoundname
            FROM compound_pathway_card cpc
            LEFT JOIN compound_summary cs
              ON cs.cpd = cpc.cpd
            WHERE cpc.pathway = ?${sourceWhere}
            ORDER BY COALESCE(cs.compoundname, cpc.cpd) ASC, cpc.cpd ASC
          `
        )
        .all(pathway, ...sourceParams);

      const relations = db
        .prepare(
          `
            SELECT DISTINCT
              cpd,
              ko,
              source
            FROM compound_ko_pathway_rel
            WHERE pathway = ?${sourceWhere}
          `
        )
        .all(pathway, ...sourceParams);

      const geneRows = db
        .prepare(
          `
            SELECT DISTINCT
              cgc.cpd,
              cgc.ko,
              cgc.genesymbol,
              cgc.ec
            FROM compound_gene_card cgc
            JOIN compound_ko_pathway_rel rel
              ON rel.cpd = cgc.cpd
             AND rel.ko = cgc.ko
            WHERE rel.pathway = ?${useSourceFilter ? ' AND rel.source = ?' : ''}
          `
        )
        .all(pathway, ...sourceParams);

      const koSet = new Set(relations.map((row) => row.ko).filter(Boolean));
      const geneSet = new Set(
        geneRows.map((row) => String(row.genesymbol || '').trim()).filter((value) => value.length > 0)
      );

      const koToCompounds = new Map();
      for (const row of relations) {
        const ko = String(row.ko || '').trim();
        const cpd = String(row.cpd || '').trim();
        if (!ko || !cpd) {
          continue;
        }
        if (!koToCompounds.has(ko)) {
          koToCompounds.set(ko, new Set());
        }
        koToCompounds.get(ko).add(cpd);
      }

      const koDistribution = [...koToCompounds.entries()]
        .map(([ko, compounds]) => ({
          ko,
          count: compounds.size,
        }))
        .sort((a, b) => b.count - a.count || a.ko.localeCompare(b.ko))
        .slice(0, 10);

      const geneToCompounds = new Map();
      for (const row of geneRows) {
        const gene = String(row.genesymbol || '').trim();
        const cpd = String(row.cpd || '').trim();
        if (!cpd || !gene) {
          continue;
        }
        if (!geneToCompounds.has(gene)) {
          geneToCompounds.set(gene, new Set());
        }
        geneToCompounds.get(gene).add(cpd);
      }

      const geneDistribution = [...geneToCompounds.entries()]
        .map(([gene, compounds]) => ({
          gene,
          count: compounds.size,
        }))
        .sort((a, b) => b.count - a.count || a.gene.localeCompare(b.gene))
        .slice(0, 10);

      const ecTokenSet = new Set();
      for (const row of geneRows) {
        const rawEc = String(row.ec || '').trim();
        if (!rawEc) {
          continue;
        }
        for (const token of rawEc.split(/[;,]/)) {
          const ec = token.trim();
          if (ec && ec !== '-') {
            ecTokenSet.add(ec);
          }
        }
      }

      const ecClassCount = new Map();
      for (const ec of ecTokenSet) {
        const match = /^([1-9])\./.exec(ec);
        const key = match ? `${match[1]}.x.x.x` : 'Other';
        ecClassCount.set(key, (ecClassCount.get(key) || 0) + 1);
      }

      const ecClassOrder = ['1.x.x.x', '2.x.x.x', '3.x.x.x', '4.x.x.x', '5.x.x.x', '6.x.x.x', '7.x.x.x', 'Other'];
      const ecClassDistribution = [...ecClassCount.entries()]
        .map(([ecClass, count]) => ({ ec_class: ecClass, count }))
        .sort((a, b) => {
          const ai = ecClassOrder.indexOf(a.ec_class);
          const bi = ecClassOrder.indexOf(b.ec_class);
          if (ai !== -1 && bi !== -1) {
            return ai - bi;
          }
          if (ai !== -1) {
            return -1;
          }
          if (bi !== -1) {
            return 1;
          }
          return a.ec_class.localeCompare(b.ec_class);
        });

      let koOverlapPct = null;
      if (!useSourceFilter && availableSources.includes('KEGG') && availableSources.includes('HADEG')) {
        const keggKos = new Set(
          relations
            .filter((row) => row.source === 'KEGG')
            .map((row) => row.ko)
            .filter(Boolean)
        );
        const hadegKos = new Set(
          relations
            .filter((row) => row.source === 'HADEG')
            .map((row) => row.ko)
            .filter(Boolean)
        );
        const union = new Set([...keggKos, ...hadegKos]);
        if (union.size > 0) {
          const intersection = [...keggKos].filter((ko) => hadegKos.has(ko)).length;
          koOverlapPct = Math.round((intersection / union.size) * 100);
        }
      }

      const endpoints = readDistinctStrings(db, `
        SELECT DISTINCT endpoint AS value
        FROM toxicity_endpoint
        ORDER BY endpoint ASC
      `);

      const toxicityRows = db
        .prepare(
          `
            SELECT
              te.cpd,
              te.endpoint,
              te.label,
              te.value
            FROM toxicity_endpoint te
            JOIN (
              SELECT DISTINCT cpd
              FROM compound_pathway_card
              WHERE pathway = ?${sourceWhere}
            ) cpd_scope
              ON cpd_scope.cpd = te.cpd
            ORDER BY te.cpd ASC, te.endpoint ASC
          `
        )
        .all(pathway, ...sourceParams);

      res.json({
        pathway,
        available_sources: availableSources,
        selected_source: useSourceFilter ? sourceRaw : 'ALL',
        summary: {
          pathway,
          selected_source: useSourceFilter ? sourceRaw : 'ALL',
          ko_count: koSet.size,
          gene_count: geneSet.size,
          compound_count: compounds.length,
          reaction_ec_count: ecTokenSet.size,
          source_count: useSourceFilter ? 1 : availableSources.length,
          ko_overlap_pct: koOverlapPct,
        },
        ko_distribution: koDistribution,
        gene_distribution: geneDistribution,
        ec_class_distribution: ecClassDistribution,
        toxicity_matrix: {
          compounds: compounds.map((row) => ({
            cpd: row.cpd,
            compoundname: row.compoundname || null,
          })),
          endpoints,
          cells: toxicityRows.map((row) => ({
            cpd: row.cpd,
            endpoint: row.endpoint,
            label: row.label,
            value: row.value === null ? null : Number(row.value),
            risk_bucket: deriveRiskBucket(row.label),
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/pathways', (req, res, next) => {
    try {
      const { page, pageSize, offset } = getPagination(req.query);
      const where = [];
      const params = [];

      if (req.query.source) {
        where.push('source = ?');
        params.push(String(req.query.source));
      }

      if (req.query.search) {
        where.push('pathway LIKE ? COLLATE NOCASE');
        params.push(likeValue(String(req.query.search)));
      }

      const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
      const total = db
        .prepare(`SELECT COUNT(*) AS total FROM pathway_summary ${whereSql}`)
        .get(...params).total;

      const rows = db
        .prepare(`
          SELECT
            pathway,
            source,
            compound_count,
            gene_count,
            updated_at
          FROM pathway_summary
          ${whereSql}
          ORDER BY compound_count DESC, pathway ASC
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
