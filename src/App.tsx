import { lazy, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'

const WaveShader = lazy(() => import('./components/three/WaveShader'))

export default function App() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0604]">
      {/* Shader background - wrapped in error boundary so text always shows */}
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 1] }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false }}
          dpr={[1, 2]}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <WaveShader />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center select-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="font-serif italic text-[clamp(0.7rem,1.2vw,1rem)] text-[#e0e0e0]/70 mb-6 tracking-wide"
          style={{ textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}
        >
          Creative Developer &amp; Digital Craftsman
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[1.1] font-bold tracking-tight text-white uppercase mb-4"
          style={{ textShadow: '0 0 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.8)' }}
        >
          Roberto BH
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-serif italic text-[clamp(0.8rem,1.5vw,1.1rem)] text-[#e0e0e0]/60 mb-10 tracking-widest"
          style={{ textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}
        >
          Portfolio coming soon
        </motion.p>

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
            className="text-sm text-[#e0e0e0]/40 hover:text-[#ffcc00] transition-colors duration-300 tracking-widest uppercase font-mono"
          >
            GitHub
          </a>
          <a
            href="mailto:robertobecerrilhurtado@gmail.com"
            className="text-sm text-[#e0e0e0]/40 hover:text-[#ffcc00] transition-colors duration-300 tracking-widest uppercase font-mono"
          >
            Contact
          </a>
        </motion.div>
      </div>
    </div>
  )
}
