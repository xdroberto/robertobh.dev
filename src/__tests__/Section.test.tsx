import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import Section from '../components/layout/Section'

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

describe('Section', () => {
  it('renders children inside a section element with correct id', () => {
    const { container } = render(
      <Section id="hero">
        <p>Hello</p>
      </Section>,
    )
    expect(container.querySelector('#hero')).toBeTruthy()
    expect(container.querySelector('#hero p')?.textContent).toBe('Hello')
  })

  it('wraps children in max-w-7xl container by default', () => {
    const { container } = render(
      <Section id="test">
        <p>Content</p>
      </Section>,
    )
    const inner = container.querySelector('section > div')
    expect(inner?.className).toContain('max-w-7xl')
    expect(inner?.className).toContain('mx-auto')
  })

  it('omits max-w-7xl wrapper when fullWidth is true', () => {
    const { container } = render(
      <Section id="test" fullWidth>
        <p>Content</p>
      </Section>,
    )
    const inner = container.querySelector('section > div')
    expect(inner?.className).toBe('')
  })

  it('applies custom className to the section element', () => {
    const { container } = render(
      <Section id="test" className="bg-red-500">
        <p>Content</p>
      </Section>,
    )
    const section = container.querySelector('section')
    expect(section?.className).toContain('bg-red-500')
  })
})
