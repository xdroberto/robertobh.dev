import { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const panel = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose],
  )

  // Body scroll lock + key listener — only while modal is mounted AND open.
  // Saves prior overflow value so we never clobber other consumers.
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Track the trigger and auto-focus first interactive element on open;
  // restore focus to the trigger only on the open→closed transition.
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement
      requestAnimationFrame(() => {
        const first = containerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        first?.focus()
      })
      return
    }
    if (triggerRef.current) {
      triggerRef.current.focus()
      triggerRef.current = null
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Close button is fixed to the viewport so it never scrolls out
              of view, even when long modal content scrolls inside. Living
              outside panelRef keeps it as a sibling, but containerRef-based
              focus trap still includes it. */}
          <button
            onClick={onClose}
            className="fixed top-3 right-3 sm:top-4 sm:right-4 z-30 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-black/80 hover:text-white hover:border-white/30 active:scale-95 transition-all duration-200 shadow-lg shadow-black/40"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            ref={panelRef}
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-3xl xl:max-w-[45%] mx-4 sm:mx-6 my-8 sm:my-16"
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Project details'}
          >
            <div className="relative bg-[#0e0c0a] border border-[#2a2420] overflow-hidden">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
