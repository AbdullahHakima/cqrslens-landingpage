import React from 'react';
import { PixelWordmark } from '../brand/PixelWordmark';

interface PageMastheadProps {
  /** Stepped-pixel display wordmark lines (1 or 2 short words, e.g. ["FEATURES"] or ["USE", "CASES"]) */
  pixelLines: readonly string[];
  /** Screen-reader natural H1 title */
  srTitle: string;
  /** Concise architectural summary below H1 (capped under 70ch) */
  summary: string;
  /** Optional right-column actions or technical coordinate block */
  aside?: React.ReactNode;
}

export const PageMasthead: React.FC<PageMastheadProps> = ({
  pixelLines,
  srTitle,
  summary,
  aside,
}) => (
  <section
    aria-labelledby="page-masthead-heading"
    className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-canvas)] pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-16"
  >
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="min-w-0 lg:col-span-7">
          <h1 id="page-masthead-heading" className="m-0">
            <span className="sr-only">{srTitle}</span>
            <PixelWordmark
              lines={pixelLines}
              animateEntrance
              glyphHeight="clamp(1.65rem, 3.9vw, 3.25rem)"
              className="text-[var(--color-text-primary)]"
            />
          </h1>

          <p className="mt-5 mb-0 max-w-[35rem] font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)] sm:mt-6 sm:text-[1.0625rem]">
            {summary}
          </p>
        </div>

        {aside && (
          <div className="min-w-0 lg:col-span-5 lg:flex lg:justify-end">
            {aside}
          </div>
        )}
      </div>
    </div>
  </section>
);
