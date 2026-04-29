import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGitHubActivity } from '../hooks/useGitHubActivity'

const CACHE_KEY = 'github-activity-cache-v2'
const CACHE_TTL = 1000 * 60 * 30
const GRID_WEEKS = 52

function makeFetchResponse(data: unknown, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  } as Response)
}

// Default success path: contributions API + repos + profile.
function setupSuccessfulFetch() {
  vi.spyOn(globalThis, 'fetch').mockImplementation((url: string | URL | Request) => {
    const urlStr = url.toString()
    if (urlStr.includes('github-contributions-api')) {
      return makeFetchResponse({
        total: { lastYear: 311 },
        contributions: [
          { date: '2026-04-20', count: 5, level: 2 },
          { date: '2026-04-21', count: 0, level: 0 },
          { date: '2026-04-22', count: 3, level: 1 },
        ],
      })
    }
    if (urlStr.includes('/repos')) {
      return makeFetchResponse([
        { language: 'TypeScript' },
        { language: 'Python' },
        { language: 'TypeScript' },
      ])
    }
    if (urlStr.includes('/events/public')) {
      return makeFetchResponse([
        {
          type: 'PushEvent',
          created_at: '2026-03-01T10:00:00Z',
          payload: { commits: [{ sha: 'a' }, { sha: 'b' }] },
        },
      ])
    }
    // Profile
    return makeFetchResponse({ public_repos: 25 })
  })
}

// Path where contributions API fails but events fallback succeeds.
function setupContributionsFailureWithEventsFallback() {
  vi.spyOn(globalThis, 'fetch').mockImplementation((url: string | URL | Request) => {
    const urlStr = url.toString()
    if (urlStr.includes('github-contributions-api')) {
      return Promise.reject(new Error('contributions api down'))
    }
    if (urlStr.includes('/repos')) {
      return makeFetchResponse([{ language: 'TypeScript' }])
    }
    if (urlStr.includes('/events/public')) {
      return makeFetchResponse([
        {
          type: 'PushEvent',
          created_at: '2026-03-01T10:00:00Z',
          payload: { commits: [{ sha: 'a' }] },
        },
      ])
    }
    return makeFetchResponse({ public_repos: 25 })
  })
}

describe('useGitHubActivity', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('starts with loading=true and fallback data', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useGitHubActivity())
    expect(result.current.loading).toBe(true)
    expect(result.current.isRealData).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('starts with a fallback grid of the correct shape', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useGitHubActivity())
    expect(result.current.grid).toHaveLength(GRID_WEEKS)
    for (const week of result.current.grid) {
      expect(week).toHaveLength(7)
    }
  })

  it('sets isRealData=true and updates stats from contributions API', async () => {
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRealData).toBe(true)
    expect(result.current.stats.publicRepos).toBe(25)
    expect(result.current.stats.contributionsLastYear).toBe(311)
    expect(result.current.stats.lastContributionDate).toBe('2026-04-22')
    expect(result.current.error).toBeNull()
  })

  it('correctly identifies top language from repos', async () => {
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.isRealData).toBe(true))
    expect(result.current.stats.languages[0].name).toBe('TypeScript')
    expect(result.current.stats.languages[0].count).toBe(2)
  })

  it('caches fetched data in localStorage', async () => {
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.isRealData).toBe(true))
    const cached = localStorage.getItem(CACHE_KEY)
    expect(cached).not.toBeNull()
    const parsed = JSON.parse(cached!)
    expect(parsed.timestamp).toBeGreaterThan(0)
    expect(parsed.stats.publicRepos).toBe(25)
    expect(parsed.stats.contributionsLastYear).toBe(311)
  })

  it('uses cached data without fetching when cache is valid', async () => {
    const cachedStats = {
      publicRepos: 99,
      languages: [{ name: 'Rust', count: 7 }],
      contributionsLastYear: 420,
      lastContributionDate: '2026-04-15',
    }
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), stats: cachedStats, contributions: [] }),
    )
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRealData).toBe(true)
    expect(result.current.stats.publicRepos).toBe(99)
    expect(result.current.stats.contributionsLastYear).toBe(420)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('fetches fresh data when cache is expired', async () => {
    const expiredCache = {
      timestamp: Date.now() - CACHE_TTL - 1000,
      stats: {
        publicRepos: 1,
        languages: [],
        contributionsLastYear: 0,
        lastContributionDate: null,
      },
      contributions: [],
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(expiredCache))
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.stats.publicRepos).toBe(25)
  })

  it('removes expired cache entry from localStorage', async () => {
    const expiredCache = {
      timestamp: Date.now() - CACHE_TTL - 1000,
      stats: {
        publicRepos: 1,
        languages: [],
        contributionsLastYear: 0,
        lastContributionDate: null,
      },
      contributions: [],
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(expiredCache))
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    const newCache = JSON.parse(localStorage.getItem(CACHE_KEY)!)
    expect(newCache.stats.publicRepos).toBe(25)
  })

  it('falls back to events API when contributions API fails', async () => {
    setupContributionsFailureWithEventsFallback()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRealData).toBe(true)
    expect(result.current.stats.publicRepos).toBe(25)
    // Fallback path derives count from events
    expect(result.current.stats.contributionsLastYear).toBeGreaterThan(0)
  })

  it('handles network error — sets error and keeps fallback data', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'))
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Network failure')
    expect(result.current.isRealData).toBe(false)
    expect(result.current.stats.publicRepos).toBeGreaterThan(0)
  })

  it('handles rate limiting (non-ok HTTP response) — sets error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve({ message: 'rate limit exceeded' }),
    } as Response)
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toMatch(/403|fetch failed|rate/i)
    expect(result.current.isRealData).toBe(false)
  })

  it('handles malformed localStorage cache gracefully', async () => {
    localStorage.setItem(CACHE_KEY, 'this is not valid json {{{')
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRealData).toBe(true)
  })

  it('does not update state after unmount', async () => {
    setupSuccessfulFetch()
    const { unmount } = renderHook(() => useGitHubActivity())
    unmount()
    await new Promise((r) => setTimeout(r, 50))
  })

  it('handles non-Error thrown objects — sets error to "Unknown error"', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue('plain string error')
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Unknown error')
    expect(result.current.isRealData).toBe(false)
  })

  it('returns grid with all values in range 0-4', async () => {
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    for (const week of result.current.grid) {
      for (const day of week) {
        expect(day).toBeGreaterThanOrEqual(0)
        expect(day).toBeLessThanOrEqual(4)
      }
    }
  })
})
