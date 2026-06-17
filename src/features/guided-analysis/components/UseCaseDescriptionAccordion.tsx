/**
 * @packageDocumentation
 *
 * Expandable narrative panel for guided analysis use-case descriptions, interpretation guidance,
 * and limitations.
 */
import { useId, useState } from 'react';
import type { GuidedUseCaseDescription } from '@/features/guided-analysis/types';
import type { ReactNode } from 'react';
import { AlertTriangle, Eye, HelpCircle, Info, Lightbulb } from 'lucide-react';

/**
 * Props accepted by the guided use-case description accordion.
 */
interface UseCaseDescriptionAccordionProps {
  /** Narrative use-case content declared by the selected guided query. */
  content: GuidedUseCaseDescription;
  /** Optional action rendered beside the accordion toggle in the header. */
  headerAction?: ReactNode;
}

/**
 * Renders an expandable use-case description panel for the selected guided query.
 *
 * @param props Use-case narrative content and optional header action.
 * @returns An accordion section containing scientific question, description, interpretation, and limitations.
 *
 * @remarks
 * Interpretation guidelines and limitations are rendered only when the selected use case exposes
 * those optional arrays in its declarative content contract.
 */
export function UseCaseDescriptionAccordion({ content, headerAction }: UseCaseDescriptionAccordionProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const hasVisualElements = Array.isArray(content.visual_elements) && content.visual_elements.length > 0;
  const interpretationGuidelines = Array.isArray(content.interpretation_guidelines)
    ? content.interpretation_guidelines
    : [];
  const limitations = Array.isArray(content.limitations) ? content.limitations : [];
  const hasLimitations = limitations.length > 0;

  return (
    <section className="rounded-lg border border-teal-200 bg-white shadow-sm">
      <div className="px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-base font-semibold text-gray-900">View Use Case Description</h4>
        <div className="flex flex-wrap items-center justify-end gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={contentId}
            className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {open ? 'Hide' : 'Show'}
          </button>
          {headerAction}
        </div>
      </div>

      {open ? (
        <div id={contentId} role="region" className="space-y-5 border-t border-teal-100 px-6 pb-5 pt-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <HelpCircle className="h-4 w-4" />
              <h5 className="text-sm font-semibold">Scientific Question</h5>
            </div>
            <p className="mt-1 pl-6 text-sm italic text-slate-600">{content.scientific_question}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sky-700">
              <Info className="h-4 w-4" />
              <h5 className="text-sm font-semibold">Description</h5>
            </div>
            <p className="mt-1 pl-6 text-sm leading-6 text-slate-600">{content.description}</p>
          </div>

          {hasVisualElements ? (
            <div>
              <div className="flex items-center gap-2 text-blue-700">
                <Eye className="h-4 w-4" />
                <h5 className="text-sm font-semibold">Visual Elements</h5>
              </div>
              <ul className="mt-2 list-disc space-y-2 pl-11 text-sm leading-6 text-slate-600">
                {content.visual_elements?.map((item, idx) => (
                  <li key={`${item.label}-${idx}`}>
                    <span className="font-semibold text-slate-800">{item.label}:</span> {item.description}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <div className="flex items-center gap-2 text-amber-500">
              <Lightbulb className="h-4 w-4" />
              <h5 className="text-sm font-semibold">Interpretation</h5>
            </div>
            <ul className="mt-2 list-disc space-y-2 pl-11 text-sm leading-6 text-slate-600">
              {interpretationGuidelines.map((statement, idx) => (
                <li key={`interpretation-${idx}`}>{statement}</li>
              ))}
            </ul>
          </div>

          {hasLimitations ? (
            <div>
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
                <h5 className="text-sm font-semibold">Limitations</h5>
              </div>
              <ul className="mt-2 list-disc space-y-2 pl-11 text-sm leading-6 text-slate-600">
                {limitations.map((statement, idx) => (
                  <li key={`limitation-${idx}`}>{statement}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
