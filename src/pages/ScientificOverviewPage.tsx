/**
 * @packageDocumentation
 *
 * Long-form editorial page that expands the scientific context block from the home route.
 */
import { SCIENTIFIC_OVERVIEW_CATALOG } from '@/content/scientific-overview/catalog';
import { ScientificBioremediationSection } from '@/features/scientific-overview/components/ScientificBioremediationSection';
import { ScientificDataScienceSection } from '@/features/scientific-overview/components/ScientificDataScienceSection';
import { ScientificFoundationsSection } from '@/features/scientific-overview/components/ScientificFoundationsSection';
import { ScientificMultiomicsSection } from '@/features/scientific-overview/components/ScientificMultiomicsSection';
import { ScientificOverviewQuickNav } from '@/features/scientific-overview/components/ScientificOverviewQuickNav';
import { Card, CardContent, SectionHeader } from '@/shared/ui';
import type { ScientificOverviewSectionId } from '@/types/scientificOverview';

function sectionTitleById(sectionId: ScientificOverviewSectionId) {
  const sections = SCIENTIFIC_OVERVIEW_CATALOG.sections;
  switch (sectionId) {
    case 'scientific-foundations':
      return {
        title: sections.scientificFoundations.title,
        description: sections.scientificFoundations.description,
      };
    case 'data-science':
      return {
        title: sections.dataScience.title,
        description: sections.dataScience.description,
      };
    case 'fair-principles':
      return {
        title: sections.fairPrinciples.title,
        description: sections.fairPrinciples.description,
      };
    case 'multiomics':
      return {
        title: sections.multiomics.title,
        description: sections.multiomics.description,
      };
  }
}

function renderSection(sectionId: ScientificOverviewSectionId) {
  const sections = SCIENTIFIC_OVERVIEW_CATALOG.sections;
  switch (sectionId) {
    case 'scientific-foundations':
      return <ScientificFoundationsSection key={sectionId} section={sections.scientificFoundations} />;
    case 'data-science':
      return <ScientificDataScienceSection key={sectionId} section={sections.dataScience} />;
    case 'fair-principles':
      return <ScientificBioremediationSection key={sectionId} section={sections.fairPrinciples} />;
    case 'multiomics':
      return <ScientificMultiomicsSection key={sectionId} section={sections.multiomics} />;
  }
}

export function ScientificOverviewPage() {
  const catalog = SCIENTIFIC_OVERVIEW_CATALOG;
  const quickNavItems = catalog.section_order.map((sectionId) => ({
    id: sectionId,
    label: sectionTitleById(sectionId).title,
    description: sectionTitleById(sectionId).description,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 px-6 py-6">
          <SectionHeader
            eyebrow={catalog.header.eyebrow}
            title={catalog.header.title}
            description={catalog.header.subtitle}
            descriptionClassName="max-w-none xl:whitespace-nowrap"
          />
        </CardContent>
      </Card>

      <ScientificOverviewQuickNav
        title={catalog.quick_nav.title}
        description={catalog.quick_nav.description}
        items={quickNavItems}
      />

      {catalog.section_order.map((sectionId) => renderSection(sectionId))}
    </div>
  );
}
