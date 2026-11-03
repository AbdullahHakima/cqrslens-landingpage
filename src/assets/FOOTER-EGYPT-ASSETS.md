# Footer Egypt Engraving Assets

Source artwork was supplied by the project owner as three transparent PNG masks:

| Art direction | Source file | Source size |
| --- | --- | --- |
| Desktop panorama | `ChatGPT Image Nov 2, 2026, 08_11_28 PM-1.png` | 2172 × 724 |
| Tablet panorama | `ChatGPT Image Nov 2, 2026, 08_12_48 PM-2.png` | 1536 × 1024 |
| Mobile panorama | `ChatGPT Image Nov 2, 2026, 08_12_57 PM-3.png` | 1122 × 1402 |

Each plate was cropped to its visible artwork plus a 12 px transparent breathing margin, tinted toward the footer papyrus ink (`#F5ECD6`) while preserving the original alpha detail, resized to its display widths, and encoded as WebP at quality 82 with lossless alpha. The source RGB detail is retained for the engraving's tonal variation; the output is not flattened to a solid silhouette.

The footer selects one art direction with `<picture>` media queries, so only one plate is downloaded:

- **Desktop:** `(min-width: 1280px)` — `footer-egypt-desktop-*.webp`
- **Tablet:** `(min-width: 768px)` — `footer-egypt-tablet-*.webp`
- **Mobile:** default — `footer-egypt-mobile-*.webp`

`footer-egypt-manifest.json` records every emitted file, dimension, and byte size. The artwork remains decorative (`alt=""`) and is hidden from assistive technology.
