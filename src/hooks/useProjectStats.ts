import { useEffect, useState } from 'react';
import { BRAND } from '../config/brand';

export interface ProjectStats {
  githubStars: number | null;
  nugetDownloads: number | null;
}

interface ProjectStatsState extends ProjectStats {
  isLoading: boolean;
}

interface CachedProjectStats extends ProjectStats {
  fetchedAt: number;
}

const CACHE_KEY = 'cqrslens.project-stats.v1';
const CACHE_TTL_MS = 10 * 60 * 1000;

let memoryCache: CachedProjectStats | null = null;
let inflightRequest: Promise<ProjectStats> | null = null;

function readCache(): CachedProjectStats | null {
  if (memoryCache) return memoryCache;

  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CachedProjectStats>;
    if (
      typeof parsed.fetchedAt !== 'number' ||
      (typeof parsed.githubStars !== 'number' && typeof parsed.nugetDownloads !== 'number')
    ) {
      return null;
    }

    memoryCache = {
      githubStars: typeof parsed.githubStars === 'number' ? parsed.githubStars : null,
      nugetDownloads: typeof parsed.nugetDownloads === 'number' ? parsed.nugetDownloads : null,
      fetchedAt: parsed.fetchedAt,
    };
    return memoryCache;
  } catch {
    return null;
  }
}

function writeCache(stats: ProjectStats): void {
  const cached: CachedProjectStats = {
    githubStars: stats.githubStars,
    nugetDownloads: stats.nugetDownloads,
    fetchedAt: Date.now(),
  };

  memoryCache = cached;

  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Storage can be unavailable in private browsing; the in-memory cache still works.
  }
}

async function fetchGithubStars(): Promise<number> {
  const repoPath = BRAND.githubUrl.replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
  const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) {
    throw new Error(`GitHub stars request failed with ${response.status}`);
  }

  const data = (await response.json()) as { stargazers_count?: number };
  if (typeof data.stargazers_count !== 'number') {
    throw new Error('GitHub response did not include a star count');
  }

  return data.stargazers_count;
}

async function fetchNugetDownloads(): Promise<number> {
  const params = new URLSearchParams({
    q: `packageid:${BRAND.nugetPackage}`,
    prerelease: 'true',
    semVerLevel: '2.0.0',
  });
  const response = await fetch(`https://azuresearch-usnc.nuget.org/query?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`NuGet downloads request failed with ${response.status}`);
  }

  const data = (await response.json()) as {
    data?: Array<{ totalDownloads?: number }>;
  };
  const totalDownloads = data.data?.[0]?.totalDownloads;
  if (typeof totalDownloads !== 'number') {
    throw new Error('NuGet response did not include a download count');
  }

  return totalDownloads;
}

function loadProjectStats(): Promise<ProjectStats> {
  if (inflightRequest) return inflightRequest;

  inflightRequest = (async () => {
    const previous = readCache();
    const [githubResult, nugetResult] = await Promise.allSettled([
      fetchGithubStars(),
      fetchNugetDownloads(),
    ]);

    const stats: ProjectStats = {
      githubStars:
        githubResult.status === 'fulfilled' ? githubResult.value : (previous?.githubStars ?? null),
      nugetDownloads:
        nugetResult.status === 'fulfilled' ? nugetResult.value : (previous?.nugetDownloads ?? null),
    };

    if (stats.githubStars !== null && stats.nugetDownloads !== null) {
      writeCache(stats);
    }

    return stats;
  })().finally(() => {
    inflightRequest = null;
  });

  return inflightRequest;
}

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const standardNumberFormatter = new Intl.NumberFormat('en-US');

export function formatProjectStat(value: number): string {
  return value < 1000 ? standardNumberFormatter.format(value) : compactNumberFormatter.format(value);
}

export function useProjectStats(): ProjectStatsState {
  const [state, setState] = useState<ProjectStatsState>(() => {
    const cached = readCache();
    return {
      githubStars: cached?.githubStars ?? null,
      nugetDownloads: cached?.nugetDownloads ?? null,
      isLoading: cached === null,
    };
  });

  useEffect(() => {
    const cached = readCache();
    if (
      cached &&
      cached.githubStars !== null &&
      cached.nugetDownloads !== null &&
      Date.now() - cached.fetchedAt < CACHE_TTL_MS
    ) {
      return;
    }

    let cancelled = false;

    setState((current) => ({
      ...current,
      isLoading: current.githubStars === null && current.nugetDownloads === null,
    }));

    loadProjectStats().then((stats) => {
      if (cancelled) return;
      setState({ ...stats, isLoading: false });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
