import React, { Suspense } from 'react';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { DOC_SECTION_ROUTES } from './config/routes';
import { RouterProvider, useRouter } from './lib/router';
import { HomePage } from './pages/HomePage';

const loadQuickstartPage = () => import('./pages/QuickstartPage');
const loadFeaturesPage = () => import('./pages/FeaturesPage');
const loadUseCasesPage = () => import('./pages/UseCasesPage');
const loadDocsPage = () => import('./pages/DocsPage');
const loadRulesPage = () => import('./pages/RulesPage');
const loadIntegrationsPage = () => import('./pages/IntegrationsPage');
const loadExamplesPage = () => import('./pages/ExamplesPage');
const loadChangelogPage = () => import('./pages/ChangelogPage');
const loadRoadmapPage = () => import('./pages/RoadmapPage');
const loadNotFoundPage = () => import('./pages/NotFoundPage');

const QuickstartPage = React.lazy(loadQuickstartPage);
const FeaturesPage = React.lazy(loadFeaturesPage);
const UseCasesPage = React.lazy(loadUseCasesPage);
const DocsPage = React.lazy(loadDocsPage);
const RulesPage = React.lazy(loadRulesPage);
const IntegrationsPage = React.lazy(loadIntegrationsPage);
const ExamplesPage = React.lazy(loadExamplesPage);
const ChangelogPage = React.lazy(loadChangelogPage);
const RoadmapPage = React.lazy(loadRoadmapPage);
const NotFoundPage = React.lazy(loadNotFoundPage);

const VALID_DOC_SLUGS = new Set(DOC_SECTION_ROUTES.map((c) => c.slug));

const preloadedRoutes = new Set<string>();

function preloadRoute(pathname: string): void {
  if (pathname === '/' || preloadedRoutes.has(pathname)) return;
  preloadedRoutes.add(pathname);

  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    void loadDocsPage();
    return;
  }

  switch (pathname) {
    case '/quickstart':
      void loadQuickstartPage();
      break;
    case '/features':
      void loadFeaturesPage();
      break;
    case '/use-cases':
      void loadUseCasesPage();
      break;
    case '/rules':
      void loadRulesPage();
      break;
    case '/integrations':
      void loadIntegrationsPage();
      break;
    case '/examples':
      void loadExamplesPage();
      break;
    case '/changelog':
      void loadChangelogPage();
      break;
    case '/roadmap':
      void loadRoadmapPage();
      break;
    default:
      break;
  }
}

const RouteView: React.FC = () => {
  const { pathname } = useRouter();

  if (pathname === '/') {
    return <HomePage />;
  }

  let page: React.ReactNode;
  switch (pathname) {
    case '/quickstart':
      page = <QuickstartPage />;
      break;
    case '/features':
      page = <FeaturesPage />;
      break;
    case '/use-cases':
      page = <UseCasesPage />;
      break;
    case '/docs':
      page = <DocsPage />;
      break;
    case '/rules':
      page = <RulesPage />;
      break;
    case '/integrations':
      page = <IntegrationsPage />;
      break;
    case '/examples':
      page = <ExamplesPage />;
      break;
    case '/changelog':
      page = <ChangelogPage />;
      break;
    case '/roadmap':
      page = <RoadmapPage />;
      break;
    default: {
      if (pathname.startsWith('/docs/')) {
        const slug = pathname.slice('/docs/'.length);
        if (VALID_DOC_SLUGS.has(slug)) {
          page = <DocsPage />;
          break;
        }
      }
      page = <NotFoundPage />;
      break;
    }
  }

  return (
    <Suspense fallback={<div className="min-h-[140dvh] bg-[var(--color-bg-canvas)]" />}>
      {page}
    </Suspense>
  );
};

export const App: React.FC = () => (
  <RouterProvider onPreloadRoute={preloadRoute}>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[var(--z-skip)] focus:rounded-[4px] focus:bg-[var(--color-action-solid)] focus:px-4 focus:py-2.5 focus:font-editorial-mono focus:text-xs focus:text-[var(--color-action-text)]"
    >
      Skip to main content
    </a>

    <SiteHeader />

    <main id="main-content">
      <RouteView />
    </main>

    <SiteFooter />
  </RouterProvider>
);
