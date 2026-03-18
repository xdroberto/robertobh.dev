import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import WaveShader from './components/three/WaveShader'

export default function App() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    let lastUpdate = 0
    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastUpdate < 16) return
      lastUpdate = now
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0604]">
      {/* Shader background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 1] }}
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <WaveShader />
        </Canvas>
      </div>

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center select-none">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="font-serif italic text-[clamp(0.7rem,1.2vw,1rem)] text-[#e0e0e0]/60 mb-6 tracking-wide"
        >
          Creative Developer &amp; Digital Craftsman
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[1.1] font-bold tracking-tight text-[#e0e0e0] uppercase mb-4"
        >
          Roberto BH
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-serif italic text-[clamp(0.8rem,1.5vw,1.1rem)] text-[#e0e0e0]/50 mb-10 tracking-widest"
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

      {/* Custom cursor (desktop only) */}
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
    </div>
  )
}
