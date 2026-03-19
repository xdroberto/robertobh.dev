import { motion } from 'framer-motion'
import Section from '../components/layout/Section'

interface Project {
  entry: string
  title: string
  tags: string[]
  description: string
  link?: string
}

const PROJECTS: Project[] = [
  {
    entry: '01',
    title: 'Side Effects\nStudio',
    tags: ['React', 'WebGL', 'Three.js'],
    description:
      'Generative audio-visual environment. Real-time rendering pipeline with signal processing and interactive shader compositions.',
    link: 'https://studio.robertobh.dev',
  },
  {
    entry: '02',
    title: 'Moonhouse\nBistro',
    tags: ['Next.js', 'CMS', 'Framer'],
    description:
      'Restaurant web presence with dynamic content management. Dashboard-driven architecture for menu, reservations and operational control.',
    link: 'https://moonhousebistro.com',
  },
  {
    entry: '03',
    title: 'Giftcard\nSystem',
    tags: ['Python', 'Flask', 'SQLite'],
    description:
      'Gift card management platform with QR/barcode generation, role-based access control, and real-time balance tracking.',
    link: 'https://moonhouse.robertobh.dev',
  },
]

export default function ProjectMatrix() {
  return (
    <Section id="projects">
      {/* Section label */}
      <div className="mb-10 sm:mb-14">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8a8480]">
          Selected Work
        </span>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {PROJECTS.map((project, i) => (
          <motion.a
            key={project.entry}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative flex flex-col justify-between p-5 sm:p-6 min-h-[280px] sm:min-h-[320px] border border-[#2a2420] bg-[#0e0c0a] hover:border-[#3a3430] hover:bg-[#141210] transition-all duration-500"
          >
            {/* Entry number */}
            <div className="flex items-start justify-between mb-6">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a8480]/60">
                ENTRY_{project.entry}
              </span>
              {/* Arrow icon */}
              <svg
                className="w-4 h-4 text-[#8a8480]/30 group-hover:text-[#ffcc00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#e0dcd8] leading-tight whitespace-pre-line mb-5 group-hover:text-white transition-colors duration-300">
              {project.title}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 border border-[#2a2420] text-[#8a8480] group-hover:border-[#3a3430] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm leading-relaxed text-[#8a8480] mb-6 flex-grow">
              {project.description}
            </p>

            {/* View link */}
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[#8a8480] group-hover:text-[#ffcc00] transition-colors duration-300">
              <span>View Project</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  )
}
