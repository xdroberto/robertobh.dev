import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ErrorBoundary from '../components/ErrorBoundary'

function Boom(): React.ReactElement {
  throw new Error('kaboom')
}

describe('ErrorBoundary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // React logs caught errors to console.error in dev — suppress so tests
    // stay quiet and we don't pollute the report.
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('renders the child normally when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>healthy child</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('healthy child')).toBeTruthy()
  })

  it('renders the fallback prop when a child throws', () => {
    render(
      <ErrorBoundary fallback={<p>fallback ui</p>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('fallback ui')).toBeTruthy()
  })

  it('returns null (renders nothing) when a child throws and no fallback is provided', () => {
    const { container } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    // No fallback → boundary returns null. Container should have no children.
    expect(container.firstChild).toBeNull()
  })

  it('does not render the broken child after it throws', () => {
    render(
      <ErrorBoundary fallback={<p>fallback ui</p>}>
        <Boom />
        <p>sibling that should never render</p>
      </ErrorBoundary>,
    )
    expect(screen.queryByText(/sibling that should never render/)).toBeNull()
    expect(screen.getByText('fallback ui')).toBeTruthy()
  })

  it('renders multiple healthy children', () => {
    render(
      <ErrorBoundary>
        <p>first</p>
        <p>second</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('first')).toBeTruthy()
    expect(screen.getByText('second')).toBeTruthy()
  })
})
