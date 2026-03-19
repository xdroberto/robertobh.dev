import { motion } from 'framer-motion'
import Section from '../components/layout/Section'

interface Project {
  entry: string
  title: string
  role: string
  tags: string[]
  description: string
  link?: string
}

const PROJECTS: Project[] = [
  {
    entry: '01',
    title: 'Side Effects Studio',
    role: 'Creator & Lead Developer',
    tags: ['React', 'WebGL', 'Three.js'],
    description:
      'Generative audio-visual environment with real-time rendering and interactive shader compositions.',
    link: 'https://studio.robertobh.dev',
  },
  {
    entry: '02',
    title: 'Moonhouse Bistro',
    role: 'Design & Architecture',
    tags: ['Next.js', 'CMS', 'Framer'],
    description:
      'Restaurant web presence with dashboard-driven content management for menu, reservations and operations.',
    link: 'https://moonhouse-ar.com',
  },
  {
    entry: '03',
    title: 'Giftcard System',
    role: 'Full-Stack Developer',
    tags: ['Python', 'Flask', 'SQLite'],
    description:
      'Gift card management platform with QR/barcode generation, role-based access and real-time tracking.',
    link: 'https://moonhouse.robertobh.dev',
  },
]

export default function ProjectMatrix() {
  return (
    <Section id="projects">
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-12 sm:mb-16">
        <h2 className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8a8480]">
          Selected Work
        </h2>
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#8a8480]/30">
          {PROJECTS.length} projects
        </span>
      </div>

      {/* Project list — clean vertical stack */}
      <div className="flex flex-col">
        {PROJECTS.map((project, i) => (
          <motion.a
            key={project.entry}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-start sm:items-center gap-3 sm:gap-8 py-8 sm:py-10 border-b border-[#2a2420]/60 hover:border-[#3a3430] transition-colors duration-500 first:border-t"
          >
            {/* Left: number + title */}
            <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
              <span className="font-mono text-[10px] tracking-[0.15em] text-[#8a8480]/40 shrink-0">
                {project.entry}
              </span>
              <h3 className="font-display text-lg sm:text-2xl lg:text-3xl font-semibold tracking-tight text-[#e0dcd8] group-hover:text-white transition-colors duration-300 truncate">
                {project.title}
              </h3>
            </div>

            {/* Center: role + tags */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pl-8 sm:pl-0">
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#8a8480]/50">
                {project.role}
              </span>
              <span className="hidden sm:block text-[#8a8480]/20">&mdash;</span>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] sm:text-[10px] tracking-[0.08em] uppercase text-[#8a8480]/40"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Right: arrow */}
            <div className="hidden sm:flex items-center">
              <svg
                className="w-5 h-5 text-[#8a8480]/20 group-hover:text-[#ffcc00] group-hover:translate-x-1 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  )
}
