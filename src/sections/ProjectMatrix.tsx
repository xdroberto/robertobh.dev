import { useState } from 'react'
import { motion } from 'framer-motion'
import Section from '../components/layout/Section'
import Modal from '../components/ui/Modal'
import ProjectDetail from '../components/ui/ProjectDetail'
import { PROJECTS } from '../data/projects'
import type { Project } from '../data/projects'

function ProjectCard({
  project,
  index,
  onOpen,
  featured = false,
}: {
  project: Project
  index: number
  onOpen: () => void
  featured?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <button
        onClick={onOpen}
        className="w-full text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ffcc00]/40"
      >
        <div
          className={`border border-[#2a2420]/70 bg-[#0e0c0a] rounded-sm overflow-hidden transition-all duration-500 ease-out group-hover:border-[#4a3e36] group-hover:shadow-[0_4px_30px_rgba(255,204,0,0.04)] group-hover:-translate-y-1 ${featured ? 'sm:flex sm:flex-row' : ''}`}
        >
          {/* Preview — image or gradient fallback */}
          <div
            className={`relative overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.02] ${featured ? 'w-full sm:w-1/2 h-48 sm:h-72' : 'w-full h-48 sm:h-56'}`}
            style={{ background: project.gradient }}
          >
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                loading="lazy"
              />
            )}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,204,0,0.06) 0%, transparent 40%)',
              }}
            />
            {/* Number */}
            <span className="absolute top-5 left-6 font-mono text-[10px] tracking-[0.2em] text-white/20">
              {String(index + 1).padStart(2, '0')}
            </span>
            {/* Open indicator — animates on hover */}
            <div className="absolute top-5 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/50">
                View Project
              </span>
              <svg
                className="w-3.5 h-3.5 text-white/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
            </div>
          </div>

          {/* Card body */}
          <div
            className={`p-6 sm:p-7 ${featured ? 'sm:w-1/2 sm:flex sm:flex-col sm:justify-center' : ''}`}
          >
            <div className="flex flex-col gap-1.5 mb-4">
              <h3
                className={`font-display font-semibold tracking-tight text-[#e0dcd8] group-hover:text-white transition-colors duration-300 ${featured ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}
              >
                {project.title}
              </h3>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-[#8a8480]/40">
                {project.role}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] tracking-[0.08em] uppercase px-2.5 py-1 border border-[#2a2420]/50 text-[#8a8480]/40 rounded-sm group-hover:border-[#3a3430]/60 group-hover:text-[#8a8480]/60 transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Summary */}
            <p className="text-sm leading-relaxed text-[#8a8480]/70">{project.summary}</p>
          </div>
        </div>
      </button>
    </motion.div>
  )
}

export default function ProjectMatrix() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <>
      <Section id="projects">
        {/* Section header */}
        <div className="mb-12 sm:mb-16">
          <h2 className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8a8480]">
            Selected Work
          </h2>
        </div>

        {/* Project grid — featured first card, two below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {PROJECTS.map((project, i) => (
            <div key={project.id} className={i === 0 ? 'lg:col-span-2' : ''}>
              <ProjectCard
                project={project}
                index={i}
                onOpen={() => setActiveProject(project)}
                featured={i === 0}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Project detail modal */}
      <Modal
        isOpen={activeProject !== null}
        onClose={() => setActiveProject(null)}
        title={activeProject?.title}
      >
        {activeProject && <ProjectDetail project={activeProject} />}
      </Modal>
    </>
  )
}
