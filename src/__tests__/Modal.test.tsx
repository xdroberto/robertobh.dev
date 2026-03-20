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
})
