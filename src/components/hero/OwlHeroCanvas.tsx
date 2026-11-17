import { useEffect, useImperativeHandle, useRef, forwardRef, type RefObject } from 'react';
import {
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PCFShadowMap,
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
  triggerScan: (aimX?: number, aimY?: number) => void;
}

interface OwlHeroCanvasProps {
  inspectingCta: boolean;
  /**
   * Layout anchor describing where the owl should stand inside the full-bleed hero
   * surface. The canvas fills the whole hero; the 3D scene is framed to this element's
   * rectangle, so one continuous surface serves every breakpoint.
   */
  stageRef: RefObject<HTMLElement | null>;
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
 * Resolves the four dedicated owl-palette CSS color expressions (including
 * `oklch(...)` custom properties) in a single software-backed 4x1 canvas readback,
 * matching the browser's CSS compositor byte-for-byte with zero GPU readback stalls
 * and 0ms caching across mounts. These tokens are intentionally independent from the
 * page surface tokens so the porcelain owl keeps its contrast on the lapis hero.
 */
function resolvePaletteFromTokens(): ResolvedPalette {
  const fallbacks: readonly [[number, number, number], [number, number, number], [number, number, number], [number, number, number]] = [
    [0.020, 0.122, 0.263],
    [0.961, 0.925, 0.839],
    [0.840, 0.800, 0.690],
    [0.012, 0.082, 0.184],
  ];

  try {
    const styles = getComputedStyle(document.documentElement);
    const vars = [
      styles.getPropertyValue('--color-owl-paper').trim(),
      styles.getPropertyValue('--color-owl-highlight').trim(),
      styles.getPropertyValue('--color-owl-clay').trim(),
      styles.getPropertyValue('--color-owl-ink').trim(),
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
  ({ inspectingCta, stageRef }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inspectingRef = useRef(inspectingCta);
    const triggerFnRef = useRef<((aimX?: number, aimY?: number) => void) | null>(null);

    inspectingRef.current = inspectingCta;

    useImperativeHandle(ref, () => ({
      triggerScan: (aimX?: number, aimY?: number) => {
        triggerFnRef.current?.(aimX, aimY);
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
            powerPreference: 'high-performance',
            stencil: false,
            preserveDrawingBuffer: false,
          });
        } catch {
          return;
        }

        renderer.outputColorSpace = SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = PCFShadowMap;

        const initialVw = window.innerWidth || 1024;
        const isCompactDevice =
          initialVw < 768 ||
          (typeof navigator !== 'undefined' &&
            typeof navigator.hardwareConcurrency === 'number' &&
            navigator.hardwareConcurrency <= 4);

        const owlController = createOwlSceneController({
          compactDetail: isCompactDevice,
        });
        const postMaterial = createOwlHalftoneMaterial();

        /* Sync shader palette byte-for-byte with the active owl-palette OKLCH tokens */
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

        const msaaSamples = renderer.capabilities.isWebGL2 && !isCompactDevice ? 2 : 0;
        const renderTarget = new WebGLRenderTarget(800, 720, {
          minFilter: LinearFilter,
          magFilter: LinearFilter,
          format: RGBAFormat,
          type: UnsignedByteType,
          samples: msaaSamples,
        });
        postMaterial.uniforms.tScene.value = renderTarget.texture;

        type QualityTier = 'high' | 'balanced' | 'eco';
        let qualityTier: QualityTier = 'high';
        let shadowInterval = 1;
        let activeFrameCount = 0;
        let avgFrameMs = 16.7;
        let slowStreak = 0;

        const groundProbe = new Vector3();
        let cssW = 1;
        let cssH = 1;
        /* Stage = the sub-rectangle of the hero surface the owl is framed into */
        let stageDocLeft = 0;
        let stageDocTop = 0;
        let stageW = 1;
        let stageH = 1;
        let lastCanvasW = 0;
        let lastCanvasH = 0;
        let lastDpr = 0;
        let lastRtW = 0;
        let lastRtH = 0;

        const updateSize = () => {
          /* Batch all layout reads before any canvas/uniform writes */
          const rect = container.getBoundingClientRect();
          const stageEl = stageRef.current;
          const sRect = stageEl ? stageEl.getBoundingClientRect() : rect;

          cssW = Math.max(16, Math.round(rect.width));
          cssH = Math.max(16, Math.round(rect.height));

          const sx = Math.min(Math.max(sRect.left - rect.left, 0), cssW - 16);
          const sy = Math.min(Math.max(sRect.top - rect.top, 0), cssH - 16);
          stageW = Math.max(16, Math.min(Math.round(sRect.width), cssW - sx));
          stageH = Math.max(16, Math.min(Math.round(sRect.height), cssH - sy));
          stageDocLeft = sRect.left + window.scrollX;
          stageDocTop = sRect.top + window.scrollY;

          const nativeDpr = window.devicePixelRatio || 1;
          const canvasCap =
            qualityTier === 'eco'
              ? 1.0
              : qualityTier === 'balanced'
                ? 1.25
                : isCompactDevice
                  ? 1.6
                  : 2.0;
          const rtCap =
            qualityTier === 'eco'
              ? 0.72
              : qualityTier === 'balanced'
                ? 0.85
                : isCompactDevice
                  ? 1.0
                  : 1.25;

          const dpr = Math.min(nativeDpr, canvasCap);
          const rtDpr = Math.min(nativeDpr, rtCap);

          if (cssW !== lastCanvasW || cssH !== lastCanvasH || dpr !== lastDpr) {
            renderer.setPixelRatio(dpr);
            renderer.setSize(cssW, cssH, false);
            lastCanvasW = cssW;
            lastCanvasH = cssH;
            lastDpr = dpr;
          }

          const rtW = Math.max(16, Math.round(stageW * rtDpr));
          const rtH = Math.max(16, Math.round(stageH * rtDpr));
          if (rtW !== lastRtW || rtH !== lastRtH) {
            renderTarget.setSize(rtW, rtH);
            lastRtW = rtW;
            lastRtH = rtH;
          }

          const aspect = stageW / Math.max(1, stageH);
          owlController.camera.aspect = aspect;

          /* Responsive framing tied directly to stage geometry across phones, tablets,
             short landscape phones, laptops & ultrawides.
             Visible height at distance d is 2 * d * tan(15deg) ~= 0.536 * d. */
          const vw = window.innerWidth || cssW;
          const vh = window.innerHeight || cssH;
          const isStackedStage = stageW > vw * 0.76;
          const isShortLandscapeSide = !isStackedStage && vh < 520;
          const VIS_PER_Z = 0.536;
          let baseZ: number;
          let offsetX: number;
          let camY: number;
          let lookY: number;

          if (isStackedStage) {
            baseZ = Math.max(3.8 / VIS_PER_Z, 2.95 / (aspect * VIS_PER_Z));
            offsetX = 0.04;
            camY = 0.02;
            lookY = -0.02;
            postMaterial.uniforms.uSonarMaskLeft.value = 0.0;
          } else if (isShortLandscapeSide) {
            /* Landscape mobile split (50vw..100vw, locked below 72px header inside 100dvh fold):
               height-fit the whole owl cleanly from tufts to talons inside the visible fold */
            baseZ = Math.max(8.2, 4.15 / VIS_PER_Z, 3.25 / (aspect * VIS_PER_Z));
            offsetX = -0.06;
            camY = 0.04;
            lookY = -0.02;
            postMaterial.uniforms.uSonarMaskLeft.value = 1.0;
          } else {
            const isCompactSideStage = vw < 1220;
            baseZ = isCompactSideStage ? 9.45 : 9.10;
            /* Guard tall/narrow side stages (e.g. portrait iPad Pro) against horizontal crop */
            baseZ = Math.max(baseZ, 3.95 / (aspect * VIS_PER_Z));
            /* Clear left wordmark ("NOCTUA CODE MAP") + sticky header ear-tuft margin cleanly */
            offsetX = isCompactSideStage ? -0.46 : vw >= 1680 ? -0.46 : -0.42;
            camY = 0.22;
            lookY = 0.12;
            postMaterial.uniforms.uSonarMaskLeft.value = 1.0;
          }

          owlController.camera.position.set(offsetX, camY, baseZ);
          owlController.camera.lookAt(offsetX, lookY, 0);
          owlController.camera.updateProjectionMatrix();

          /* Ground-contact line of the talons in stage UV, so the cast-shadow band tracks the
             feet at every stage aspect ratio instead of assuming a fixed framing */
          owlController.camera.updateMatrixWorld();
          const footNdc = groundProbe.set(0, -1.4, 0).project(owlController.camera);
          postMaterial.uniforms.uFootY.value = footNdc.y * 0.5 + 0.5;

          postMaterial.uniforms.uResolutionCss.value.set(cssW, cssH);
          /* Stage rectangle in hero UV space (origin bottom-left, like gl_FragCoord) */
          postMaterial.uniforms.uStageRect.value.set(
            sx / cssW,
            (cssH - sy - stageH) / cssH,
            stageW / cssW,
            stageH / cssH
          );
          postMaterial.uniforms.uRowPitch.value = cssW < 540 ? 5.8 : vw >= 1800 ? 7.5 : 7.0;
          postMaterial.uniforms.uColPitch.value = cssW < 540 ? 3.8 : vw >= 1800 ? 4.8 : 4.5;
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
          /* Map pointer relative to the cached owl stage (zero layout reads) */
          interaction.pointerX = ((e.pageX - stageDocLeft) / Math.max(stageW, 1) - 0.5) * 2;
          interaction.pointerY = -((e.pageY - stageDocTop) / Math.max(stageH, 1) - 0.5) * 2;
          interaction.pointerActive = true;

          window.clearTimeout(pointerIdleTimer);
          pointerIdleTimer = window.setTimeout(() => {
            interaction.pointerActive = false;
          }, 2600);
        };

        const clearPointerFocus = () => {
          interaction.pointerActive = false;
        };

        const clockStart = performance.now();
        const REDUCED_POSE_SEC = 3.2;
        let prevNow = clockStart;
        let lastRenderMs = 0;
        let revealed = false;
        let rafId = 0;
        let resizeRaf = 0;
        let reducedPulseTimer = 0;
        let reducedScanOverride: number | null = null;
        let isRunning = false;
        let inViewport = true;
        let contextLost = false;

        const scheduleResize = () => {
          if (resizeRaf || disposed) return;
          resizeRaf = window.requestAnimationFrame(() => {
            resizeRaf = 0;
            if (disposed || contextLost) return;
            updateSize();
            if (!isRunning) {
              renderFrameAt(performance.now());
            }
          });
        };

        const renderFrameAt = (nowMs: number) => {
          if (contextLost) return;
          const elapsedSec = (nowMs - clockStart) / 1000;
          const dt = Math.min(0.05, Math.max(0.001, (nowMs - prevNow) / 1000));
          const frameDelta = lastRenderMs > 0 ? nowMs - lastRenderMs : 16.7;
          prevNow = nowMs;
          lastRenderMs = nowMs;

          interaction.inspectingCta = inspectingRef.current;

          /* Track sustained slow frames to auto-step down render target DPR & shadow cadence */
          if (!prefersReducedMotion && isRunning && frameDelta < 120) {
            activeFrameCount++;
            if (activeFrameCount > 15) {
              avgFrameMs = avgFrameMs * 0.9 + frameDelta * 0.1;
              if (qualityTier === 'high' && avgFrameMs > 28) {
                slowStreak++;
                if (slowStreak >= 18) {
                  qualityTier = 'balanced';
                  shadowInterval = 2;
                  slowStreak = 0;
                  scheduleResize();
                }
              } else if (qualityTier === 'balanced' && avgFrameMs > 40) {
                slowStreak++;
                if (slowStreak >= 18) {
                  qualityTier = 'eco';
                  shadowInterval = 3;
                  slowStreak = 0;
                  scheduleResize();
                }
              } else {
                slowStreak = Math.max(0, slowStreak - 1);
              }
            }
          }

          if (shadowInterval > 1) {
            renderer.shadowMap.autoUpdate = false;
            renderer.shadowMap.needsUpdate = activeFrameCount % shadowInterval === 0;
          } else {
            renderer.shadowMap.autoUpdate = true;
          }

          const { scanWave, owlScreenPos } = owlController.update(
            prefersReducedMotion ? REDUCED_POSE_SEC : elapsedSec,
            prefersReducedMotion ? 0.016 : dt,
            interaction
          );

          postMaterial.uniforms.uTime.value = prefersReducedMotion ? REDUCED_POSE_SEC : elapsedSec;
          postMaterial.uniforms.uScanWave.value =
            reducedScanOverride !== null ? reducedScanOverride : scanWave;
          postMaterial.uniforms.uOwlScreenPos.value.copy(owlScreenPos);

          /* Pass 1: Render 3D sculpted Owl + directional floor shadow into offscreen target */
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
              owlController.update(REDUCED_POSE_SEC, 0.03, interaction);
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

        triggerFnRef.current = (aimX?: number, aimY?: number) => {
          const tSec = (performance.now() - clockStart) / 1000;
          owlController.triggerScanHop(tSec, aimX, aimY);
          if (prefersReducedMotion) {
            /* Display a calm static sonar ring snapshot without rapid strobing */
            window.clearTimeout(reducedPulseTimer);
            reducedScanOverride = 0.44;
            for (let i = 0; i < 6; i++) {
              owlController.update(REDUCED_POSE_SEC, 0.03, interaction);
            }
            renderFrameAt(performance.now());
            reducedPulseTimer = window.setTimeout(() => {
              if (disposed || contextLost) return;
              reducedScanOverride = null;
              for (let i = 0; i < 12; i++) {
                owlController.update(REDUCED_POSE_SEC, 0.03, interaction);
              }
              renderFrameAt(performance.now());
            }, 950);
          }
        };

        const resizeObserver = new ResizeObserver(scheduleResize);
        resizeObserver.observe(container);
        if (stageRef.current) resizeObserver.observe(stageRef.current);

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
          lastCanvasW = 0;
          lastRtW = 0;
          syncPaletteFromTokens();
          updateSize();
          startLoop();
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('blur', clearPointerFocus);
        document.documentElement.addEventListener('pointerleave', clearPointerFocus);
        document.addEventListener('visibilitychange', onVisibilityChange);
        canvas.addEventListener('webglcontextlost', onContextLost);
        canvas.addEventListener('webglcontextrestored', onContextRestored);

        startLoop();

        teardown = () => {
          stopLoop();
          window.cancelAnimationFrame(resizeRaf);
          window.clearTimeout(pointerIdleTimer);
          window.clearTimeout(reducedPulseTimer);
          triggerFnRef.current = null;
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('blur', clearPointerFocus);
          document.documentElement.removeEventListener('pointerleave', clearPointerFocus);
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
        onClick={(e) => {
          const stage = stageRef.current;
          if (!stage) return;
          /* The canvas is full-bleed; only clicks on the owl stage pulse and aim the gaze */
          const r = stage.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            const aimX = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 2;
            const aimY = -((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * 2;
            triggerFnRef.current?.(aimX, aimY);
          }
        }}
        className="relative h-full w-full touch-pan-y select-none"
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