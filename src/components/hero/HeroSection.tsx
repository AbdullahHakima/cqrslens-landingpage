import React, { Suspense, useEffect, useRef, useState } from 'react';
import { BRAND } from '../../config/brand';
import { Link } from '../../lib/router';
import { PixelWordmark } from '../brand/PixelWordmark';
import type { OwlHeroCanvasHandle } from './OwlHeroCanvas';
import { ChevronRightIcon, SonarPulseIcon } from '../ui/Icons';
import { InstallCommandButton } from '../ui/InstallCommandButton';
import { ProjectStats } from '../ui/ProjectStats';

const OwlHeroCanvas = React.lazy(() => import('./OwlHeroCanvas'));

export const HeroSection: React.FC = () => {
  const owlRef = useRef<OwlHeroCanvasHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [inspectingCta, setInspectingCta] = useState(false);
  const [stageReady, setStageReady] = useState(false);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setStageReady(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[var(--color-bg-canvas)]"
    >
      {/* Layer 0 - the owl is the hero: one full-bleed halftone surface behind all the copy. */}
      <div className="absolute inset-0 z-[var(--z-canvas)]">
        {stageReady && (
          <Suspense fallback={null}>
            <OwlHeroCanvas ref={owlRef} inspectingCta={inspectingCta} stageRef={stageRef} />
          </Suspense>
        )}
      </div>

      {/* Layer 1 - wordmark, copy and CTAs overlaid on the owl: headline top, actions bottom */}
      <div className="pointer-events-none relative z-[var(--z-hero-copy)] mx-auto flex min-h-dvh lg:static w-full max-w-[1440px] flex-1 flex-col px-4 pt-22 pb-5 sm:px-8 sm:pt-26 sm:pb-7 lg:px-8 lg:pt-[19dvh] lg:pb-[8.5dvh] xl:px-12">
        <h1 id="hero-heading" className="pointer-events-auto m-0 w-full max-w-full lg:max-w-[43vw] xl:max-w-[48vw]">
          <span className="sr-only">
            {BRAND.name} Code Map: {BRAND.heroSummary}
          </span>
          <PixelWordmark
            lines={BRAND.heroLines}
            animateEntrance
            glyphHeight="clamp(2.15rem, 5.15vw, 4.55rem)"
            className="text-[var(--color-text-primary)]"
          />
        </h1>

        {/* Owl stage anchor - invisible box that tells the canvas where the owl stands.
            Stacked: it takes the space between headline and actions and overlaps both by a
            few rem, so the owl is the centrepiece and the copy sits on top of it.
            Desktop (lg): the wrapper is static, so this resolves against the whole hero and
            lets the owl reach under the right end of the wordmark. */}
        <div
          ref={stageRef}
          aria-hidden="true"
          className="pointer-events-none relative mt-2 -mb-8 min-h-[250px] flex-1 lg:absolute lg:inset-y-0 lg:right-0 lg:left-[30vw] lg:m-0 lg:min-h-0 lg:flex-none"
        />
        <div className="pointer-events-auto mt-auto pt-10 lg:pt-12">
          <p className="m-0 max-w-[36ch] font-editorial-mono text-sm leading-[1.6] text-pretty text-[var(--color-text-primary)] sm:max-w-[39ch] sm:text-base lg:max-w-[36ch] xl:max-w-[39ch]">
            {BRAND.heroSummary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:mt-7 sm:gap-x-7">
            <Link
              to="/quickstart"
              className="btn-primary"
              onMouseEnter={() => setInspectingCta(true)}
              onMouseLeave={() => setInspectingCta(false)}
              onFocus={() => setInspectingCta(true)}
              onBlur={() => setInspectingCta(false)}
            >
              Get Started
            </Link>

            <Link to="/docs" className="link-quiet">
              <span>Read Documentation</span>
              <ChevronRightIcon className="size-3.5" />
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5">
            <InstallCommandButton onHoverChange={setInspectingCta} />

            <button
              type="button"
              onClick={() => owlRef.current?.triggerScan()}
              aria-label="Trigger architectural sonar pulse on 3D owl"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[4px] border border-[var(--color-border-subtle)] bg-transparent px-3 font-editorial-mono text-xs text-[var(--color-text-secondary)] transition-[border-color,color,transform] duration-150 ease-[var(--ease-out)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] active:scale-[0.97]"
            >
              <SonarPulseIcon className="size-3.5" />
              <span>Pulse scan</span>
            </button>
          </div>

          <ProjectStats className="mt-2 sm:mt-3" />
        </div>
      </div>
    </section>
  );
};