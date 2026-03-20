// ─── Types ───────────────────────────────────────────────────

export interface ContributionDay {
  date: string // YYYY-MM-DD
  level: number // 0-4
  count: number
}

export interface GitHubEvent {
  type: string
  created_at: string
  payload?: {
    commits?: { sha: string }[]
    size?: number
  }
}

export interface GitHubRepo {
  language: string | null
}

// ─── Pure utility functions ──────────────────────────────────

export function countToLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 10) return 3
  return 4
}

export function generateFallbackGrid(weeks: number): number[][] {
  const grid: number[][] = []
  let seed = 42
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647
    return seed / 2147483647
  }

  for (let w = 0; w < weeks; w++) {
    const col: number[] = []
    const weekActivity = rand() > 0.3 ? rand() * 0.8 + 0.2 : rand() * 0.15
    for (let d = 0; d < 7; d++) {
      const val = rand() < weekActivity ? Math.ceil(rand() * 4) : 0
      col.push(val)
    }
    grid.push(col)
  }
  return grid
}

export function eventsToContributions(events: GitHubEvent[]): ContributionDay[] {
  const byDate = new Map<string, number>()

  for (const event of events) {
    const date = event.created_at.slice(0, 10)
    const count = byDate.get(date) ?? 0

    if (event.type === 'PushEvent' && event.payload?.commits) {
      byDate.set(date, count + event.payload.commits.length)
    } else {
      byDate.set(date, count + 1)
    }
  }

  return Array.from(byDate.entries()).map(([date, count]) => ({
    date,
    count,
    level: countToLevel(count),
  }))
}

export function contributionsToGrid(contributions: ContributionDay[], weeks: number): number[][] {
  const levelMap = new Map<string, number>()
  for (const c of contributions) {
    levelMap.set(c.date, c.level)
  }

  const today = new Date()
  const grid: number[][] = []

  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - weeks * 7 - today.getDay())

  for (let w = 0; w < weeks; w++) {
    const col: number[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + w * 7 + d)
      const key = date.toISOString().slice(0, 10)

      if (date > today) {
        col.push(0)
      } else {
        col.push(levelMap.get(key) ?? 0)
      }
    }
    grid.push(col)
  }

  return grid
}

export function countLanguages(repos: GitHubRepo[]): { name: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const repo of repos) {
    if (repo.language) {
      counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
