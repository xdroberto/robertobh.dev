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
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap: Tab / Shift+Tab stays inside modal
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
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

  // Lock body scroll, listen for keys, manage focus
  useEffect(() => {
    if (isOpen) {
      // Save the element that triggered the modal
      triggerRef.current = document.activeElement as HTMLElement

      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)

      // Auto-focus the close button (first focusable element)
      requestAnimationFrame(() => {
        const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        first?.focus()
      })
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)

      // Restore focus to trigger element
      if (!isOpen && triggerRef.current) {
        triggerRef.current.focus()
        triggerRef.current = null
      }
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
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
              {/* Close button — circular dark backdrop so it's legible on top
                  of any project header image (e.g. the bright Moonhouse hero).
                  44×44 tap target, fixed-position so scroll inside the modal
                  never hides it. */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/90 hover:bg-black/80 hover:text-white hover:border-white/30 active:scale-95 transition-all duration-200 shadow-lg shadow-black/40"
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

              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
