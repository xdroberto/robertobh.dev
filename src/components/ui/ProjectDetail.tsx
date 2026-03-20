import { motion } from 'framer-motion'
import type { Project } from '../../data/projects'

const CATEGORY_COLORS: Record<string, string> = {
  frontend: 'border-[#6366f1]/40 text-[#6366f1]/70',
  backend: 'border-[#10b981]/40 text-[#10b981]/70',
  infra: 'border-[#f59e0b]/40 text-[#f59e0b]/70',
  tool: 'border-[#8b5cf6]/40 text-[#8b5cf6]/70',
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function ProjectDetail({ project }: { project: Project }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      {/* Header with gradient */}
      <div className="relative h-44 sm:h-56" style={{ background: project.gradient }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,204,0,0.06) 0%, transparent 40%)',
          }}
        />
        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 bg-gradient-to-t from-[#0e0c0a] via-[#0e0c0a]/80 to-transparent pt-16">
          <motion.div variants={fadeUp}>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#8a8480]/50 block mb-1.5">
              {project.role}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#e0dcd8]">
              {project.title}
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-8 pb-8">
        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="text-sm sm:text-base leading-relaxed text-[#8a8480] mt-6 mb-8"
        >
          {project.description}
        </motion.p>

        {/* Stats bar */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-3 gap-4 mb-10 py-5 border-y border-[#2a2420]/50"
        >
          {project.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-lg sm:text-xl font-semibold text-[#e0dcd8] mb-0.5">
                {stat.value}
              </div>
              <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#8a8480]/50">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tech Stack */}
        <motion.div variants={fadeUp} className="mb-10">
          <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8a8480]/60 mb-4">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech.name}
                className={`font-mono text-[9px] sm:text-[10px] tracking-[0.08em] px-2.5 py-1 border ${CATEGORY_COLORS[tech.category] ?? 'border-[#2a2420]/60 text-[#8a8480]/50'}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        {project.sections.map((section, i) => (
          <motion.div key={i} variants={fadeUp} className="mb-8 last:mb-0">
            <h3 className="font-display text-sm sm:text-base font-semibold text-[#e0dcd8] mb-2.5">
              {section.title}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#8a8480]">{section.content}</p>
          </motion.div>
        ))}

        {/* Testimonial */}
        {project.testimonial && (
          <motion.blockquote
            variants={fadeUp}
            className="mt-10 border-l-2 border-[#ffcc00]/30 pl-5 py-2"
          >
            <p className="text-sm sm:text-base italic leading-relaxed text-[#8a8480]/80 mb-3">
              &ldquo;{project.testimonial.quote}&rdquo;
            </p>
            <footer className="font-mono text-[10px] tracking-[0.1em] text-[#8a8480]/50">
              {project.testimonial.author}
              <span className="mx-2 text-[#2a2420]">/</span>
              {project.testimonial.role}
            </footer>
          </motion.blockquote>
        )}

        {/* CTA link */}
        {project.link && (
          <motion.div variants={fadeUp} className="mt-10">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase px-5 py-3 border border-[#ffcc00]/30 text-[#ffcc00]/80 hover:text-[#ffcc00] hover:border-[#ffcc00]/60 transition-all duration-300"
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
          </motion.div>
        )}
        {!project.link && project.linkLabel && (
          <motion.div variants={fadeUp} className="mt-10">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.15em] uppercase px-5 py-3 border border-[#2a2420]/50 text-[#8a8480]/30">
              {project.linkLabel}
              <span className="text-[9px]">&mdash; Coming soon</span>
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
