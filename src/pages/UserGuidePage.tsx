/**
 * @packageDocumentation
 *
 * User guide landing page that renders workflow guidance, quick navigation, and
 * module-specific usage notes for the main BioRemPP explorer surfaces.
 */
import type { View } from '@/app/routes';
import { USER_GUIDE_CATALOG } from '@/content/user-guide/catalog';
import { Card, CardContent, SectionHeader } from '@/shared/ui';
import { UserGuideCategorySection } from '@/features/user-guide/components/UserGuideCategorySection';
import { UserGuideQuickNav } from '@/features/user-guide/components/UserGuideQuickNav';
import { UserGuideWorkflowSection } from '@/features/user-guide/components/UserGuideWorkflowSection';

/**
 * Props accepted by the user guide page.
 */
interface UserGuidePageProps {
  /** Route-level navigation callback used by category CTA buttons. */
  onNavigateToView: (view: View) => void;
}

/**
 * Renders the BioRemPP user guide page from the declarative user guide catalog.
 *
 * @param props User guide navigation contract.
 * @returns Workflow guidance, module summaries, and navigation actions for the main explorer views.
 */
export function UserGuidePage({ onNavigateToView }: UserGuidePageProps) {
  const guide = USER_GUIDE_CATALOG;
  const compoundPair = guide.categories.filter(
    (category) => category.id === 'compounds' || category.id === 'compound-classes'
  );
  const genePathwayPair = guide.categories.filter(
    (category) => category.id === 'genes' || category.id === 'pathways'
  );
  const remainingCategories = guide.categories.filter(
    (category) =>
      category.id !== 'compounds' &&
      category.id !== 'compound-classes' &&
      category.id !== 'genes' &&
      category.id !== 'pathways'
  );

  return (
    <div className="space-y-6">
      <UserGuideWorkflowSection title={guide.workflow.title} steps={guide.workflow.steps} />

      <UserGuideQuickNav
        title={guide.quick_nav.title}
        description={guide.quick_nav.description}
        categories={guide.categories}
      />

      {compoundPair.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {compoundPair.map((category) => (
            <UserGuideCategorySection
              key={category.id}
              category={category}
              onNavigateToView={onNavigateToView}
            />
          ))}
        </div>
      ) : null}

      {genePathwayPair.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {genePathwayPair.map((category) => (
            <UserGuideCategorySection
              key={category.id}
              category={category}
              onNavigateToView={onNavigateToView}
            />
          ))}
        </div>
      ) : null}

      {remainingCategories.map((category) => (
        <UserGuideCategorySection
          key={category.id}
          category={category}
          onNavigateToView={onNavigateToView}
        />
      ))}

      <Card>
        <CardContent className="space-y-4 px-6 py-6">
          <SectionHeader eyebrow="Interpretation" title="Working across modules" />
          <div className="surface-muted px-5 py-5">
            <p className="text-sm leading-6 text-slate-600">{guide.closing_note}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
