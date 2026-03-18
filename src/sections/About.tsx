import Section from '../components/layout/Section'

const skills = [
  'Python', 'Flask', 'React', 'TypeScript',
  'Three.js', 'Tailwind CSS', 'SQLite', 'Git',
]

export default function About() {
  return (
    <Section id="about">
      <h2 className="text-3xl font-bold mb-2">About</h2>
      <div className="w-12 h-0.5 bg-[var(--color-accent)] mb-8" />

      <div className="grid md:grid-cols-2 gap-12">
        <div className="text-left">
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            I'm a developer passionate about building clean, performant web applications
            with a focus on user experience and modern design.
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            Currently working on interactive tools and creative projects that combine
            functionality with visual polish.
          </p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-[var(--color-accent)] mb-4 font-mono">
            Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-sm bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-md text-[var(--color-text-secondary)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
