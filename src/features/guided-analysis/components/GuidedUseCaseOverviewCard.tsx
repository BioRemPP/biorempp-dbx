import type { GuidedUseCaseDescription } from '@/features/guided-analysis/types';
import type { ReactNode } from 'react';
import { AlertTriangle, Eye, HelpCircle, Lightbulb } from 'lucide-react';

interface GuidedUseCaseOverviewCardProps {
  content: GuidedUseCaseDescription;
  headerAction?: ReactNode;
}

function OverviewSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
      <div className="flex items-center gap-2 text-slate-900">
        {icon}
        <h5 className="text-sm font-semibold">{title}</h5>
      </div>
      <div className="text-sm leading-6 text-slate-600">{children}</div>
    </section>
  );
}

export function GuidedUseCaseOverviewCard({
  content,
  headerAction,
}: GuidedUseCaseOverviewCardProps) {
  const hasVisualElements = Array.isArray(content.visual_elements) && content.visual_elements.length > 0;
  const interpretationGuidelines = Array.isArray(content.interpretation_guidelines)
    ? content.interpretation_guidelines.slice(0, 2)
    : [];
  const limitations = Array.isArray(content.limitations) ? content.limitations.slice(0, 2) : [];

  return (
    <section className="rounded-2xl border border-teal-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-teal-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-slate-950">Analysis Overview</h4>
          <p className="text-sm text-slate-600">
            Key context for understanding what this use case answers and how to read the results.
          </p>
        </div>
        {headerAction ? (
          <div className="flex flex-wrap items-center justify-end gap-2">{headerAction}</div>
        ) : null}
      </div>

      <div className="grid gap-4 px-6 py-5 lg:grid-cols-2">
        <OverviewSection
          icon={<HelpCircle className="h-4 w-4 text-emerald-700" />}
          title="What this analysis answers"
        >
          <p className="italic">{content.scientific_question}</p>
        </OverviewSection>

        <OverviewSection
          icon={<Lightbulb className="h-4 w-4 text-amber-600" />}
          title="What this analysis does"
        >
          <p>{content.description}</p>
        </OverviewSection>

        {hasVisualElements ? (
          <div className="lg:col-span-2">
            <OverviewSection
              icon={<Eye className="h-4 w-4 text-blue-700" />}
              title="What you will see"
            >
              <ul className="list-disc space-y-2 pl-5">
                {content.visual_elements?.map((item, index) => (
                  <li key={`${item.label}-${index}`}>
                    <span className="font-semibold text-slate-800">{item.label}:</span> {item.description}
                  </li>
                ))}
              </ul>
            </OverviewSection>
          </div>
        ) : null}

        {interpretationGuidelines.length ? (
          <OverviewSection
            icon={<Lightbulb className="h-4 w-4 text-amber-600" />}
            title="How to interpret"
          >
            <ul className="list-disc space-y-2 pl-5">
              {interpretationGuidelines.map((statement, index) => (
                <li key={`interpretation-${index}`}>{statement}</li>
              ))}
            </ul>
          </OverviewSection>
        ) : null}

        {limitations.length ? (
          <OverviewSection
            icon={<AlertTriangle className="h-4 w-4 text-rose-600" />}
            title="Interpretation limits"
          >
            <ul className="list-disc space-y-2 pl-5">
              {limitations.map((statement, index) => (
                <li key={`limitation-${index}`}>{statement}</li>
              ))}
            </ul>
          </OverviewSection>
        ) : null}
      </div>
    </section>
  );
}
