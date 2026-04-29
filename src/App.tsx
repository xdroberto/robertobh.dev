import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import About from './sections/About'
import ProjectMatrix from './sections/ProjectMatrix'
import Activity from './sections/Activity'
import Footer from './sections/Footer'

const HeroCanvas = lazy(() => import('./components/three/HeroCanvas'))

const HERO_STATIC_BG =
  'radial-gradient(ellipse at 30% 40%, rgba(255,180,40,0.18) 0%, transparent 55%),' +
  'radial-gradient(ellipse at 75% 65%, rgba(80,140,220,0.15) 0%, transparent 55%),' +
  'radial-gradient(ellipse at 55% 80%, rgba(220,80,80,0.12) 0%, transparent 60%),' +
  'linear-gradient(180deg, #0c0604 0%, #1a0c06 50%, #0c0604 100%)'

export default function App() {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = ''
    })
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-[#0a0604]">
        <Navbar />

        {/* ===== HERO SECTION ===== */}
        <section className="relative h-dvh min-h-[600px] flex items-center justify-center overflow-hidden">
          {reduceMotion ? (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: HERO_STATIC_BG }}
            />
          ) : (
            <ErrorBoundary>
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
          )}

          {/* Noise overlay (CSS handles prefers-reduced-motion via display:none) */}
          <div className="noise-overlay" />

          {/* Hero content */}
          <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center select-none max-w-3xl">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffcc00]/30 bg-[#0a0604]/40 backdrop-blur-sm"
              style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#ffcc00] opacity-75 animate-ping" />
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

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
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
            </motion.div>
          </motion.div>
        </section>

        {/* ===== CONTENT SECTIONS ===== */}
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <ProjectMatrix />
        <div className="section-divider" />
        <Activity />
        <div className="section-divider" />
        <Footer />
      </div>
    </MotionConfig>
  )
}
