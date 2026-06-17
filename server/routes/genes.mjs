import express from 'express';
import {
  getPagination,
  parseNumber,
  likeValue,
  toPaginatedResponse,
  parseJsonArray,
  parseJsonObject,
  isMissingToken,
  parseStringTokens,
  readDistinctStrings,
  deriveRiskBucket,
} from '../shared/query.mjs';

export function createGenesRouter({ db }) {
  const router = express.Router();

  router.get('/genes/:ko', (req, res, next) => {
    try {
      const ko = String(req.params.ko || '').trim().toUpperCase();
      if (!ko) {
        res.status(400).json({ error: 'Missing required parameter: ko' });
        return;
      }

      const gene = db
        .prepare(`
          SELECT
            ko,
            genesymbol,
            genename,
            compound_count,
            pathway_count,
            enzyme_activities,
            updated_at
          FROM gene_summary
          WHERE ko = ?
        `)
        .get(ko);

      if (!gene) {
        res.status(404).json({ error: `Gene "${ko}" not found` });
        return;
      }

      const compoundClassCount = db
        .prepare(`
          SELECT COUNT(DISTINCT cs.compoundclass) AS total
          FROM compound_gene_card cgc
          JOIN compound_summary cs
            ON cs.cpd = cgc.cpd
          WHERE cgc.ko = ?
            AND cs.compoundclass IS NOT NULL
            AND TRIM(cs.compoundclass) <> ''
        `)
        .get(ko).total;

      const referenceAgencyCount = db
        .prepare(`
          SELECT COUNT(DISTINCT crm.reference_ag) AS total
          FROM compound_reference_map crm
          JOIN (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          ) cpd_scope
            ON cpd_scope.cpd = crm.cpd
        `)
        .get(ko).total;

      const toxicityCounts = db
        .prepare(`
          SELECT
            COUNT(*) AS total_compounds,
            SUM(CASE WHEN cs.toxicity_risk_mean IS NOT NULL THEN 1 ELSE 0 END) AS with_toxicity
          FROM (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          ) cpd_scope
          JOIN compound_summary cs
            ON cs.cpd = cpd_scope.cpd
        `)
        .get(ko);

      const toxicityCoveragePct =
        toxicityCounts.total_compounds > 0
          ? Math.round((toxicityCounts.with_toxicity / toxicityCounts.total_compounds) * 100)
          : null;

      res.json({
        ko: gene.ko,
        genesymbol: gene.genesymbol,
        genename: gene.genename,
        compound_count: gene.compound_count,
        pathway_count: gene.pathway_count,
        enzyme_activities: parseJsonArray(gene.enzyme_activities),
        compound_class_count: compoundClassCount,
        reference_agency_count: referenceAgencyCount,
        toxicity_coverage_pct: toxicityCoveragePct,
        updated_at: gene.updated_at,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/genes/:ko/overview', (req, res, next) => {
    try {
      const ko = String(req.params.ko || '').trim().toUpperCase();
      if (!ko) {
        res.status(400).json({ error: 'Missing required parameter: ko' });
        return;
      }

      const exists = db.prepare('SELECT 1 FROM gene_summary WHERE ko = ? LIMIT 1').get(ko);
      if (!exists) {
        res.status(404).json({ error: `Gene "${ko}" not found` });
        return;
      }

      const linkedCompoundsTotal = db
        .prepare(`
          SELECT COUNT(*) AS total
          FROM (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          )
        `)
        .get(ko).total;

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
            te.value,
            cs.compoundname
          FROM toxicity_endpoint te
          JOIN (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          ) cpd_scope
            ON cpd_scope.cpd = te.cpd
          LEFT JOIN compound_summary cs
            ON cs.cpd = te.cpd
          ORDER BY COALESCE(cs.compoundname, te.cpd) ASC, te.cpd ASC, te.endpoint ASC
        `)
        .all(ko);

      const compoundsWithToxicity = new Map();
      for (const row of toxicityRows) {
        const cpd = String(row.cpd || '').trim();
        if (!cpd) {
          continue;
        }
        if (!compoundsWithToxicity.has(cpd)) {
          compoundsWithToxicity.set(cpd, {
            cpd,
            compoundname: row.compoundname || null,
          });
        }
      }

      const compounds = [...compoundsWithToxicity.values()];
      const toxicityCompounds = compounds.length;
      const excludedNoToxicity = Math.max(0, linkedCompoundsTotal - toxicityCompounds);
      const toxicityCoveragePct =
        linkedCompoundsTotal > 0 ? Math.round((toxicityCompounds / linkedCompoundsTotal) * 100) : null;

      res.json({
        ko,
        summary: {
          linked_compounds_total: linkedCompoundsTotal,
          toxicity_compounds: toxicityCompounds,
          excluded_no_toxicity: excludedNoToxicity,
          endpoint_count: endpoints.length,
          toxicity_coverage_pct: toxicityCoveragePct,
        },
        toxicity_matrix: {
          compounds,
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

  router.get('/genes/:ko/compounds', (req, res, next) => {
    try {
      const ko = String(req.params.ko || '').trim().toUpperCase();
      if (!ko) {
        res.status(400).json({ error: 'Missing required parameter: ko' });
        return;
      }

      const exists = db.prepare('SELECT 1 FROM gene_summary WHERE ko = ? LIMIT 1').get(ko);
      if (!exists) {
        res.status(404).json({ error: `Gene "${ko}" not found` });
        return;
      }

      const { page, pageSize, offset } = getPagination(req.query);

      const total = db
        .prepare(`
          SELECT COUNT(*) AS total
          FROM (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          )
        `)
        .get(ko).total;

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
            cs.smiles,
            cs.updated_at
          FROM compound_summary cs
          JOIN (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          ) cpd_scope
            ON cpd_scope.cpd = cs.cpd
          ORDER BY COALESCE(cs.compoundname, cs.cpd) ASC, cs.cpd ASC
          LIMIT ? OFFSET ?
        `)
        .all(ko, pageSize, offset);

      res.json(toPaginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      next(error);
    }
  });

  router.get('/genes/:ko/metadata', (req, res, next) => {
    try {
      const ko = String(req.params.ko || '').trim().toUpperCase();
      if (!ko) {
        res.status(400).json({ error: 'Missing required parameter: ko' });
        return;
      }

      const gene = db
        .prepare(`
          SELECT
            ko,
            genesymbol,
            genename,
            compound_count,
            pathway_count,
            updated_at
          FROM gene_summary
          WHERE ko = ?
        `)
        .get(ko);

      if (!gene) {
        res.status(404).json({ error: `Gene "${ko}" not found` });
        return;
      }

      const compounds = db
        .prepare(`
          SELECT
            cs.cpd,
            cs.compoundname,
            cs.compoundclass,
            cs.smiles,
            cs.toxicity_risk_mean
          FROM compound_summary cs
          JOIN (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          ) cpd_scope
            ON cpd_scope.cpd = cs.cpd
        `)
        .all(ko);

      const compoundClassSet = new Set();
      const smilesSet = new Set();
      const smilesMap = new Map();
      let toxicityWithCoverage = 0;

      for (const compound of compounds) {
        const compoundClass = String(compound.compoundclass || '').trim();
        if (!isMissingToken(compoundClass)) {
          compoundClassSet.add(compoundClass);
        }

        const smiles = String(compound.smiles || '').trim();
        if (!isMissingToken(smiles)) {
          smilesSet.add(smiles);
          if (!smilesMap.has(smiles)) {
            smilesMap.set(smiles, String(compound.compoundname || '').trim() || null);
          }
        }

        if (compound.toxicity_risk_mean !== null && compound.toxicity_risk_mean !== undefined) {
          toxicityWithCoverage += 1;
        }
      }

      const toxicityCoveragePct =
        compounds.length > 0 ? Math.round((toxicityWithCoverage / compounds.length) * 100) : null;

      const pathwayBySource = db
        .prepare(`
          SELECT
            source,
            COUNT(DISTINCT pathway) AS pathway_count
          FROM compound_ko_pathway_rel
          WHERE ko = ?
          GROUP BY source
        `)
        .all(ko);

      const pathwaysBySource = {
        HADEG: 0,
        KEGG: 0,
        COMPOUND_PATHWAY: 0,
      };
      for (const row of pathwayBySource) {
        const source = String(row.source || '').trim();
        if (source in pathwaysBySource) {
          pathwaysBySource[source] = row.pathway_count;
        }
      }

      const referenceAgencyCount = db
        .prepare(`
          SELECT COUNT(DISTINCT crm.reference_ag) AS total
          FROM compound_reference_map crm
          JOIN (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          ) cpd_scope
            ON cpd_scope.cpd = crm.cpd
        `)
        .get(ko).total;

      const metadataRows = db
        .prepare(`
          SELECT cm.metadata_json
          FROM compound_metadata cm
          JOIN (
            SELECT DISTINCT cpd
            FROM compound_gene_card
            WHERE ko = ?
          ) cpd_scope
            ON cpd_scope.cpd = cm.cpd
        `)
        .all(ko);

      const chebiSet = new Set();
      const chebiMap = new Map();
      for (const row of metadataRows) {
        const payload = parseJsonObject(row.metadata_json);
        const chebi = String(
          payload?.cross_references?.chebi || payload?.identifiers?.chebi_id || ''
        ).trim();
        if (!isMissingToken(chebi)) {
          chebiSet.add(chebi);
          const compoundName = String(
            payload?.identifiers?.compound_name || payload?.chemical_information?.compound_name || ''
          ).trim();
          if (!chebiMap.has(chebi)) {
            chebiMap.set(chebi, compoundName || null);
          }
        }
      }

      const cardRows = db
        .prepare(`
          SELECT
            enzyme_activity,
            ec,
            reactions,
            reaction_descriptions
          FROM compound_gene_card
          WHERE ko = ?
        `)
        .all(ko);

      const enzymeActivitySet = new Set();
      const ecSet = new Set();
      const reactionIdSet = new Set();
      const reactionDescriptionMap = new Map();

      for (const row of cardRows) {
        const enzymeActivity = String(row.enzyme_activity || '').trim();
        if (!isMissingToken(enzymeActivity)) {
          enzymeActivitySet.add(enzymeActivity);
        }

        for (const token of parseStringTokens(row.ec)) {
          ecSet.add(token);
        }

        const reactionIds = parseStringTokens(row.reactions);
        const reactionDescriptions = parseStringTokens(row.reaction_descriptions, { allowCommaSplit: false });

        for (const token of reactionIds) {
          reactionIdSet.add(token);
        }

        if (reactionIds.length > 0 && reactionDescriptions.length > 0) {
          if (reactionIds.length === reactionDescriptions.length) {
            for (let i = 0; i < reactionIds.length; i += 1) {
              const id = reactionIds[i];
              const description = reactionDescriptions[i];
              if (!reactionDescriptionMap.has(id)) {
                reactionDescriptionMap.set(id, description);
              }
            }
          } else if (reactionDescriptions.length === 1) {
            const description = reactionDescriptions[0];
            for (const id of reactionIds) {
              if (!reactionDescriptionMap.has(id)) {
                reactionDescriptionMap.set(id, description);
              }
            }
          }
        }
      }

      const dataSources = [
        { name: 'BioRemPP', role: 'Core KO-gene-compound mapping', color: 'green' },
      ];
      if (pathwaysBySource.HADEG > 0) {
        dataSources.push({ name: 'HADEG', role: 'Hydrocarbon degradation pathways', color: 'blue' });
      }
      if (pathwaysBySource.KEGG > 0) {
        dataSources.push({ name: 'KEGG', role: 'Metabolic pathway annotation', color: 'purple' });
      }
      if (toxicityWithCoverage > 0) {
        dataSources.push({ name: 'ToxCSM', role: 'Toxicity prediction for linked compounds', color: 'orange' });
      }

      const sortedChebi = [...chebiSet].sort((a, b) => a.localeCompare(b));
      const sortedSmiles = [...smilesSet].sort((a, b) => a.localeCompare(b));
      const sortedReactions = [...reactionIdSet].sort((a, b) => a.localeCompare(b));
      const sortedEc = [...ecSet].sort((a, b) => a.localeCompare(b));

      res.json({
        identifiers: {
          ko: gene.ko,
          gene_symbol: gene.genesymbol,
          gene_name: gene.genename,
          kegg_ko_id: gene.ko,
          ec_numbers: sortedEc,
          chebi_ids: sortedChebi,
          smiles: sortedSmiles,
          reaction_ids: sortedReactions,
          chebi_items: sortedChebi.map((id) => ({
            id,
            compound_name: chebiMap.get(id) || null,
          })),
          smiles_items: sortedSmiles.map((value) => ({
            value,
            compound_name: smilesMap.get(value) || null,
          })),
          reaction_items: sortedReactions.map((id) => ({
            id,
            description: reactionDescriptionMap.get(id) || null,
          })),
        },
        data_sources: dataSources,
        quantitative_overview: {
          linked_compounds: compounds.length,
          compound_classes: compoundClassSet.size,
          pathway_annotations: gene.pathway_count,
          pathways_hadeg: pathwaysBySource.HADEG,
          pathways_kegg: pathwaysBySource.KEGG,
          pathways_compound_pathway: pathwaysBySource.COMPOUND_PATHWAY,
          ec_count: ecSet.size,
          enzyme_activity_count: enzymeActivitySet.size,
          reference_agencies: referenceAgencyCount,
          toxicity_coverage_pct: toxicityCoveragePct,
          reaction_id_count: sortedReactions.length,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/genes', (req, res, next) => {
    try {
      const { page, pageSize, offset } = getPagination(req.query);
      const where = [];
      const params = [];

      if (req.query.genesymbol) {
        where.push('genesymbol = ?');
        params.push(String(req.query.genesymbol));
      }

      const compoundMin = parseNumber(req.query.compound_count_min);
      if (compoundMin !== undefined) {
        where.push('compound_count >= ?');
        params.push(compoundMin);
      }

      const compoundMax = parseNumber(req.query.compound_count_max);
      if (compoundMax !== undefined) {
        where.push('compound_count <= ?');
        params.push(compoundMax);
      }

      if (req.query.search) {
        const search = likeValue(String(req.query.search));
        where.push('(genesymbol LIKE ? COLLATE NOCASE OR genename LIKE ? COLLATE NOCASE OR ko LIKE ? COLLATE NOCASE)');
        params.push(search, search, search);
      }

      const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
      const total = db
        .prepare(`SELECT COUNT(*) AS total FROM gene_summary ${whereSql}`)
        .get(...params).total;

      const rows = db
        .prepare(`
          SELECT
            ko,
            genesymbol,
            genename,
            compound_count,
            pathway_count,
            enzyme_activities,
            updated_at
          FROM gene_summary
          ${whereSql}
          ORDER BY compound_count DESC, ko ASC
          LIMIT ? OFFSET ?
        `)
        .all(...params, pageSize, offset)
        .map((row) => ({
          ...row,
          enzyme_activities: parseJsonArray(row.enzyme_activities),
        }));

      res.json(toPaginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
