import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../components/layout/Navbar'

vi.mock('framer-motion', () => {
  const cache = new Map<string, unknown>()
  return {
    motion: new Proxy(
      {},
      {
        get: (_: object, tag: string) => {
          if (!cache.has(tag)) {
            cache.set(
              tag,
              function MotionEl({
                children,
                ...props
              }: {
                children?: React.ReactNode
                [key: string]: unknown
              }) {
                return React.createElement(tag, props, children)
              },
            )
          }
          return cache.get(tag)
        },
      },
    ),
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
  }
})

describe('Navbar', () => {
  it('renders the RBH logo link', () => {
    render(<Navbar />)
    expect(screen.getByText('RBH')).toBeTruthy()
  })

  it('renders all desktop nav items', () => {
    render(<Navbar />)
    expect(screen.getAllByText('Projects').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Activity').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Contact').length).toBeGreaterThanOrEqual(1)
  })

  it('renders a hamburger button for mobile', () => {
    render(<Navbar />)
    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button).toBeTruthy()
  })

  it('hamburger button has aria-expanded=false initially', () => {
    render(<Navbar />)
    const button = screen.getByRole('button', { name: /toggle menu/i })
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('opens mobile menu when hamburger is clicked', () => {
    render(<Navbar />)
    const button = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
  })

  it('locks body scroll when mobile menu is open', () => {
    render(<Navbar />)
    const button = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(button)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('unlocks body scroll when mobile menu is closed', () => {
    render(<Navbar />)
    const button = screen.getByRole('button', { name: /toggle menu/i })
    fireEvent.click(button)
    fireEvent.click(button)
    expect(document.body.style.overflow).toBe('')
  })

  it('nav items have correct href anchors', () => {
    render(<Navbar />)
    const projectLinks = screen
      .getAllByText('Projects')
      .map((el) => el.closest('a'))
      .filter(Boolean) as HTMLAnchorElement[]
    expect(projectLinks.some((a) => a.getAttribute('href') === '#projects')).toBe(true)
  })

  it('RBH logo calls scrollTo on click', () => {
    render(<Navbar />)
    const logoLink = screen.getByText('RBH')
    fireEvent.click(logoLink)
    expect(window.scrollTo).toHaveBeenCalled()
  })
})
