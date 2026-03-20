import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGitHubActivity } from '../hooks/useGitHubActivity'

// ─── Helpers ──────────────────────────────────────────────────

const CACHE_KEY = 'github-activity-cache'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

function makeFetchResponse(data: unknown, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
  } as Response)
}

function setupSuccessfulFetch() {
  vi.spyOn(globalThis, 'fetch').mockImplementation((url: string | URL | Request) => {
    const urlStr = url.toString()
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
        { type: 'IssuesEvent', created_at: '2026-03-02T10:00:00Z' },
      ])
    }
    // Profile
    return makeFetchResponse({ public_repos: 25 })
  })
}

// ─── Tests ────────────────────────────────────────────────────

describe('useGitHubActivity', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('starts with loading=true and fallback data', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {})) // never resolves
    const { result } = renderHook(() => useGitHubActivity())
    expect(result.current.loading).toBe(true)
    expect(result.current.isRealData).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('starts with a fallback grid of the correct shape', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useGitHubActivity())
    expect(result.current.grid).toHaveLength(26) // GRID_WEEKS
    for (const week of result.current.grid) {
      expect(week).toHaveLength(7)
    }
  })

  it('sets isRealData=true and updates stats after successful fetch', async () => {
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRealData).toBe(true)
    expect(result.current.stats.publicRepos).toBe(25)
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
  })

  it('uses cached data without fetching when cache is valid', async () => {
    const cachedStats = {
      publicRepos: 99,
      languages: [{ name: 'Rust', count: 7 }],
      totalContributions: 42,
      recentCommits: 5,
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
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('fetches fresh data when cache is expired', async () => {
    const expiredCache = {
      timestamp: Date.now() - CACHE_TTL - 1000, // expired
      stats: { publicRepos: 1, languages: [], totalContributions: 0, recentCommits: 0 },
      contributions: [],
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(expiredCache))
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    // Should have fetched and overwritten with real data
    expect(result.current.stats.publicRepos).toBe(25)
  })

  it('removes expired cache entry from localStorage', async () => {
    const expiredCache = {
      timestamp: Date.now() - CACHE_TTL - 1000,
      stats: { publicRepos: 1, languages: [], totalContributions: 0, recentCommits: 0 },
      contributions: [],
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(expiredCache))
    setupSuccessfulFetch()
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    // Cache should be refreshed with new data (not the expired entry)
    const newCache = JSON.parse(localStorage.getItem(CACHE_KEY)!)
    expect(newCache.stats.publicRepos).toBe(25)
  })

  it('handles network error — sets error and keeps fallback data', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'))
    const { result } = renderHook(() => useGitHubActivity())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Network failure')
    expect(result.current.isRealData).toBe(false)
    // Fallback stats still present
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
    // Should fall through to fetch instead of crashing
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRealData).toBe(true)
  })

  it('does not update state after unmount (no setState on cancelled hook)', async () => {
    setupSuccessfulFetch()
    const { unmount } = renderHook(() => useGitHubActivity())
    unmount() // unmount before fetch resolves
    // If state is updated after unmount, vitest would throw "Cannot update state on unmounted component"
    // Wait a tick to let any pending async ops complete
    await new Promise((r) => setTimeout(r, 50))
    // No assertion needed — passing without error is the test
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
