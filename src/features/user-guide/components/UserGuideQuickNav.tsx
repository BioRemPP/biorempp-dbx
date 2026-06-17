import type { UserGuideCategorySection } from '@/types/userGuide';
import { Button, Card, CardContent, SectionHeader } from '@/shared/ui';

interface UserGuideQuickNavProps {
  title: string;
  description: string;
  categories: UserGuideCategorySection[];
}

export function UserGuideQuickNav({ title, description, categories }: UserGuideQuickNavProps) {
  return (
    <Card>
      <CardContent className="space-y-4 px-6 py-6">
        <SectionHeader eyebrow="Navigation" title={title} description={description} />

        <nav aria-label="User guide quick navigation">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                asChild
                variant="outline"
                size="sm"
                className="h-auto w-full flex-col items-start justify-start gap-0.5 rounded-xl border-slate-200 px-4 py-3 text-left"
              >
                <a href={`#${category.id}`}>
                  <p className="text-xs font-medium text-slate-400">{category.eyebrow}</p>
                  <p className="text-sm font-semibold text-slate-950">{category.label}</p>
                </a>
              </Button>
            ))}
          </div>
        </nav>
      </CardContent>
    </Card>
  );
}
