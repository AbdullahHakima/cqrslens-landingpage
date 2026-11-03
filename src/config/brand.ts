/**
 * Centralized brand identity & technical artifact configuration.
 *
 * NOTE: "NOCTUA" is a placeholder brand identity paired with the Owl centerpiece.
 * "CqrsLens" / "cqrslens" remains the active NuGet package & CLI development codename
 * so all install commands and repository links work immediately.
 * Update `name` and `heroLines` here to rename the entire site in one place.
 */
export const BRAND = {
  /** Placeholder display name — change here once final tool name is chosen */
  name: 'Noctua',
  isPlaceholderName: true,

  /** Two-line stepped-pixel display headline in the hero */
  heroLines: ['NOCTUA', 'CODE MAP'] as const,

  /** Concise hero value proposition */
  heroSummary:
    'Maps your .NET and CQRS codebase without building it. Every command, handler, validator, and layer drawn.',

  /** Concise footer architectural tagline */
  footerTagline: 'See the architecture behind your .NET code.',

  /** Footer origin, tying the tool to its home */
  footerOrigin: 'Egypt',
  footerCoordinates: 'Cairo · 30.0444° N / 31.2357° E',

  /** Active CLI & package coordinates from github.com/AbdullahHakima/cqrslens */
  cliBinary: 'cqrslens',
  nugetPackage: 'CqrsLens',
  version: '0.9.0',
  installCommand: 'dotnet tool install -g CqrsLens',

  /** External & canonical links */
  siteUrl: 'https://abdullahhakima.github.io/cqrslens',
  githubUrl: 'https://github.com/AbdullahHakima/cqrslens',
  githubDisplay: 'github.com/AbdullahHakima/cqrslens',
  githubReadmeUrl: 'https://github.com/AbdullahHakima/cqrslens#readme',
  githubReleasesUrl: 'https://github.com/AbdullahHakima/cqrslens/releases',
  githubIssuesUrl: 'https://github.com/AbdullahHakima/cqrslens/issues',
  githubNewIssueUrl: 'https://github.com/AbdullahHakima/cqrslens/issues/new',
  githubLicenseUrl: 'https://github.com/AbdullahHakima/cqrslens/blob/main/LICENSE',
  nugetUrl: 'https://www.nuget.org/packages/CqrsLens',
  nugetDisplay: 'nuget.org/packages/CqrsLens',
  authorName: 'Abdullah Hakim',
  authorUrl: 'https://github.com/AbdullahHakima',
  license: 'MIT',
  year: 2026,
} as const;
