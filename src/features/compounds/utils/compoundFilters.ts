/**
 * @packageDocumentation
 *
 * Client-side compound filtering helpers used by explorer views and cached result sets.
 */
import type { CompoundFilters, CompoundSummary } from '@/features/compounds/types';

function parseReferenceList(value: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Checks whether a compound summary includes a given reference agency label.
 *
 * @param compound Compound summary being evaluated.
 * @param referenceAg Reference agency label to match.
 * @returns `true` when the compound references the provided agency.
 */
export function containsReference(compound: CompoundSummary, referenceAg: string) {
  return parseReferenceList(compound.reference_ag).includes(referenceAg);
}

/**
 * Applies client-side filter rules to a set of compound summaries.
 *
 * @param compounds Compound summaries to evaluate.
 * @param filters Current explorer filter set.
 * @returns The subset of compounds that satisfy every active filter.
 * @remarks
 * Empty filter values are ignored. The free-text search matches against the compound identifier and
 * the normalized compound name.
 */
export function applyCompoundFilters(compounds: CompoundSummary[], filters: CompoundFilters) {
  return compounds.filter((compound) => {
    if (filters.compoundclass && compound.compoundclass !== filters.compoundclass) {
      return false;
    }

    if (filters.reference_ag && !containsReference(compound, filters.reference_ag)) {
      return false;
    }

    if (filters.pathway && !compound.pathways.includes(filters.pathway)) {
      return false;
    }

    if (filters.gene && !compound.genes.includes(filters.gene)) {
      return false;
    }

    if (filters.ko_count_min !== undefined && compound.ko_count < filters.ko_count_min) {
      return false;
    }

    if (filters.ko_count_max !== undefined && compound.ko_count > filters.ko_count_max) {
      return false;
    }

    if (filters.gene_count_min !== undefined && compound.gene_count < filters.gene_count_min) {
      return false;
    }

    if (filters.gene_count_max !== undefined && compound.gene_count > filters.gene_count_max) {
      return false;
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      const name = (compound.compoundname || '').toLowerCase();
      const cpd = compound.cpd.toLowerCase();
      if (!name.includes(search) && !cpd.includes(search)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Derives option metadata from an in-memory compound result set.
 *
 * @param compounds Compound summaries used to infer available filter values.
 * @returns Sorted unique values for compound classes, reference agencies, genes, and pathways.
 */
export function getCompoundFilterMetadata(compounds: CompoundSummary[]) {
  const classSet = new Set<string>();
  const referenceSet = new Set<string>();
  const geneSet = new Set<string>();
  const pathwaySet = new Set<string>();

  for (const compound of compounds) {
    if (compound.compoundclass) {
      classSet.add(compound.compoundclass);
    }

    for (const referenceAg of parseReferenceList(compound.reference_ag)) {
      referenceSet.add(referenceAg);
    }

    for (const gene of compound.genes) {
      if (gene) {
        geneSet.add(gene);
      }
    }

    for (const pathway of compound.pathways) {
      if (pathway) {
        pathwaySet.add(pathway);
      }
    }
  }

  return {
    compoundClasses: [...classSet].sort((a, b) => a.localeCompare(b)),
    referenceAGs: [...referenceSet].sort((a, b) => a.localeCompare(b)),
    genes: [...geneSet].sort((a, b) => a.localeCompare(b)),
    pathways: [...pathwaySet].sort((a, b) => a.localeCompare(b)),
  };
}
