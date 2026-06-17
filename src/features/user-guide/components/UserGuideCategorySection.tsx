import type { View } from '@/app/routes';
import type { UserGuideCategorySection as UserGuideCategorySectionType } from '@/types/userGuide';
import { Button, Card, CardContent, SectionHeader } from '@/shared/ui';
import { Zap, SlidersHorizontal, LayoutList } from 'lucide-react';

interface UserGuideCategorySectionProps {
  category: UserGuideCategorySectionType;
  onNavigateToView: (view: View) => void;
}

function InfoColumn({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  return (
    <div className="flex flex-col gap-3 border-l-2 border-accent pl-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-accent" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">{title}</p>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-5 text-slate-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UserGuideCategorySection({ category, onNavigateToView }: UserGuideCategorySectionProps) {
  return (
    <Card id={category.id} className="scroll-mt-6">
      <CardContent className="space-y-6 px-6 py-6">
        <SectionHeader
          eyebrow={category.eyebrow}
          title={category.label}
          description={category.summary}
          action={
            <Button variant="subtle" onClick={() => onNavigateToView(category.target_view)}>
              {category.cta_label}
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <InfoColumn icon={Zap} title="Key actions" items={category.capabilities} />
          <InfoColumn icon={SlidersHorizontal} title="Filters" items={category.filters} />
          <InfoColumn icon={LayoutList} title="What you get" items={category.outputs} />
        </div>

        <div className="flex flex-wrap items-baseline gap-x-1 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
            When to use
          </span>
          {category.when_to_use.map((item, index) => (
            <span key={item} className="text-sm leading-6 text-emerald-900">
              {item}
              {index < category.when_to_use.length - 1 && (
                <span className="mx-1.5 select-none text-emerald-400">·</span>
              )}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
