import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ParticleField from '../components/three/ParticleField'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ParticleField />
        </Canvas>
      </div>

      {/* Content */}
      <div className="text-center z-10 px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm tracking-widest uppercase text-[var(--color-accent)] mb-4 font-mono"
        >
          Creative Developer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Roberto BH
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto mb-8"
        >
          Building modern, interactive web experiences with attention to detail.
        </motion.p>
        <motion.a
          href="#projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="inline-block px-6 py-3 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300"
        >
          View Work
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-[var(--color-text-secondary)] rounded-full flex justify-center pt-1"
        >
          <div className="w-1 h-2 bg-[var(--color-text-secondary)] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
