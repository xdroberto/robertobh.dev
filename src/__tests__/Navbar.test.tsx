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

  it('applies scrolled-state classes when scrollY > 60', () => {
    const { container } = render(<Navbar />)
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
    fireEvent.scroll(window)
    const nav = container.querySelector('nav') as HTMLElement
    expect(nav).toBeTruthy()
    // Mobile: fully opaque (no compositing). sm:+: translucent + blur.
    expect(nav.className).toContain('bg-[#0a0604]')
    expect(nav.className).toContain('sm:backdrop-blur-xl')
    // Reset for other tests
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  it('uses the bg-transparent class (no scrolled style) when scrollY is 0', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    const { container } = render(<Navbar />)
    fireEvent.scroll(window)
    const nav = container.querySelector('nav') as HTMLElement
    expect(nav).toBeTruthy()
    expect(nav.className).toContain('bg-transparent')
    expect(nav.className).not.toContain('sm:backdrop-blur-xl')
  })
})
