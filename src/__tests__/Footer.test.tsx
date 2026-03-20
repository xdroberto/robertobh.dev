import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../sections/Footer'

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
}))

describe('Footer', () => {
  it('renders the footer element', () => {
    render(<Footer />)
    expect(document.querySelector('footer')).toBeTruthy()
  })

  it('has the correct contact section id', () => {
    render(<Footer />)
    const footer = document.querySelector('footer')
    expect(footer?.getAttribute('id')).toBe('contact')
  })

  it('renders the CTA heading text', () => {
    render(<Footer />)
    expect(screen.getByText("Let's build something.")).toBeTruthy()
  })

  it('renders the tagline paragraph', () => {
    render(<Footer />)
    expect(screen.getByText(/Open to collaboration and interesting conversations/i)).toBeTruthy()
  })

  it('renders the GitHub link', () => {
    render(<Footer />)
    const link = screen.getByText('GitHub')
    expect(link.tagName).toBe('A')
    expect((link as HTMLAnchorElement).href).toContain('github.com/xdroberto')
  })

  it('renders the LinkedIn link', () => {
    render(<Footer />)
    const link = screen.getByText('LinkedIn')
    expect(link.tagName).toBe('A')
    expect((link as HTMLAnchorElement).href).toContain('linkedin.com')
  })

  it('renders the Email link', () => {
    render(<Footer />)
    const link = screen.getByText('Email')
    expect(link.tagName).toBe('A')
    expect((link as HTMLAnchorElement).href).toContain('mailto:')
  })

  it('renders the current year in the copyright notice', () => {
    render(<Footer />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeTruthy()
  })

  it('renders the Roberto BH copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/Roberto BH/)).toBeTruthy()
  })

  it('renders the Mexico flag emoji with aria-label', () => {
    render(<Footer />)
    const flag = screen.getByRole('img', { name: 'Mexico' })
    expect(flag).toBeTruthy()
  })

  it('renders the Palestine donation link', () => {
    render(<Footer />)
    const donateLink = screen.getByText('Donate for Palestine')
    expect(donateLink.closest('a')).toBeTruthy()
    expect((donateLink.closest('a') as HTMLAnchorElement).href).toContain('donate.unrwa.org')
  })

  it('opens external links in a new tab with rel noopener', () => {
    render(<Footer />)
    const githubLink = screen.getByText('GitHub').closest('a') as HTMLAnchorElement
    expect(githubLink.target).toBe('_blank')
    expect(githubLink.rel).toContain('noopener')
  })

  it('opens email links without target="_blank"', () => {
    render(<Footer />)
    const emailLink = screen.getByText('Email').closest('a') as HTMLAnchorElement
    expect(emailLink.target).not.toBe('_blank')
  })
})
