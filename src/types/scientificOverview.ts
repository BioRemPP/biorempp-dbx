/**
 * @packageDocumentation
 *
 * Editorial contracts for the Scientific Overview page and the related home CTA.
 */

/**
 * Stable identifiers for the scientific overview macrosections.
 */
export type ScientificOverviewSectionId =
  | 'scientific-foundations'
  | 'data-science'
  | 'fair-principles'
  | 'multiomics';

/**
 * Page header shown in the scientific overview hero block.
 */
export interface ScientificOverviewHeader {
  eyebrow: string;
  title: string;
  subtitle: string;
}

/**
 * Home CTA content reused inside the scientific context block.
 */
export interface ScientificOverviewHomeCta {
  title: string;
  description: string;
  button_label: string;
}

/**
 * Quick-navigation copy shown above the scientific overview section links.
 */
export interface ScientificOverviewQuickNav {
  title: string;
  description: string;
}

/**
 * One cited supporting reference rendered in scientific overview disclosures.
 */
export interface ScientificOverviewReference {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  note: string;
}

/**
 * One scientific concept card in the foundations section.
 */
export interface ScientificFoundationTerm {
  id: string;
  label: string;
  summary: string;
  definition: string;
  application: string;
  use_cases: string[];
  references: ScientificOverviewReference[];
}

/**
 * Foundations macrosection content.
 */
export interface ScientificFoundationsSection {
  id: 'scientific-foundations';
  eyebrow: string;
  title: string;
  description: string;
  terms: ScientificFoundationTerm[];
}

/**
 * One data-science subsection rendered in an accordion.
 */
export interface ScientificDataScienceCategory {
  id: string;
  title: string;
  summary: string;
  methods: string[];
  applications: string[];
  references: ScientificOverviewReference[];
}

/**
 * Data science macrosection content.
 */
export interface ScientificDataScienceSection {
  id: 'data-science';
  eyebrow: string;
  title: string;
  description: string;
  categories: ScientificDataScienceCategory[];
}

/**
 * One FAIR principle card.
 */
export interface ScientificFairPrinciple {
  id: string;
  label: string;
  description: string;
  implementations: string[];
}

/**
 * One integrated database card.
 */
export interface ScientificIntegratedDatabase {
  id: string;
  name: string;
  type: string;
  description: string;
  data_points: string[];
}

/**
 * One additional scientific resource card.
 */
export interface ScientificResource {
  id: string;
  title: string;
  focus: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  relevance: string;
}

/**
 * FAIR and integrated-database macrosection content.
 */
export interface ScientificBioremediationSection {
  id: 'fair-principles';
  eyebrow: string;
  title: string;
  description: string;
  fair_principles: ScientificFairPrinciple[];
  integrated_databases_title: string;
  integrated_databases: ScientificIntegratedDatabase[];
  resources_title: string;
  resources: ScientificResource[];
}

/**
 * One core identifier that anchors interoperability across resources.
 */
export interface ScientificIdentifier {
  id: string;
  label: string;
  description: string;
  example: string;
  sources: string[];
}

/**
 * One omics-layer framing card.
 */
export interface ScientificOmicsLayer {
  id: string;
  label: string;
  status_label: string;
  status_tone: 'success' | 'subtle' | 'warning';
  description: string;
  key_identifiers: string[];
  note: string;
}

/**
 * One external tool or framework entry documented for interoperability.
 */
export interface ScientificTool {
  id: string;
  name: string;
  summary: string;
  interoperable_ids: string[];
  integration_example: string;
  reference_title: string;
  reference_citation: string;
  reference_url: string;
}

/**
 * One grouped interoperability block, such as genomics or metabolomics tools.
 */
export interface ScientificToolGroup {
  id: string;
  title: string;
  description: string;
  tools: ScientificTool[];
}

/**
 * Multi-omics and interoperability macrosection content.
 */
export interface ScientificMultiomicsSection {
  id: 'multiomics';
  eyebrow: string;
  title: string;
  description: string;
  framework_title: string;
  framework_description: string;
  core_identifiers: ScientificIdentifier[];
  omics_layers: ScientificOmicsLayer[];
  interoperability_title: string;
  interoperability_description: string;
  interoperability_groups: ScientificToolGroup[];
}

/**
 * Full scientific overview catalog assembled from the editorial YAML domain.
 */
export interface ScientificOverviewCatalog {
  version: string;
  header: ScientificOverviewHeader;
  home_cta: ScientificOverviewHomeCta;
  quick_nav: ScientificOverviewQuickNav;
  section_order: ScientificOverviewSectionId[];
  sections: {
    scientificFoundations: ScientificFoundationsSection;
    dataScience: ScientificDataScienceSection;
    fairPrinciples: ScientificBioremediationSection;
    multiomics: ScientificMultiomicsSection;
  };
}
