# Design System — Noctua (Placeholder Identity for Static .NET Architecture Cartography)

## 1. Visual World & Direction
- **Aesthetic Thesis:** A tactile Swiss architectural monograph printed on a deep lapis plate in warm papyrus ink, crossed with retro-digital bitmap printmaking. Built around a living 3D sculptural Little Owl (*Athene noctua*) rendered in real time through a 3-regime horizontal scanline and pixel-block halftone shader.
- **Placeholder Brand Seam:** `src/config/brand.ts` owns the display brand identity (`Noctua` / `NOCTUA CODE MAP`) separately from the technical CLI & NuGet coordinates (`cqrslens` / `CqrsLens v0.9.0`).

## 2. Two-Tier OKLCH Color System (`src/styles/tokens.css`)
- **Tier 1 (Primitives):** The site-wide palette is the Egyptian lapis, papyrus, and saffron print ramp promoted from the footer engraving plate — deep lapis (`--lapis-600` through `--lapis-950`), warm papyrus cream (`--papyrus-100` through `--papyrus-500`), and a single saffron origin accent (`--saffron-400`). Five print-calibrated diagnostic ink ramps (`cobalt`, `teal`, `amber`, `crimson`, `forest`) remain reserved for data and state. Primitives are never consumed directly by components.
- **Tier 2 (Semantics):**
  - Surfaces: `--color-bg-canvas` (`lapis-900`), `--color-bg-elevated` (`lapis-850`), `--color-bg-subtle` (`lapis-800`), `--color-bg-sunken` and `--color-bg-inverse` (`lapis-950`), `--color-bg-inverse-elevated` (`lapis-900`).
  - Ink (all WCAG AA/AAA verified on the lapis canvas): `--color-text-primary` papyrus cream (14.2:1), `--color-text-secondary` (10.6:1), `--color-text-muted` (7.2:1), `--color-text-on-inverse` (16.0:1).
  - Borders & Actions: `--color-border-subtle`, `--color-border-strong`, cream `--color-action-solid` with lapis `--color-action-text` (16.0:1), `--color-focus-ring`.
  - Hero owl palette: `--color-owl-paper` (`lapis-900`), `--color-owl-highlight` (`papyrus-100`), `--color-owl-clay` (`papyrus-300`), `--color-owl-ink` (`lapis-950`). Deliberately independent of page surfaces so the porcelain body and lapis-ink features keep their contrast on the hero field.
  - Footer surfaces: `--color-bg-footer` (`lapis-900`), `--color-bg-footer-raised` (`lapis-800`), `--color-bg-footer-deep` (`lapis-950`); footer ink: `--color-text-footer` (14.2:1 on footer lapis), `--color-text-footer-muted` (10.2:1), `--color-footer-accent` (9.4:1); footer hairlines and focus: `--color-border-footer`, `--color-border-footer-faint`, `--color-footer-focus`.
  - CQRS Domain States: `--color-role-command-*`, `--color-role-query-*`, `--color-role-warn-*`, `--color-role-error-*`, `--color-role-pass-*` (always paired with explicit text badges, never color alone).

## 3. Typography
- **Display Wordmarks (`PixelWordmark.tsx`):** Authored 10-row stepped-pixel SVG bitmap typeface with 2-unit stems, notched corner shoulders, and merged horizontal `<rect>` runs (`shape-rendering: crispEdges`).
- **Editorial Sans (`Hanken Grotesk`):** Rational neo-grotesque primary voice for section headings (`font-medium`, `-0.025em` tracking, `text-wrap: balance`), table headers, and technical prose (`16px`, `1.55` to `1.6` unitless line-height, `30rem` to `33rem` measure capped under 75 characters, `text-wrap: pretty`).
- **Technical Monospace (`Azeret Mono`):** Hero statement and CTAs, navigation links, CLI invocations, C# contract names, rule identifiers, and source coordinates.

## 4. 3D WebGL Owl & 3-Regime Halftone Shader (`src/components/hero/`)
- **Sculpted 3D Geometry (`owlRig.ts`):** High-subdivision vertex-sculpted cranium with twin concave binocular facial discs and heart-shaped supraorbital brow ridge, feathered plumicorn tufts, obsidian eyes with protruding white corneal catchlights and 3D eyelids, compact hooked beak, plump chevron-textured chest, articulated wings, and 3-toed talons over a directional ground shadow catcher.
- **Behavioral Kinematics:** Second-order damped spring solver driving a 5-act autonomous owl loop (2-step sidestep hop + feather ruffle, 25° curious owl head-tilt, 3-stop architectural sonar scan with right-wing gesture, glance toward headline/CTA with rapid double-blink, calm breathing perch), blended seamlessly with live cursor tracking, CTA hover inspection, and click-to-pulse sonar waves.
- **3-Regime GLSL Shader (`owlShader.ts`):**
  1. Lit porcelain highlights (`lum > 0.895`) render a warm papyrus-cream 3D volume over the lapis field with zero scanlines.
  2. Mid-tone shadows (`0.09 < effDark < 0.80`) render 100% solid dark-ink horizontal bars locked to screen rows (`7px` pitch) with quantized thickness capped at `62%` of row height (preserving light feather gaps across all white plumage) and `4.5px` stepped horizontal tips.
  3. Deep dark features (`effDark >= 0.80`) fill full `7×4.5px` cells to fuse obsidian eyes, beak, and talons into crisp 8-bit pixel blocks while cutting out bright white corneal catchlights.

## 5. Layout & Craft Guardrails
- 12-column Swiss rectilinear grid (`max-w-[1440px]`), `min-h-dvh` hero, 44px minimum touch targets.
- **Fixed lapis-glass masthead:** `.site-header` is a translucent lapis pane — 18px backdrop blur with 145% saturation, a top sheen, a hairline, and a soft inset highlight. It deepens to 82% opacity with a stronger shadow once scrolled (`data-scrolled`), while `.site-header-panel` extends the same glass treatment to the mobile menu. Browsers without `backdrop-filter` fall back to an opaque lapis bar. Active nav items use the saffron origin underline; the Quickstart CTA is cream papyrus with an inset highlight.
- Lazy routes render a structural `PageSkeleton` that mirrors the masthead and first content band. Links prime chunks on pointer enter, pointer down, touch start, and focus; remaining page chunks prefetch sequentially during browser idle time, skipping Save-Data and 2G connections.
- Strict adherence to Impeccable craft floor: no eyebrow/kicker labels above headings, no repetitive 3×2 icon-card grids or nested cards, no `feTurbulence` grain, no Unicode/emoji icon stand-ins, themed browser surfaces (`::selection`, `scrollbar-color`, `:focus-visible`, `caret-color`), and full `prefers-reduced-motion` + offscreen WebGL pause handling.

## 6. Footer — Lapis Engraving Plate & Egypt Origin
- **Visual role:** The footer is the deepest end of the site-wide lapis print plate, not a separate theme. Warm papyrus ink and a single saffron origin mark tie it to the supplied Egyptian panorama without turning the page into a tourism theme.
- **Art direction & provenance:** Three supplied transparent Egypt masks (desktop, tablet, mobile) are cropped to visible artwork, tinted toward `#F5ECD6` while keeping their grayscale/alpha engraving detail, and encoded as responsive WebP variants. `<picture>` selects the appropriate plate at `768px` and `1280px`, and the wrapper keeps the same aspect ratio with `object-contain` so no pyramid, dhow, tower, or mosque can be cropped. Provenance and emitted dimensions live in `src/assets/FOOTER-EGYPT-ASSETS.md` and `footer-egypt-manifest.json`.
- **Structure:** Brand/origin block with `BUILT IN EGYPT` and the depicted Cairo coordinates (`Cairo · 30.0444° N / 31.2357° E`), three compact wayfinding columns, and a copyable install command. The reference newsletter slot became a functional CLI copy field because the product has no newsletter backend; duplicated GitHub/NuGet links were removed from the Project column in favour of the labelled social icons.
- **Responsive rule:** Five-column desktop rail at `1280px`+, three-column wayfinding with full-width brand/install rows at `640px–1279px`, and a two-column link grid on phones. Navigation links, social icons, and copy controls keep a 44px touch target; long command strings wrap without horizontal overflow.
- **Surface states:** `.surface-footer` owns the dark `color-scheme`, cream focus rings, and lapis-on-papyrus selection. The copy field exposes `aria-live` success/error feedback and uses a selection-based clipboard fallback when the Clipboard API is unavailable.
