import { motion } from 'framer-motion'
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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export default function About() {
  return (
    <Section id="about">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Section label */}
        <motion.div variants={fadeUp} className="mb-10 sm:mb-14">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#8a8480]">
            About
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20">
          {/* Bio */}
          <div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight text-[#e0dcd8] mb-6"
            >
              I build <span className="text-[#ffcc00]">full-stack products</span>{' '}
              <span className="text-[#ffcc00]">end-to-end</span> — from data model to deploy.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base leading-relaxed text-[#8a8480] mb-5 max-w-xl"
            >
              Software engineer and generative artist from Mexico, currently remote in US Central
              time. I work across the full stack — TypeScript on the frontend, TypeScript or Python
              on the backend, Postgres at the data layer, Linux underneath.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base leading-relaxed text-[#8a8480] max-w-xl"
            >
              I build software that holds up in production — typed boundaries between services,
              integer cents for money, real database migrations, idempotent background jobs,
              observable deploys. Strong defaults so products can move fast without breaking trust.
            </motion.p>
          </div>

          {/* Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-6 self-start">
            {STACK.map((group) => (
              <motion.div key={group.label} variants={fadeUp}>
                <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#ffcc00]/70 mb-4 pb-2 border-b border-[#2a2420]/60">
                  {group.label}
                </h3>
                <ul className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[11px] sm:text-xs text-[#8a8480]/80 leading-snug"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
