import Section from '../components/layout/Section'

interface StackGroup {
  label: string
  items: string[]
}

const STACK: StackGroup[] = [
  {
    label: 'Frontend',
    items: ['TypeScript', 'React 19', 'Tailwind CSS', 'Three.js / R3F', 'GLSL', 'Framer Motion'],
  },
  {
    label: 'Backend & Data',
    items: [
      'Python',
      'Node.js · Hono',
      'Flask · FastAPI',
      'Postgres · pgvector',
      'SQLite · Drizzle',
      'Redis · Cron',
    ],
  },
  {
    label: 'Infra & Creative',
    items: [
      'Nginx · systemd',
      'Docker · PM2',
      'Linux VPS · Hetzner',
      'TouchDesigner',
      'p5.js · Processing',
      'Figma',
    ],
  },
]

export default function About() {
  return (
    <Section id="about">
      <div>
        <div className="mb-10 sm:mb-14">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8a8480]">
            About
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20">
          {/* Bio */}
          <div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight text-[#e0dcd8] mb-6">
              I build <span className="text-[#ffcc00]">full-stack products</span>{' '}
              <span className="text-[#ffcc00]">end-to-end</span> — from data model to deploy.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#8a8480] mb-5 max-w-xl">
              Software engineer and generative artist from Mexico, currently remote in US Central
              time. I work across the full stack — TypeScript on the frontend, TypeScript or Python
              on the backend, Postgres at the data layer, Linux underneath.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#8a8480] max-w-xl">
              I build software that holds up in production — typed boundaries between services,
              integer cents for money, real database migrations, idempotent background jobs,
              observable deploys. Strong defaults so products can move fast without breaking trust.
            </p>
          </div>

          {/* Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-6 self-start">
            {STACK.map((group) => (
              <div key={group.label}>
                <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#ffcc00]/70 mb-4 pb-2 border-b border-[#2a2420]/60">
                  {group.label}
                </h3>
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] sm:text-xs text-[#8a8480] leading-snug"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
