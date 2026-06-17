/**
 * @packageDocumentation
 *
 * Home-page summary section for Scope and Limitations, plus the detailed interpretation modal.
 */
import { useState } from 'react';
import type { LimitationsEditorialCatalog, LimitationsTone } from '@/types/limitations';
import { Button, Card, CardContent, SectionHeader } from '@/shared/ui';
import { LimitationsDialog } from './LimitationsDialog';

interface HomeLimitationsSectionProps {
  /** Catalog content rendered in the home teaser and modal. */
  content: LimitationsEditorialCatalog;
  /** Callback used to open the shared Terms dialog from the modal footer. */
  onOpenTerms: () => void;
}

function toneCardClassName(tone: LimitationsTone) {
  switch (tone) {
    case 'warning':
      return 'border-amber-200 bg-amber-50/70';
    case 'success':
      return 'border-emerald-200 bg-emerald-50/70';
    case 'info':
      return 'border-blue-200 bg-blue-50/70';
    default:
      return 'border-slate-200 bg-white';
  }
}

/**
 * Renders the home teaser for interpretation boundaries and owns the detailed modal open state.
 */
export function HomeLimitationsSection({ content, onOpenTerms }: HomeLimitationsSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="space-y-6 px-6 py-6">
          <SectionHeader
            eyebrow={content.home_component.eyebrow}
            title={content.home_component.title}
            description={content.home_component.subtitle}
            action={
              <Button variant="outline" onClick={() => setOpen(true)}>
                {content.home_component.cta_label}
              </Button>
            }
          />

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5">
            <p className="max-w-4xl text-sm leading-7 text-slate-600">{content.home_component.intro}</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {content.home_component.summary_cards.map((card) => (
                <div
                  key={card.id}
                  className={`rounded-2xl border px-4 py-4 shadow-soft ${toneCardClassName(card.tone)}`}
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-950">{card.title}</h3>
                    <p className="text-sm leading-6 text-slate-600">{card.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <LimitationsDialog open={open} onOpenChange={setOpen} content={content} onOpenTerms={onOpenTerms} />
    </>
  );
}
