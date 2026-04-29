import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProjectMatrix from '../sections/ProjectMatrix'
import { PROJECTS } from '../data/projects'

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

describe('ProjectMatrix', () => {
  it('renders the section with id="projects"', () => {
    render(<ProjectMatrix />)
    expect(document.querySelector('#projects')).toBeTruthy()
  })

  it('renders "Selected Work" heading', () => {
    render(<ProjectMatrix />)
    expect(screen.getByText('Selected Work')).toBeTruthy()
  })

  it('renders all project titles', () => {
    render(<ProjectMatrix />)
    for (const project of PROJECTS) {
      expect(screen.getByText(project.title)).toBeTruthy()
    }
  })

  it('renders all project role labels', () => {
    render(<ProjectMatrix />)
    for (const project of PROJECTS) {
      expect(screen.getAllByText(project.role).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('renders all project summaries', () => {
    render(<ProjectMatrix />)
    for (const project of PROJECTS) {
      expect(screen.getByText(project.summary)).toBeTruthy()
    }
  })

  it('renders the correct number of project cards', () => {
    render(<ProjectMatrix />)
    const buttons = screen.getAllByRole('button')
    // Each project card has one button (open detail)
    expect(buttons.length).toBeGreaterThanOrEqual(PROJECTS.length)
  })

  it('modal is not visible initially', () => {
    render(<ProjectMatrix />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens modal when a project card is clicked', () => {
    render(<ProjectMatrix />)
    const firstButton = screen.getAllByRole('button')[0]
    fireEvent.click(firstButton)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('shows the correct project title in the modal after click', () => {
    render(<ProjectMatrix />)
    const firstButton = screen.getAllByRole('button')[0]
    fireEvent.click(firstButton)
    // The modal's aria-label should match the first project title
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-label')).toBe(PROJECTS[0].title)
  })

  it('closes the modal when the close button is clicked', () => {
    render(<ProjectMatrix />)
    const firstButton = screen.getAllByRole('button')[0]
    fireEvent.click(firstButton)
    expect(screen.getByRole('dialog')).toBeTruthy()
    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders project tags for the first project', () => {
    render(<ProjectMatrix />)
    for (const tag of PROJECTS[0].tags) {
      expect(screen.getAllByText(tag).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('renders numbered index badges (01, 02, 03)', () => {
    render(<ProjectMatrix />)
    for (let i = 0; i < PROJECTS.length; i++) {
      const badge = String(i + 1).padStart(2, '0')
      expect(screen.getAllByText(badge).length).toBeGreaterThanOrEqual(1)
    }
  })
})
