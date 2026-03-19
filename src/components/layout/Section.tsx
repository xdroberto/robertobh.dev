import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export default function Section({ id, children, className = '', fullWidth = false }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`py-16 sm:py-24 px-5 sm:px-8 ${className}`}
    >
      <div className={fullWidth ? '' : 'max-w-6xl mx-auto'}>{children}</div>
    </motion.section>
  )
}
