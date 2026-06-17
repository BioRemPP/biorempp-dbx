/**
 * @packageDocumentation
 *
 * Landing page composition for the BioRemPP explorer home route, including editorial content,
 * download disclosures, and entry points into guided analysis and database navigation.
 */
import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowUpRight, Check, ChevronDown, Clipboard, Database, Download, FileSpreadsheet, Play, Quote } from 'lucide-react';
import type { View } from '@/app/routes';
import { DOWNLOAD_CATALOG } from '@/content/downloads/catalog';
import { HOME_EDITORIAL_CATALOG } from '@/content/home/catalog';
import { LIMITATIONS_EDITORIAL_CATALOG } from '@/content/limitations/catalog';
import { SCIENTIFIC_OVERVIEW_CATALOG } from '@/content/scientific-overview/catalog';
import { cn } from '@/shared/lib/cn';
import { Badge, Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, SectionHeader } from '@/shared/ui';
import { DatabaseSnapshotSection } from '@/features/home/components/DatabaseSnapshotSection';
import { HomeLimitationsSection } from '@/features/home/components/HomeLimitationsSection';
import { TermsOfUseDialog } from '@/features/home/components/TermsOfUseDialog';
import { UserGuideIntroCard } from '@/features/home/components/UserGuideIntroCard';

/**
 * Props accepted by the home landing page.
 */
interface HomePageProps {
  /** Route-level navigation callback used by hero and browse actions. */
  onNavigateToView: (view: View) => void;
}

/**
 * Resolves the icon used for a download package format badge.
 *
 * @param format Package format declared in the download catalog.
 * @returns The icon component associated with the supplied format.
 */
function iconForFormat(format: string) {
  return format.toUpperCase() === 'SQLITE' ? Database : FileSpreadsheet;
}

/**
 * Renders a list of editorial paragraphs with a shared text style.
 *
 * @param items Paragraph strings to render.
 * @param className Tailwind class string applied to each paragraph.
 * @returns A paragraph element for each input string.
 */
function renderParagraphs(items: string[], className: string) {
  return items.map((paragraph) => (
    <p key={paragraph} className={className}>
      {paragraph}
    </p>
  ));
}

async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function extractCitationBody(block: string, prefix: string) {
  return block.startsWith(prefix) ? block.slice(prefix.length).trim() : null;
}

const homeAlignedSectionGridClass = 'grid grid-cols-1 gap-6 xl:grid-cols-2';

/**
 * Compact card used to preview a downloadable data package before opening the release dialog.
 */
function DownloadCatalogCard({
  item,
  onReview,
  showReviewButton = true,
}: {
  /** Download package selected from the public release catalog. */
  item: (typeof DOWNLOAD_CATALOG.items)[number];
  /** Callback used to open the review dialog for the selected package. */
  onReview: (id: string) => void;
  /** Whether the card should render the review button. */
  showReviewButton?: boolean;
}) {
  const Icon = iconForFormat(item.format);

  return (
    <Card className={cn('rounded-2xl border-slate-200 bg-slate-50/70 shadow-soft', !showReviewButton && 'h-full')}>
      <CardContent
        className={cn(
          'space-y-4 px-4 py-4',
          !showReviewButton && 'flex h-full min-h-[11.5rem] flex-col justify-between'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-950">{item.label}</p>
            <p className="text-xs text-slate-500">{item.source}</p>
          </div>
          <Badge variant="outline">{item.format}</Badge>
        </div>

        <div className="space-y-1 text-xs text-slate-600">
          <p>Version: {item.version}</p>
          {item.size ? <p>Size: {item.size}</p> : null}
          {item.updated_at ? <p>Updated: {item.updated_at}</p> : null}
        </div>

        {showReviewButton ? (
          <Button className="w-full justify-between" onClick={() => onReview(item.id)}>
            <span className="inline-flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {HOME_EDITORIAL_CATALOG.downloads.disclaimer_title}
            </span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

/**
 * Browse section that maps editorial home categories to application views.
 */
function BrowseByCategorySection({
  onNavigateToView,
}: {
  /** Navigation callback invoked when a category button is selected. */
  onNavigateToView: (view: View) => void;
}) {
  const browseSection = HOME_EDITORIAL_CATALOG.browse_section;

  return (
    <Card className="h-full">
      <CardContent className="space-y-6 px-6 py-6">
        <SectionHeader
          eyebrow={browseSection.eyebrow}
          title={browseSection.title}
          description={browseSection.description}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {browseSection.items.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              size="lg"
              onClick={() => onNavigateToView(item.id)}
              className="h-auto w-full justify-start whitespace-normal rounded-2xl border-slate-200 px-4 py-3 text-left"
            >
              <div className="min-w-0 max-w-full space-y-1">
                <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                <p className="text-xs leading-5 text-slate-600 whitespace-normal break-words">{item.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Renders the BioRemPP landing page and coordinates hero dialogs, download review state,
 * and shortcuts into the main explorer areas.
 *
 * @param props Home page navigation contract.
 * @returns The composed home route content.
 */
export function HomePage({ onNavigateToView }: HomePageProps) {
  const [selectedDownloadId, setSelectedDownloadId] = useState<string | null>(null);
  const [howToCiteOpen, setHowToCiteOpen] = useState(false);
  const [copiedCitationKey, setCopiedCitationKey] = useState<'apa' | 'bibtex' | null>(null);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [downloadsExpanded, setDownloadsExpanded] = useState(false);
  const homeContent = HOME_EDITORIAL_CATALOG;
  const limitationsContent = LIMITATIONS_EDITORIAL_CATALOG;

  const selectedDownload = useMemo(
    () => DOWNLOAD_CATALOG.items.find((item) => item.id === selectedDownloadId) || null,
    [selectedDownloadId]
  );
  const selectedHeroModal = homeContent.hero.modals.how_to_cite;
  const howToCiteIntro = selectedHeroModal.paragraphs.find(
    (paragraph) =>
      !paragraph.startsWith('Database (APA):') &&
      !paragraph.startsWith('Database (BibTeX):') &&
      !paragraph.startsWith('BioRemPP DBX Service (placeholder):')
  );
  const apaCitation = extractCitationBody(
    selectedHeroModal.paragraphs.find((paragraph) => paragraph.startsWith('Database (APA):')) ?? '',
    'Database (APA):'
  );
  const bibtexCitation = extractCitationBody(
    selectedHeroModal.paragraphs.find((paragraph) => paragraph.startsWith('Database (BibTeX):')) ?? '',
    'Database (BibTeX):'
  );
  const dbxPlaceholder = extractCitationBody(
    selectedHeroModal.paragraphs.find((paragraph) => paragraph.startsWith('BioRemPP DBX Service (placeholder):')) ?? '',
    'BioRemPP DBX Service (placeholder):'
  );
  const primaryDownload = DOWNLOAD_CATALOG.items[0] || null;
  const secondaryDownloads = DOWNLOAD_CATALOG.items.slice(1);
  const downloadsDisclosureId = 'other-database-downloads-panel';

  async function handleCopyCitation(key: 'apa' | 'bibtex', value: string) {
    try {
      await copyTextToClipboard(value);
      setCopiedCitationKey(key);
      window.setTimeout(() => setCopiedCitationKey((current) => (current === key ? null : current)), 1400);
    } catch (error) {
      console.error('Failed to copy citation block:', error);
      setCopiedCitationKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className={homeAlignedSectionGridClass}>
        <Card className="h-full">
          <CardContent className="flex h-full flex-col gap-4 px-6 py-6">
            <div className="space-y-2">
              <SectionHeader eyebrow={homeContent.scientific_overview.eyebrow} title={homeContent.hero.title} />
              <p className="text-sm font-medium leading-6 text-slate-600 sm:text-base">
                {homeContent.hero.access_statement}
              </p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="flex w-full max-w-4xl flex-col space-y-4 text-center">
                <div className="space-y-3">
                  {renderParagraphs(homeContent.hero.description, 'text-sm leading-7 text-slate-600 sm:text-base')}
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-4 shadow-soft">
                  <div className="space-y-3 text-center">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-950">{SCIENTIFIC_OVERVIEW_CATALOG.home_cta.title}</p>
                      <p className="text-sm leading-6 text-slate-600">{SCIENTIFIC_OVERVIEW_CATALOG.home_cta.description}</p>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={() => onNavigateToView('scientific-overview')}>
                        {SCIENTIFIC_OVERVIEW_CATALOG.home_cta.button_label}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {homeContent.hero.cta_buttons.map((button) => {
                    const icon =
                      button.id === 'launch-analysis'
                        ? Play
                        : button.id === 'terms-of-use'
                          ? AlertTriangle
                          : Quote;
                    const variant =
                      button.id === 'terms-of-use'
                        ? 'outline'
                        : button.variant === 'success'
                          ? 'success'
                          : button.variant === 'secondary'
                            ? 'secondary'
                            : 'default';
                    const Icon = icon;

                    return (
                      <Button
                        key={button.id}
                        variant={variant}
                        size="lg"
                        onClick={() => {
                          if (button.id === 'launch-analysis') {
                            onNavigateToView('guided-analysis');
                            return;
                          }
                          if (button.id === 'terms-of-use') {
                            setTermsDialogOpen(true);
                            return;
                          }
                          setHowToCiteOpen(true);
                        }}
                        className={
                          button.id === 'launch-analysis'
                            ? 'w-full bg-accent text-white hover:bg-blue-700'
                            : button.id === 'terms-of-use'
                            ? 'w-full border-amber-200 bg-amber-100 text-amber-800 hover:border-amber-300 hover:bg-amber-200'
                            : 'w-full bg-emerald-500 text-white hover:bg-emerald-600'
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {button.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-auto flex min-h-[10.5rem] items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-center">
              <div className="w-full space-y-3">
                {homeContent.hero.notice_lines.map((line) => (
                  <p key={line} className="text-sm leading-6 text-emerald-900">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="flex h-full flex-col gap-5 px-6 py-6">
            <SectionHeader
              eyebrow={homeContent.scientific_overview.eyebrow}
              title={homeContent.scientific_overview.title}
            />

            <div className="grid flex-1 grid-cols-1 gap-4">
              <div className="surface-muted px-5 py-5">
                <div className="space-y-3">
                  {renderParagraphs(homeContent.scientific_overview.content, 'text-sm leading-6 text-slate-600')}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-soft">
                <p className="text-sm font-semibold text-slate-950">{homeContent.target_users.title}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                  {homeContent.target_users.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-soft">
                  <p className="text-sm font-semibold text-slate-950">{homeContent.data_sources.title}</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                    {homeContent.data_sources.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {homeContent.data_sources.footer ? (
                    <p className="mt-4 text-xs leading-5 text-slate-500">{homeContent.data_sources.footer}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={homeAlignedSectionGridClass}>
        <UserGuideIntroCard onNavigateToView={onNavigateToView} />
        <BrowseByCategorySection onNavigateToView={onNavigateToView} />
      </div>

      <div className={homeAlignedSectionGridClass}>
        <DatabaseSnapshotSection
          eyebrow={homeContent.snapshot.eyebrow}
          title={homeContent.snapshot.title}
          description={homeContent.snapshot.description}
          actionLabel={homeContent.snapshot.action_label}
          onOpenDatabaseMetrics={() => onNavigateToView('databases')}
        />

        <Card className="h-full xl:h-[44rem]">
          <CardContent className="flex h-full flex-col gap-6 px-6 py-6">
            <SectionHeader
              eyebrow={homeContent.downloads.eyebrow}
              title={
                <span className="inline-flex items-center gap-2">
                  <Download className="h-5 w-5 text-accent" />
                  {homeContent.downloads.title}
                </span>
              }
              description={downloadsExpanded ? undefined : homeContent.downloads.description[0]}
            />

            <div className="flex min-h-0 flex-1 flex-col">
              {!downloadsExpanded ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {renderParagraphs(homeContent.downloads.description.slice(1), 'text-sm leading-6 text-slate-600')}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-900">{homeContent.downloads.primary_title}</p>
                    <p className="text-sm leading-6 text-slate-600">{homeContent.downloads.primary_description}</p>
                  </div>

                  {primaryDownload ? (
                    <DownloadCatalogCard item={primaryDownload} onReview={setSelectedDownloadId} />
                  ) : null}
                </div>
              ) : null}

              {downloadsExpanded ? (
                <div
                  id={downloadsDisclosureId}
                  className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/40 px-4 py-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {secondaryDownloads.map((item) => (
                      <DownloadCatalogCard
                        key={item.id}
                        item={item}
                        onReview={() => undefined}
                        showReviewButton={false}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="min-h-0 flex-1" aria-hidden="true" />
              )}

              {secondaryDownloads.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-5">
                  <button
                    type="button"
                    aria-expanded={downloadsExpanded}
                    aria-controls={downloadsDisclosureId}
                    onClick={() => setDownloadsExpanded((current) => !current)}
                    className="group flex w-full items-start justify-between gap-3 py-5 text-left text-base font-semibold text-slate-900 transition-colors hover:text-accent"
                  >
                    <span className="space-y-1">
                      <span className="block text-sm font-semibold text-slate-950">
                        {homeContent.downloads.accordion_title} ({secondaryDownloads.length})
                      </span>
                      <span className="block text-xs font-normal leading-5 text-slate-500">
                        {homeContent.downloads.accordion_description}
                      </span>
                    </span>
                    <ChevronDown
                      className={`mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                        downloadsExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <HomeLimitationsSection
        content={limitationsContent}
        onOpenTerms={() => setTermsDialogOpen(true)}
      />

      <Dialog
        open={howToCiteOpen}
        onOpenChange={(open) => {
          setHowToCiteOpen(open);
          if (!open) {
            setCopiedCitationKey(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedHeroModal.title}</DialogTitle>
            <DialogDescription>{selectedHeroModal.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm leading-6 text-slate-700">
            {howToCiteIntro ? <p>{howToCiteIntro}</p> : null}

            {apaCitation ? (
              <section className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Database (APA)</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyCitation('apa', apaCitation)}
                  >
                    {copiedCitationKey === 'apa' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    {copiedCitationKey === 'apa' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-700 whitespace-pre-line">{apaCitation}</p>
              </section>
            ) : null}

            {bibtexCitation ? (
              <section className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Database (BibTeX)</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyCitation('bibtex', bibtexCitation)}
                  >
                    {copiedCitationKey === 'bibtex' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    {copiedCitationKey === 'bibtex' ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <pre className="mt-3 overflow-x-auto text-xs leading-6 text-slate-700 whitespace-pre-wrap">
                  {bibtexCitation}
                </pre>
              </section>
            ) : null}

            {dbxPlaceholder ? (
              <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  BioRemPP DBX Service (placeholder)
                </p>
                <p className="mt-3">{dbxPlaceholder}</p>
              </section>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHowToCiteOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TermsOfUseDialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen} />

      <Dialog
        open={Boolean(selectedDownloadId)}
        onOpenChange={(open) => setSelectedDownloadId(open ? selectedDownloadId : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{homeContent.downloads.disclaimer_title}</DialogTitle>
            <DialogDescription>
              {selectedDownload
                ? `${selectedDownload.label} / ${selectedDownload.format} / ${selectedDownload.version}`
                : `${homeContent.downloads.accordion_title} / current release`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm leading-6 text-slate-700">
            {homeContent.downloads.disclaimer_paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDownloadId(null)}>
              {homeContent.downloads.close_label}
            </Button>
            {selectedDownload?.url ? (
              <Button asChild>
                <a
                  href={selectedDownload.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {homeContent.downloads.open_release_label}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
