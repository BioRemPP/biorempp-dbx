/**
 * @packageDocumentation
 *
 * Shared application shell that renders the global header, primary navigation,
 * page container, and footer around route-specific content.
 */
import type { ReactNode } from 'react';
import { APP_BRAND, APP_FOOTER_CONTACT_EMAIL, APP_FOOTER_COPYRIGHT, APP_FOOTER_RELEASE_LABEL, APP_PRIMARY_NAV, APP_BROWSE_NAV, BROWSE_ACTIVE_VIEWS } from './navigation';
import { DOCUMENTATION_CATALOG } from '../content/documentation/catalog';
import type { View } from './routes';
import { withBasePath } from '../utils/basePath';
import { CLIENT_BASE_PATH } from '../shared/api/client';
import { APP_RELEASE } from './config/appMetadata';
import { Button } from '../shared/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuChevron } from '../shared/ui/dropdown-menu';
import { cn } from '../shared/lib/cn';
import { MaintenanceBanner } from '../shared/feedback/MaintenanceBanner';
import { OfflineBanner } from '../shared/feedback/OfflineBanner';

/**
 * Props accepted by the global application shell.
 */
interface AppShellProps {
  /** Top-level view currently considered active for navigation highlighting. */
  activeView: View;
  /** Navigation callback used by brand and primary navigation actions. */
  onNavigateToView: (view: View) => void;
  /** Route-specific page content rendered inside the shell body. */
  children: ReactNode;
}

/**
 * Renders the shared application shell around the active route content.
 *
 * @param props Active view, navigation callback, and page content.
 * @returns The full application frame with header, main content area, and footer.
 */
export function AppShell({ activeView, onNavigateToView, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <OfflineBanner />
      <MaintenanceBanner />
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-[94vw] flex-col gap-6 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <button type="button" onClick={() => onNavigateToView('home')} className="flex items-center gap-3 text-left">
                <div className="flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
                  <img
                    src={withBasePath('/BIOREMPP_LOGO.png', CLIENT_BASE_PATH)}
                    alt="BioRemPP logo"
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{APP_BRAND.title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm text-slate-600 sm:text-base">{APP_BRAND.subtitle}</p>
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      {APP_RELEASE.label}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <nav aria-label="Primary" className="flex flex-wrap items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={BROWSE_ACTIVE_VIEWS.has(activeView) ? 'subtle' : 'ghost'}
                    size="sm"
                    className={cn(
                      'group rounded-full px-4',
                      BROWSE_ACTIVE_VIEWS.has(activeView) ? 'shadow-none' : ''
                    )}
                  >
                    Browse
                    <DropdownMenuChevron />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {APP_BROWSE_NAV.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      className={cn(item.view === activeView && 'bg-slate-50 font-medium text-slate-950')}
                      onSelect={() => onNavigateToView(item.view)}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {APP_PRIMARY_NAV.map((item) => (
                <Button
                  key={item.id}
                  variant={item.view === activeView ? 'subtle' : 'ghost'}
                  size="sm"
                  className={cn('rounded-full px-4', item.view === activeView ? 'shadow-none' : '')}
                  onClick={() => onNavigateToView(item.view)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-[94vw] flex-1 flex-col py-8">{children}</main>

      <footer className="mt-16 border-t border-slate-200/80 bg-white/90">
        <div className="mx-auto grid w-[94vw] grid-cols-1 gap-3 py-5 text-sm text-slate-500 md:grid-cols-3 md:items-center">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-medium text-emerald-600">{APP_FOOTER_RELEASE_LABEL}</p>
            <p className="text-xs text-slate-400">{APP_FOOTER_COPYRIGHT}</p>
          </div>
          <div className="text-center">
            <a
              href={DOCUMENTATION_CATALOG.resource_card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 transition-colors hover:text-slate-600"
            >
              Documentation
            </a>
          </div>
          <div className="text-center text-xs text-slate-400 md:text-right">
            Contact:{' '}
            <a
              href={`mailto:${APP_FOOTER_CONTACT_EMAIL}`}
              className="text-slate-500 transition-colors hover:text-slate-700"
            >
              {APP_FOOTER_CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
