import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

// Plain <section> — no scroll-triggered animations. Earlier versions used a
// `motion.section` with `whileInView`, which on mobile could fail to fire in
// edge cases (fast scroll, prefers-reduced-motion interactions) and leave
// sections at `opacity: 0` while still consuming layout space — which the
// user observed as "scroll is much longer than the content."
export default function Section({ id, children, className = '', fullWidth = false }: SectionProps) {
  return (
    <section id={id} className={`py-20 sm:py-28 lg:py-32 px-5 sm:px-8 lg:px-12 ${className}`}>
      <div className={fullWidth ? '' : 'max-w-7xl mx-auto'}>{children}</div>
    </section>
  )
}
