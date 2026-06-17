import express from 'express';
import {
  getPagination,
  parseNumber,
  parseOverviewLimit,
  likeValue,
  toPaginatedResponse,
  parseJsonObject,
  parseJsonArray,
  readDistinctStrings,
  createEmptyCompoundMetadata,
  deriveRiskBucket,
} from '../shared/query.mjs';
import { getKeggImageCached } from '../shared/kegg.mjs';

export function createCompoundsRouter({ db, keggLimiter, hasCompoundMetadataTable }) {
  const router = express.Router();

  router.get('/compounds', (req, res, next) => {
    try {
      const { page, pageSize, offset } = getPagination(req.query);
      const where = [];
      const params = [];

      if (req.query.compoundclass) {
        where.push('cs.compoundclass = ?');
        params.push(String(req.query.compoundclass));
      }
      if (req.query.reference_ag) {
        where.push(`
          EXISTS (
            SELECT 1
            FROM compound_reference_map crm
            WHERE crm.cpd = cs.cpd
              AND crm.reference_ag = ?
          )
        `);
        params.push(String(req.query.reference_ag));
      }
      if (req.query.pathway) {
        if (req.query.pathway_source) {
          where.push(`
            EXISTS (
              SELECT 1
              FROM compound_pathway_card cpc
              WHERE cpc.cpd = cs.cpd
                AND cpc.source = ?
                AND cpc.pathway = ?
            )
          `);
          params.push(String(req.query.pathway_source), String(req.query.pathway));
        } else {
          where.push(`
            EXISTS (
              SELECT 1
              FROM compound_pathway_card cpc
              WHERE cpc.cpd = cs.cpd
                AND cpc.pathway = ?
            )
          `);
          params.push(String(req.query.pathway));
        }
      } else if (req.query.pathway_source) {
        where.push(`
          EXISTS (
            SELECT 1
            FROM compound_pathway_card cpc
            WHERE cpc.cpd = cs.cpd
              AND cpc.source = ?
          )
        `);
        params.push(String(req.query.pathway_source));
      }
      if (req.query.gene) {
        where.push(`
          EXISTS (
            SELECT 1
            FROM compound_gene_map cgm
            WHERE cgm.cpd = cs.cpd
              AND cgm.genesymbol = ?
          )
        `);
        params.push(String(req.query.gene));
      }

      const koCountMin = parseNumber(req.query.ko_count_min);
      if (koCountMin !== undefined) {
        where.push('cs.ko_count >= ?');
        params.push(koCountMin);
      }
      const koCountMax = parseNumber(req.query.ko_count_max);
      if (koCountMax !== undefined) {
        where.push('cs.ko_count <= ?');
        params.push(koCountMax);
      }

      const geneCountMin = parseNumber(req.query.gene_count_min);
      if (geneCountMin !== undefined) {
        where.push('cs.gene_count >= ?');
        params.push(geneCountMin);
      }
      const geneCountMax = parseNumber(req.query.gene_count_max);
      if (geneCountMax !== undefined) {
        where.push('cs.gene_count <= ?');
        params.push(geneCountMax);
      }

      if (req.query.search) {
        const search = likeValue(String(req.query.search));
        where.push('(cs.compoundname LIKE ? COLLATE NOCASE OR cs.cpd LIKE ? COLLATE NOCASE)');
        params.push(search, search);
      }

      const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

      const total = db
        .prepare(`SELECT COUNT(*) AS total FROM compound_summary cs ${whereSql}`)
        .get(...params).total;

      const rows = db
        .prepare(`
          SELECT
            cs.cpd,
            cs.compoundname,
            cs.compoundclass,
            cs.reference_ag,
            cs.reference_count,
            cs.ko_count,
            cs.gene_count,
            cs.pathway_count,
            cs.toxicity_risk_mean,
            cs.high_risk_endpoint_count,
            cs.toxicity_scores,
            cs.smiles,
            cs.genes,
            cs.pathways,
            cs.updated_at
          FROM compound_summary cs
          ${whereSql}
          ORDER BY cs.gene_count DESC, cs.cpd ASC
          LIMIT ? OFFSET ?
        `)
        .all(...params, pageSize, offset)
        .map((row) => ({
          ...row,
          toxicity_scores: parseJsonObject(row.toxicity_scores),
          genes: parseJsonArray(row.genes),
          pathways: parseJsonArray(row.pathways),
        }));

      res.json(toPaginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      next(error);
    }
  });

  router.get('/compounds/:cpd', (req, res, next) => {
    try {
      const row = db
        .prepare(`
          SELECT
            cpd,
            compoundname,
            compoundclass,
            reference_ag,
            reference_count,
            ko_count,
            gene_count,
            pathway_count,
            toxicity_risk_mean,
            high_risk_endpoint_count,
            toxicity_scores,
            smiles,
            genes,
            pathways,
            updated_at
          FROM compound_summary
          WHERE cpd = ?
          LIMIT 1
        `)
        .get(req.params.cpd);

      if (!row) {
        res.json(null);
        return;
      }

      res.json({
        ...row,
        toxicity_scores: parseJsonObject(row.toxicity_scores),
        genes: parseJsonArray(row.genes),
        pathways: parseJsonArray(row.pathways),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/compounds/:cpd/kegg-image', keggLimiter, async (req, res, next) => {
    const cpd = String(req.params.cpd || '').trim().toUpperCase();

    if (!/^C\d{5}$/.test(cpd)) {
      res.status(400).type('text/plain').send('Invalid KEGG compound ID.');
      return;
    }

    try {
      const result = await getKeggImageCached(cpd);

      if (result.kind === 'not_found') {
        res
          .set('Cache-Control', 'public, max-age=3600')
          .status(404)
          .type('text/plain')
          .send('KEGG structure image not found.');
        return;
      }

      if (result.kind === 'invalid_payload') {
        res.status(502).type('text/plain').send(result.reason);
        return;
      }

      if (result.kind === 'upstream_error') {
        res.status(502).type('text/plain').send('Unable to retrieve KEGG structure image.');
        return;
      }

      res
        .set('Cache-Control', 'public, max-age=3600')
        .set('Content-Length', String(result.buffer.length))
        .type(result.contentType || 'image/gif')
        .send(result.buffer);
    } catch (error) {
      next(error);
    }
  });

  router.get('/compounds/:cpd/overview', (req, res, next) => {
    try {
      const cpd = req.params.cpd;
      const topKo = parseOverviewLimit(req.query.top_ko, 10);
      const topPathways = parseOverviewLimit(req.query.top_pathways, 10);

      const summary = db
        .prepare(
          `
            SELECT
              cpd,
              compoundname,
              compoundclass,
              reference_count,
              ko_count,
              gene_count,
              pathway_count,
              toxicity_risk_mean,
              high_risk_endpoint_count
            FROM compound_summary
            WHERE cpd = ?
            LIMIT 1
          `
        )
        .get(cpd);

      if (!summary) {
        res.status(404).json({ error: `Compound ${cpd} not found` });
        return;
      }

      const koBar = db
        .prepare(
          `
            SELECT
              ko,
              relation_count_total AS count,
              relation_count_hadeg,
              relation_count_kegg
            FROM compound_ko_overview
            WHERE cpd = ?
              AND relation_count_total > 0
            ORDER BY relation_count_total DESC, relation_count_hadeg DESC, relation_count_kegg DESC, ko ASC
            LIMIT ?
          `
        )
        .all(cpd, topKo);

      const pathwaysTopKegg = db
        .prepare(
          `
            SELECT
              source,
              pathway,
              supporting_rows
            FROM compound_pathway_card
            WHERE cpd = ?
              AND source = 'KEGG'
            ORDER BY supporting_rows DESC, pathway ASC
            LIMIT ?
          `
        )
        .all(cpd, topPathways);

      const pathwaysTopHadeg = db
        .prepare(
          `
            SELECT
              source,
              pathway,
              supporting_rows
            FROM compound_pathway_card
            WHERE cpd = ?
              AND source = 'HADEG'
            ORDER BY supporting_rows DESC, pathway ASC
            LIMIT ?
          `
        )
        .all(cpd, topPathways);

      const pathwaysAll = db
        .prepare(
          `
            SELECT
              source,
              pathway,
              supporting_rows
            FROM compound_pathway_card
            WHERE cpd = ?
              AND source IN ('KEGG', 'HADEG')
            ORDER BY source ASC, pathway ASC
          `
        )
        .all(cpd);

      const toxicityHeatmap = db
        .prepare(
          `
            SELECT
              endpoint,
              label,
              value
            FROM toxicity_endpoint
            WHERE cpd = ?
            ORDER BY endpoint ASC
          `
        )
        .all(cpd)
        .map((row) => ({
          ...row,
          risk_bucket: deriveRiskBucket(row.label),
        }));

      const pathwayScoreByName = new Map();
      for (const row of pathwaysAll) {
        const current = pathwayScoreByName.get(row.pathway) ?? 0;
        pathwayScoreByName.set(row.pathway, Math.max(current, Number(row.supporting_rows) || 0));
      }

      const selectedPathways = [...pathwayScoreByName.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, topPathways)
        .map(([pathway]) => pathway);

      const sourcePriority = ['KEGG', 'HADEG'];
      const sources = [...new Set(pathwaysAll.map((row) => row.source))].sort((a, b) => {
        const ai = sourcePriority.indexOf(a);
        const bi = sourcePriority.indexOf(b);
        if (ai !== -1 && bi !== -1) {
          return ai - bi;
        }
        if (ai !== -1) {
          return -1;
        }
        if (bi !== -1) {
          return 1;
        }
        return a.localeCompare(b);
      });

      const pathwayCellMap = new Map(
        pathwaysAll
          .filter((row) => selectedPathways.includes(row.pathway))
          .map((row) => [`${row.source}|${row.pathway}`, row])
      );

      const pathwayCoverageCells = [];
      for (const source of sources) {
        for (const pathway of selectedPathways) {
          const key = `${source}|${pathway}`;
          const row = pathwayCellMap.get(key);
          pathwayCoverageCells.push({
            source,
            pathway,
            present: row ? 1 : 0,
            weight: row ? Number(row.supporting_rows) || 0 : 0,
          });
        }
      }

      res.json({
        cpd,
        limits: {
          top_ko: topKo,
          top_pathways: topPathways,
        },
        summary,
        ko_bar: koBar.map((row) => ({
          ko: row.ko,
          count: Number(row.count) || 0,
          relation_count_hadeg: Number(row.relation_count_hadeg) || 0,
          relation_count_kegg: Number(row.relation_count_kegg) || 0,
        })),
        pathways_top_kegg: pathwaysTopKegg.map((row) => ({
          source: row.source,
          pathway: row.pathway,
          supporting_rows: Number(row.supporting_rows) || 0,
        })),
        pathways_top_hadeg: pathwaysTopHadeg.map((row) => ({
          source: row.source,
          pathway: row.pathway,
          supporting_rows: Number(row.supporting_rows) || 0,
        })),
        pathway_coverage: {
          sources,
          pathways: selectedPathways,
          cells: pathwayCoverageCells,
        },
        metric_basis: {
          ko_bar: 'distinct(cpd,ko,source,pathway)',
          pathways_top_kegg: 'distinct(cpd,ko,source,pathway)',
          pathways_top_hadeg: 'distinct(cpd,ko,source,pathway)',
          pathway_coverage_weight: 'distinct(cpd,ko,source,pathway)',
        },
        toxicity_heatmap: toxicityHeatmap.map((row) => ({
          endpoint: row.endpoint,
          label: row.label,
          value: row.value === null ? null : Number(row.value),
          risk_bucket: row.risk_bucket,
        })),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/compounds/:cpd/metadata', (req, res, next) => {
    try {
      const cpd = req.params.cpd;
      const emptyMetadata = createEmptyCompoundMetadata(cpd);

      if (!hasCompoundMetadataTable) {
        res.json(emptyMetadata);
        return;
      }

      const row = db
        .prepare(`
          SELECT metadata_json
          FROM compound_metadata
          WHERE cpd = ?
          LIMIT 1
        `)
        .get(cpd);

      if (!row?.metadata_json) {
        res.json(emptyMetadata);
        return;
      }

      const parsed = parseJsonObject(row.metadata_json);
      res.json({
        ...emptyMetadata,
        ...parsed,
        identifiers: {
          ...emptyMetadata.identifiers,
          ...(parsed.identifiers && typeof parsed.identifiers === 'object' ? parsed.identifiers : {}),
          cpd,
        },
        functional_annotation: {
          ...emptyMetadata.functional_annotation,
          ...(parsed.functional_annotation && typeof parsed.functional_annotation === 'object'
            ? parsed.functional_annotation
            : {}),
        },
        chemical_information: {
          ...emptyMetadata.chemical_information,
          ...(parsed.chemical_information && typeof parsed.chemical_information === 'object'
            ? parsed.chemical_information
            : {}),
        },
        provenance: {
          ...emptyMetadata.provenance,
          ...(parsed.provenance && typeof parsed.provenance === 'object' ? parsed.provenance : {}),
        },
        cross_references: {
          ...emptyMetadata.cross_references,
          ...(parsed.cross_references && typeof parsed.cross_references === 'object'
            ? parsed.cross_references
            : {}),
        },
        data_quality: {
          ...emptyMetadata.data_quality,
          ...(parsed.data_quality && typeof parsed.data_quality === 'object' ? parsed.data_quality : {}),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/compounds/:cpd/genes', (req, res, next) => {
    try {
      const { page, pageSize, offset } = getPagination(req.query);
      const where = ['cpd = ?'];
      const params = [req.params.cpd];

      if (req.query.search) {
        const search = likeValue(String(req.query.search));
        where.push(`
          (
            ko LIKE ? COLLATE NOCASE
            OR genesymbol LIKE ? COLLATE NOCASE
            OR genename LIKE ? COLLATE NOCASE
            OR enzyme_activity LIKE ? COLLATE NOCASE
            OR ec LIKE ? COLLATE NOCASE
          )
        `);
        params.push(search, search, search, search, search);
      }

      const whereSql = `WHERE ${where.join(' AND ')}`;
      const total = db
        .prepare(`SELECT COUNT(*) AS total FROM compound_gene_card ${whereSql}`)
        .get(...params).total;

      const rows = db
        .prepare(`
          SELECT
            cpd,
            ko,
            genesymbol,
            genename,
            enzyme_activity,
            ec,
            reaction_descriptions,
            supporting_rows,
            updated_at
          FROM compound_gene_card
          ${whereSql}
          ORDER BY supporting_rows DESC, genesymbol ASC, ko ASC
          LIMIT ? OFFSET ?
        `)
        .all(...params, pageSize, offset)
        .map((row) => {
          const reactionDescriptions = parseJsonArray(row.reaction_descriptions);
          return {
            ...row,
            reaction_descriptions: reactionDescriptions.slice(0, 10),
            reaction_descriptions_total: reactionDescriptions.length,
          };
        });

      res.json(toPaginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      next(error);
    }
  });

  router.get('/compounds/:cpd/pathways', (req, res, next) => {
    try {
      const { page, pageSize, offset } = getPagination(req.query);
      const where = ['cpd = ?'];
      const params = [req.params.cpd];

      if (req.query.source) {
        where.push('source = ?');
        params.push(String(req.query.source));
      }
      if (req.query.search) {
        where.push('pathway LIKE ? COLLATE NOCASE');
        params.push(likeValue(String(req.query.search)));
      }

      const whereSql = `WHERE ${where.join(' AND ')}`;
      const total = db
        .prepare(`SELECT COUNT(*) AS total FROM compound_pathway_card ${whereSql}`)
        .get(...params).total;

      const rows = db
        .prepare(`
          SELECT
            cpd,
            source,
            pathway,
            supporting_rows,
            updated_at
          FROM compound_pathway_card
          ${whereSql}
          ORDER BY source ASC, pathway ASC
          LIMIT ? OFFSET ?
        `)
        .all(...params, pageSize, offset);

      res.json(toPaginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      next(error);
    }
  });

  router.get('/compounds/:cpd/toxicity-profile', (req, res, next) => {
    try {
      const { page, pageSize, offset } = getPagination(req.query);
      const where = ['cpd = ?'];
      const params = [req.params.cpd];

      if (req.query.endpoint) {
        where.push('endpoint = ?');
        params.push(String(req.query.endpoint));
      }

      const whereSql = `WHERE ${where.join(' AND ')}`;
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
          ORDER BY endpoint ASC
          LIMIT ? OFFSET ?
        `)
        .all(...params, pageSize, offset);

      res.json(toPaginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      next(error);
    }
  });

  router.get('/compound-classes', (req, res, next) => {
    try {
      const { page, pageSize, offset } = getPagination(req.query);
      const where = ['cs.compoundclass IS NOT NULL', "TRIM(cs.compoundclass) <> ''"];
      const params = [];

      if (req.query.search) {
        where.push('cs.compoundclass LIKE ? COLLATE NOCASE');
        params.push(likeValue(String(req.query.search)));
      }

      const whereSql = `WHERE ${where.join(' AND ')}`;
      const total = db
        .prepare(`
          SELECT COUNT(*) AS total
          FROM (
            SELECT cs.compoundclass
            FROM compound_summary cs
            ${whereSql}
            GROUP BY cs.compoundclass
          )
        `)
        .get(...params).total;

      const rows = db
        .prepare(`
          SELECT
            cs.compoundclass,
            COUNT(DISTINCT cs.cpd) AS compound_count,
            COUNT(DISTINCT cgc.ko) AS ko_count,
            COUNT(DISTINCT cgc.genesymbol) AS gene_count,
            COUNT(DISTINCT CASE WHEN cpc.pathway IS NOT NULL AND cpc.source IS NOT NULL THEN cpc.source || '|' || cpc.pathway END) AS pathway_count,
            MAX(cs.updated_at) AS updated_at
          FROM compound_summary cs
          LEFT JOIN compound_gene_card cgc
            ON cgc.cpd = cs.cpd
          LEFT JOIN compound_pathway_card cpc
            ON cpc.cpd = cs.cpd
          ${whereSql}
          GROUP BY cs.compoundclass
          ORDER BY compound_count DESC, cs.compoundclass ASC
          LIMIT ? OFFSET ?
        `)
        .all(...params, pageSize, offset);

      res.json(toPaginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      next(error);
    }
  });

  router.get('/compound-classes/detail/overview', (req, res, next) => {
    try {
      const compoundclass = String(req.query.compoundclass || '').trim();
      if (!compoundclass) {
        res.status(400).json({ error: 'Missing required query parameter: compoundclass' });
        return;
      }

      const compounds = db
        .prepare(`
          SELECT
            cs.cpd,
            cs.compoundname
          FROM compound_summary cs
          WHERE cs.compoundclass = ?
          ORDER BY COALESCE(cs.compoundname, cs.cpd) ASC, cs.cpd ASC
        `)
        .all(compoundclass);

      if (compounds.length === 0) {
        res.status(404).json({ error: `Compound class "${compoundclass}" not found` });
        return;
      }

      const geneRows = db
        .prepare(`
          SELECT DISTINCT
            cgc.cpd,
            cgc.ko,
            cgc.genesymbol,
            cgc.ec
          FROM compound_gene_card cgc
          JOIN compound_summary cs
            ON cs.cpd = cgc.cpd
          WHERE cs.compoundclass = ?
        `)
        .all(compoundclass);

      const pathwayRows = db
        .prepare(`
          SELECT DISTINCT
            cpc.source,
            cpc.pathway
          FROM compound_pathway_card cpc
          JOIN compound_summary cs
            ON cs.cpd = cpc.cpd
          WHERE cs.compoundclass = ?
        `)
        .all(compoundclass);

      const koSet = new Set(geneRows.map((row) => row.ko).filter(Boolean));
      const geneSet = new Set(
        geneRows.map((row) => String(row.genesymbol || '').trim()).filter((value) => value.length > 0)
      );

      const koToCompounds = new Map();
      for (const row of geneRows) {
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
        .map(([ko, cpds]) => ({
          ko,
          count: cpds.size,
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
        .map(([gene, cpds]) => ({
          gene,
          count: cpds.size,
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

      const pathwaySet = new Set(
        pathwayRows
          .map((row) => {
            const source = String(row.source || '').trim();
            const pathway = String(row.pathway || '').trim();
            if (!source || !pathway) {
              return null;
            }
            return `${source}|${pathway}`;
          })
          .filter(Boolean)
      );

      const sourceSet = new Set(
        pathwayRows.map((row) => String(row.source || '').trim()).filter((value) => value.length > 0)
      );

      const endpoints = readDistinctStrings(db, `
        SELECT DISTINCT endpoint AS value
        FROM toxicity_endpoint
        ORDER BY endpoint ASC
      `);

      const toxicityRows = db
        .prepare(`
          SELECT
            te.cpd,
            te.endpoint,
            te.label,
            te.value
          FROM toxicity_endpoint te
          JOIN compound_summary cs
            ON cs.cpd = te.cpd
          WHERE cs.compoundclass = ?
          ORDER BY te.cpd ASC, te.endpoint ASC
        `)
        .all(compoundclass);

      const compoundsWithToxicity = new Set(toxicityRows.map((row) => row.cpd).filter(Boolean));
      const toxicityCoveragePct =
        compounds.length > 0 ? Math.round((compoundsWithToxicity.size / compounds.length) * 100) : null;

      res.json({
        compoundclass,
        summary: {
          compoundclass,
          ko_count: koSet.size,
          gene_count: geneSet.size,
          compound_count: compounds.length,
          reaction_ec_count: ecTokenSet.size,
          pathway_count: pathwaySet.size,
          source_count: sourceSet.size,
          toxicity_coverage_pct: toxicityCoveragePct,
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

  return router;
}
