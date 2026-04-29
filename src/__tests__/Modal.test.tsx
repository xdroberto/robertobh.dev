import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../components/ui/Modal'

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

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={false} onClose={onClose}>
        <p>Hidden content</p>
      </Modal>,
    )
    expect(screen.queryByText('Hidden content')).toBeNull()
  })

  it('renders children when isOpen is true', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Visible content</p>
      </Modal>,
    )
    expect(screen.getByText('Visible content')).toBeTruthy()
  })

  it('renders with role="dialog" when open', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('dialog has aria-modal="true"', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
  })

  it('renders a Close button when open', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    expect(screen.getByRole('button', { name: /close/i })).toBeTruthy()
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    const backdrop = document.querySelector('[aria-hidden]') as HTMLElement
    expect(backdrop).toBeTruthy()
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('locks body scroll when open', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('uses the title prop as aria-label on the dialog', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="My Project">
        <p>Content</p>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-label')).toBe('My Project')
  })

  it('uses fallback aria-label when no title is provided', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-label')).toBe('Project details')
  })

  it('Shift+Tab on first focusable element wraps focus to last', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <button>Last Button</button>
      </Modal>,
    )
    const closeBtn = screen.getByRole('button', { name: /close/i })
    const lastBtn = screen.getByRole('button', { name: /last button/i })
    closeBtn.focus()
    expect(document.activeElement).toBe(closeBtn)
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(lastBtn)
  })

  it('Tab on last focusable element wraps focus to first', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <button>Last Button</button>
      </Modal>,
    )
    const closeBtn = screen.getByRole('button', { name: /close/i })
    const lastBtn = screen.getByRole('button', { name: /last button/i })
    lastBtn.focus()
    expect(document.activeElement).toBe(lastBtn)
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(closeBtn)
  })

  it('Tab on a middle element does not wrap focus', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <button>Middle Button</button>
        <button>Last Button</button>
      </Modal>,
    )
    const middleBtn = screen.getByRole('button', { name: /middle button/i })
    middleBtn.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    // No preventDefault or focus change — middle is neither first nor last
    expect(onClose).not.toHaveBeenCalled()
  })

  // ----- Tests for the rewritten structure -----

  it('close button is fixed-positioned, not inside the panel', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Panel content</p>
      </Modal>,
    )
    const closeBtn = screen.getByLabelText('Close')
    // The new structure has the close button as a sibling of the dialog panel,
    // with a `fixed` positioning class so it stays in the viewport while the
    // panel scrolls.
    expect(closeBtn.className).toContain('fixed')
    expect(closeBtn.className).toContain('top-3')
    expect(closeBtn.className).toContain('right-3')
    const dialogPanel = screen.getByRole('dialog')
    expect(dialogPanel.contains(closeBtn)).toBe(false)
  })

  it('close button is queryable by aria-label "Close"', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    expect(screen.getByLabelText('Close')).toBeTruthy()
  })

  it('container is queryable and uses overflow-y-auto for scrollable content', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    // Outer container has the fixed-inset / scroll classes per the rewrite
    const outer = container.querySelector('.fixed.inset-0.z-50') as HTMLElement | null
    expect(outer).not.toBeNull()
    expect(outer!.className).toContain('overflow-y-auto')
    expect(outer!.className).toContain('overscroll-contain')
  })

  it('saves and restores body overflow value on open/close', () => {
    document.body.style.overflow = 'scroll'
    const onClose = vi.fn()
    const { rerender } = render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    expect(document.body.style.overflow).toBe('hidden')
    rerender(
      <Modal isOpen={false} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    )
    // The previous overflow value is restored, not blanked out
    expect(document.body.style.overflow).toBe('scroll')
    document.body.style.overflow = ''
  })

  it('focus trap includes the close button (it lives inside containerRef)', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <button>Inner</button>
      </Modal>,
    )
    const closeBtn = screen.getByLabelText('Close')
    const innerBtn = screen.getByRole('button', { name: /inner/i })
    // Tab from last (inner) wraps to first (close button)
    innerBtn.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(closeBtn)
  })
})
