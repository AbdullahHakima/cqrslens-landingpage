import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { BRAND } from './src/config/brand';
import { DOC_SECTION_ROUTES, ROUTES, resolveRouteMeta } from './src/config/routes';

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectRouteMetadata(html: string, routePath: string, depth: number): string {
  const meta = resolveRouteMeta(routePath);
  const canonicalUrl =
    meta.canonicalPath === '/'
      ? `${BRAND.siteUrl}/`
      : `${BRAND.siteUrl}${meta.canonicalPath}`;

  const relPrefix = depth > 0 ? '../'.repeat(depth) : './';
  let out = html
    .replace(/(src|href)="\.\/assets\//g, `$1="${relPrefix}assets/`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtmlAttr(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtmlAttr(meta.description)}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeHtmlAttr(meta.title)}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtmlAttr(meta.description)}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeHtmlAttr(meta.title)}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeHtmlAttr(meta.description)}" />`
    );

  return out;
}

/**
 * Generates static route entry points (`dist/<route>/index.html`) with accurate
 * per-page Open Graph / canonical metadata and depth-adjusted asset paths,
 * plus a GitHub Pages SPA `dist/404.html` fallback for arbitrary unknown URLs.
 */
function staticMultiPageRoutesPlugin(): Plugin {
  return {
    name: 'noctua-static-multipage-routes',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const rootHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(rootHtmlPath)) return;

      const templateHtml = fs.readFileSync(rootHtmlPath, 'utf-8');

      const allStaticPaths = [
        ...ROUTES.map((r) => r.path).filter((p) => p !== '/'),
        ...DOC_SECTION_ROUTES.map((d) => `/docs/${d.slug}`),
      ];

      for (const routePath of allStaticPaths) {
        const segments = routePath.split('/').filter(Boolean);
        // 1. Directory index (<route>/index.html) for trailing-slash requests (/docs/)
        const targetDir = path.join(distDir, ...segments);
        fs.mkdirSync(targetDir, { recursive: true });
        const dirIndexHtml = injectRouteMetadata(templateHtml, routePath, segments.length);
        fs.writeFileSync(path.join(targetDir, 'index.html'), dirIndexHtml, 'utf-8');

        // 2. Clean-URL file (<route>.html) for non-trailing-slash requests (/docs)
        const cleanFileHtml = injectRouteMetadata(
          templateHtml,
          routePath,
          Math.max(0, segments.length - 1)
        );
        fs.writeFileSync(`${targetDir}.html`, cleanFileHtml, 'utf-8');
      }

      const fallback404 = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex" />
    <title>Redirecting — ${escapeHtmlAttr(BRAND.name)}</title>
    <script>
      (function () {
        var l = window.location;
        var isGhSubpath = l.pathname === '/cqrslens' || l.pathname.indexOf('/cqrslens/') === 0;
        var base = isGhSubpath ? '/cqrslens' : '';
        var sub = isGhSubpath ? l.pathname.slice('/cqrslens'.length) : l.pathname;
        var target = base + '/?p=' + encodeURIComponent(sub || '/') + (l.hash ? '&h=' + encodeURIComponent(l.hash) : '');
        l.replace(target);
      })();
    </script>
  </head>
  <body></body>
</html>`;
      fs.writeFileSync(path.join(distDir, '404.html'), fallback404, 'utf-8');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), staticMultiPageRoutesPlugin()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'three'],
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'discrete-eden-korean-reflections.trycloudflare.com',
      '.trycloudflare.com',
    ],
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/HomePage.tsx',
        './src/components/hero/HeroSection.tsx',
        './src/components/hero/OwlHeroCanvas.tsx',
      ],
    },
  },
  preview: {
    host: true,
    allowedHosts: [
      'discrete-eden-korean-reflections.trycloudflare.com',
      '.trycloudflare.com',
    ],
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
        },
      },
    },
  },
});
