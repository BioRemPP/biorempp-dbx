/**
 * @packageDocumentation
 *
 * Layout shell for guided analysis pages, pairing a query-selection sidebar with the main analysis
 * workspace.
 */
import type { ReactNode } from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui';

/**
 * Props accepted by the guided analysis layout shell.
 */
interface GuidedAnalysisLayoutProps {
  /** Title shown in the layout header card. */
  title: string;
  /** Short description shown below the layout title. */
  description: string;
  /** Sidebar content, typically the guided query selector. */
  sidebar: ReactNode;
  /** Main guided analysis content rendered beside the sidebar. */
  children: ReactNode;
}

/**
 * Renders the two-column guided analysis shell with header, sidebar, and content area.
 *
 * @param props Header text plus sidebar and main content.
 * @returns The guided analysis page layout.
 */
export function GuidedAnalysisLayout({
  title,
  description,
  sidebar,
  children,
}: GuidedAnalysisLayoutProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-sm text-slate-600">{description}</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="min-w-0">{sidebar}</div>
        <div className="space-y-4 min-w-0">{children}</div>
      </div>
    </div>
  );
}
