import { describe, expect, it } from 'vitest'
import {
  contributionsToGrid,
  countLanguages,
  countToLevel,
  eventsToContributions,
  generateFallbackGrid,
} from '../utils/github.ts'
import type { GitHubEvent, GitHubRepo } from '../utils/github.ts'

// ─── countToLevel ────────────────────────────────────────────

describe('countToLevel', () => {
  it('returns 0 for zero contributions', () => {
    expect(countToLevel(0)).toBe(0)
  })

  it('returns 1 for 1-2 contributions', () => {
    expect(countToLevel(1)).toBe(1)
    expect(countToLevel(2)).toBe(1)
  })

  it('returns 2 for 3-5 contributions', () => {
    expect(countToLevel(3)).toBe(2)
    expect(countToLevel(5)).toBe(2)
  })

  it('returns 3 for 6-10 contributions', () => {
    expect(countToLevel(6)).toBe(3)
    expect(countToLevel(10)).toBe(3)
  })

  it('returns 4 for more than 10 contributions', () => {
    expect(countToLevel(11)).toBe(4)
    expect(countToLevel(100)).toBe(4)
    expect(countToLevel(9999)).toBe(4)
  })

  it('handles negative numbers (edge case)', () => {
    // Negative counts are not expected but should not crash
    // -1 <= 2, so it returns level 1
    expect(countToLevel(-1)).toBe(1)
  })
})

// ─── generateFallbackGrid ────────────────────────────────────

describe('generateFallbackGrid', () => {
  it('returns correct number of weeks', () => {
    const grid = generateFallbackGrid(26)
    expect(grid).toHaveLength(26)
  })

  it('each week has exactly 7 days', () => {
    const grid = generateFallbackGrid(10)
    for (const week of grid) {
      expect(week).toHaveLength(7)
    }
  })

  it('all values are between 0 and 4', () => {
    const grid = generateFallbackGrid(52)
    for (const week of grid) {
      for (const day of week) {
        expect(day).toBeGreaterThanOrEqual(0)
        expect(day).toBeLessThanOrEqual(4)
      }
    }
  })

  it('is deterministic (seeded random)', () => {
    const grid1 = generateFallbackGrid(26)
    const grid2 = generateFallbackGrid(26)
    expect(grid1).toEqual(grid2)
  })

  it('returns empty array for 0 weeks', () => {
    const grid = generateFallbackGrid(0)
    expect(grid).toEqual([])
  })

  it('returns single week for 1 week', () => {
    const grid = generateFallbackGrid(1)
    expect(grid).toHaveLength(1)
    expect(grid[0]).toHaveLength(7)
  })
})

// ─── eventsToContributions ───────────────────────────────────

describe('eventsToContributions', () => {
  it('returns empty array for no events', () => {
    const result = eventsToContributions([])
    expect(result).toEqual([])
  })

  it('counts PushEvent commits correctly', () => {
    const events: GitHubEvent[] = [
      {
        type: 'PushEvent',
        created_at: '2026-03-15T10:00:00Z',
        payload: {
          commits: [{ sha: 'abc' }, { sha: 'def' }, { sha: 'ghi' }],
        },
      },
    ]
    const result = eventsToContributions(events)
    expect(result).toHaveLength(1)
    expect(result[0].date).toBe('2026-03-15')
    expect(result[0].count).toBe(3)
    expect(result[0].level).toBe(2) // 3 commits => level 2
  })

  it('counts non-PushEvent as 1 contribution', () => {
    const events: GitHubEvent[] = [
      { type: 'IssuesEvent', created_at: '2026-03-15T10:00:00Z' },
      { type: 'CreateEvent', created_at: '2026-03-15T12:00:00Z' },
    ]
    const result = eventsToContributions(events)
    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(2)
  })

  it('aggregates events on the same date', () => {
    const events: GitHubEvent[] = [
      {
        type: 'PushEvent',
        created_at: '2026-03-15T08:00:00Z',
        payload: { commits: [{ sha: 'a' }] },
      },
      { type: 'IssuesEvent', created_at: '2026-03-15T14:00:00Z' },
      {
        type: 'PushEvent',
        created_at: '2026-03-15T20:00:00Z',
        payload: { commits: [{ sha: 'b' }, { sha: 'c' }] },
      },
    ]
    const result = eventsToContributions(events)
    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(4) // 1 + 1 + 2
  })

  it('separates events on different dates', () => {
    const events: GitHubEvent[] = [
      { type: 'CreateEvent', created_at: '2026-03-14T10:00:00Z' },
      { type: 'CreateEvent', created_at: '2026-03-15T10:00:00Z' },
    ]
    const result = eventsToContributions(events)
    expect(result).toHaveLength(2)
    const dates = result.map((r) => r.date).sort()
    expect(dates).toEqual(['2026-03-14', '2026-03-15'])
  })

  it('handles PushEvent without commits gracefully', () => {
    const events: GitHubEvent[] = [
      { type: 'PushEvent', created_at: '2026-03-15T10:00:00Z', payload: {} },
    ]
    const result = eventsToContributions(events)
    expect(result).toHaveLength(1)
    // No commits array, so falls through to the else branch
    expect(result[0].count).toBe(1)
  })

  it('assigns correct levels based on count', () => {
    // Single event => count 1 => level 1
    const events: GitHubEvent[] = [{ type: 'WatchEvent', created_at: '2026-01-01T00:00:00Z' }]
    const result = eventsToContributions(events)
    expect(result[0].level).toBe(1)
  })
})

// ─── contributionsToGrid ─────────────────────────────────────

describe('contributionsToGrid', () => {
  it('returns correct number of weeks', () => {
    const grid = contributionsToGrid([], 26)
    expect(grid).toHaveLength(26)
  })

  it('each week has 7 days', () => {
    const grid = contributionsToGrid([], 10)
    for (const week of grid) {
      expect(week).toHaveLength(7)
    }
  })

  it('returns all zeros for empty contributions', () => {
    const grid = contributionsToGrid([], 4)
    for (const week of grid) {
      for (const day of week) {
        expect(day).toBe(0)
      }
    }
  })

  it('maps contribution levels to the correct dates', () => {
    // Use a known past date that's guaranteed to be within the 26-week window
    // and use toISOString format to match the function's key generation
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 7) // 1 week ago
    const dateStr = pastDate.toISOString().slice(0, 10)
    const contributions = [{ date: dateStr, count: 5, level: 2 }]

    const grid = contributionsToGrid(contributions, 26)

    // Flatten and check that level 2 appears somewhere
    const allLevels = grid.flat()
    expect(allLevels).toContain(2)
  })

  it('returns empty array for 0 weeks', () => {
    const grid = contributionsToGrid([], 0)
    expect(grid).toEqual([])
  })

  it('all values are numbers between 0 and 4', () => {
    const contributions = [
      { date: '2026-03-10', count: 15, level: 4 },
      { date: '2026-03-11', count: 1, level: 1 },
    ]
    const grid = contributionsToGrid(contributions, 4)
    for (const week of grid) {
      for (const day of week) {
        expect(typeof day).toBe('number')
        expect(day).toBeGreaterThanOrEqual(0)
        expect(day).toBeLessThanOrEqual(4)
      }
    }
  })
})

// ─── countLanguages ──────────────────────────────────────────

describe('countLanguages', () => {
  it('returns empty array for no repos', () => {
    expect(countLanguages([])).toEqual([])
  })

  it('counts languages correctly', () => {
    const repos: GitHubRepo[] = [
      { language: 'TypeScript' },
      { language: 'TypeScript' },
      { language: 'Python' },
      { language: 'TypeScript' },
      { language: 'Python' },
    ]
    const result = countLanguages(repos)
    expect(result).toEqual([
      { name: 'TypeScript', count: 3 },
      { name: 'Python', count: 2 },
    ])
  })

  it('sorts by count descending', () => {
    const repos: GitHubRepo[] = [
      { language: 'Python' },
      { language: 'TypeScript' },
      { language: 'TypeScript' },
      { language: 'Go' },
      { language: 'Go' },
      { language: 'Go' },
    ]
    const result = countLanguages(repos)
    expect(result[0].name).toBe('Go')
    expect(result[1].name).toBe('TypeScript')
    expect(result[2].name).toBe('Python')
  })

  it('skips repos with null language', () => {
    const repos: GitHubRepo[] = [{ language: null }, { language: 'Rust' }, { language: null }]
    const result = countLanguages(repos)
    expect(result).toEqual([{ name: 'Rust', count: 1 }])
  })

  it('handles all-null languages', () => {
    const repos: GitHubRepo[] = [{ language: null }, { language: null }, { language: null }]
    expect(countLanguages(repos)).toEqual([])
  })

  it('handles single repo', () => {
    const repos: GitHubRepo[] = [{ language: 'JavaScript' }]
    expect(countLanguages(repos)).toEqual([{ name: 'JavaScript', count: 1 }])
  })
})
