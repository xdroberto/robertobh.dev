import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProjectDetail from '../components/ui/ProjectDetail'
import type { Project } from '../data/projects'

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_: object, tag: string) =>
        function MotionEl({
          children,
          ...props
        }: {
          children?: React.ReactNode
          [key: string]: unknown
        }) {
          return React.createElement(tag, props, children)
        },
    },
  ),
}))

const base: Project = {
  id: 'test',
  title: 'Test Project',
  role: 'Developer',
  tags: ['React'],
  summary: 'A test project',
  gradient: 'linear-gradient(135deg, #000 0%, #fff 100%)',
  description: 'Full description here.',
  techStack: [{ name: 'React', category: 'frontend' }],
  sections: [{ title: 'Overview', content: 'Section content.' }],
  stats: [{ label: 'Users', value: '1K' }],
}

describe('ProjectDetail', () => {
  it('renders project title and role', () => {
    render(<ProjectDetail project={base} />)
    expect(screen.getByText('Test Project')).toBeTruthy()
    expect(screen.getByText('Developer')).toBeTruthy()
  })

  it('renders project description', () => {
    render(<ProjectDetail project={base} />)
    expect(screen.getByText('Full description here.')).toBeTruthy()
  })

  it('renders stat values and labels', () => {
    render(<ProjectDetail project={base} />)
    expect(screen.getByText('1K')).toBeTruthy()
    expect(screen.getByText('Users')).toBeTruthy()
  })

  it('renders section titles and content', () => {
    render(<ProjectDetail project={base} />)
    expect(screen.getByText('Overview')).toBeTruthy()
    expect(screen.getByText('Section content.')).toBeTruthy()
  })

  it('renders image when project.image is provided', () => {
    const project: Project = { ...base, image: '/test.webp' }
    const { container } = render(<ProjectDetail project={project} />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/test.webp')
    expect(img?.getAttribute('alt')).toBe('Test Project')
  })

  it('does not render image when project.image is absent', () => {
    const { container } = render(<ProjectDetail project={base} />)
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders known tech category with correct color class', () => {
    render(<ProjectDetail project={base} />)
    const techBadge = screen.getByText('React')
    expect(techBadge.className).toContain('text-[#6366f1]/70') // frontend color
  })

  it('renders unknown tech category with fallback classes', () => {
    const project = {
      ...base,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      techStack: [{ name: 'UnknownTech', category: 'unknown' as any }],
    }
    render(<ProjectDetail project={project} />)
    const badge = screen.getByText('UnknownTech')
    expect(badge.className).toContain('border-[#2a2420]/60')
  })

  it('renders external link when project.link is provided', () => {
    const project: Project = { ...base, link: 'https://example.com', linkLabel: 'Visit Site' }
    render(<ProjectDetail project={project} />)
    const link = screen.getByRole('link', { name: /visit site/i })
    expect(link.getAttribute('href')).toBe('https://example.com')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders "Coming soon" when linkLabel is set but link is absent', () => {
    const project: Project = { ...base, linkLabel: 'Visit Site' }
    render(<ProjectDetail project={project} />)
    expect(screen.getByText(/coming soon/i)).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('renders neither link nor "Coming soon" when both are absent', () => {
    render(<ProjectDetail project={base} />)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.queryByText(/coming soon/i)).toBeNull()
  })

  it('renders testimonial blockquote when provided', () => {
    const project: Project = {
      ...base,
      testimonial: { quote: 'Excellent work!', author: 'Jane Doe', role: 'CTO' },
    }
    const { container } = render(<ProjectDetail project={project} />)
    expect(screen.getByText(/excellent work/i)).toBeTruthy()
    expect(screen.getByText(/jane doe/i)).toBeTruthy()
    expect(container.querySelector('blockquote')).toBeTruthy()
  })

  it('does not render blockquote when testimonial is absent', () => {
    const { container } = render(<ProjectDetail project={base} />)
    expect(container.querySelector('blockquote')).toBeNull()
  })
})
