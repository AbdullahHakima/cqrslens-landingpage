import React from 'react';

/**
 * Structural placeholder that mirrors the masthead and first content band of a
 * lazy-loaded page. It keeps the footer from jumping and gives slow connections
 * an honest, low-noise loading state instead of a blank viewport.
 */
export const PageSkeleton: React.FC = () => (
  <div
    aria-busy="true"
    className="min-h-[72dvh] bg-[var(--color-bg-canvas)]"
  >
    <div role="status" aria-live="polite" className="sr-only">
      Loading page
    </div>

    <div
      aria-hidden="true"
      className="mx-auto max-w-[1440px] px-4 pt-24 pb-14 motion-safe:animate-pulse sm:px-8 sm:pt-28 sm:pb-18 md:pt-32 md:pb-22 lg:px-12"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="min-w-0 lg:col-span-7">
          <div className="h-[clamp(1.65rem,3.9vw,3.25rem)] w-28 rounded-[2px] bg-[var(--color-bg-sunken)] sm:w-36" />
          <div className="mt-5 h-4 w-full max-w-[32rem] rounded-[2px] bg-[var(--color-bg-sunken)] sm:mt-6" />
          <div className="mt-2.5 h-4 w-4/5 max-w-[24rem] rounded-[2px] bg-[var(--color-bg-sunken)]" />
        </div>
        <div className="flex lg:col-span-5 lg:justify-end">
          <div className="h-4 w-36 rounded-[2px] bg-[var(--color-bg-sunken)]" />
        </div>
      </div>

      <div className="mt-12 border-t border-[var(--color-border-subtle)] pt-10 sm:mt-14">
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)] sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="bg-[var(--color-bg-canvas)] p-4 sm:p-5">
              <div className="h-3 w-20 rounded-[2px] bg-[var(--color-bg-sunken)]" />
              <div className="mt-4 h-8 w-24 rounded-[2px] bg-[var(--color-bg-sunken)]" />
              <div className="mt-4 h-3 w-full rounded-[2px] bg-[var(--color-bg-sunken)]" />
              <div className="mt-2 h-3 w-3/4 rounded-[2px] bg-[var(--color-bg-sunken)]" />
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-[48rem]">
          <div className="h-3 w-24 rounded-[2px] bg-[var(--color-bg-sunken)]" />
          <div className="mt-4 h-4 w-full rounded-[2px] bg-[var(--color-bg-sunken)]" />
          <div className="mt-2.5 h-4 w-11/12 rounded-[2px] bg-[var(--color-bg-sunken)]" />
          <div className="mt-2.5 h-4 w-4/5 rounded-[2px] bg-[var(--color-bg-sunken)]" />
        </div>
      </div>
    </div>
  </div>
);
