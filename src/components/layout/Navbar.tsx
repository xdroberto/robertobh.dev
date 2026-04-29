import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Activity', href: '#activity' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState<string | null>(null)

  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Track which section is in view to mark active link
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return
    }

    const sections = NAV_ITEMS.map((item) => {
      const id = item.href.replace('#', '')
      const el = document.getElementById(id)
      return el ? { href: item.href, el } : null
    }).filter((s): s is { href: string; el: HTMLElement } => s !== null)

    if (sections.length === 0) return

    const visibility = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = '#' + entry.target.id
          visibility.set(href, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let bestHref: string | null = null
        let bestRatio = 0
        for (const [href, ratio] of visibility.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestHref = href
          }
        }
        setActiveHref(bestRatio > 0 ? bestHref : null)
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    for (const { el } of sections) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Focus first link when menu opens; return focus to hamburger when it closes.
  useEffect(() => {
    if (menuOpen) {
      wasOpenRef.current = true
      const t = window.setTimeout(() => {
        const first = mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a')
        first?.focus()
      }, 0)
      return () => window.clearTimeout(t)
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false
      hamburgerRef.current?.focus()
    }
    return undefined
  }, [menuOpen])

  // Escape to close + focus trap (Tab wraps within menu links)
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
        return
      }
      if (e.key === 'Tab') {
        const links = mobileMenuRef.current?.querySelectorAll<HTMLAnchorElement>('a')
        if (!links || links.length === 0) return
        const first = links[0]
        const last = links[links.length - 1]
        const active = document.activeElement
        if (e.shiftKey) {
          if (active === first || !mobileMenuRef.current?.contains(active)) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (active === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled
            ? // Mobile: fully opaque bg (no compositing with cards behind) +
              // no backdrop-filter — both were forcing repaints of content
              // scrolling beneath the nav and contributed to visible flicker.
              // sm:+ keeps the translucent + blur look since desktop GPUs
              // handle it without cost.
              'bg-[#0a0604] sm:bg-[#0a0604]/80 sm:backdrop-blur-xl border-b border-[#2a2420]/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo — button (not anchor) since it scrolls to top, doesn't navigate */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              closeMenu()
            }}
            className="font-mono text-xs sm:text-sm tracking-[0.2em] text-[#e0dcd8]/80 hover:text-[#ffcc00] transition-colors duration-300 inline-block py-3 -my-3 bg-transparent border-0 cursor-pointer"
            aria-label="Scroll to top"
          >
            RBH
          </button>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeHref === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`font-mono text-xs tracking-[0.15em] uppercase hover:text-[#ffcc00] transition-colors duration-300 ${
                    isActive ? 'text-[#ffcc00]' : 'text-[#e0dcd8]/70'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[5px] -mr-2"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block w-5 h-[1px] bg-[#e0dcd8]/70 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}
            />
            <span
              className={`block w-5 h-[1px] bg-[#e0dcd8]/70 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-5 h-[1px] bg-[#e0dcd8]/70 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-[#0a0604]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10"
          >
            {NAV_ITEMS.map((item, i) => {
              const isActive = activeHref === item.href
              return (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive ? 'page' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className={`font-mono text-lg tracking-[0.2em] uppercase hover:text-[#ffcc00] transition-colors ${
                    isActive ? 'text-[#ffcc00]' : 'text-[#e0dcd8]/70'
                  }`}
                >
                  {item.label}
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
