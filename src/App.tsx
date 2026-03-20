import { lazy, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import ProjectMatrix from './sections/ProjectMatrix'
import Activity from './sections/Activity'
import Footer from './sections/Footer'

const WaveShader = lazy(() => import('./components/three/WaveShader'))

export default function App() {
  return (
    <div className="bg-[#0a0604]">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-dvh min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Shader background */}
        <ErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 1] }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false,
            }}
            dpr={[1, 2]}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <WaveShader />
            </Suspense>
          </Canvas>
        </ErrorBoundary>

        {/* Noise overlay */}
        <div className="noise-overlay" />

        {/* Hero content */}
        <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center select-none">
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="font-serif italic text-[clamp(0.7rem,1.2vw,1rem)] text-[#e0e0e0]/70 mb-5 tracking-wide"
            style={{ textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}
          >
            Creative Developer
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[1.1] font-bold tracking-tight text-white uppercase mb-4"
            style={{
              textShadow:
                '0 0 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            Roberto BH
          </motion.h1>

          {/* Location + timezone */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#e0e0e0]/30 mb-10"
            style={{ textShadow: '0 0 15px rgba(0,0,0,0.7)' }}
          >
            USA &middot; CST
          </motion.p>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="flex gap-8"
          >
            <a
              href="https://github.com/xdroberto"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 text-xs sm:text-sm text-[#e0e0e0]/40 hover:text-[#ffcc00] transition-colors duration-300 tracking-widest uppercase font-mono"
            >
              GitHub
            </a>
            <a
              href="mailto:robertobecerrilhurtado@gmail.com"
              className="px-4 py-3 text-xs sm:text-sm text-[#e0e0e0]/40 hover:text-[#ffcc00] transition-colors duration-300 tracking-widest uppercase font-mono"
            >
              Contact
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
              className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#e0e0e0]/20"
              style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
            >
              Scroll
            </span>
            <svg
              className="w-4 h-4 text-[#e0e0e0]/20"
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
      <ProjectMatrix />
      <div className="section-divider" />
      <Activity />
      <div className="section-divider" />
      <Footer />
    </div>
  )
}
