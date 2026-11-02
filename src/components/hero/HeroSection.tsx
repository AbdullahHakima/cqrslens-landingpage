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
      className="relative flex flex-col overflow-hidden bg-[var(--color-bg-canvas)] lg:block lg:min-h-dvh"
    >
      {/* Editorial Copy & CTAs (Left Half on Desktop, Top on Mobile & Portrait Tablet) */}
      <div className="pointer-events-none relative z-[var(--z-hero-copy)] mx-auto flex w-full max-w-[1440px] flex-col px-4 pt-22 pb-5 sm:px-8 sm:pt-26 sm:pb-7 lg:min-h-dvh lg:px-8 lg:pt-[19dvh] lg:pb-[8.5dvh] xl:px-12">
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

        <div className="pointer-events-auto mt-7 sm:mt-10 lg:mt-auto lg:pt-12">
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

      {/* Real-Time 3D Sculptural Owl + 3-Regime Scanline Halftone Stage */}
      <div className="relative z-[var(--z-canvas)] h-[38dvh] min-h-[260px] max-h-[340px] w-full sm:h-[44dvh] sm:min-h-[320px] sm:max-h-[430px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:max-h-none lg:w-[60vw] xl:w-[62vw]">
        {stageReady && (
          <Suspense fallback={null}>
            <OwlHeroCanvas ref={owlRef} inspectingCta={inspectingCta} />
          </Suspense>
        )}
      </div>
    </section>
  );
};
