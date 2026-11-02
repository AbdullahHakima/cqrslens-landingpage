import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import {
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PCFSoftShadowMap,
  PlaneGeometry,
  RGBAFormat,
  SRGBColorSpace,
  Scene,
  UnsignedByteType,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three';
import { createOwlHalftoneMaterial } from './owlShader';
import { createOwlSceneController, OwlInteractionState } from './owlRig';

export interface OwlHeroCanvasHandle {
  triggerScan: () => void;
}

interface OwlHeroCanvasProps {
  inspectingCta: boolean;
}

interface ResolvedPalette {
  key: string;
  paper: Vector3;
  highlight: Vector3;
  clayShade: Vector3;
  ink: Vector3;
}

let cachedPalette: ResolvedPalette | null = null;

/**
 * Resolves all 4 Tier-2 CSS color expressions (including `oklch(...)` custom properties)
 * in a single software-backed 4x1 canvas readback, matching the browser's CSS compositor
 * byte-for-byte with zero GPU readback stalls and 0ms caching across mounts.
 */
function resolvePaletteFromTokens(): ResolvedPalette {
  const fallbacks: readonly [[number, number, number], [number, number, number], [number, number, number], [number, number, number]] = [
    [0.957, 0.949, 0.925],
    [0.988, 0.984, 0.969],
    [0.890, 0.880, 0.850],
    [0.067, 0.071, 0.063],
  ];

  try {
    const styles = getComputedStyle(document.documentElement);
    const vars = [
      styles.getPropertyValue('--color-bg-canvas').trim(),
      styles.getPropertyValue('--color-bg-elevated').trim(),
      styles.getPropertyValue('--color-bg-sunken').trim(),
      styles.getPropertyValue('--color-text-primary').trim(),
    ] as const;

    const key = vars.join('|');
    if (cachedPalette && cachedPalette.key === key) {
      return cachedPalette;
    }

    const probe = document.createElement('canvas');
    probe.width = 4;
    probe.height = 1;
    const ctx = probe.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return {
        key,
        paper: new Vector3(...fallbacks[0]),
        highlight: new Vector3(...fallbacks[1]),
        clayShade: new Vector3(...fallbacks[2]),
        ink: new Vector3(...fallbacks[3]),
      };
    }

    for (let i = 0; i < 4; i++) {
      if (vars[i]) {
        ctx.fillStyle = vars[i];
        ctx.fillRect(i, 0, 1, 1);
      }
    }

    const data = ctx.getImageData(0, 0, 4, 1).data;
    const readVec = (idx: number): Vector3 => {
      if (!vars[idx]) return new Vector3(...fallbacks[idx]);
      const base = idx * 4;
      return new Vector3(data[base] / 255, data[base + 1] / 255, data[base + 2] / 255);
    };

    cachedPalette = {
      key,
      paper: readVec(0),
      highlight: readVec(1),
      clayShade: readVec(2),
      ink: readVec(3),
    };
    return cachedPalette;
  } catch {
    return {
      key: 'fallback',
      paper: new Vector3(...fallbacks[0]),
      highlight: new Vector3(...fallbacks[1]),
      clayShade: new Vector3(...fallbacks[2]),
      ink: new Vector3(...fallbacks[3]),
    };
  }
}

export const OwlHeroCanvas = forwardRef<OwlHeroCanvasHandle, OwlHeroCanvasProps>(
  ({ inspectingCta }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inspectingRef = useRef(inspectingCta);
    const triggerFnRef = useRef<(() => void) | null>(null);

    inspectingRef.current = inspectingCta;

    useImperativeHandle(ref, () => ({
      triggerScan: () => {
        triggerFnRef.current?.();
      },
    }));

    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      let disposed = false;
      let teardown: (() => void) | null = null;

      /* Defer WebGL context + shader initialization to the next animation frame so:
         1. Hero HTML/CSS paints first with zero main-thread blocking.
         2. React <StrictMode> double-invocation in localhost dev cancels the first rAF
            before creating a redundant WebGLRenderer / compiling shaders twice. */
      const bootRaf = window.requestAnimationFrame(() => {
        if (disposed) return;

        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        let renderer: WebGLRenderer;
        try {
          renderer = new WebGLRenderer({
            canvas,
            antialias: false,
            alpha: false,
          });
        } catch {
          return;
        }

        renderer.outputColorSpace = SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFSoftShadowMap;

        const owlController = createOwlSceneController();
        const postMaterial = createOwlHalftoneMaterial();

        /* Sync shader palette byte-for-byte with active Tier-2 OKLCH CSS tokens */
        const syncPaletteFromTokens = () => {
          const palette = resolvePaletteFromTokens();
          postMaterial.uniforms.uPaperColor.value.copy(palette.paper);
          postMaterial.uniforms.uHighlightColor.value.copy(palette.highlight);
          postMaterial.uniforms.uClayShadeColor.value.copy(palette.clayShade);
          postMaterial.uniforms.uInkColor.value.copy(palette.ink);
        };
        syncPaletteFromTokens();

        /* Fullscreen post-processing quad */
        const postScene = new Scene();
        const postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const quadGeo = new PlaneGeometry(2, 2);
        const quadMesh = new Mesh(quadGeo, postMaterial);
        postScene.add(quadMesh);

        const renderTarget = new WebGLRenderTarget(800, 720, {
          minFilter: LinearFilter,
          magFilter: LinearFilter,
          format: RGBAFormat,
          type: UnsignedByteType,
          samples: 2,
        });
        postMaterial.uniforms.tScene.value = renderTarget.texture;

        let cssW = 1;
        let cssH = 1;
        let docLeft = 0;
        let docTop = 0;

        const updateSize = () => {
          const rect = container.getBoundingClientRect();
          docLeft = rect.left + window.scrollX;
          docTop = rect.top + window.scrollY;
          cssW = Math.max(16, Math.round(rect.width));
          cssH = Math.max(16, Math.round(rect.height));
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          /* Pass 1 feeds the quantized halftone shader; 1.25x DPR + 2x MSAA cuts
             offscreen GPU fill-rate by up to 8x while Pass 2 renders at full Retina DPR */
          const rtDpr = Math.min(dpr, 1.25);

          renderer.setPixelRatio(dpr);
          renderer.setSize(cssW, cssH, false);

          const bufW = Math.round(cssW * rtDpr);
          const bufH = Math.round(cssH * rtDpr);
          renderTarget.setSize(bufW, bufH);

          const aspect = cssW / Math.max(1, cssH);
          owlController.camera.aspect = aspect;
          /* Responsive framing tied to layout mode (stacked < 1024px vs side-by-side >= 1024px) */
          const vw = window.innerWidth || cssW;
          const isStackedStage = vw < 1024;
          let baseZ: number;
          let offsetX: number;
          let camY: number;
          let lookY: number;

          if (isStackedStage) {
            baseZ = aspect < 1.15 ? 10.55 : aspect < 1.65 ? 9.75 : 9.35;
            offsetX = 0.04;
            camY = -0.05;
            lookY = -0.15;
          } else {
            const isCompactSideStage = vw < 1220;
            baseZ = isCompactSideStage ? 10.2 : 9.45;
            offsetX = isCompactSideStage ? -0.38 : -0.30;
            camY = 0.08;
            lookY = -0.04;
          }

          owlController.camera.position.set(offsetX, camY, baseZ);
          owlController.camera.lookAt(offsetX, lookY, 0);
          owlController.camera.updateProjectionMatrix();

          postMaterial.uniforms.uResolutionCss.value.set(cssW, cssH);
          postMaterial.uniforms.uRowPitch.value = cssW < 540 ? 6.0 : 7.0;
          postMaterial.uniforms.uColPitch.value = cssW < 540 ? 4.0 : 4.5;
        };

        updateSize();

        const interaction: OwlInteractionState = {
          pointerX: 0,
          pointerY: 0,
          pointerActive: false,
          inspectingCta: false,
        };

        let pointerIdleTimer = 0;
        const onPointerMove = (e: PointerEvent) => {
          if (e.pointerType === 'touch') return;
          /* Map pointer relative to cached document coordinates (zero layout reads) */
          interaction.pointerX = ((e.pageX - docLeft) / Math.max(cssW, 1) - 0.5) * 2;
          interaction.pointerY = -((e.pageY - docTop) / Math.max(cssH, 1) - 0.5) * 2;
          interaction.pointerActive = true;

          window.clearTimeout(pointerIdleTimer);
          pointerIdleTimer = window.setTimeout(() => {
            interaction.pointerActive = false;
          }, 2600);
        };

        const clockStart = performance.now();
        let prevNow = clockStart;
        let lastRenderMs = 0;
        let revealed = false;
        let rafId = 0;
        let isRunning = false;
        let inViewport = true;
        let contextLost = false;

        const renderFrameAt = (nowMs: number) => {
          if (contextLost) return;
          const elapsedSec = (nowMs - clockStart) / 1000;
          const dt = Math.min(0.05, Math.max(0.001, (nowMs - prevNow) / 1000));
          prevNow = nowMs;
          lastRenderMs = nowMs;

          interaction.inspectingCta = inspectingRef.current;

          const { scanWave, owlScreenPos } = owlController.update(
            prefersReducedMotion ? 3.2 : elapsedSec,
            prefersReducedMotion ? 0.016 : dt,
            interaction
          );

          postMaterial.uniforms.uTime.value = prefersReducedMotion ? 3.2 : elapsedSec;
          postMaterial.uniforms.uScanWave.value = scanWave;
          postMaterial.uniforms.uOwlScreenPos.value.copy(owlScreenPos);

          /* Pass 1: Render 3D sculpted Owl + directional floor shadow into MSAA target */
          renderer.setRenderTarget(renderTarget);
          renderer.setClearColor(0xffffff, 0.0);
          renderer.clear(true, true, false);
          renderer.render(owlController.scene, owlController.camera);

          /* Pass 2: Composite 3-regime scanline & pixel-block halftone shader to screen */
          renderer.setRenderTarget(null);
          renderer.render(postScene, postCamera);

          if (!revealed) {
            revealed = true;
            canvas.style.opacity = '1';
          }
        };

        const loop = (now: number) => {
          if (!isRunning) return;
          rafId = window.requestAnimationFrame(loop);
          /* Pace high-refresh displays (120/144/240Hz) cleanly to ~60-82 FPS while
             rendering every single vblank on 60Hz/75Hz monitors */
          if (lastRenderMs > 0 && now - lastRenderMs < 12.0) return;
          renderFrameAt(now);
        };

        const startLoop = () => {
          if (prefersReducedMotion) {
            /* Pre-warm spring solver for 20 steps so the static pose settles naturally */
            for (let i = 0; i < 20; i++) {
              owlController.update(3.2, 0.03, interaction);
            }
            renderFrameAt(performance.now());
            return;
          }
          if (isRunning || !inViewport || document.hidden || contextLost) return;
          isRunning = true;
          const now = performance.now();
          prevNow = now;
          if (!revealed) {
            renderFrameAt(now);
          }
          rafId = window.requestAnimationFrame(loop);
        };

        const stopLoop = () => {
          isRunning = false;
          window.cancelAnimationFrame(rafId);
        };

        triggerFnRef.current = () => {
          const tSec = (performance.now() - clockStart) / 1000;
          owlController.triggerScanHop(tSec);
          if (prefersReducedMotion) {
            renderFrameAt(performance.now());
          }
        };

        const resizeObserver = new ResizeObserver(() => {
          updateSize();
          if (!isRunning) {
            renderFrameAt(performance.now());
          }
        });
        resizeObserver.observe(container);

        const intersectionObserver = new IntersectionObserver(
          (entries) => {
            inViewport = entries[0]?.isIntersecting ?? true;
            if (inViewport && !document.hidden) startLoop();
            else stopLoop();
          },
          { threshold: 0.02 }
        );
        intersectionObserver.observe(container);

        const onVisibilityChange = () => {
          if (inViewport && !document.hidden) startLoop();
          else stopLoop();
        };

        const onContextLost = (e: Event) => {
          e.preventDefault();
          contextLost = true;
          stopLoop();
        };

        const onContextRestored = () => {
          contextLost = false;
          syncPaletteFromTokens();
          updateSize();
          startLoop();
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('visibilitychange', onVisibilityChange);
        canvas.addEventListener('webglcontextlost', onContextLost);
        canvas.addEventListener('webglcontextrestored', onContextRestored);

        startLoop();

        teardown = () => {
          stopLoop();
          window.clearTimeout(pointerIdleTimer);
          triggerFnRef.current = null;
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          window.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('visibilitychange', onVisibilityChange);
          canvas.removeEventListener('webglcontextlost', onContextLost);
          canvas.removeEventListener('webglcontextrestored', onContextRestored);

          owlController.dispose();
          quadGeo.dispose();
          postMaterial.dispose();
          renderTarget.dispose();
          renderer.dispose();
        };
      });

      return () => {
        disposed = true;
        window.cancelAnimationFrame(bootRaf);
        teardown?.();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        onClick={() => triggerFnRef.current?.()}
        title="Click owl to pulse an architectural scan"
        className="relative h-full w-full cursor-pointer touch-pan-y select-none"
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="block h-full w-full touch-pan-y transition-opacity duration-200 ease-[var(--ease-out)] motion-reduce:transition-none"
        />
      </div>
    );
  }
);

OwlHeroCanvas.displayName = 'OwlHeroCanvas';

export default OwlHeroCanvas;
