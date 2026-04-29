import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Override PROJECTS with one card that has an image and one without,
// so both branches of the `{!project.image && ...}` condition are exercised.
vi.mock('../data/projects', () => ({
  PROJECTS: [
    {
      id: 'has-image',
      title: 'Project With Image',
      role: 'Dev',
      tags: ['React'],
      summary: 'Has a hero image.',
      gradient: 'linear-gradient(#000, #fff)',
      image: '/projects/test.webp',
      description: 'Desc.',
      techStack: [],
      sections: [],
      stats: [],
    },
    {
      id: 'no-image',
      title: 'Project No Image',
      role: 'Dev',
      tags: ['Vue'],
      summary: 'No hero image.',
      gradient: 'linear-gradient(#111, #eee)',
      description: 'Desc.',
      techStack: [],
      sections: [],
      stats: [],
    },
  ],
}))

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
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
  useReducedMotion: () => false,
}))

import ProjectMatrix from '../sections/ProjectMatrix'
import { PROJECTS } from '../data/projects'

describe('ProjectMatrix (no-image branch)', () => {
  it('renders both project cards', () => {
    render(<ProjectMatrix />)
    expect(screen.getByText('Project With Image')).toBeTruthy()
    expect(screen.getByText('Project No Image')).toBeTruthy()
  })

  it('renders gradient accent bar for card without image', () => {
    const { container } = render(<ProjectMatrix />)
    // The gradient accent is a div with h-1.5 and inline background style
    const accentBars = container.querySelectorAll<HTMLElement>('[style*="linear-gradient"]')
    // At least one accent bar should exist (the no-image card)
    expect(accentBars.length).toBeGreaterThanOrEqual(1)
  })

  it('renders an img element for the card with an image', () => {
    const { container } = render(<ProjectMatrix />)
    const imgs = container.querySelectorAll('img')
    expect(imgs.length).toBe(1)
    expect(imgs[0].getAttribute('src')).toBe('/projects/test.webp')
  })

  it('renders correct number of project cards', () => {
    render(<ProjectMatrix />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(PROJECTS.length)
  })
})
