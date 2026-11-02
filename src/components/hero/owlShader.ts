import { ShaderMaterial, Vector2, Vector3 } from 'three';

/**
 * Custom GLSL Post-Processing Shader implementing the 3-Regime Sculptural
 * Scanline + Pixel-Block Halftone technique:
 *
 *   Regime 1 (Bright Lit 3D Volume):
 *     Soft elevated white sculptural highlight melting seamlessly into cool
 *     mineral drafting paper — zero scanlines on lit left surfaces.
 *
 *   Regime 2 (Mid-Tone 3D Shading + Sweeping Right-Edge Shadow Gobo):
 *     100% solid ink horizontal scanlines locked to screen rows, with
 *     thickness capped so shaded white plumage always retains crisp breathing
 *     gaps between lines, and horizontal X tips quantized to discrete cells.
 *
 *   Regime 3 (Intentional Dark Features — Eyes, Beak, Talons):
 *     Full-row vertical fill quantized to pixel columns, fusing obsidian
 *     features into crisp 8-bit pixel-art blocks while preserving bright
 *     white corneal eye catchlights.
 */
export function createOwlHalftoneMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      tScene: { value: null },
      uResolutionCss: { value: new Vector2(800, 720) },
      uPaperColor: { value: new Vector3(0.922, 0.949, 0.933) },
      uHighlightColor: { value: new Vector3(0.985, 0.992, 0.988) },
      uClayShadeColor: { value: new Vector3(0.845, 0.875, 0.858) },
      uInkColor: { value: new Vector3(0.063, 0.078, 0.071) },
      uTime: { value: 0 },
      uScanWave: { value: -1.0 },
      uOwlScreenPos: { value: new Vector2(0.48, 0.48) },
      uRowPitch: { value: 7.0 },
      uColPitch: { value: 4.5 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;

      uniform sampler2D tScene;
      uniform vec2 uResolutionCss;
      uniform vec3 uPaperColor;
      uniform vec3 uHighlightColor;
      uniform vec3 uClayShadeColor;
      uniform vec3 uInkColor;
      uniform float uTime;
      uniform float uScanWave;
      uniform vec2 uOwlScreenPos;
      uniform float uRowPitch;
      uniform float uColPitch;

      varying vec2 vUv;

      float cellHash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      /* Animated architectural gobo shadow sweeping the upper-right & ground right edge */
      float backdropGobo(vec2 uv, float t, float owlFootY) {
        /* Upper-right organic contour wave bleeding to x = 1.0 */
        float wave = sin(uv.y * 5.4 - t * 0.52) * 0.048
                   + sin(uv.y * 11.5 + t * 0.34) * 0.020;
        float drift = sin(t * 0.40) * 0.040;
        float edgeX = 0.60 + drift + wave + pow(abs(uv.y - 0.65), 1.65) * 0.55;

        float upperField = smoothstep(edgeX - 0.015, edgeX + 0.24, uv.x);
        float upperMaskY = smoothstep(0.35, 0.48, uv.y) * (1.0 - smoothstep(0.85, 0.93, uv.y));
        upperField *= upperMaskY * 0.30;

        /* Ground shadow continuation aligned directly with the Owl's talon plane */
        float floorBand = exp(-pow((uv.y - owlFootY) / 0.048, 2.0));
        float floorStart = 0.47 + sin(uv.y * 26.0) * 0.010;
        float floorField = smoothstep(floorStart, floorStart + 0.20, uv.x) * floorBand * 0.32;

        return max(upperField, floorField);
      }

      void main() {
        vec2 cssPos = vUv * uResolutionCss;
        float yTop = uResolutionCss.y - cssPos.y;

        float rowIdx = floor(yTop / uRowPitch);
        float rowLocal = yTop - rowIdx * uRowPitch;
        float distFromRowCenter = abs(rowLocal - uRowPitch * 0.5);

        float colIdx = floor(cssPos.x / uColPitch);

        vec2 cellCssCenter = vec2(
          (colIdx + 0.5) * uColPitch,
          uResolutionCss.y - (rowIdx + 0.5) * uRowPitch
        );
        vec2 qUv = clamp(cellCssCenter / uResolutionCss, vec2(0.001), vec2(0.999));

        vec4 smoothSample = texture2D(tScene, vUv);
        vec4 cellSample = texture2D(tScene, qUv);

        float smoothIsOwl = smoothstep(0.55, 0.85, smoothSample.a);
        float cellIsOwl = step(0.55, cellSample.a);

        float smoothLum = dot(smoothSample.rgb, vec3(0.299, 0.587, 0.114));
        float cellLum = dot(cellSample.rgb, vec3(0.299, 0.587, 0.114));

        /* Tactile 3D porcelain highlight & soft shading underneath the scanlines */
        vec3 owlClayBase = mix(uClayShadeColor, uHighlightColor, smoothstep(0.32, 0.92, smoothLum));
        vec3 baseColor = mix(uPaperColor, owlClayBase, smoothIsOwl);

        float owlFootY = clamp(uOwlScreenPos.y - 0.30, 0.12, 0.24);
        float darkness = 0.0;

        if (cellIsOwl > 0.5) {
          /* Lit left porcelain rim (cellLum > 0.885) drops to 0 darkness => zero lines */
          darkness = smoothstep(0.885, 0.06, cellLum);
        } else {
          float floorShadow = (cellSample.a > 0.005 && cellSample.a <= 0.55)
            ? clamp((1.0 - cellLum) * 1.05, 0.0, 0.44)
            : 0.0;
          float gobo = backdropGobo(qUv, uTime, owlFootY);
          darkness = max(floorShadow, gobo);
        }

        /* Active sonar scan wave ripple */
        if (uScanWave >= 0.0 && uScanWave <= 1.25) {
          vec2 aspectVec = vec2(
            (qUv.x - uOwlScreenPos.x) * (uResolutionCss.x / max(uResolutionCss.y, 1.0)),
            qUv.y - uOwlScreenPos.y
          );
          float radialDist = length(aspectVec);
          float waveFront = uScanWave * 1.15;
          float ring = exp(-pow((radialDist - waveFront) / 0.052, 2.0));
          float fadeOut = 1.0 - smoothstep(0.75, 1.25, uScanWave);
          if (qUv.x > 0.20) {
            darkness = max(darkness, ring * 0.32 * fadeOut);
          }
        }

        /* Stepped printer-tick edge breakup on faintest outer fringes */
        float jitter = (cellHash(vec2(colIdx, rowIdx)) - 0.5) * 0.065;
        float effDark = darkness + (darkness > 0.02 && darkness < 0.22 ? jitter : 0.0);

        /* Preserve crisp white corneal catchlights inside the obsidian eyes */
        bool isEyeCatchlight = (cellIsOwl > 0.5 && max(cellLum, smoothLum) > 0.92);

        float inkMask = 0.0;

        if (!isEyeCatchlight && effDark > 0.09) {
          if (effDark >= 0.90 && cellIsOwl > 0.5) {
            /* REGIME 3: Obsidian features ONLY (eyes, beak, talons) merge into solid pixel blocks */
            inkMask = 1.0;
          } else {
            /* REGIME 2: Airy architectural horizontal scanlines capped at ~46% of rowPitch
               so shaded white plumage always retains crisp breathing gaps */
            float normShade = clamp((effDark - 0.09) / 0.80, 0.0, 1.0);
            float maxHalf = uRowPitch * 0.23;
            float minHalf = 0.52;
            float stepped = floor(normShade * 4.0) / 3.0;
            float halfThick = mix(minHalf, maxHalf, clamp(stepped, 0.0, 1.0));
            inkMask = 1.0 - smoothstep(halfThick - 0.22, halfThick + 0.22, distFromRowCenter);
          }
        }

        vec3 finalColor = mix(baseColor, uInkColor, inkMask);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    depthTest: false,
    depthWrite: false,
  });
}
