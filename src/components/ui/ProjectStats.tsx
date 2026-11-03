import React from 'react';
import { BRAND } from '../../config/brand';
import { formatProjectStat, useProjectStats } from '../../hooks/useProjectStats';
import { GitHubIcon, NuGetIcon } from './Icons';

interface ProjectStatsProps {
  className?: string;
  tone?: 'default' | 'inverse';
}

const statLinkClass =
  'inline-flex min-h-[32px] items-center gap-1.5 no-underline transition-colors duration-150';

export const ProjectStats: React.FC<ProjectStatsProps> = ({
  className = '',
  tone = 'default',
}) => {
  const { githubStars, nugetDownloads } = useProjectStats();
  const inverse = tone === 'inverse';

  if (githubStars === null && nugetDownloads === null) return null;

  const linkTone = inverse
    ? 'hover:text-[var(--color-text-on-inverse)]'
    : 'hover:text-[var(--color-text-primary)]';
  const iconTone = inverse
    ? 'text-[var(--color-text-on-inverse)]'
    : 'text-[var(--color-text-primary)]';
  const countTone = inverse
    ? 'text-[var(--color-text-on-inverse)]'
    : 'text-[var(--color-text-primary)]';
  const containerTone = inverse
    ? 'text-[var(--color-text-on-inverse-muted)]'
    : 'text-[var(--color-text-muted)]';
  const separatorTone = inverse
    ? 'bg-[var(--color-border-inverse-strong)]'
    : 'bg-[var(--color-border-strong)]';

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 font-editorial-mono text-xs leading-none ${containerTone} ${className}`}
    >
      {githubStars !== null && (
        <a
          href={BRAND.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${formatProjectStat(githubStars)} GitHub ${
            githubStars === 1 ? 'star' : 'stars'
          }`}
          className={`${statLinkClass} ${linkTone}`}
        >
          <GitHubIcon className={`size-3.5 shrink-0 ${iconTone}`} />
          <span className={`font-medium tabular-nums ${countTone}`}>
            {formatProjectStat(githubStars)}
          </span>
          <span className="whitespace-nowrap">
            {githubStars === 1 ? 'GitHub star' : 'GitHub stars'}
          </span>
        </a>
      )}

      {githubStars !== null && nugetDownloads !== null && (
        <span aria-hidden="true" className={`h-3 w-px ${separatorTone}`} />
      )}

      {nugetDownloads !== null && (
        <a
          href={BRAND.nugetUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${formatProjectStat(nugetDownloads)} NuGet ${
            nugetDownloads === 1 ? 'download' : 'downloads'
          }`}
          className={`${statLinkClass} ${linkTone}`}
        >
          <NuGetIcon className={`size-3.5 shrink-0 ${iconTone}`} />
          <span className={`font-medium tabular-nums ${countTone}`}>
            {formatProjectStat(nugetDownloads)}
          </span>
          <span className="whitespace-nowrap">
            {nugetDownloads === 1 ? 'NuGet download' : 'NuGet downloads'}
          </span>
        </a>
      )}
    </div>
  );
};
