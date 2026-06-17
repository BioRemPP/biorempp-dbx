/**
 * @packageDocumentation
 *
 * Root application component responsible for client-side route parsing and page composition.
 */
import { useEffect, useState } from 'react';
import { AppShell } from './app/AppShell';
import { ErrorBoundary } from './app/ErrorBoundary';
import {
  buildCompoundClassPath,
  buildCompoundPath,
  buildDatabaseSchemaPath,
  buildGenePath,
  buildPathwayPath,
  getActiveView,
  getLegacyRedirectPath,
  getViewPath,
  parseRoute,
  resolveAppPath,
  type Route,
  type View,
} from './app/routes';
import { CompoundExplorer } from '@features/compounds/pages/CompoundExplorer';
import { CompoundClassExplorer } from '@features/compound-classes/pages/CompoundClassExplorer';
import { CompoundDetail } from '@features/compounds/pages/CompoundDetail';
import { CompoundClassDetail } from '@features/compound-classes/pages/CompoundClassDetail';
import { DatabasesPage } from '@features/databases/pages/DatabasesPage';
import { DatabaseSchemaPage } from '@features/databases/pages/DatabaseSchemaPage';
import { FaqPage } from '@pages/FaqPage';
import { ContactPage } from '@pages/ContactPage';
import { DocumentationPage } from '@pages/DocumentationPage';
import { GuidedAnalysisPage } from '@features/guided-analysis/pages/GuidedAnalysisPage';
import { GeneExplorer } from '@features/genes/pages/GeneExplorer';
import { GeneDetail } from '@features/genes/pages/GeneDetail';
import { HomePage } from '@pages/HomePage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { PathwayExplorer } from '@features/pathways/pages/PathwayExplorer';
import { ScientificOverviewPage } from '@pages/ScientificOverviewPage';
import { PathwayDetail } from '@features/pathways/pages/PathwayDetail';
import { TechnicalInformationPage } from '@pages/TechnicalInformationPage';
import { ToxicityExplorer } from '@features/toxicity/pages/ToxicityExplorer';
import { UserGuidePage } from '@pages/UserGuidePage';

interface GeneExplorerEntryState {
  notice: string;
  search: string;
  token: string;
}

/**
 * Resolves the current browser location into the active application view and detail screen.
 *
 * @returns The composed application shell with the page that matches the current route.
 * @remarks
 * This component owns the lightweight browser-history integration used by the Vite client.
 * It normalizes base-path-aware URLs, applies legacy redirects on first render, and keeps the
 * rendered page synchronized with `window.location.pathname`.
 */
function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const [geneExplorerEntry, setGeneExplorerEntry] = useState<GeneExplorerEntryState | null>(null);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    const legacyRedirectPath = getLegacyRedirectPath(window.location.pathname);
    if (legacyRedirectPath) {
      window.history.replaceState(null, '', legacyRedirectPath);
      setRoute(parseRoute(legacyRedirectPath));
    }
  }, []);

  function navigate(path: string, replace = false) {
    const target = resolveAppPath(path);
    const current = resolveAppPath(window.location.pathname);

    if (target !== current) {
      if (replace) {
        window.history.replaceState(null, '', target);
      } else {
        window.history.pushState(null, '', target);
      }
    }

    setRoute(parseRoute(target));
    window.scrollTo({ top: 0 });
  }

  function navigateToView(view: View) {
    if (view === 'genes') {
      setGeneExplorerEntry(null);
    }
    navigate(getViewPath(view));
  }

  function openCompoundDetail(cpd: string) {
    navigate(buildCompoundPath(cpd));
  }

  function openDatabaseSchema(schemaId: Parameters<typeof buildDatabaseSchemaPath>[0]) {
    navigate(buildDatabaseSchemaPath(schemaId));
  }

  function openGeneDetail(ko: string) {
    navigate(buildGenePath(ko));
  }

  function openGeneExplorerFromGuidedFallback(payload: { search: string; notice: string }) {
    setGeneExplorerEntry({
      ...payload,
      token: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    });
    navigate(getViewPath('genes'));
  }

  function openPathwayDetail(pathway: string, source?: string) {
    navigate(buildPathwayPath(pathway, source));
  }

  function openCompoundClassDetail(compoundclass: string) {
    navigate(buildCompoundClassPath(compoundclass));
  }

  function renderRouteContent() {
    if (route.kind === 'view' && route.view === 'home') {
      return <HomePage onNavigateToView={navigateToView} />;
    }
    if (route.kind === 'view' && route.view === 'scientific-overview') {
      return <ScientificOverviewPage />;
    }
    if (route.kind === 'view' && route.view === 'user-guide') {
      return <UserGuidePage onNavigateToView={navigateToView} />;
    }
    if (route.kind === 'view' && route.view === 'technical-information') {
      return <TechnicalInformationPage onNavigateToView={navigateToView} />;
    }
    if (route.kind === 'view' && route.view === 'faq') {
      return <FaqPage onNavigateToView={navigateToView} />;
    }
    if (route.kind === 'view' && route.view === 'contact') {
      return <ContactPage />;
    }
    if (route.kind === 'view' && route.view === 'documentation') {
      return <DocumentationPage />;
    }
    if (route.kind === 'view' && route.view === 'databases') {
      return <DatabasesPage onOpenSchema={openDatabaseSchema} />;
    }
    if (route.kind === 'view' && route.view === 'compounds') {
      return <CompoundExplorer onCompoundSelect={openCompoundDetail} />;
    }
    if (route.kind === 'view' && route.view === 'compound-classes') {
      return <CompoundClassExplorer onCompoundClassSelect={openCompoundClassDetail} />;
    }
    if (route.kind === 'view' && route.view === 'genes') {
      return (
        <GeneExplorer
          onGeneSelect={openGeneDetail}
          entryNotice={geneExplorerEntry?.notice}
          entrySearch={geneExplorerEntry?.search}
          entryToken={geneExplorerEntry?.token}
        />
      );
    }
    if (route.kind === 'view' && route.view === 'pathways') {
      return <PathwayExplorer onPathwaySelect={openPathwayDetail} />;
    }
    if (route.kind === 'view' && route.view === 'toxicity') {
      return <ToxicityExplorer onCompoundSelect={openCompoundDetail} />;
    }
    if (route.kind === 'view' && route.view === 'guided-analysis') {
      return (
        <GuidedAnalysisPage
          onCompoundSelect={openCompoundDetail}
          onGeneSelect={openGeneDetail}
          onGeneExplorerSelect={openGeneExplorerFromGuidedFallback}
          onPathwaySelect={openPathwayDetail}
        />
      );
    }
    if (route.kind === 'compound') {
      return (
        <CompoundDetail
          cpd={route.cpd}
          onBack={() => navigateToView('compounds')}
          onGeneSelect={openGeneDetail}
        />
      );
    }
    if (route.kind === 'databaseSchema') {
      return (
        <DatabaseSchemaPage
          schemaId={route.schemaId}
          onOpenSchema={openDatabaseSchema}
          onOpenIndex={() => navigateToView('databases')}
        />
      );
    }
    if (route.kind === 'gene') {
      return (
        <GeneDetail
          ko={route.ko}
          onBack={() => navigateToView('genes')}
          onCompoundSelect={openCompoundDetail}
        />
      );
    }
    if (route.kind === 'compoundClass') {
      return (
        <CompoundClassDetail
          compoundclass={route.compoundclass}
          onBack={() => navigateToView('compound-classes')}
        />
      );
    }
    if (route.kind === 'pathway') {
      return <PathwayDetail pathway={route.pathway} source={route.source} onBack={() => navigateToView('pathways')} />;
    }
    if (route.kind === 'not_found') {
      return <NotFoundPage onBack={() => navigateToView('home')} />;
    }

    return null;
  }

  return (
    <AppShell activeView={getActiveView(route)} onNavigateToView={navigateToView}>
      <ErrorBoundary key={JSON.stringify(route)} onNavigateHome={() => navigateToView('home')}>
        {renderRouteContent()}
      </ErrorBoundary>
    </AppShell>
  );
}

export default App;
