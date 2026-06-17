/**
 * @packageDocumentation
 *
 * FAQ page that renders searchable question groups, inline guidance notes, and
 * quick links into key BioRemPP application modules.
 */
import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import type { View } from '@/app/routes';
import { FAQ_CATALOG } from '@/content/faq/catalog';
import { InlineStatusBanner, NoResultsState } from '@/shared/feedback';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  SectionHeader,
} from '@/shared/ui';
import type { FaqItem, FaqLink, FaqNoteType, FaqSection } from '../types/faq';

/**
 * Props accepted by the FAQ page.
 */
interface FaqPageProps {
  /** Route-level navigation callback used by shortcut buttons in the page header. */
  onNavigateToView: (view: View) => void;
}

/**
 * Flattens searchable FAQ content into a normalized search string.
 *
 * @param item FAQ item whose content should be indexed for client-side search.
 * @param sectionTitle Title of the section that owns the FAQ item.
 * @returns A lowercase search string containing the item's question, answer, and auxiliary fields.
 */
function buildItemSearchText(item: FaqItem, sectionTitle: string, sectionDescription?: string) {
  return [
    sectionTitle,
    sectionDescription,
    item.question,
    item.answer,
    item.code_example,
    item.note?.text,
    ...(item.bullets || []),
    ...(item.tags || []),
    ...(item.links || []).map((link) => `${link.label} ${'view' in link ? link.view : link.url}`),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function isInternalFaqLink(link: FaqLink): link is Extract<FaqLink, { view: View }> {
  return 'view' in link;
}

/**
 * Maps FAQ note types to inline-status banner tones.
 *
 * @param type FAQ note type declared in the catalog.
 * @returns The corresponding banner tone supported by the UI component.
 */
function noteTone(type: FaqNoteType): 'info' | 'warning' | 'success' {
  if (type === 'warning') {
    return 'warning';
  }
  if (type === 'success') {
    return 'success';
  }
  return 'info';
}

/**
 * Renders the FAQ page with grouped accordions, full-text client-side search, and quick navigation.
 *
 * @param props FAQ page navigation contract.
 * @returns The full FAQ route content.
 *
 * @remarks
 * When a search term is active, matching items expand automatically and the component stops
 * persisting manual accordion state until the search is cleared.
 */
export function FaqPage({ onNavigateToView }: FaqPageProps) {
  const [search, setSearch] = useState('');
  const [openItemIds, setOpenItemIds] = useState<string[]>([]);

  const normalizedSearch = search.trim().toLowerCase();
  const hasSearch = normalizedSearch.length > 0;

  const filteredSections = useMemo(() => {
    if (!hasSearch) {
      return FAQ_CATALOG.sections;
    }

    return FAQ_CATALOG.sections
      .map((section) => {
        const items = section.items.filter((item) =>
          buildItemSearchText(item, section.title, section.description).includes(normalizedSearch)
        );
        return {
          ...section,
          items,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [hasSearch, normalizedSearch]);

  const totalItems = useMemo(
    () => filteredSections.reduce((sum, section) => sum + section.items.length, 0),
    [filteredSections]
  );

  const expandedItems = useMemo(
    () => (hasSearch ? filteredSections.flatMap((section) => section.items.map((item) => item.id)) : openItemIds),
    [filteredSections, hasSearch, openItemIds]
  );

  function jumpToSection(sectionId: string) {
    const target = document.getElementById(`faq-section-${sectionId}`);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderSection(section: FaqSection) {
    return (
      <Card key={section.id} id={`faq-section-${section.id}`} className="overflow-hidden">
        <CardHeader className="border-b border-slate-200 pb-4">
          <CardTitle>{section.title}</CardTitle>
          {section.description ? (
            <CardDescription className="max-w-3xl text-sm leading-6 text-slate-600">
              {section.description}
            </CardDescription>
          ) : null}
          <p className="text-xs text-slate-500">
            {section.items.length} question{section.items.length === 1 ? '' : 's'}
          </p>
        </CardHeader>

        <CardContent className="pb-2 pt-0">
          <Accordion
            type="multiple"
            value={expandedItems}
            onValueChange={(values) => {
              if (!hasSearch) {
                setOpenItemIds(values);
              }
            }}
          >
            {section.items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm leading-6 text-slate-700">
                    <p>{item.answer}</p>

                    {item.bullets && item.bullets.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-5">
                        {item.bullets.map((bullet, index) => (
                          <li key={`${item.id}-bullet-${index}`}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}

                    {item.code_example ? (
                      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-xs text-slate-100 whitespace-pre-wrap">
                        {item.code_example}
                      </pre>
                    ) : null}

                    {item.links && item.links.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">References</p>
                        <ul className="list-disc space-y-1 pl-5">
                          {item.links.map((link, index) => (
                            <li key={`${item.id}-link-${index}`}>
                              {isInternalFaqLink(link) ? (
                                <button
                                  type="button"
                                  onClick={() => onNavigateToView(link.view)}
                                  className="text-accent underline-offset-4 hover:underline"
                                >
                                  {link.label}
                                </button>
                              ) : (
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent underline-offset-4 hover:underline"
                                >
                                  {link.label}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {item.note ? (
                      <InlineStatusBanner tone={noteTone(item.note.type)}>{item.note.text}</InlineStatusBanner>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader
            eyebrow="Support"
            title={FAQ_CATALOG.title}
            description={FAQ_CATALOG.intro}
            action={<Badge variant="subtle">{FAQ_CATALOG.language.toUpperCase()}</Badge>}
          />

          <div className="flex flex-wrap gap-2">
            {FAQ_CATALOG.header_actions.map((action, index) =>
              isInternalFaqLink(action) ? (
                <Button
                  key={`${action.label}-${index}`}
                  variant={index === 0 ? 'subtle' : 'outline'}
                  onClick={() => onNavigateToView(action.view)}
                >
                  {action.label}
                </Button>
              ) : (
                <Button key={`${action.label}-${index}`} asChild variant={index === 0 ? 'subtle' : 'outline'}>
                  <a href={action.url} target="_blank" rel="noopener noreferrer">
                    {action.label}
                  </a>
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="order-2 space-y-4 xl:order-1">
          {filteredSections.length === 0 ? (
            <NoResultsState message="No FAQ entries matched your search. Try broader keywords." />
          ) : (
            filteredSections.map(renderSection)
          )}
        </div>

        <aside className="order-1 xl:sticky xl:top-24 xl:order-2">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-slate-200 bg-slate-50/80">
              <CardTitle className="text-base">Quick Navigation</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search FAQ..."
                  className="pl-10"
                />
              </div>

              <p className="text-xs text-slate-500">
                {totalItems} question{totalItems === 1 ? '' : 's'} in view
              </p>

              <nav className="max-h-[60vh] space-y-1 overflow-y-auto pr-1">
                {filteredSections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => jumpToSection(section.id)}
                    className="h-auto w-full justify-start rounded-xl px-2 py-2 text-left text-sm text-slate-700"
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>
                      {section.title} ({section.items.length})
                    </span>
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
