import React from 'react';
import { BRAND } from '../config/brand';
import { Link, useRouter } from '../lib/router';
import { PixelWordmark } from '../components/brand/PixelWordmark';
import { ArrowLeftIcon, ChevronRightIcon } from '../components/ui/Icons';

export const NotFoundPage: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <section
      aria-labelledby="not-found-heading"
      className="mx-auto flex min-h-[72dvh] max-w-[1440px] flex-col justify-center px-4 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-20 lg:px-12"
    >
      <div className="max-w-[38rem]">
        <h1 id="not-found-heading" className="m-0">
          <span className="sr-only">404 — Unmapped Route in {BRAND.name}</span>
          <PixelWordmark
            lines={['404', 'UNMAPPED']}
            animateEntrance
            glyphHeight="clamp(1.95rem, 4.2vw, 3.4rem)"
            className="text-[var(--color-text-primary)]"
          />
        </h1>

        <p className="mt-6 mb-0 font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
          No page handler is linked to{' '}
          <code className="break-words [overflow-wrap:anywhere] rounded-[3px] bg-[var(--color-bg-sunken)] px-1.5 py-0.5 font-editorial-mono text-xs text-[var(--color-text-primary)]">
            {pathname}
          </code>
          . Use one of the verified entry points below to continue exploring {BRAND.name}.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
          <Link to="/" className="btn-primary">
            <ArrowLeftIcon className="size-3.5" />
            <span>Return Home</span>
          </Link>
          <Link to="/quickstart" className="link-quiet">
            <span>Quickstart</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
          <Link to="/docs" className="link-quiet">
            <span>Documentation</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
          <Link to="/rules" className="link-quiet">
            <span>Rules Catalog</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
