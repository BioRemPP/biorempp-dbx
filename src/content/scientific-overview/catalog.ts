/**
 * @packageDocumentation
 *
 * Loader and validator for the Scientific Overview editorial domain.
 */
import { parse as parseYaml } from 'yaml';
import { assertNonEmptyString, assertNonEmptyStringArray, assertObject } from '../shared/guards';
import type {
  ScientificBioremediationSection,
  ScientificDataScienceCategory,
  ScientificDataScienceSection,
  ScientificFairPrinciple,
  ScientificFoundationTerm,
  ScientificFoundationsSection,
  ScientificIdentifier,
  ScientificIntegratedDatabase,
  ScientificMultiomicsSection,
  ScientificOmicsLayer,
  ScientificOverviewCatalog,
  ScientificOverviewReference,
  ScientificOverviewSectionId,
  ScientificResource,
  ScientificTool,
  ScientificToolGroup,
} from '../../types/scientificOverview';
import rawBioremediationYaml from '../editorial/scientific_overview/bioremediation.yaml?raw';
import rawDataScienceYaml from '../editorial/scientific_overview/datascience.yaml?raw';
import rawIndexYaml from '../editorial/scientific_overview/index.yaml?raw';
import rawMultiomicsYaml from '../editorial/scientific_overview/multiomics.yaml?raw';
import rawScientificYaml from '../editorial/scientific_overview/scientific.yaml?raw';

const EXPECTED_SECTION_ORDER: ScientificOverviewSectionId[] = [
  'scientific-foundations',
  'data-science',
  'fair-principles',
  'multiomics',
];

const ALLOWED_OMICS_TONES = new Set(['success', 'subtle', 'warning']);

function parseYamlDocument(rawYaml: string, label: string) {
  try {
    return parseYaml(rawYaml);
  } catch (error) {
    throw new Error(
      `Invalid scientific overview config YAML syntax in ${label}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

function assertNonEmptyObjectArray(value: unknown, path: string) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid scientific overview config at ${path}: expected non-empty array`);
  }
  return value;
}

function assertYear(value: unknown, path: string) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid scientific overview config at ${path}: expected positive number`);
  }
  return value;
}

function normalizeReference(rawValue: unknown, path: string): ScientificOverviewReference {
  const reference = assertObject(rawValue, path);
  return {
    id: assertNonEmptyString(reference.id, `${path}.id`),
    title: assertNonEmptyString(reference.title, `${path}.title`),
    authors: assertNonEmptyString(reference.authors, `${path}.authors`),
    journal: assertNonEmptyString(reference.journal, `${path}.journal`),
    year: assertYear(reference.year, `${path}.year`),
    url: assertNonEmptyString(reference.url, `${path}.url`),
    note: assertNonEmptyString(reference.note, `${path}.note`),
  };
}

function normalizeFoundationTerm(rawValue: unknown, path: string): ScientificFoundationTerm {
  const term = assertObject(rawValue, path);
  const referencesRaw = assertNonEmptyObjectArray(term.references, `${path}.references`);
  return {
    id: assertNonEmptyString(term.id, `${path}.id`),
    label: assertNonEmptyString(term.label, `${path}.label`),
    summary: assertNonEmptyString(term.summary, `${path}.summary`),
    definition: assertNonEmptyString(term.definition, `${path}.definition`),
    application: assertNonEmptyString(term.application, `${path}.application`),
    use_cases: assertNonEmptyStringArray(term.use_cases, `${path}.use_cases`),
    references: referencesRaw.map((reference, index) =>
      normalizeReference(reference, `${path}.references[${index}]`)
    ),
  };
}

function normalizeFoundationsSection(rawValue: unknown): ScientificFoundationsSection {
  const root = assertObject(rawValue, 'scientific.yaml');
  const section = assertObject(root.section, 'scientific.section');
  const termsRaw = assertNonEmptyObjectArray(section.terms, 'scientific.section.terms');
  return {
    id: 'scientific-foundations',
    eyebrow: assertNonEmptyString(section.eyebrow, 'scientific.section.eyebrow'),
    title: assertNonEmptyString(section.title, 'scientific.section.title'),
    description: assertNonEmptyString(section.description, 'scientific.section.description'),
    terms: termsRaw.map((term, index) => normalizeFoundationTerm(term, `scientific.section.terms[${index}]`)),
  };
}

function normalizeDataScienceCategory(rawValue: unknown, path: string): ScientificDataScienceCategory {
  const category = assertObject(rawValue, path);
  const referencesRaw = assertNonEmptyObjectArray(category.references, `${path}.references`);
  return {
    id: assertNonEmptyString(category.id, `${path}.id`),
    title: assertNonEmptyString(category.title, `${path}.title`),
    summary: assertNonEmptyString(category.summary, `${path}.summary`),
    methods: assertNonEmptyStringArray(category.methods, `${path}.methods`),
    applications: assertNonEmptyStringArray(category.applications, `${path}.applications`),
    references: referencesRaw.map((reference, index) =>
      normalizeReference(reference, `${path}.references[${index}]`)
    ),
  };
}

function normalizeDataScienceSection(rawValue: unknown): ScientificDataScienceSection {
  const root = assertObject(rawValue, 'datascience.yaml');
  const section = assertObject(root.section, 'datascience.section');
  const categoriesRaw = assertNonEmptyObjectArray(section.categories, 'datascience.section.categories');
  return {
    id: 'data-science',
    eyebrow: assertNonEmptyString(section.eyebrow, 'datascience.section.eyebrow'),
    title: assertNonEmptyString(section.title, 'datascience.section.title'),
    description: assertNonEmptyString(section.description, 'datascience.section.description'),
    categories: categoriesRaw.map((category, index) =>
      normalizeDataScienceCategory(category, `datascience.section.categories[${index}]`)
    ),
  };
}

function normalizeFairPrinciple(rawValue: unknown, path: string): ScientificFairPrinciple {
  const principle = assertObject(rawValue, path);
  return {
    id: assertNonEmptyString(principle.id, `${path}.id`),
    label: assertNonEmptyString(principle.label, `${path}.label`),
    description: assertNonEmptyString(principle.description, `${path}.description`),
    implementations: assertNonEmptyStringArray(principle.implementations, `${path}.implementations`),
  };
}

function normalizeIntegratedDatabase(rawValue: unknown, path: string): ScientificIntegratedDatabase {
  const database = assertObject(rawValue, path);
  return {
    id: assertNonEmptyString(database.id, `${path}.id`),
    name: assertNonEmptyString(database.name, `${path}.name`),
    type: assertNonEmptyString(database.type, `${path}.type`),
    description: assertNonEmptyString(database.description, `${path}.description`),
    data_points: assertNonEmptyStringArray(database.data_points, `${path}.data_points`),
  };
}

function normalizeResource(rawValue: unknown, path: string): ScientificResource {
  const resource = assertObject(rawValue, path);
  return {
    id: assertNonEmptyString(resource.id, `${path}.id`),
    title: assertNonEmptyString(resource.title, `${path}.title`),
    focus: assertNonEmptyString(resource.focus, `${path}.focus`),
    authors: assertNonEmptyString(resource.authors, `${path}.authors`),
    journal: assertNonEmptyString(resource.journal, `${path}.journal`),
    year: assertYear(resource.year, `${path}.year`),
    url: assertNonEmptyString(resource.url, `${path}.url`),
    relevance: assertNonEmptyString(resource.relevance, `${path}.relevance`),
  };
}

function normalizeBioremediationSection(rawValue: unknown): ScientificBioremediationSection {
  const root = assertObject(rawValue, 'bioremediation.yaml');
  const section = assertObject(root.section, 'bioremediation.section');
  const fairPrinciplesRaw = assertNonEmptyObjectArray(
    section.fair_principles,
    'bioremediation.section.fair_principles'
  );
  const databasesRaw = assertNonEmptyObjectArray(
    section.integrated_databases,
    'bioremediation.section.integrated_databases'
  );
  const resourcesRaw = assertNonEmptyObjectArray(section.resources, 'bioremediation.section.resources');
  return {
    id: 'fair-principles',
    eyebrow: assertNonEmptyString(section.eyebrow, 'bioremediation.section.eyebrow'),
    title: assertNonEmptyString(section.title, 'bioremediation.section.title'),
    description: assertNonEmptyString(section.description, 'bioremediation.section.description'),
    fair_principles: fairPrinciplesRaw.map((principle, index) =>
      normalizeFairPrinciple(principle, `bioremediation.section.fair_principles[${index}]`)
    ),
    integrated_databases_title: assertNonEmptyString(
      section.integrated_databases_title,
      'bioremediation.section.integrated_databases_title'
    ),
    integrated_databases: databasesRaw.map((database, index) =>
      normalizeIntegratedDatabase(database, `bioremediation.section.integrated_databases[${index}]`)
    ),
    resources_title: assertNonEmptyString(section.resources_title, 'bioremediation.section.resources_title'),
    resources: resourcesRaw.map((resource, index) =>
      normalizeResource(resource, `bioremediation.section.resources[${index}]`)
    ),
  };
}

function normalizeIdentifier(rawValue: unknown, path: string): ScientificIdentifier {
  const identifier = assertObject(rawValue, path);
  return {
    id: assertNonEmptyString(identifier.id, `${path}.id`),
    label: assertNonEmptyString(identifier.label, `${path}.label`),
    description: assertNonEmptyString(identifier.description, `${path}.description`),
    example: assertNonEmptyString(identifier.example, `${path}.example`),
    sources: assertNonEmptyStringArray(identifier.sources, `${path}.sources`),
  };
}

function normalizeOmicsLayer(rawValue: unknown, path: string): ScientificOmicsLayer {
  const layer = assertObject(rawValue, path);
  const statusTone = assertNonEmptyString(layer.status_tone, `${path}.status_tone`);
  if (!ALLOWED_OMICS_TONES.has(statusTone)) {
    throw new Error(
      `Invalid scientific overview config at ${path}.status_tone: expected one of success|subtle|warning`
    );
  }
  return {
    id: assertNonEmptyString(layer.id, `${path}.id`),
    label: assertNonEmptyString(layer.label, `${path}.label`),
    status_label: assertNonEmptyString(layer.status_label, `${path}.status_label`),
    status_tone: statusTone as ScientificOmicsLayer['status_tone'],
    description: assertNonEmptyString(layer.description, `${path}.description`),
    key_identifiers: assertNonEmptyStringArray(layer.key_identifiers, `${path}.key_identifiers`),
    note: assertNonEmptyString(layer.note, `${path}.note`),
  };
}

function normalizeTool(rawValue: unknown, path: string): ScientificTool {
  const tool = assertObject(rawValue, path);
  return {
    id: assertNonEmptyString(tool.id, `${path}.id`),
    name: assertNonEmptyString(tool.name, `${path}.name`),
    summary: assertNonEmptyString(tool.summary, `${path}.summary`),
    interoperable_ids: assertNonEmptyStringArray(tool.interoperable_ids, `${path}.interoperable_ids`),
    integration_example: assertNonEmptyString(tool.integration_example, `${path}.integration_example`),
    reference_title: assertNonEmptyString(tool.reference_title, `${path}.reference_title`),
    reference_citation: assertNonEmptyString(tool.reference_citation, `${path}.reference_citation`),
    reference_url: assertNonEmptyString(tool.reference_url, `${path}.reference_url`),
  };
}

function normalizeToolGroup(rawValue: unknown, path: string): ScientificToolGroup {
  const group = assertObject(rawValue, path);
  const toolsRaw = assertNonEmptyObjectArray(group.tools, `${path}.tools`);
  return {
    id: assertNonEmptyString(group.id, `${path}.id`),
    title: assertNonEmptyString(group.title, `${path}.title`),
    description: assertNonEmptyString(group.description, `${path}.description`),
    tools: toolsRaw.map((tool, index) => normalizeTool(tool, `${path}.tools[${index}]`)),
  };
}

function normalizeMultiomicsSection(rawValue: unknown): ScientificMultiomicsSection {
  const root = assertObject(rawValue, 'multiomics.yaml');
  const section = assertObject(root.section, 'multiomics.section');
  const identifiersRaw = assertNonEmptyObjectArray(section.core_identifiers, 'multiomics.section.core_identifiers');
  const layersRaw = assertNonEmptyObjectArray(section.omics_layers, 'multiomics.section.omics_layers');
  const groupsRaw = assertNonEmptyObjectArray(
    section.interoperability_groups,
    'multiomics.section.interoperability_groups'
  );
  return {
    id: 'multiomics',
    eyebrow: assertNonEmptyString(section.eyebrow, 'multiomics.section.eyebrow'),
    title: assertNonEmptyString(section.title, 'multiomics.section.title'),
    description: assertNonEmptyString(section.description, 'multiomics.section.description'),
    framework_title: assertNonEmptyString(section.framework_title, 'multiomics.section.framework_title'),
    framework_description: assertNonEmptyString(
      section.framework_description,
      'multiomics.section.framework_description'
    ),
    core_identifiers: identifiersRaw.map((identifier, index) =>
      normalizeIdentifier(identifier, `multiomics.section.core_identifiers[${index}]`)
    ),
    omics_layers: layersRaw.map((layer, index) =>
      normalizeOmicsLayer(layer, `multiomics.section.omics_layers[${index}]`)
    ),
    interoperability_title: assertNonEmptyString(
      section.interoperability_title,
      'multiomics.section.interoperability_title'
    ),
    interoperability_description: assertNonEmptyString(
      section.interoperability_description,
      'multiomics.section.interoperability_description'
    ),
    interoperability_groups: groupsRaw.map((group, index) =>
      normalizeToolGroup(group, `multiomics.section.interoperability_groups[${index}]`)
    ),
  };
}

export interface ScientificOverviewRawCatalogs {
  indexYaml: string;
  scientificYaml: string;
  datascienceYaml: string;
  bioremediationYaml: string;
  multiomicsYaml: string;
}

export function parseScientificOverviewCatalog(rawCatalogs: ScientificOverviewRawCatalogs): ScientificOverviewCatalog {
  const indexRoot = assertObject(parseYamlDocument(rawCatalogs.indexYaml, 'index.yaml'), 'scientific-overview.index');
  const header = assertObject(indexRoot.header, 'scientific-overview.index.header');
  const homeCta = assertObject(indexRoot.home_cta, 'scientific-overview.index.home_cta');
  const quickNav = assertObject(indexRoot.quick_nav, 'scientific-overview.index.quick_nav');
  const sectionOrderRaw = indexRoot.section_order;

  if (!Array.isArray(sectionOrderRaw) || sectionOrderRaw.length !== EXPECTED_SECTION_ORDER.length) {
    throw new Error(
      `Invalid scientific overview config at scientific-overview.index.section_order: expected exactly ${EXPECTED_SECTION_ORDER.length} items`
    );
  }

  const sectionOrder = sectionOrderRaw.map((entry, index) =>
    assertNonEmptyString(entry, `scientific-overview.index.section_order[${index}]`)
  ) as ScientificOverviewSectionId[];

  sectionOrder.forEach((sectionId, index) => {
    if (sectionId !== EXPECTED_SECTION_ORDER[index]) {
      throw new Error(
        `Invalid scientific overview config at scientific-overview.index.section_order[${index}]: expected "${EXPECTED_SECTION_ORDER[index]}"`
      );
    }
  });

  return {
    version: assertNonEmptyString(indexRoot.version, 'scientific-overview.index.version'),
    header: {
      eyebrow: assertNonEmptyString(header.eyebrow, 'scientific-overview.index.header.eyebrow'),
      title: assertNonEmptyString(header.title, 'scientific-overview.index.header.title'),
      subtitle: assertNonEmptyString(header.subtitle, 'scientific-overview.index.header.subtitle'),
    },
    home_cta: {
      title: assertNonEmptyString(homeCta.title, 'scientific-overview.index.home_cta.title'),
      description: assertNonEmptyString(homeCta.description, 'scientific-overview.index.home_cta.description'),
      button_label: assertNonEmptyString(
        homeCta.button_label,
        'scientific-overview.index.home_cta.button_label'
      ),
    },
    quick_nav: {
      title: assertNonEmptyString(quickNav.title, 'scientific-overview.index.quick_nav.title'),
      description: assertNonEmptyString(
        quickNav.description,
        'scientific-overview.index.quick_nav.description'
      ),
    },
    section_order: sectionOrder,
    sections: {
      scientificFoundations: normalizeFoundationsSection(
        parseYamlDocument(rawCatalogs.scientificYaml, 'scientific.yaml')
      ),
      dataScience: normalizeDataScienceSection(parseYamlDocument(rawCatalogs.datascienceYaml, 'datascience.yaml')),
      fairPrinciples: normalizeBioremediationSection(
        parseYamlDocument(rawCatalogs.bioremediationYaml, 'bioremediation.yaml')
      ),
      multiomics: normalizeMultiomicsSection(parseYamlDocument(rawCatalogs.multiomicsYaml, 'multiomics.yaml')),
    },
  };
}

export function loadScientificOverviewCatalog(): ScientificOverviewCatalog {
  return parseScientificOverviewCatalog({
    indexYaml: rawIndexYaml,
    scientificYaml: rawScientificYaml,
    datascienceYaml: rawDataScienceYaml,
    bioremediationYaml: rawBioremediationYaml,
    multiomicsYaml: rawMultiomicsYaml,
  });
}

export const SCIENTIFIC_OVERVIEW_CATALOG = loadScientificOverviewCatalog();
