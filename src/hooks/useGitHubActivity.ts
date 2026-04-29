import { useEffect, useState } from 'react'
import {
  contributionsToGrid,
  countLanguages,
  eventsToContributions,
  findLastContribution,
  generateFallbackGrid,
} from '../utils/github.ts'
import type {
  ContributionDay,
  ContributionsApiResponse,
  GitHubEvent,
  GitHubRepo,
} from '../utils/github.ts'

export type { ContributionDay } from '../utils/github.ts'

const GITHUB_USER = 'xdroberto'
const API_BASE = 'https://api.github.com'
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`
const CACHE_KEY = 'github-activity-cache-v2'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes
const GRID_WEEKS = 52

export interface GitHubStats {
  publicRepos: number
  languages: { name: string; count: number }[]
  contributionsLastYear: number
  lastContributionDate: string | null
}

export interface GitHubActivityData {
  stats: GitHubStats
  grid: number[][]
  loading: boolean
  error: string | null
  isRealData: boolean
}

interface CachedData {
  timestamp: number
  stats: GitHubStats
  contributions: ContributionDay[]
}

function getFallbackStats(): GitHubStats {
  return {
    publicRepos: 20,
    languages: [
      { name: 'TypeScript', count: 4 },
      { name: 'Python', count: 4 },
      { name: 'JavaScript', count: 3 },
      { name: 'HTML', count: 2 },
    ],
    contributionsLastYear: 0,
    lastContributionDate: null,
  }
}

interface GitHubUser {
  public_repos: number
}

async function fetchProfile(): Promise<GitHubUser> {
  const res = await fetch(`${API_BASE}/users/${GITHUB_USER}`)
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`)
  return res.json()
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(`${API_BASE}/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
  if (!res.ok) throw new Error(`Repos fetch failed: ${res.status}`)
  return res.json()
}

async function fetchContributions(): Promise<ContributionsApiResponse> {
  const res = await fetch(CONTRIBUTIONS_API)
  if (!res.ok) throw new Error(`Contributions fetch failed: ${res.status}`)
  return res.json()
}

async function fetchEvents(page = 1): Promise<GitHubEvent[]> {
  const res = await fetch(
    `${API_BASE}/users/${GITHUB_USER}/events/public?per_page=100&page=${page}`,
  )
  if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`)
  return res.json()
}

function getCache(): CachedData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: CachedData = JSON.parse(raw)
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return cached
  } catch {
    return null
  }
}

function setCache(stats: GitHubStats, contributions: ContributionDay[]) {
  try {
    const data: CachedData = { timestamp: Date.now(), stats, contributions }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // localStorage might be full or unavailable
  }
}

export function useGitHubActivity(): GitHubActivityData {
  const [stats, setStats] = useState<GitHubStats>(getFallbackStats())
  const [grid, setGrid] = useState<number[][]>(() => generateFallbackGrid(GRID_WEEKS))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRealData, setIsRealData] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const cached = getCache()
      if (cached) {
        if (!cancelled) {
          setStats(cached.stats)
          setGrid(contributionsToGrid(cached.contributions, GRID_WEEKS))
          setIsRealData(true)
          setLoading(false)
        }
        return
      }

      try {
        // Primary path: contribution calendar (mirrors the green grid on
        // github.com/<user>, includes private contributions). Repos and
        // profile are still fetched from GitHub directly for languages.
        const [profile, repos, contribResp] = await Promise.all([
          fetchProfile(),
          fetchRepos(),
          fetchContributions(),
        ])

        if (cancelled) return

        const contributions = contribResp.contributions
        const last = findLastContribution(contributions)

        const realStats: GitHubStats = {
          publicRepos: profile.public_repos,
          languages: countLanguages(repos),
          contributionsLastYear: contribResp.total.lastYear ?? 0,
          lastContributionDate: last?.date ?? null,
        }

        setStats(realStats)
        setGrid(contributionsToGrid(contributions, GRID_WEEKS))
        setIsRealData(true)
        setCache(realStats, contributions)
      } catch (primaryErr) {
        // Fallback: derive a partial calendar from public events
        try {
          const [profile, repos, events1, events2] = await Promise.all([
            fetchProfile(),
            fetchRepos(),
            fetchEvents(1),
            fetchEvents(2),
          ])

          if (cancelled) return

          const allEvents = [...events1, ...events2]
          const contributions = eventsToContributions(allEvents)
          const last = findLastContribution(contributions)

          const realStats: GitHubStats = {
            publicRepos: profile.public_repos,
            languages: countLanguages(repos),
            contributionsLastYear: contributions.reduce((s, c) => s + c.count, 0),
            lastContributionDate: last?.date ?? null,
          }

          setStats(realStats)
          setGrid(contributionsToGrid(contributions, GRID_WEEKS))
          setIsRealData(true)
          setCache(realStats, contributions)
        } catch (fallbackErr) {
          if (!cancelled) {
            const msg =
              fallbackErr instanceof Error
                ? fallbackErr.message
                : primaryErr instanceof Error
                  ? primaryErr.message
                  : 'Unknown error'
            setError(msg)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { stats, grid, loading, error, isRealData }
}
