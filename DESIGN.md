# Design System — Noctua (Placeholder Identity for Static .NET Architecture Cartography)

## 1. Visual World & Direction
- **Aesthetic Thesis:** Tactile Swiss architectural monograph meets retro-digital bitmap printmaking. Built around a living 3D sculptural Little Owl (*Athene noctua*) rendered in real time through a 3-regime horizontal scanline and pixel-block halftone shader.
- **Placeholder Brand Seam:** `src/config/brand.ts` owns the display brand identity (`Noctua` / `NOCTUA CODE MAP`) separately from the technical CLI & NuGet coordinates (`cqrslens` / `CqrsLens v0.8.0`).

## 2. Two-Tier OKLCH Color System (`src/styles/tokens.css`)
- **Tier 1 (Primitives):** Constant-hue (`158°`) Cool Mineral Celadon-Slate drafting paper ramp (`--mineral-50` through `--mineral-950`) paired with five print-calibrated diagnostic ink ramps (`cobalt`, `teal`, `amber`, `crimson`, `forest`). Primitives are never consumed directly by components.
- **Tier 2 (Semantics):**
  - Surfaces: `--color-bg-canvas`, `--color-bg-elevated`, `--color-bg-subtle`, `--color-bg-sunken`, `--color-bg-inverse`, `--color-bg-inverse-elevated`.
  - Ink (all WCAG AA/AAA verified): `--color-text-primary` (16.1:1), `--color-text-secondary` (9.5:1), `--color-text-muted` (5.9:1), `--color-text-on-inverse` (16.1:1).
  - Borders & Actions: `--color-border-subtle`, `--color-border-strong`, `--color-action-solid`, `--color-focus-ring`.
  - CQRS Domain States: `--color-role-command-*`, `--color-role-query-*`, `--color-role-warn-*`, `--color-role-error-*`, `--color-role-pass-*` (always paired with explicit text badges, never color alone).

## 3. Typography
- **Display Wordmarks (`PixelWordmark.tsx`):** Authored 10-row stepped-pixel SVG bitmap typeface with 2-unit stems, notched corner shoulders, and merged horizontal `<rect>` runs (`shape-rendering: crispEdges`).
- **Editorial Sans (`Hanken Grotesk`):** Rational neo-grotesque primary voice for section headings (`font-medium`, `-0.025em` tracking, `text-wrap: balance`), table headers, and technical prose (`16px`, `1.55` to `1.6` unitless line-height, `30rem` to `33rem` measure capped under 75 characters, `text-wrap: pretty`).
- **Technical Monospace (`Azeret Mono`):** Hero statement and CTAs, navigation links, CLI invocations, C# contract names, rule identifiers, and source coordinates.

## 4. 3D WebGL Owl & 3-Regime Halftone Shader (`src/components/hero/`)
- **Sculpted 3D Geometry (`owlRig.ts`):** High-subdivision vertex-sculpted cranium with twin concave binocular facial discs and heart-shaped supraorbital brow ridge, feathered plumicorn tufts, obsidian eyes with protruding white corneal catchlights and 3D eyelids, compact hooked beak, plump chevron-textured chest, articulated wings, and 3-toed talons over a directional ground shadow catcher.
- **Behavioral Kinematics:** Second-order damped spring solver driving a 5-act autonomous owl loop (2-step sidestep hop + feather ruffle, 25° curious owl head-tilt, 3-stop architectural sonar scan with right-wing gesture, glance toward headline/CTA with rapid double-blink, calm breathing perch), blended seamlessly with live cursor tracking, CTA hover inspection, and click-to-pulse sonar waves.
- **3-Regime GLSL Shader (`owlShader.ts`):**
  1. Lit porcelain highlights (`lum > 0.895`) render soft elevated 3D white volume over mineral celadon paper with zero scanlines.
  2. Mid-tone shadows (`0.09 < effDark < 0.80`) render 100% solid dark-ink horizontal bars locked to screen rows (`7px` pitch) with quantized thickness capped at `62%` of row height (preserving light feather gaps across all white plumage) and `4.5px` stepped horizontal tips.
  3. Deep dark features (`effDark >= 0.80`) fill full `7×4.5px` cells to fuse obsidian eyes, beak, and talons into crisp 8-bit pixel blocks while cutting out bright white corneal catchlights.

## 5. Layout & Craft Guardrails
- 12-column Swiss rectilinear grid (`max-w-[1440px]`), `min-h-dvh` hero, 44px minimum touch targets.
- Strict adherence to Impeccable craft floor: no eyebrow/kicker labels above headings, no repetitive 3×2 icon-card grids or nested cards, no `feTurbulence` grain, no Unicode/emoji icon stand-ins, themed browser surfaces (`::selection`, `scrollbar-color`, `:focus-visible`, `caret-color`), and full `prefers-reduced-motion` + offscreen WebGL pause handling.
