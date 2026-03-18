import { motion } from 'framer-motion'
import Section from '../components/layout/Section'

interface Project {
  title: string
  description: string
  tags: string[]
  link?: string
}

const projects: Project[] = [
  {
    title: 'Moonhouse Gift Cards',
    description:
      'Gift card management system for a restaurant. Features card generation with QR/barcodes, role-based access, public verification, and a complete admin dashboard.',
    tags: ['Python', 'Flask', 'SQLite', 'Tailwind CSS'],
    link: 'https://moonhouse.robertobh.dev',
  },
]

export default function Projects() {
  return (
    <Section id="projects">
      <h2 className="text-3xl font-bold mb-2">Projects</h2>
      <div className="w-12 h-0.5 bg-[var(--color-accent)] mb-8" />

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group block text-left p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)]/50 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-accent)] transition-colors">
              {project.title}
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-[var(--color-bg-elevated)] rounded text-[var(--color-text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  )
}
