/**
 * @packageDocumentation
 *
 * KEGG structure thumbnail card used by compound detail pages to preview a compound structure and
 * link users to the canonical KEGG compound entry.
 */
import { useEffect, useState } from 'react';
import { apiUrl } from '@/shared/api/client';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/cn';

/**
 * Props accepted by the KEGG structure thumbnail card.
 */
interface CompoundKeggStructureThumbnailProps {
  /** Compound identifier encoded into the proxy and direct KEGG image URLs. */
  cpd: string;
  /** Optional className forwarded to the outer card container. */
  className?: string;
}

/**
 * Renders a structure preview for the selected compound with proxy and direct-source fallbacks.
 *
 * @param props Compound identifier and optional container className.
 * @returns A thumbnail card that shows the KEGG structure image when one is available.
 *
 * @remarks
 * The component first attempts the internal proxy endpoint, falls back to the direct KEGG image
 * URL on image failure, and marks the structure as unavailable only after both sources fail.
 * The external CTA always points to the KEGG entry page for the selected compound identifier.
 */
export function CompoundKeggStructureThumbnail({ cpd, className }: CompoundKeggStructureThumbnailProps) {
  const [sourceMode, setSourceMode] = useState<'proxy' | 'direct' | 'unavailable'>('proxy');

  useEffect(() => {
    setSourceMode('proxy');
  }, [cpd]);

  const proxyImageSrc = apiUrl(`/api/compounds/${encodeURIComponent(cpd)}/kegg-image`);
  const directImageSrc = `https://rest.kegg.jp/get/${encodeURIComponent(cpd)}/image`;
  const keggEntryLink = `https://www.kegg.jp/entry/${encodeURIComponent(cpd)}`;
  const imageSrc = sourceMode === 'proxy' ? proxyImageSrc : sourceMode === 'direct' ? directImageSrc : null;

  function handleImageError() {
    setSourceMode((currentMode) => {
      if (currentMode === 'proxy') {
        return 'direct';
      }
      return 'unavailable';
    });
  }

  return (
    <div
      className={cn(
        'flex h-full min-h-[22.75rem] w-full flex-col rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4',
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">KEGG structure</p>
      <div className="mt-3 flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {sourceMode === 'unavailable' || !imageSrc ? (
          <p className="text-center text-xs leading-5 text-slate-500">KEGG structure unavailable</p>
        ) : (
          <img
            key={imageSrc}
            src={imageSrc}
            alt={`KEGG structure for ${cpd}`}
            className="h-full max-h-[16rem] w-full object-contain"
            decoding="async"
            loading="lazy"
            referrerPolicy={sourceMode === 'direct' ? 'no-referrer' : undefined}
            onError={handleImageError}
          />
        )}
      </div>
      <Button asChild variant="outline" size="sm" fullWidth className="mt-3">
        <a href={keggEntryLink} target="_blank" rel="noreferrer">
          View From KEGG
        </a>
      </Button>
    </div>
  );
}
