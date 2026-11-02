import React from 'react';

interface BrandMarkProps {
  className?: string;
}

/**
 * Geometric 11x11 stepped-pixel Owl Binocular Monogram.
 * Depicts plumicorn ear tufts, twin recessed ocular discs with catchlights,
 * and a central diamond beak — crisp at 24px–32px.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({ className = 'size-7' }) => (
  <svg
    viewBox="0 0 11 11"
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
    className={`fill-current ${className}`}
  >
    {/* Ear tufts */}
    <rect x="0" y="0" width="2" height="2" />
    <rect x="9" y="0" width="2" height="2" />
    {/* Brow bridge */}
    <rect x="1" y="2" width="9" height="1" />
    {/* Outer facial disc frame */}
    <rect x="0" y="3" width="2" height="5" />
    <rect x="9" y="3" width="2" height="5" />
    {/* Center septum & beak */}
    <rect x="5" y="3" width="1" height="3" />
    <rect x="4" y="7" width="3" height="1" />
    <rect x="5" y="8" width="1" height="2" />
    {/* Pupils inside white ocular discs */}
    <rect x="3" y="4" width="1" height="2" />
    <rect x="7" y="4" width="1" height="2" />
    {/* Lower disc rim */}
    <rect x="1" y="8" width="3" height="2" />
    <rect x="7" y="8" width="3" height="2" />
    <rect x="2" y="10" width="7" height="1" />
  </svg>
);
