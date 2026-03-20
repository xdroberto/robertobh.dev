import { describe, expect, it } from 'vitest'
import { PROJECTS } from '../data/projects.ts'
import type { Project } from '../data/projects.ts'

const VALID_CATEGORIES = ['frontend', 'backend', 'infra', 'tool'] as const

describe('PROJECTS data', () => {
  it('has at least one project', () => {
    expect(PROJECTS.length).toBeGreaterThan(0)
  })

  it('has no duplicate IDs', () => {
    const ids = PROJECTS.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  describe.each(PROJECTS)('project "$id"', (project: Project) => {
    it('has a non-empty id', () => {
      expect(project.id).toBeTruthy()
      expect(typeof project.id).toBe('string')
      expect(project.id.trim().length).toBeGreaterThan(0)
    })

    it('has a non-empty title', () => {
      expect(project.title).toBeTruthy()
      expect(project.title.trim().length).toBeGreaterThan(0)
    })

    it('has a non-empty role', () => {
      expect(project.role).toBeTruthy()
      expect(project.role.trim().length).toBeGreaterThan(0)
    })

    it('has at least one tag', () => {
      expect(project.tags.length).toBeGreaterThan(0)
      for (const tag of project.tags) {
        expect(tag.trim().length).toBeGreaterThan(0)
      }
    })

    it('has a non-empty summary', () => {
      expect(project.summary).toBeTruthy()
      expect(project.summary.trim().length).toBeGreaterThan(0)
    })

    it('has a non-empty description', () => {
      expect(project.description).toBeTruthy()
      expect(project.description.trim().length).toBeGreaterThan(0)
    })

    it('has a valid CSS gradient string', () => {
      expect(project.gradient).toMatch(/^linear-gradient\(/)
      expect(project.gradient).toMatch(/\)$/)
    })

    it('has at least one tech stack item', () => {
      expect(project.techStack.length).toBeGreaterThan(0)
    })

    it('has valid techStack categories', () => {
      for (const tech of project.techStack) {
        expect(VALID_CATEGORIES).toContain(tech.category)
        expect(tech.name.trim().length).toBeGreaterThan(0)
      }
    })

    it('has at least one section', () => {
      expect(project.sections.length).toBeGreaterThan(0)
    })

    it('has sections with non-empty title and content', () => {
      for (const section of project.sections) {
        expect(section.title.trim().length).toBeGreaterThan(0)
        expect(section.content.trim().length).toBeGreaterThan(0)
      }
    })

    it('has at least one stat', () => {
      expect(project.stats.length).toBeGreaterThan(0)
    })

    it('has stats with non-empty label and value', () => {
      for (const stat of project.stats) {
        expect(stat.label.trim().length).toBeGreaterThan(0)
        expect(stat.value.trim().length).toBeGreaterThan(0)
      }
    })

    it('has valid optional link (if present)', () => {
      if (project.link) {
        expect(project.link).toMatch(/^https?:\/\//)
      }
    })

    it('has valid testimonial (if present)', () => {
      if (project.testimonial) {
        expect(project.testimonial.quote.trim().length).toBeGreaterThan(0)
        expect(project.testimonial.author.trim().length).toBeGreaterThan(0)
        expect(project.testimonial.role.trim().length).toBeGreaterThan(0)
      }
    })
  })
})
