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
}: {
  project: Project
  index: number
  onOpen: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <button
        onClick={onOpen}
        className="w-full h-full text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ffcc00]/40"
      >
        <div className="h-full border border-[#2a2420]/70 bg-[#0e0c0a] rounded-sm overflow-hidden transition-all duration-500 ease-out group-hover:border-[#4a3e36] group-hover:shadow-[0_4px_30px_rgba(255,204,0,0.04)] group-hover:-translate-y-1 flex flex-col">
          {/* Card body */}
          <div className="p-6 sm:p-7 flex flex-col flex-1">
            {/* Header row: number + open indicator */}
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#8a8480]/25">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#8a8480]/40">
                  View
                </span>
                <svg
                  className="w-3.5 h-3.5 text-[#8a8480]/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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

            {/* Title & role */}
            <div className="flex flex-col gap-1.5 mb-4">
              <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#e0dcd8] group-hover:text-white transition-colors duration-300">
                {project.title}
              </h3>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-[#8a8480]/40">
                {project.role}
              </span>
            </div>

            {/* Summary */}
            <p className="text-sm leading-relaxed text-[#8a8480]/70 mb-5">{project.summary}</p>

            {/* Image preview — contained, elegant thumbnail */}
            {project.image && (
              <div className="mb-5 flex justify-center">
                <div className="relative w-4/5 max-h-48 sm:max-h-56 rounded overflow-hidden ring-1 ring-[#2a2420]/30 group-hover:ring-[#4a3e36]/40 transition-all duration-500 shadow-[0_2px_12px_rgba(0,0,0,0.3)] group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                  <div className="aspect-[16/10] relative" style={{ background: project.gradient }}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a]/30 via-transparent to-[#0e0c0a]/10" />
                  </div>
                </div>
              </div>
            )}

            {/* Gradient accent for cards without images */}
            {!project.image && (
              <div
                className="relative rounded-sm overflow-hidden mb-5 h-1.5"
                style={{ background: project.gradient }}
              />
            )}

            {/* Tags — pushed to bottom */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] tracking-[0.08em] uppercase px-2.5 py-1 border border-[#2a2420]/50 text-[#8a8480]/40 rounded-sm group-hover:border-[#3a3430]/60 group-hover:text-[#8a8480]/60 transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
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

        {/* Project grid — equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={() => setActiveProject(project)}
            />
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
