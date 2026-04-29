import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import About from './sections/About'
import ProjectMatrix from './sections/ProjectMatrix'
import Activity from './sections/Activity'
import Footer from './sections/Footer'

// Lazy-loaded — pulls three.js + R3F (~600KB raw) out of the initial bundle.
// The static gradient fallback is visually close enough that the swap-in is
// imperceptible for users.
const HeroCanvas = lazy(() => import('./components/three/HeroCanvas'))

// Static gradient fallback — matches the shader colors so the swap is visually
// silent if WebGL isn't available or the context is lost permanently.
const HERO_STATIC_BG =
  'radial-gradient(ellipse at 30% 40%, rgba(255,180,40,0.18) 0%, transparent 55%),' +
  'radial-gradient(ellipse at 75% 65%, rgba(80,140,220,0.15) 0%, transparent 55%),' +
  'radial-gradient(ellipse at 55% 80%, rgba(220,80,80,0.12) 0%, transparent 60%),' +
  'linear-gradient(180deg, #0c0604 0%, #1a0c06 50%, #0c0604 100%)'

// Probe for WebGL support up-front. If the browser can't allocate a context
// at all (very old phone, hardware acceleration off, GPU blacklist), bail out
// to the static gradient before mounting the Canvas at all.
function detectWebGL(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

export default function App() {
  // useState init runs once — picks the right path on first render and never
  // re-evaluates, so we never re-mount the Canvas.
  const [hasWebGL] = useState(() => detectWebGL())

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = ''
    })
  }, [])

  // Lock the hero height in pixels at first paint and only update on real
  // orientation changes — NEVER on scroll. iOS Safari fires "resize" events
  // 60×/sec while the URL bar animates in/out during scroll; binding `dvh`
  // (or any resize-driven measurement) to the hero causes the section to
  // resize at 60fps, which forces the WebGL canvas to relayout and produces
  // the visible flicker the user is seeing on phones.
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh100', `${window.innerHeight}px`)
    }
    setVh()
    window.addEventListener('orientationchange', setVh)
    return () => window.removeEventListener('orientationchange', setVh)
  }, [])

  return (
    <div className="bg-[#0a0604]">
      {/* Skip link — first focusable element. Hidden off-viewport until
          focused. `fixed` (not `absolute`) so it never extends document flow. */}
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-20 focus:translate-y-0 transition-transform duration-200 bg-[#ffcc00] text-[#0a0604] px-4 py-2 font-mono text-xs tracking-[0.15em] uppercase"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        {/* ===== HERO SECTION =====
          Height is locked to a CSS var set once in JS (--vh100), with a
          100svh fallback. We deliberately avoid `100dvh` — dvh is defined
          to recompute as the iOS URL bar animates in/out, which forces the
          section to resize at scroll-frame frequency and is the documented
          root cause of three.js hero flicker on phones. */}
        <section
          className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden"
          style={{ height: 'var(--vh100, 100svh)' }}
        >
          {/* Shader background, with a permanent static fallback if WebGL fails. */}
          {hasWebGL ? (
            <ErrorBoundary
              fallback={
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: HERO_STATIC_BG }}
                />
              }
            >
              <Suspense
                fallback={
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: HERO_STATIC_BG }}
                  />
                }
              >
                <HeroCanvas />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: HERO_STATIC_BG }}
            />
          )}

          {/* Noise overlay (CSS hides it on mobile and on prefers-reduced-motion) */}
          <div className="noise-overlay" />

          {/* Hero content */}
          <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center select-none max-w-3xl">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffcc00]/30 bg-[#0a0604]/70 sm:bg-[#0a0604]/40 sm:backdrop-blur-sm"
              style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
            >
              <span className="relative flex h-1.5 w-1.5">
                {/* Ping ring is a forever-running composited animation. On mobile
                  it keeps the GPU layer "live" and forces re-rasterisation of
                  the WebGL canvas behind it (one of the documented sources of
                  hero flicker on iOS). Restrict to sm:+ where it's safe. */}
                <span className="hidden sm:inline-flex absolute h-full w-full rounded-full bg-[#ffcc00] opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ffcc00]" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#e0dcd8]/80">
                Available for new projects
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="font-serif italic text-sm sm:text-base text-[#e0e0e0]/85 mb-3 tracking-wide"
              style={{ textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}
            >
              Software engineer &middot; Generative artist
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[1.05] font-bold tracking-tight text-white uppercase mb-5"
              style={{
                textShadow:
                  '0 0 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              Roberto BH
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-sm sm:text-base text-[#e0e0e0]/60 mb-2 leading-relaxed max-w-xl"
              style={{ textShadow: '0 0 18px rgba(0,0,0,0.8)' }}
            >
              Backends, web platforms & real-time visuals.
              <span className="hidden sm:inline"> TypeScript and Python, end-to-end.</span>
            </motion.p>

            {/* Location + timezone */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#e0e0e0]/40 mb-10"
              style={{ textShadow: '0 0 15px rgba(0,0,0,0.7)' }}
            >
              USA &middot; CST
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-mono tracking-[0.18em] uppercase border border-[#ffcc00]/60 bg-[#ffcc00]/10 text-[#ffcc00] hover:bg-[#ffcc00] hover:text-[#0a0604] transition-all duration-300"
              >
                View Work
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
                </svg>
              </a>
              <a
                href="mailto:robertobecerrilhurtado@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-mono tracking-[0.18em] uppercase border border-[#e0dcd8]/30 text-[#e0dcd8]/80 hover:border-[#e0dcd8]/70 hover:text-white transition-all duration-300"
              >
                Get in touch
              </a>
              <a
                href="https://github.com/xdroberto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-3 text-xs sm:text-sm font-mono tracking-[0.18em] uppercase text-[#e0dcd8]/50 hover:text-[#ffcc00] transition-colors duration-300"
                aria-label="GitHub profile"
              >
                GitHub ↗
              </a>
            </motion.div>
          </div>

          {/* Scroll indicator — static (no infinite bounce). The bounce kept a
            GPU compositor layer permanently active, which on mobile
            contributes to repaint pressure and visible flicker on cards. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="flex flex-col items-center gap-2">
              <span
                className="hidden sm:block font-mono text-[9px] tracking-[0.2em] uppercase text-[#e0e0e0]/20"
                style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
              >
                Scroll
              </span>
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e0e0e0]/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
              </svg>
            </div>
          </motion.div>
        </section>

        {/* ===== CONTENT SECTIONS ===== */}
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <ProjectMatrix />
        <div className="section-divider" />
        <Activity />
      </main>
      <div className="section-divider" />
      <Footer />
    </div>
  )
}
