import { useEffect, useState } from 'react'
import {
  contributionsToGrid,
  countLanguages,
  eventsToContributions,
  generateFallbackGrid,
} from '../utils/github.ts'
import type { ContributionDay, GitHubEvent, GitHubRepo } from '../utils/github.ts'

// Re-export ContributionDay so existing imports keep working
export type { ContributionDay } from '../utils/github.ts'

const GITHUB_USER = 'xdroberto'
const API_BASE = 'https://api.github.com'
const CACHE_KEY = 'github-activity-cache'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

// ─── Types ────────────────────────────────────────────────────

export interface GitHubStats {
  publicRepos: number
  languages: { name: string; count: number }[]
  totalContributions: number
  recentCommits: number
}

export interface GitHubActivityData {
  stats: GitHubStats
  grid: number[][] // weeks × 7 days
  loading: boolean
  error: string | null
  isRealData: boolean
}

interface CachedData {
  timestamp: number
  stats: GitHubStats
  contributions: ContributionDay[]
}

// ─── Fallback stats ──────────────────────────────────────────

function getFallbackStats(): GitHubStats {
  return {
    publicRepos: 18,
    languages: [
      { name: 'TypeScript', count: 3 },
      { name: 'JavaScript', count: 4 },
      { name: 'HTML', count: 4 },
      { name: 'SCSS', count: 1 },
    ],
    totalContributions: 0,
    recentCommits: 0,
  }
}

// ─── API fetchers ─────────────────────────────────────────────

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

async function fetchEvents(page = 1): Promise<GitHubEvent[]> {
  const res = await fetch(
    `${API_BASE}/users/${GITHUB_USER}/events/public?per_page=100&page=${page}`,
  )
  if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`)
  return res.json()
}

// ─── Cache helpers ────────────────────────────────────────────

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

// ─── Hook ─────────────────────────────────────────────────────

const GRID_WEEKS = 26

export function useGitHubActivity(): GitHubActivityData {
  const [stats, setStats] = useState<GitHubStats>(getFallbackStats())
  const [grid, setGrid] = useState<number[][]>(() => generateFallbackGrid(GRID_WEEKS))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRealData, setIsRealData] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      // Check cache first
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
        // Fetch all data in parallel
        const [profile, repos, events1, events2] = await Promise.all([
          fetchProfile(),
          fetchRepos(),
          fetchEvents(1),
          fetchEvents(2),
        ])

        if (cancelled) return

        const allEvents = [...events1, ...events2]
        const contributions = eventsToContributions(allEvents)
        const languages = countLanguages(repos)
        const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0)
        const recentCommits = allEvents.filter((e) => e.type === 'PushEvent').length

        const realStats: GitHubStats = {
          publicRepos: profile.public_repos,
          languages,
          totalContributions,
          recentCommits,
        }

        setStats(realStats)
        setGrid(contributionsToGrid(contributions, GRID_WEEKS))
        setIsRealData(true)
        setCache(realStats, contributions)
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Unknown error'
          setError(msg)
          // Keep fallback data
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
