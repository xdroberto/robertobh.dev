import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../components/layout/Section'

interface Project {
  id: string
  title: string
  role: string
  tags: string[]
  summary: string
  details: string[]
  link?: string
  linkLabel?: string
  // Gradient colors for placeholder preview
  gradient: string
}

const PROJECTS: Project[] = [
  {
    id: 'side-effects',
    title: 'Side Effects Studio',
    role: 'Creator & Lead Developer',
    tags: ['React', 'WebGL', 'Three.js', 'GLSL'],
    summary: 'Generative audio-visual environment with real-time rendering.',
    details: [
      'Custom GLSL fragment shaders with multi-wave synthesis and chromatic aberration',
      'Real-time audio-reactive rendering pipeline using Web Audio API',
      'Interactive mouse/touch influence on shader parameters',
      'Optimized for mobile with adaptive DPR and context loss recovery',
    ],
    link: 'https://studio.robertobh.dev',
    linkLabel: 'Launch Studio',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    id: 'moonhouse',
    title: 'Moonhouse Bistro',
    role: 'Design & Architecture',
    tags: ['Next.js', 'CMS', 'Dashboard'],
    summary: 'Restaurant web presence with dynamic content management.',
    details: [
      'Dashboard-driven CMS for real-time menu and content updates',
      'Architectural decisions for reservation flow and operational control',
      'Responsive design system with brand-consistent components',
      'SEO optimization and performance tuning for restaurant discovery',
    ],
    link: 'https://moonhouse-ar.com',
    linkLabel: 'Visit Site',
    gradient: 'linear-gradient(135deg, #1a1a0a 0%, #2d1f0e 50%, #3d2614 100%)',
  },
  {
    id: 'giftcard',
    title: 'Giftcard System',
    role: 'Full-Stack Developer',
    tags: ['Python', 'Flask', 'SQLite', 'QR'],
    summary: 'Gift card management platform with role-based access.',
    details: [
      'QR code and Code128 barcode generation per card with unique 16-char identifiers',
      'Role-based access: admin (full control) and cashier (redeem/verify/recharge)',
      'Integer-cent money storage for precision, with real-time balance tracking',
      'Production deployment with Gunicorn, Nginx, SSL, and automated daily backups',
    ],
    linkLabel: 'Case Study',
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #0e2d1f 50%, #143d26 100%)',
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left focus:outline-none"
      >
        {/* Card */}
        <div
          className={`border border-[#2a2420] bg-[#0e0c0a] overflow-hidden transition-all duration-500 ${
            expanded ? 'border-[#3a3430]' : 'hover:border-[#3a3430]'
          }`}
        >
          {/* Preview image area */}
          <div
            className="relative w-full h-40 sm:h-48 overflow-hidden"
            style={{ background: project.gradient }}
          >
            {/* Decorative overlay pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,204,0,0.06) 0%, transparent 40%)',
              }}
            />
            {/* Project number */}
            <span className="absolute top-4 left-5 font-mono text-[10px] tracking-[0.2em] text-white/20">
              {String(index + 1).padStart(2, '0')}
            </span>
            {/* Expand indicator */}
            <div className="absolute top-4 right-5 flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/20">
                {expanded ? 'Close' : 'Details'}
              </span>
              <motion.svg
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-3.5 h-3.5 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </motion.svg>
            </div>
          </div>

          {/* Card body */}
          <div className="p-5 sm:p-6">
            {/* Title + role */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-3">
              <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#e0dcd8] group-hover:text-white transition-colors duration-300">
                {project.title}
              </h3>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.1em] uppercase text-[#8a8480]/50 shrink-0">
                {project.role}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 border border-[#2a2420]/60 text-[#8a8480]/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Summary */}
            <p className="text-xs sm:text-sm leading-relaxed text-[#8a8480]">{project.summary}</p>
          </div>
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border border-t-0 border-[#2a2420] bg-[#0c0a08] px-5 sm:px-6 py-5 sm:py-6">
              {/* Technical details */}
              <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8a8480]/60 mb-4">
                Technical Highlights
              </h4>
              <ul className="space-y-2.5 mb-6">
                {project.details.map((detail, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-[#8a8480]"
                  >
                    <span className="text-[#ffcc00]/40 mt-1 shrink-0">&mdash;</span>
                    {detail}
                  </motion.li>
                ))}
              </ul>

              {/* Link */}
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[#ffcc00]/70 hover:text-[#ffcc00] transition-colors duration-300"
                >
                  <span>{project.linkLabel}</span>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>
              ) : (
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[#8a8480]/30">
                  {project.linkLabel || 'Coming soon'}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ProjectMatrix() {
  return (
    <Section id="projects">
      {/* Section header */}
      <div className="mb-10 sm:mb-12">
        <h2 className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8a8480]">
          Selected Work
        </h2>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  )
}
